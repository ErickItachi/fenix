import { site } from '../data/site'

type Line = 'commercial' | 'sac'

export const DEFAULT_MESSAGE = 'Olá! Gostaria de falar sobre os serviços de entrega da Fênix Entregas Flex.'

/** Link wa.me com mensagem pré-preenchida. */
export function waLink(message: string = DEFAULT_MESSAGE, line: Line = 'commercial'): string {
  return `https://wa.me/${site.phones[line].e164}?text=${encodeURIComponent(message)}`
}

export const telLink = (line: Line = 'sac') => `tel:+${site.phones[line].e164}`
