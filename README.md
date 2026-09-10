# SoftBike

Site acadêmico em HTML, CSS e JavaScript puro. Abra index.html no navegador; não há instalação ou build.

## Interações

- Menu mobile até 768 px: abre por clique/teclado, fecha por Escape ou ao escolher uma seção e preserva foco ao redimensionar.
- Voltar ao topo: aparece após rolar mais que a altura da tela e devolve o foco ao logo.
- Filtro de modelos pelas faixas etárias já descritas no site, com anúncio da quantidade encontrada.
- Rolagem suave, respeitando a preferência de movimento reduzido.
- Sem JavaScript, a navegação e todos os modelos continuam disponíveis.

As faixas são o conteúdo acadêmico existente, não uma recomendação individual de tamanho de bicicleta.
O número de WhatsApp é demonstrativo; os links continuam apontando para contato até existir um número real.
Não há carrinho, compra, envio de formulário ou backend.

## Validação

Sintaxe: node --check script.js
Regressão no navegador: node tests/smoke.cjs
Diff: git diff --check

O smoke usa Playwright e Chromium disponíveis no ambiente, sem dependência de produção.
Se necessário, defina NODE_PATH para o diretório de pacotes já instalado e CHROMIUM_EXECUTABLE para o executável do Chromium.
SCREENSHOT_DIR é opcional e deve apontar para uma pasta existente.
