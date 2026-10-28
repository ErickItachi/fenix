import { initScroll } from './scroll'
import { initCoverage, initFaq, initHeader, initMenu, initPointer, initProposal, initSectionAwareness, initServices } from './ui'

initHeader()
initMenu()
initServices()
initFaq()
initCoverage()
initProposal()
initSectionAwareness()
initPointer()

// A coreografia de scroll (e o canvas do hero) entra quando o navegador fica ocioso,
// para não competir com a primeira pintura.
const idle = (cb: () => void) =>
  typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(cb, { timeout: 900 }) : setTimeout(cb, 200)
idle(initScroll)

document.documentElement.classList.add('motion-ready')
