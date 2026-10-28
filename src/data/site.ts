// Conteúdo comercial da Fênix Entregas Flex.
// Fonte: site anterior (fenixentregasflex.com.br) e briefing do cliente.
// Não adicione números, depoimentos ou promessas que não possam ser verificados.

export const site = {
  name: 'Fênix Entregas Flex',
  shortName: 'Fênix',
  url: 'https://www.fenixentregasflex.com.br',
  tagline: 'Seu pedido renasce a cada entrega.',
  title: 'Fênix Entregas Flex | Logística de última milha para marketplaces em São Paulo',
  description:
    'Entregas rápidas no mesmo dia para sellers de Mercado Livre, Shopee, Amazon e Magalu. Última milha com duas janelas de coleta, rastreio e SAC dedicado na Grande São Paulo.',
  email: 'fenixentregasflex@gmail.com',
  phones: {
    commercial: { label: '(11) 93294-0253', e164: '5511932940253' },
    sac: { label: '(11) 99749-2921', e164: '5511997492921' },
  },
  sacHours: { open: '08h', close: '20h', schema: '08:00-20:00' },
  address: {
    street: 'Rua Sargento Manuel Chagas, 303',
    district: 'Parque Novo Mundo',
    city: 'São Paulo',
    state: 'SP',
    zip: '02179-040',
    maps:
      'https://www.google.com/maps/search/?api=1&query=Rua%20Sargento%20Manuel%20Chagas%2C%20303%20-%20Parque%20Novo%20Mundo%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%20CEP%2002179-040',
  },
  social: [
    { name: 'Instagram', href: 'https://www.instagram.com/fenixentregasflex' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/f%C3%AAnixentregasflex' },
    { name: 'Facebook', href: 'https://www.facebook.com/share/1EnkaUE2X3' },
  ],
} as const

export const nav = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'cobertura', label: 'Cobertura' },
  { id: 'faq', label: 'FAQ' },
] as const

/** Marketplaces atendidos. Os nomes pertencem aos respectivos titulares. */
export const marketplaces = ['Mercado Livre', 'Shopee', 'Amazon', 'Magalu'] as const

/** Fatos operacionais publicados pela própria Fênix. */
export const facts = [
  { value: 2, pad: 2, suffix: '', label: 'janelas de coleta por dia', note: 'Duas operações logísticas diárias' },
  { value: 100, pad: 0, suffix: '%', label: 'das áreas Flex na Grande SP', note: 'Capital, ABC e região metropolitana' },
  { value: 12, pad: 2, suffix: 'h', label: 'de SAC por dia', note: 'Atendimento das 08h às 20h' },
  { value: 4, pad: 2, suffix: '', label: 'grandes marketplaces', note: 'Mercado Livre, Shopee, Amazon e Magalu' },
] as const

export const pillars = [
  { title: 'Agilidade', text: 'Rotas otimizadas e prazos cumpridos dentro do SLA.' },
  { title: 'Confiabilidade', text: 'Rastreamento e comunicação transparente do início ao fim.' },
  { title: 'Escala', text: 'Capacidade para operar com os maiores marketplaces do país, com duas operações logísticas por dia.' },
] as const

export type ServiceIcon = 'bolt' | 'stack' | 'route' | 'headset'

export const services: ReadonlyArray<{
  id: string
  icon: ServiceIcon
  title: string
  kicker: string
  text: string
  points: readonly string[]
  wa: string
}> = [
  {
    id: 'mesmo-dia',
    icon: 'bolt',
    title: 'Entregas rápidas no mesmo dia',
    kicker: 'Última milha',
    text: 'Entrega direta ao consumidor final, com agilidade e rastreio em cada pedido.',
    points: ['Coleta no ponto de origem combinado', 'Rastreio do envio ao recebimento', 'Duas janelas de coleta por dia'],
    wa: 'Olá! Quero saber mais sobre as entregas no mesmo dia da Fênix Entregas Flex.',
  },
  {
    id: 'marketplaces',
    icon: 'stack',
    title: 'Operação para marketplaces',
    kicker: 'Sellers',
    text: 'Estrutura dedicada para grandes volumes e integrações, pronta para Mercado Livre, Shopee, Amazon e Magalu.',
    points: ['Operações de todos os portes', 'Solução ajustada ao volume da loja', 'Preparada para picos sazonais'],
    wa: 'Olá! Vendo em marketplaces e quero uma proposta de operação com a Fênix Entregas Flex.',
  },
  {
    id: 'rotas',
    icon: 'route',
    title: 'Gestão de rotas inteligente',
    kicker: 'Roteirização',
    text: 'Otimização de trajetos para reduzir tempo e custo, com pacotes organizados por região.',
    points: ['Triagem por região de entrega', 'Trajetos planejados antes da saída', 'Menos tempo entre coleta e entrega'],
    wa: 'Olá! Quero entender como funciona a gestão de rotas da Fênix Entregas Flex.',
  },
  {
    id: 'sac',
    icon: 'headset',
    title: 'Atendimento dedicado (SAC)',
    kicker: 'Das 08h às 20h',
    text: 'Atendimento dedicado para resolver qualquer imprevisto rapidamente, com comunicação direta.',
    points: ['Canal direto pelo WhatsApp', 'Atendimento das 08h às 20h', 'Acompanhamento de ocorrências'],
    wa: 'Olá! Preciso de atendimento do SAC da Fênix Entregas Flex.',
  },
]

export const steps = [
  { title: 'Coleta', text: 'Retiramos os pacotes no ponto de origem combinado, em uma das duas janelas de coleta do dia.', tag: 'Origem' },
  { title: 'Triagem', text: 'Cada pacote é conferido e separado por região de destino, ainda no centro operacional.', tag: 'Centro operacional' },
  { title: 'Roteirização', text: 'Os trajetos são organizados por região para máxima eficiência de entrega.', tag: 'Rota inteligente' },
  { title: 'Entrega expressa', text: 'Nossos motoristas levam o pacote até a porta do consumidor final.', tag: 'Última milha' },
  { title: 'Confirmação', text: 'Você acompanha cada etapa e recebe a confirmação da entrega com rastreio.', tag: 'Rastreio' },
] as const

export const differentials = [
  { title: 'Capacidade para alto volume', text: 'Estrutura pronta para picos de pedidos sem perder a qualidade.' },
  { title: 'Equipe treinada', text: 'Comprometida com prazo e cuidado em cada entrega.' },
  { title: 'Comunicação direta', text: 'SAC dedicado para resolver qualquer imprevisto rapidamente.' },
  { title: 'Flexibilidade sazonal', text: 'Prontos para operações de pico e datas de alta demanda.' },
  { title: 'Operação organizada', text: 'Triagem e roteirização por região antes de cada saída.' },
] as const

/** Coordenadas aproximadas (lat, lon) das cidades citadas na área de cobertura Flex. */
export type City = { name: string; lat: number; lon: number }
export type Region = { id: string; name: string; summary: string; cities: City[] }

export const hub = { name: 'Base Fênix · Parque Novo Mundo', lat: -23.515, lon: -46.58 }

export const regions: Region[] = [
  {
    id: 'capital',
    name: 'São Paulo Capital',
    summary: 'Todas as zonas da capital',
    cities: [
      { name: 'Centro', lat: -23.5505, lon: -46.6333 },
      { name: 'Zona Norte', lat: -23.468, lon: -46.632 },
      { name: 'Zona Leste', lat: -23.545, lon: -46.47 },
      { name: 'Zona Sul', lat: -23.655, lon: -46.705 },
      { name: 'Zona Oeste', lat: -23.57, lon: -46.725 },
    ],
  },
  {
    id: 'abc',
    name: 'Região do ABC',
    summary: 'Santo André, São Bernardo, São Caetano, Diadema e Mauá',
    cities: [
      { name: 'Santo André', lat: -23.6639, lon: -46.5383 },
      { name: 'São Bernardo', lat: -23.6944, lon: -46.5654 },
      { name: 'São Caetano', lat: -23.6229, lon: -46.5548 },
      { name: 'Diadema', lat: -23.6861, lon: -46.6228 },
      { name: 'Mauá', lat: -23.6677, lon: -46.4613 },
    ],
  },
  {
    id: 'guarulhos-osasco',
    name: 'Guarulhos e Osasco',
    summary: 'Os dois polos vizinhos da capital',
    cities: [
      { name: 'Guarulhos', lat: -23.4543, lon: -46.5337 },
      { name: 'Osasco', lat: -23.5329, lon: -46.792 },
    ],
  },
  {
    id: 'norte-oeste',
    name: 'Norte e Oeste metropolitano',
    summary: 'Caieiras, Cajamar, Cotia e Embu',
    cities: [
      { name: 'Caieiras', lat: -23.3645, lon: -46.7406 },
      { name: 'Cajamar', lat: -23.356, lon: -46.877 },
      { name: 'Cotia', lat: -23.6037, lon: -46.9192 },
      { name: 'Embu', lat: -23.649, lon: -46.8523 },
    ],
  },
  {
    id: 'barueri',
    name: 'Barueri e Alphaville',
    summary: 'Barueri, Alphaville, Carapicuíba, Jandira, Itapevi e Santana de Parnaíba',
    cities: [
      { name: 'Barueri', lat: -23.5107, lon: -46.8761 },
      { name: 'Alphaville', lat: -23.482, lon: -46.85 },
      { name: 'Carapicuíba', lat: -23.5235, lon: -46.8407 },
      { name: 'Jandira', lat: -23.5275, lon: -46.9023 },
      { name: 'Itapevi', lat: -23.5488, lon: -46.9327 },
      { name: 'Santana de Parnaíba', lat: -23.444, lon: -46.918 },
    ],
  },
  {
    id: 'alto-tiete',
    name: 'Alto Tietê',
    summary: 'Arujá, Mogi das Cruzes, Suzano, Poá, Ferraz, Itaquaquecetuba e mais',
    cities: [
      { name: 'Arujá', lat: -23.3965, lon: -46.3208 },
      { name: 'Mogi das Cruzes', lat: -23.5225, lon: -46.1883 },
      { name: 'Suzano', lat: -23.5428, lon: -46.3108 },
      { name: 'Poá', lat: -23.5286, lon: -46.3449 },
      { name: 'Ferraz', lat: -23.5411, lon: -46.3711 },
      { name: 'Itaquaquecetuba', lat: -23.4864, lon: -46.3486 },
    ],
  },
]

export const trust = [
  {
    title: 'Endereço operacional',
    text: `${site.address.street} · ${site.address.district}, ${site.address.city} - ${site.address.state}`,
    href: site.address.maps,
    cta: 'Ver no mapa',
  },
  {
    title: 'SAC com horário definido',
    text: `Atendimento das ${site.sacHours.open} às ${site.sacHours.close} pelo ${site.phones.sac.label}.`,
    href: `https://wa.me/${site.phones.sac.e164}`,
    cta: 'Falar com o SAC',
  },
  {
    title: 'Rastreabilidade',
    text: 'Acompanhamento de cada etapa, da coleta à confirmação de recebimento pelo cliente final.',
    href: '#como-funciona',
    cta: 'Ver o percurso',
  },
  {
    title: 'Presença pública',
    text: 'Canais oficiais no Instagram, LinkedIn e Facebook, além do WhatsApp comercial.',
    href: 'https://www.instagram.com/fenixentregasflex',
    cta: 'Abrir Instagram',
  },
] as const

export const faq = [
  {
    q: 'Quais regiões a Fênix atende?',
    a: 'Atendemos 100% das áreas Flex da Grande São Paulo: capital, Região do ABC, Guarulhos, Osasco, Caieiras, Cajamar, Cotia, Embu, Barueri, Alphaville, Carapicuíba, Jandira, Itapevi, Santana de Parnaíba e Alto Tietê. Para confirmar um CEP específico, fale com o comercial pelo WhatsApp.',
  },
  {
    q: 'Com quais marketplaces vocês trabalham?',
    a: 'Atendemos sellers de Mercado Livre, Shopee, Amazon e Magalu, entre outros canais de e-commerce.',
  },
  {
    q: 'Quantas coletas são feitas por dia?',
    a: 'Operamos com duas janelas de coleta por dia, para maximizar as entregas das suas vendas. Os horários são combinados com o time comercial conforme a sua operação.',
  },
  {
    q: 'Vocês fazem entregas no mesmo dia?',
    a: 'Sim. O serviço de entregas rápidas leva o pedido direto ao consumidor final no mesmo dia, com rastreio. Prazos e janelas são alinhados com o comercial de acordo com o seu fluxo.',
  },
  {
    q: 'Atendem lojas pequenas ou só grandes operações?',
    a: 'Atendemos operações de todos os portes. Adaptamos a solução ao volume do seu negócio, inclusive em picos sazonais e datas de alta demanda.',
  },
  {
    q: 'Como acompanho as entregas e resolvo imprevistos?',
    a: 'Você acompanha cada etapa, da coleta à confirmação de recebimento. Para qualquer imprevisto, o SAC atende das 08h às 20h pelo (11) 99749-2921.',
  },
  {
    q: 'Como faço para contratar?',
    a: 'Envie a solicitação de proposta nesta página ou chame o comercial no WhatsApp (11) 93294-0253. Retornamos com a solução ajustada ao seu volume.',
  },
] as const
