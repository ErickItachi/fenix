// Interações que não dependem do scroll: menu, formulários, acordeões, serviços,
// cobertura, botão de WhatsApp contextual, cursor e efeito magnético.
import { DEFAULT_MESSAGE, waLink } from '../lib/whatsapp'

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s)
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s))

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function formatCep(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

function openWhatsApp(message: string) {
  window.open(waLink(message), '_blank', 'noopener')
}

/* Menu móvel ------------------------------------------------------------- */
export function initMenu() {
  const toggle = $<HTMLButtonElement>('[data-menu-toggle]')
  const menu = $('[data-menu]')
  const label = $('[data-menu-label]')
  const header = $('[data-header]')
  if (!toggle || !menu) return
  const links = $$('[data-menu-link]', menu)
  let open = false
  let lastFocus: HTMLElement | null = null

  const set = (state: boolean) => {
    open = state
    toggle.setAttribute('aria-expanded', String(state))
    if (label) label.textContent = state ? 'Fechar menu' : 'Abrir menu'
    header?.classList.toggle('menu-open', state)
    document.documentElement.style.overflow = state ? 'hidden' : ''
    const dur = reducedMotion() ? 0 : 700
    if (state) {
      lastFocus = document.activeElement as HTMLElement
      menu.style.visibility = 'visible'
      menu.animate(
        [{ clipPath: 'circle(0% at calc(100% - 2.75rem) 2.25rem)' }, { clipPath: 'circle(150% at calc(100% - 2.75rem) 2.25rem)' }],
        { duration: dur, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', fill: 'forwards' },
      )
      links.forEach((a, i) =>
        a.animate([{ transform: 'translateY(110%)', opacity: 0 }, { transform: 'none', opacity: 1 }], {
          duration: dur, delay: dur ? 180 + i * 55 : 0, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards',
        }),
      )
      setTimeout(() => links[0]?.focus({ preventScroll: true }), dur * 0.6)
    } else {
      const anim = menu.animate(
        [{ clipPath: 'circle(150% at calc(100% - 2.75rem) 2.25rem)' }, { clipPath: 'circle(0% at calc(100% - 2.75rem) 2.25rem)' }],
        { duration: dur * 0.8, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', fill: 'forwards' },
      )
      anim.onfinish = () => { if (!open) menu.style.visibility = 'hidden' }
      lastFocus?.focus({ preventScroll: true })
    }
  }

  toggle.addEventListener('click', () => set(!open))
  links.forEach((a) => a.addEventListener('click', () => set(false)))
  document.addEventListener('keydown', (e) => {
    if (!open) return
    if (e.key === 'Escape') set(false)
    if (e.key === 'Tab') {
      const logo = header?.querySelector<HTMLElement>('a[href="#inicio"]')
      const focusables = [...(logo ? [logo] : []), toggle, ...$$<HTMLElement>('a, button', menu)]
      const i = focusables.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey && i <= 0) { e.preventDefault(); focusables[focusables.length - 1].focus() }
      else if (!e.shiftKey && i === focusables.length - 1) { e.preventDefault(); focusables[0].focus() }
    }
  })
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches && open) set(false) })
}

/* Serviços: lista + painel ---------------------------------------------- */
export function initServices() {
  const triggers = $$<HTMLButtonElement>('[data-service-trigger]')
  const panes = $$('[data-service-pane]')
  const items = $$('.service-item')
  if (!triggers.length) return
  const desktop = window.matchMedia('(min-width: 1024px)')

  // Desktop: um item sempre ativo (painel ao lado). Mobile: acordeão, um aberto por vez.
  const activate = (i: number, fromClick = false) => {
    const open = desktop.matches || !(fromClick && triggers[i].getAttribute('aria-expanded') === 'true')
    triggers.forEach((t, j) => {
      const on = j === i && open
      t.setAttribute('aria-expanded', String(on))
      items[j]?.classList.toggle('is-active', on)
    })
    panes.forEach((p, j) => {
      const on = j === i
      p.classList.toggle('is-active', on)
      p.setAttribute('aria-hidden', String(!on))
      $$('a', p).forEach((a) => (on ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')))
    })
  }

  triggers.forEach((t, i) => {
    t.addEventListener('click', () => activate(i, true))
    t.addEventListener('mouseenter', () => { if (desktop.matches && finePointer()) activate(i) })
    t.addEventListener('focus', () => { if (desktop.matches) activate(i) })
  })
  desktop.addEventListener('change', () => activate(Math.max(0, triggers.findIndex((t) => t.getAttribute('aria-expanded') === 'true'))))
  items[0]?.classList.add('is-active')
}

/* FAQ ------------------------------------------------------------------- */
export function initFaq() {
  $$<HTMLButtonElement>('[data-faq]').forEach((b) =>
    b.addEventListener('click', () => b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true'))),
  )
}

/* Cobertura ------------------------------------------------------------- */
export function initCoverage() {
  const root = $('[data-coverage]')
  if (!root) return
  const buttons = $$<HTMLButtonElement>('[data-region-btn]', root)
  const status = $('[data-map-status]', root)
  const cta = $<HTMLAnchorElement>('[data-region-cta]')
  const ctaLabel = $('[data-region-cta-label]')
  const els = $$('[data-map-route], [data-map-node]', root)
  let active: string | null = null

  const set = (id: string | null) => {
    active = id
    root.classList.toggle('has-active', !!id)
    els.forEach((el) => el.classList.toggle('is-active', !!id && el.dataset.region === id))
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.regionBtn === id)))
    const btn = buttons.find((b) => b.dataset.regionBtn === id)
    const name = btn?.querySelector('.font-semibold')?.textContent ?? ''
    if (status) status.textContent = id ? name : 'Todas as regiões'
    if (cta && ctaLabel) {
      cta.href = waLink(id ? `Olá! Quero confirmar a cobertura da Fênix em ${name}.` : 'Olá! Quero confirmar se a Fênix atende a minha região.')
      ctaLabel.textContent = id ? `Confirmar cobertura em ${name}` : 'Confirmar minha região pelo WhatsApp'
    }
  }

  buttons.forEach((b) => {
    b.addEventListener('click', () => set(active === b.dataset.regionBtn ? null : b.dataset.regionBtn!))
    b.addEventListener('mouseenter', () => { if (finePointer()) set(b.dataset.regionBtn!) })
  })
  $('ul', root)?.addEventListener('mouseleave', () => { if (finePointer()) set(null) })

  const form = $<HTMLFormElement>('[data-cep-form]')
  const input = $<HTMLInputElement>('#cep')
  const err = $('[data-cep-error]')
  input?.addEventListener('input', () => { input.value = formatCep(input.value) })
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const digits = input?.value.replace(/\D/g, '') ?? ''
    const ok = digits.length === 8
    err?.classList.toggle('hidden', ok)
    input?.setAttribute('aria-invalid', String(!ok))
    if (!ok) { input?.focus(); return }
    openWhatsApp(`Olá! Quero consultar se a Fênix Entregas Flex atende o CEP ${formatCep(digits)}.`)
  })
}

/* Formulário de proposta ------------------------------------------------- */
export function initProposal() {
  const form = $<HTMLFormElement>('[data-proposal]')
  if (!form) return
  const err = $('[data-form-error]', form)
  const cep = $<HTMLInputElement>('#f-cep', form)
  cep?.addEventListener('input', () => { cep.value = formatCep(cep.value) })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(form)
    const nome = String(data.get('nome') ?? '').trim()
    const loja = String(data.get('loja') ?? '').trim()
    const required = [$<HTMLInputElement>('#f-nome', form), $<HTMLInputElement>('#f-loja', form)]
    required.forEach((i) => i?.setAttribute('aria-invalid', String(!i.value.trim())))
    if (!nome || !loja) {
      err?.classList.remove('hidden')
      required.find((i) => !i?.value.trim())?.focus()
      return
    }
    err?.classList.add('hidden')
    const canais = data.getAll('canais').map(String)
    const lines = [
      'Olá! Quero uma proposta da Fênix Entregas Flex.',
      '',
      `• Nome: ${nome}`,
      `• Loja/empresa: ${loja}`,
      data.get('telefone') ? `• Telefone: ${String(data.get('telefone')).trim()}` : '',
      canais.length ? `• Vendo em: ${canais.join(', ')}` : '',
      `• Volume: ${data.get('volume') ?? 'Ainda não sei'}`,
      data.get('cep') ? `• CEP de coleta: ${data.get('cep')}` : '',
      String(data.get('mensagem') ?? '').trim() ? `• Sobre a operação: ${String(data.get('mensagem')).trim()}` : '',
    ].filter((l, i) => l || i === 1)
    openWhatsApp(lines.join('\n'))
  })
}

/* WhatsApp contextual + indicador de seção ------------------------------- */
const contextMessages: Record<string, string> = {
  inicio: 'Olá! Quero uma proposta de entregas para minha loja.',
  marketplaces: 'Olá! Vendo em marketplaces e quero conhecer a operação da Fênix Entregas Flex.',
  sobre: DEFAULT_MESSAGE,
  servicos: 'Olá! Quero saber mais sobre os serviços da Fênix Entregas Flex.',
  'como-funciona': 'Olá! Quero entender como funciona a coleta e a entrega da Fênix.',
  diferenciais: 'Olá! Quero uma proposta para a minha operação.',
  cobertura: 'Olá! Quero confirmar se a Fênix atende a minha região.',
  confianca: DEFAULT_MESSAGE,
  faq: 'Olá! Tenho uma dúvida sobre os serviços da Fênix Entregas Flex.',
  contato: 'Olá! Quero uma proposta da Fênix Entregas Flex.',
}

export function initSectionAwareness() {
  const fab = $<HTMLAnchorElement>('[data-fab]')
  const fabLabel = $('[data-fab-label]')
  const rail = $$<HTMLAnchorElement>('[data-rail-link]')
  const navLinks = $$<HTMLAnchorElement>('[data-nav-link]')
  const pill = $('[data-nav-pill]')
  const sections = $$('main section[id]')
  const hero = $('#inicio')
  const contact = $('#contato')
  let current = 'inicio'

  const movePill = (link?: HTMLAnchorElement) => {
    if (!pill) return
    if (!link) { pill.style.opacity = '0'; return }
    pill.style.opacity = '1'
    pill.style.width = `${link.offsetWidth}px`
    pill.style.transform = `translateX(${link.offsetLeft}px)`
  }
  if (pill) pill.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1), width .6s cubic-bezier(.16,1,.3,1), opacity .4s'

  const update = (id: string) => {
    current = id
    if (fab) fab.href = waLink(contextMessages[id] ?? DEFAULT_MESSAGE)
    if (fabLabel) fabLabel.textContent = id === 'cobertura' ? 'Consultar meu CEP' : id === 'faq' ? 'Tirar uma dúvida' : 'Fale com o comercial'
    const railId = rail.some((r) => r.dataset.railLink === id) ? id : id === 'marketplaces' ? 'inicio' : id === 'diferenciais' ? 'como-funciona' : id === 'confianca' ? 'cobertura' : id
    rail.forEach((r) => r.classList.toggle('is-active', r.dataset.railLink === railId))
    const nl = navLinks.find((l) => l.dataset.navLink === railId)
    navLinks.forEach((l) => l.classList.toggle('is-active', l === nl))
    movePill(nl)
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) update((e.target as HTMLElement).id)
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  sections.forEach((s) => io.observe(s))

  // FAB aparece depois do hero e some sobre a seção de contato (que já tem os botões)
  let pastHero = false, onContact = false
  const sync = () => fab?.classList.toggle('is-visible', pastHero && !onContact)
  if (hero) new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; sync() }, { rootMargin: '-20% 0px 0px 0px' }).observe(hero)
  if (contact) new IntersectionObserver(([e]) => { onContact = e.isIntersecting; sync() }, { threshold: 0.35 }).observe(contact)

  const refresh = () => movePill(navLinks.find((l) => l.classList.contains('is-active')))
  window.addEventListener('resize', refresh)
  document.fonts?.ready.then(refresh)
  return () => current
}

/* Cabeçalho -------------------------------------------------------------- */
export function initHeader() {
  const header = $('[data-header]')
  if (!header) return
  let ticking = false
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 16)
    ticking = false
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(update)
    }
  }, { passive: true })
  update()
}

/* Magnético + cursor (apenas ponteiro fino, sem movimento reduzido) ------- */
export function initPointer() {
  if (!finePointer() || reducedMotion()) return

  $$('[data-magnetic]').forEach((el) => {
    const inner = $('[data-magnetic-inner]', el) ?? el
    let raf = 0
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left - r.width / 2) / r.width
      const y = (e.clientY - r.top - r.height / 2) / r.height
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * 10}px, ${y * 10}px)`
        inner.style.transform = `translate(${x * 6}px, ${y * 6}px)`
      })
    })
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf)
      el.style.transition = inner.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)'
      el.style.transform = inner.style.transform = ''
      setTimeout(() => { el.style.transition = inner.style.transition = '' }, 700)
    })
  })

  const cursor = $('[data-cursor]')
  if (!cursor) return
  cursor.classList.remove('hidden')
  let x = -100, y = -100, cx = -100, cy = -100
  window.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY }, { passive: true })
  window.addEventListener('pointerdown', () => cursor.classList.add('is-down'))
  window.addEventListener('pointerup', () => cursor.classList.remove('is-down'))
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as Element).closest('a, button, label.chip, input, textarea')
    cursor.classList.toggle('is-hover', !!t)
  })
  document.addEventListener('pointerleave', () => { x = y = -100 })
  const tick = () => {
    cx += (x - cx) * 0.2
    cy += (y - cy) * 0.2
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
    requestAnimationFrame(tick)
  }
  tick()
}
