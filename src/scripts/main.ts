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
initScroll()

document.documentElement.classList.add('motion-ready')
