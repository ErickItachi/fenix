// Rede de rotas do hero: um plano em perspectiva com a base Fênix ao centro,
// rotas até as cidades atendidas e "cometas" (pacotes) percorrendo os trajetos.
// Canvas 2D leve: pausa fora da tela, limita o DPR e respeita movimento reduzido.
import { hub, regions } from '../../data/site'

type P2 = { x: number; y: number }
type Route = { pts: P2[]; end: number; len: number }
type Comet = { r: number; t: number; dur: number; dir: 1 | -1; delay: number }
type Pulse = { node: number; t: number }

const FIRE = [255, 107, 0]
const FLARE = [255, 140, 41]

function mulberry(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createHeroNetwork(canvas: HTMLCanvasElement, reduced: boolean) {
  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return { setScroll() {}, destroy() {} }

  const rand = mulberry(7)
  // Coordenadas no plano: X para leste, Z para o norte (profundidade). Base em (0, 0).
  const kx = 3.1, kz = 4.4
  const toPlane = (lat: number, lon: number): P2 => ({ x: (lon - hub.lon) * kx, y: (lat - hub.lat) * kz })

  const cities = regions.flatMap((r) => r.cities.map((c) => toPlane(c.lat, c.lon)))
  const ghosts: P2[] = Array.from({ length: 46 }, () => ({ x: (rand() - 0.5) * 4.2, y: (rand() - 0.42) * 2.6 }))
  const nodes = [...cities, ...ghosts]

  const routes: Route[] = cities.map((c, i) => {
    const dx = c.x, dy = c.y
    const len = Math.hypot(dx, dy) || 1
    const bend = (i % 2 ? 1 : -1) * Math.min(0.35, len * 0.28)
    const cx = dx / 2 - (dy / len) * bend
    const cy = dy / 2 + (dx / len) * bend
    const pts: P2[] = []
    const N = 36
    for (let k = 0; k <= N; k++) {
      const t = k / N
      const b = 2 * (1 - t) * t, d = t * t
      pts.push({ x: b * cx + d * c.x, y: b * cy + d * c.y })
    }
    return { pts, end: i, len }
  })

  let w = 0, h = 0, dpr = 1
  let scroll = 0
  let mx = 0, my = 0, tx = 0, ty = 0
  let reveal = reduced ? 1 : 0
  let raf = 0
  let visible = true
  let last = performance.now()
  const small = () => w < 640

  const comets: Comet[] = []
  const pulses: Pulse[] = []
  const spawn = (delay = 0): Comet => ({
    r: Math.floor(rand() * routes.length),
    t: 0,
    dur: 1.6 + rand() * 1.8,
    dir: rand() > 0.3 ? 1 : -1,
    delay,
  })

  function resize() {
    const rect = canvas.getBoundingClientRect()
    w = rect.width
    h = rect.height
    dpr = Math.min(window.devicePixelRatio || 1, small() ? 1.5 : 1.75)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    const target = small() ? 7 : 14
    comets.length = 0
    for (let i = 0; i < target; i++) comets.push(spawn(rand() * 2.4))
    if (reduced) draw(0)
  }

  // Câmera: inclinação e zoom dependem do scroll; um leve deslocamento segue o ponteiro.
  function project(p: P2): P2 & { s: number } {
    const zoom = 1 + scroll * 0.9
    const f = Math.max(w, h * 1.1) * (small() ? 0.62 : 0.46) * zoom
    const horizon = h * (0.18 - scroll * 0.25)
    const camH = 0.62 - scroll * 0.18
    const z = 1.25 + p.y + scroll * 0.4
    const zz = Math.max(z, 0.08)
    const ox = small() ? w * 0.6 : w * 0.66
    return {
      x: ox + ((p.x - mx * 0.25) * f) / zz,
      y: horizon + (camH * f) / zz + my * 18,
      s: 1 / zz,
    }
  }

  function line(a: P2, b: P2) {
    const pa = project(a), pb = project(b)
    ctx!.moveTo(pa.x, pa.y)
    ctx!.lineTo(pb.x, pb.y)
  }

  function draw(dt: number) {
    const c = ctx!
    c.clearRect(0, 0, w, h)
    const fade = 1 - scroll * 0.85

    // Grade em perspectiva
    c.lineWidth = 1
    c.strokeStyle = `rgba(255,255,255,${0.05 * reveal * fade})`
    c.beginPath()
    for (let x = -3; x <= 3; x += 0.25) line({ x, y: -1.1 }, { x, y: 2.6 })
    for (let z = -1.1; z <= 2.6; z += 0.25) line({ x: -3, y: z }, { x: 3, y: z })
    c.stroke()

    // Rotas base (tracejado discreto) revelando a partir da base
    c.globalCompositeOperation = 'lighter'
    for (const r of routes) {
      const n = Math.max(2, Math.floor(r.pts.length * Math.min(1, reveal * 1.15 - r.len * 0.08)))
      if (n < 2) continue
      c.beginPath()
      for (let k = 0; k < n; k++) {
        const p = project(r.pts[k])
        k ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)
      }
      c.strokeStyle = `rgba(${FIRE},${0.22 * fade})`
      c.lineWidth = 1.1
      c.stroke()
    }

    // Cometas (pacotes em trânsito)
    if (!reduced) {
      for (const cm of comets) {
        if (cm.delay > 0) { cm.delay -= dt; continue }
        cm.t += dt / cm.dur
        if (cm.t >= 1) {
          pulses.push({ node: cm.dir === 1 ? routes[cm.r].end : -1, t: 0 })
          Object.assign(cm, spawn(rand() * 0.8))
          continue
        }
        const r = routes[cm.r]
        const e = cm.t < 0.5 ? 2 * cm.t * cm.t : 1 - Math.pow(-2 * cm.t + 2, 2) / 2
        const head = cm.dir === 1 ? e : 1 - e
        const tail = 0.22
        const steps = 14
        for (let k = 0; k < steps; k++) {
          const u0 = head - cm.dir * tail * (k / steps)
          const u1 = head - cm.dir * tail * ((k + 1) / steps)
          if (u0 < 0 || u0 > 1 || u1 < 0 || u1 > 1) break
          const a = project(at(r, u0)), b = project(at(r, u1))
          c.beginPath()
          c.moveTo(a.x, a.y)
          c.lineTo(b.x, b.y)
          c.strokeStyle = `rgba(${FLARE},${(1 - k / steps) * 0.95 * fade})`
          c.lineWidth = 2.4 * (1 - k / steps) + 0.4
          c.stroke()
        }
        const hp = project(at(r, Math.min(1, Math.max(0, head))))
        const g = c.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, 16)
        g.addColorStop(0, `rgba(255,220,180,${0.95 * fade})`)
        g.addColorStop(0.25, `rgba(${FIRE},${0.55 * fade})`)
        g.addColorStop(1, 'rgba(255,107,0,0)')
        c.fillStyle = g
        c.beginPath()
        c.arc(hp.x, hp.y, 16, 0, Math.PI * 2)
        c.fill()
      }
    }

    // Pulsos de chegada
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i]
      p.t += dt / 1.2
      if (p.t >= 1) { pulses.splice(i, 1); continue }
      const pos = project(p.node >= 0 ? cities[p.node] : { x: 0, y: 0 })
      c.beginPath()
      c.arc(pos.x, pos.y, 4 + p.t * 26 * pos.s, 0, Math.PI * 2)
      c.strokeStyle = `rgba(${FIRE},${(1 - p.t) * 0.8 * fade})`
      c.lineWidth = 1.5
      c.stroke()
    }
    c.globalCompositeOperation = 'source-over'

    // Nós
    nodes.forEach((n, i) => {
      const p = project(n)
      if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) return
      const isCity = i < cities.length
      const r = (isCity ? 2.6 : 1.5) * Math.min(2.2, p.s * 1.4)
      c.beginPath()
      c.arc(p.x, p.y, r, 0, Math.PI * 2)
      c.fillStyle = isCity ? `rgba(255,140,41,${0.9 * reveal * fade})` : `rgba(243,243,241,${0.22 * reveal * fade})`
      c.fill()
    })

    // Base
    const hp = project({ x: 0, y: 0 })
    const glow = c.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, 60)
    glow.addColorStop(0, `rgba(255,107,0,${0.55 * reveal * fade})`)
    glow.addColorStop(1, 'rgba(255,107,0,0)')
    c.fillStyle = glow
    c.beginPath()
    c.arc(hp.x, hp.y, 60, 0, Math.PI * 2)
    c.fill()
    c.beginPath()
    c.arc(hp.x, hp.y, 5, 0, Math.PI * 2)
    c.fillStyle = `rgba(255,107,0,${reveal})`
    c.fill()
  }

  function at(r: Route, u: number): P2 {
    const f = u * (r.pts.length - 1)
    const i = Math.min(r.pts.length - 2, Math.floor(f))
    const t = f - i
    const a = r.pts[i], b = r.pts[i + 1]
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
  }

  function loop(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (reveal < 1) reveal = Math.min(1, reveal + dt / 2.2)
    mx += (tx - mx) * 0.05
    my += (ty - my) * 0.05
    draw(dt)
    raf = visible ? requestAnimationFrame(loop) : 0
  }

  function start() {
    if (reduced || raf) return
    last = performance.now()
    raf = requestAnimationFrame(loop)
  }
  function stop() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting && !document.hidden
    visible ? start() : stop()
  })
  io.observe(canvas)
  const onVis = () => {
    visible = !document.hidden
    visible ? start() : stop()
  }
  document.addEventListener('visibilitychange', onVis)
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    tx = (e.clientX / window.innerWidth - 0.5) * 2
    ty = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()
  start()

  return {
    setScroll(p: number) {
      scroll = p
      if (reduced) draw(0)
    },
    destroy() {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
    },
  }
}
