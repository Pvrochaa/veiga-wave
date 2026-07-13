# veigawave

> Projeto criado em 13/07/2026. Pasta dedicada — instruções aqui sobrescrevem as da raiz quando relevantes.

## Sobre

Site institucional/e-commerce para a veigawave, marca de biquíni de uma cliente da Rochaa Agência. Precisa ser totalmente profissional, responsivo e interativo, com paleta degradê pôr-do-sol x mar.

## Tipo

Cliente novo

## Entregas previstas

- Site (home + navegação completa nessa primeira rodada; produto, checkout e páginas institucionais em rodadas futuras)

## Onde salvar o que

- Briefings e contexto: nessa pasta na raiz (`briefing.md`)
- Entregas: `site/`

## Contexto que herda da raiz

Esse projeto herda automaticamente o tom de voz, marca e contexto do negócio definidos em `_memoria/` e `identidade/` da raiz. Não duplicar essas informações aqui.

## Específico desse projeto

- Primeira entrega é um protótipo front-end estático (HTML/CSS/JS) — sem backend, carrinho/checkout reais ou integração de pagamento ainda
- Estrutura de navegação completa: Home, Novidades, Coleções, Biquínis (tops/calcinhas/conjuntos), Maiôs/Body, Saídas de praia e acessórios, Sale/Outlet, Sobre a marca, Contato

### Identidade visual (Brand Book — Solar Edition, v1.0, 2026)

Conceito: "hora dourada" — o instante em que o sol toca o horizonte e o mar acende. Toda a identidade gira em torno da linha do horizonte e do degradê do pôr do sol.

**Paleta oficial:**
- Sol Nascente: `#FFC46B`
- Pôr do Sol: `#FF6A45`
- Água-viva: `#14C6B2`
- Maré: `#0A8478`
- Profundo: `#07211F`
- Areia: `#E7DDC9`
- Espuma: `#F2F0E9`
- Gradiente-assinatura ("Hora Dourada"): `linear-gradient(90deg, #FFC46B, #FF6A45 42%, #0A8478 100%)`

**Tipografia:** display serifada itálica (Georgia/Times) para títulos editoriais e campanhas; sans black (Helvetica Neue 800 / equivalente) para o wordmark, caixa-baixa com tracking negativo.

**Emblema:** sol em degradê radial (dourado claro ao centro → coral nas bordas), sem moldura ao redor.

**Direção de arte:** sempre golden hour, nunca sol a pino; água como cenário (textura de mar/reflexo); tons naturais de pele e areia.

O fundo do hero do site (`site/assets/js/main.js`, IIFE `heroSky`) reproduz esse degradê + sol pulsante + ondas animadas em canvas, replicado do brand book oficial da marca.
