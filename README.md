# Fênix Entregas Flex — site

Landing page da Fênix Entregas Flex, logística de última milha para sellers de marketplaces na Grande São Paulo.

Feita com [Astro](https://astro.build), Tailwind CSS 4 e GSAP (ScrollTrigger, SplitText e MotionPath). O HTML é gerado estático no build. O JavaScript cuida só do movimento e das interações.

## Rodar localmente

Use Node.js 22 ou superior.

```bash
npm ci
npm run dev
```

`npm run build` roda a checagem de tipos (`astro check`) e gera `dist/`. `npm run preview` serve o build.

## Onde mudar o conteúdo

Todo o conteúdo comercial está em `src/data/site.ts`: telefones, e-mail, endereço, redes, marketplaces, serviços, etapas, diferenciais, regiões atendidas, itens de confiança e FAQ. Os textos vieram do site anterior; não adicione números, depoimentos ou promessas que não possam ser comprovados.

- Mensagens de WhatsApp: `src/lib/whatsapp.ts` e o campo `wa` de cada serviço. A mensagem do botão flutuante muda conforme a seção visível (`contextMessages` em `src/scripts/ui.ts`).
- Coordenadas do mapa: `regions` em `src/data/site.ts` (latitude e longitude aproximadas). O mapa e a rede animada da abertura são gerados a partir delas.
- Logos dos marketplaces: os arquivos oficiais ficam em `brand/marketplaces/`. `python3 scripts/marketplaces.py brand/marketplaces public/marketplaces` remove o fundo e gera as silhuetas monocromáticas em `public/marketplaces/`. No site elas são pintadas com o gradiente prata via `mask-image` (`src/components/Marketplaces.astro`).
- Logo: o original transparente fica em `brand/fenix-logo-original.webp`. Para regenerar as versões web em `public/brand/`, rode `python3 scripts/logo.py brand/fenix-logo-original.webp public/brand` (requer Pillow).

## Estrutura

- `src/components/`: uma seção por arquivo (Hero, Marketplaces, About, Services, Journey, Differentials, Coverage, Trust, Faq, Contact, Footer) e peças comuns (Header, Button, Icon, Logo, Floating).
- `src/scripts/scroll.ts`: coreografia de scroll. Tudo fica em `gsap.matchMedia`: com `prefers-reduced-motion` nada é escondido nem fixado, e a abertura vira um quadro estático. O percurso de "Como funciona" é fixado só a partir de 1024 px; no celular vira uma trilha vertical.
- `src/scripts/motion/heroNetwork.ts`: rede de rotas em canvas 2D. Pausa fora da tela e com a aba oculta, e limita a densidade de pixels.
- `src/scripts/ui.ts`: menu, serviços, FAQ, mapa, formulários, botão de WhatsApp, cursor e efeito magnético.

O formulário de proposta e a consulta de CEP não guardam dados: montam a mensagem e abrem o WhatsApp comercial.

## Publicação

O projeto está pronto para a Vercel (framework Astro, saída estática). `vercel.json` define cabeçalhos de segurança e cache longo para `/_astro/`. O domínio canônico configurado em `astro.config.mjs` e no `robots.txt` é `https://www.fenixentregasflex.com.br`.
