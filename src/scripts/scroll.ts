// Coreografia de scroll com GSAP + ScrollTrigger.
// Tudo que depende de movimento fica dentro de gsap.matchMedia: com movimento reduzido
// nada é escondido, nada é fixado, e o hero vira um quadro estático.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { createHeroNetwork } from './motion/heroNetwork'

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin)

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s)
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s))

export function initScroll() {
  const canvas = $<HTMLCanvasElement>('[data-hero-canvas]')
  const mm = gsap.matchMedia()

  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
      desktop: '(min-width: 1024px)',
    },
    (context) => {
      const { motion, desktop } = context.conditions as { motion: boolean; reduce: boolean; desktop: boolean }
      const network = canvas ? createHeroNetwork(canvas, !motion) : null

      // Barra de progresso no cabeçalho (vale também com movimento reduzido)
      gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: motion ? 0.3 : true } })

      if (!motion) {
        if (network) ScrollTrigger.create({ trigger: '#inicio', start: 'top top', end: 'bottom top', onUpdate: (s) => network.setScroll(s.progress) })
        initCounters(false)
        return () => network?.destroy()
      }

      heroIntro()
      heroScroll(network)
      headings()
      reveals()
      scrubWords()
      aboutPanel()
      marquee()
      serviceList()
      desktop ? journeyDesktop() : journeyMobile()
      differentials()
      initCounters(true)
      coverage()
      ornaments()

      return () => network?.destroy()
    },
  )

  document.fonts?.ready.then(() => ScrollTrigger.refresh())
}

/* Hero ------------------------------------------------------------------ */
function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
  tl.fromTo('[data-hero-line] .split-inner', { y: 0, yPercent: 105 }, { y: 0, yPercent: 0, duration: 1.35, stagger: 0.11 })
    .fromTo('[data-hero-fade]', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.09 }, 0.45)
    .from('[data-header] > div', { y: -30, opacity: 0, duration: 1.1 }, 0.2)
}

function heroScroll(network: ReturnType<typeof createHeroNetwork> | null) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#inicio',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: (s) => network?.setScroll(s.progress),
    },
  })
  tl.to('[data-hero-content]', { yPercent: -18, opacity: 0.15, ease: 'none' }, 0)
    .to('#hero-title', { scale: 0.94, transformOrigin: 'left bottom', ease: 'none' }, 0)
}

/* Títulos: linhas sobem de dentro de máscaras ----------------------------- */
function headings() {
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 108,
          duration: 1.2,
          stagger: 0.09,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        }),
    })
  })
}

function reveals() {
  const items = $$('[data-reveal]')
  gsap.set(items, { y: 32 })
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
  })
}

/* Palavras acendem conforme o scroll ------------------------------------- */
function scrubWords() {
  $$('[data-scrub-words]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.12 },
          { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true } },
        ),
    })
  })
}

/* Painel claro do "Sobre" abre como uma cortina -------------------------- */
function aboutPanel() {
  const panel = $('[data-about-panel]')
  if (!panel) return
  gsap.fromTo(
    panel,
    { clipPath: 'inset(0% 6% 0% 6% round 48px 48px 0px 0px)' },
    { clipPath: 'inset(0% 0% 0% 0% round 48px 48px 0px 0px)', ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 25%', scrub: true } },
  )
}

/* Letreiro com velocidade do scroll -------------------------------------- */
function marquee() {
  const rows = $$('[data-marquee]')
  if (!rows.length) return
  const tweens = rows.map((row) => {
    const dir = Number(row.dataset.marquee)
    return dir < 0
      ? gsap.to(row, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
      : gsap.fromTo(row, { xPercent: -50 }, { xPercent: 0, duration: 46, ease: 'none', repeat: -1 })
  })
  const skew = rows.map((r) => gsap.quickSetter(r, 'skewX', 'deg'))
  let dir = 1, target = 1, current = 1
  const st = ScrollTrigger.create({
    trigger: '#marketplaces',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (s) => {
      dir = s.direction
      target = dir * gsap.utils.clamp(1, 7, 1 + Math.abs(s.getVelocity()) / 350)
    },
    onToggle: (s) => tweens.forEach((t) => (s.isActive ? t.resume() : t.pause())),
  })
  if (!st.isActive) tweens.forEach((t) => t.pause())
  gsap.ticker.add(() => {
    if (!st.isActive) return
    current += (target - current) * 0.08
    target += (dir - target) * 0.04
    tweens.forEach((t) => t.timeScale(current))
    const k = gsap.utils.clamp(-6, 6, (current - dir) * -1.4)
    skew.forEach((set) => set(k))
  })
}

function serviceList() {
  gsap.from('.service-item', {
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: '[data-services]', start: 'top 85%', once: true },
  })
}

/* Como funciona: percurso fixado (desktop) -------------------------------- */
function journeyDesktop() {
  const section = $('[data-journey]')
  const path = $<SVGPathElement>('[data-route]')
  const glow = $<SVGPathElement>('[data-route-glow]')
  const pkg = $<SVGGElement>('[data-package]')
  if (!section || !path || !glow || !pkg) return
  const stations = $$<SVGGElement>('[data-station]')
  const steps = $$('[data-step]')
  const index = $('[data-journey-index]')
  const count = $('[data-journey-count]')
  const bar = $('[data-journey-bar]')

  // Fração do caminho onde cada estação está
  const len = path.getTotalLength()
  const fr = stations.map((st) => {
    const m = /translate\(([\d.]+) ([\d.]+)\)/.exec(st.getAttribute('transform') ?? '')
    const sx = Number(m?.[1] ?? 0), sy = Number(m?.[2] ?? 0)
    let best = 0, bestD = Infinity
    for (let l = 0; l <= len; l += 4) {
      const p = path.getPointAtLength(l)
      const d = (p.x - sx) ** 2 + (p.y - sy) ** 2
      if (d < bestD) { bestD = d; best = l }
    }
    return best / len
  })

  gsap.set([path, glow], { strokeDasharray: len, strokeDashoffset: len })
  let currentStep = -1
  const setStep = (p: number) => {
    let cur = -1
    fr.forEach((f, i) => { if (p >= f - 0.012) cur = i })
    if (cur === currentStep) return
    currentStep = cur
    stations.forEach((s, i) => { s.classList.toggle('is-on', i <= cur); s.classList.toggle('is-current', i === cur) })
    steps.forEach((s, i) => { s.classList.toggle('is-on', i <= Math.max(cur, 0)); s.classList.toggle('is-current', i === Math.max(cur, 0)) })
    const label = String(Math.max(cur, 0) + 1).padStart(2, '0')
    if (index) index.textContent = label
    if (count && count.textContent !== label) {
      gsap.fromTo(count, { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out' })
      count.textContent = label
    }
  }
  setStep(0)

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * 2.6}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (s) => {
        setStep(s.progress * 1.04)
        if (bar) gsap.set(bar, { scaleX: s.progress })
      },
    },
  })
  tl.to([path, glow], { strokeDashoffset: 0, duration: 1 }, 0)
    .to(pkg, { duration: 1, motionPath: { path, align: path, alignOrigin: [0.5, 0.5] } }, 0)
}

/* Como funciona: trilha vertical (mobile/tablet) -------------------------- */
function journeyMobile() {
  const list = $('[data-steps]')
  const track = $('[data-track]')
  const dot = $('[data-track-dot]')
  if (!list || !track || !dot) return
  const st = { trigger: list, start: 'top 65%', end: 'bottom 65%', scrub: 0.5 }
  gsap.to(track, { scaleY: 1, ease: 'none', scrollTrigger: st })
  gsap.to(dot, { y: () => (track.parentElement?.offsetHeight ?? 0) - 15, ease: 'none', scrollTrigger: { ...st, invalidateOnRefresh: true } })
  $$('[data-step]').forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 66%',
      onEnter: () => step.classList.add('is-on'),
      onLeaveBack: () => step.classList.remove('is-on'),
    })
    gsap.from(step.querySelector('div'), { opacity: 0, x: 14, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: step, start: 'top 85%', once: true } })
  })
}

/* Diferenciais: preenchimento das palavras -------------------------------- */
function differentials() {
  $$('[data-dif]').forEach((row) => {
    const fill = $('[data-dif-fill]', row)
    if (!fill) return
    gsap.fromTo(
      fill,
      { clipPath: 'inset(0% 100% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: row, start: 'top 82%', end: 'top 42%', scrub: 0.6 } },
    )
  })
}

function initCounters(animate: boolean) {
  $$('[data-count]').forEach((el) => {
    const value = Number(el.dataset.count)
    const pad = Number(el.dataset.pad ?? 0)
    const render = (v: number) => (el.textContent = String(Math.round(v)).padStart(pad, '0'))
    if (!animate) return render(value)
    const obj = { v: 0 }
    render(0)
    gsap.to(obj, {
      v: value,
      duration: 1.8,
      ease: 'expo.out',
      onUpdate: () => render(obj.v),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })
}

/* Cobertura: rotas desenhadas a partir da base ---------------------------- */
function coverage() {
  const routes = $$<SVGPathElement>('[data-map-route]')
  const nodes = $$('[data-map-node] > circle:nth-child(2)')
  if (!routes.length) return
  routes.forEach((r) => {
    const l = r.getTotalLength()
    gsap.set(r, { strokeDasharray: l, strokeDashoffset: l })
  })
  gsap.set(nodes, { scale: 0, transformOrigin: '50% 50%' })
  const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-coverage]', start: 'top 72%', once: true } })
  tl.to(routes, { strokeDashoffset: 0, duration: 1.6, ease: 'power3.inOut', stagger: { each: 0.035, from: 'random' } })
    .to(nodes, { scale: 1, duration: 0.6, ease: 'back.out(3)', stagger: { each: 0.03, from: 'random' } }, 0.7)
    .add(() => routes.forEach((r) => gsap.set(r, { clearProps: 'strokeDasharray,strokeDashoffset' })))
}

/* Selos girando, paralaxe, letreiro final --------------------------------- */
function ornaments() {
  $$('[data-spin]').forEach((el) =>
    gsap.to(el, { rotation: 300, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } }),
  )
  $$('[data-parallax]').forEach((el) =>
    gsap.fromTo(
      el,
      { yPercent: -Number(el.dataset.parallax) },
      { yPercent: Number(el.dataset.parallax), ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    ),
  )
  $$('[data-parallax-x]').forEach((el) =>
    gsap.fromTo(
      el,
      { xPercent: -Number(el.dataset.parallaxX) },
      { xPercent: Number(el.dataset.parallaxX), ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } },
    ),
  )
  const word = $('[data-footer-word]')
  if (word) {
    gsap.fromTo(word, { yPercent: 70 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: word.parentElement, start: 'top bottom', end: 'bottom bottom', scrub: true } })
  }
}
