'use strict';

const menu = document.querySelector('#menu-principal');
const botaoMenu = document.querySelector('.menu-toggle');
const telaPequena = window.matchMedia('(max-width: 768px)');
const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
const botaoTopo = document.querySelector('#botaoTopo');

function rolarAoTopo() {
    document.querySelector('.topo .logo')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: movimentoReduzido.matches ? 'instant' : 'smooth' });
}

if (menu && botaoMenu) {
    function definirMenu(aberto) {
        botaoMenu.setAttribute('aria-expanded', String(aberto));
        botaoMenu.textContent = aberto ? 'Fechar menu' : 'Menu';
        menu.hidden = telaPequena.matches && !aberto;
    }

    function ajustarMenu() {
        botaoMenu.hidden = !telaPequena.matches;
        definirMenu(false);
        if (menu.hidden && menu.contains(document.activeElement)) botaoMenu.focus();
        if (botaoMenu.hidden && document.activeElement === botaoMenu) menu.querySelector('a').focus();
    }

    botaoMenu.addEventListener('click', () => {
        definirMenu(botaoMenu.getAttribute('aria-expanded') !== 'true');
    });

    document.querySelector('.topo').addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && telaPequena.matches) {
            definirMenu(false);
            botaoMenu.focus();
        }
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (!telaPequena.matches) return;
            definirMenu(false);
            if (!link.hash) return;
            const destino = document.querySelector(link.hash);
            if (!destino) return;
            destino.setAttribute('tabindex', '-1');
            destino.focus({ preventScroll: true });
        });
    });

    telaPequena.addEventListener('change', ajustarMenu);
    ajustarMenu();
}

function atualizarBotaoTopo() {
    const visivel = window.scrollY > window.innerHeight;
    botaoTopo.hidden = !visivel;
    botaoTopo.classList.toggle('visivel', visivel);
}

if (botaoTopo) {
    window.addEventListener('scroll', atualizarBotaoTopo, { passive: true });
    window.addEventListener('resize', atualizarBotaoTopo);
    atualizarBotaoTopo();

    botaoTopo.addEventListener('click', rolarAoTopo);
}

const filtro = document.querySelector('#faixa-etaria');
const produtos = [...document.querySelectorAll('.produto')];
const resultado = document.querySelector('#resultado-modelos');

function filtrarModelos() {
    produtos.forEach((produto) => {
        produto.hidden = filtro.value !== 'todos' && produto.dataset.faixa !== filtro.value;
    });
    const quantidade = produtos.filter((produto) => !produto.hidden).length;
    resultado.textContent = quantidade === 1 ? '1 modelo encontrado.' : quantidade + ' modelos encontrados.';
}

if (filtro && resultado) {
    filtro.addEventListener('change', filtrarModelos);
    document.querySelector('.filtro-modelos').hidden = false;
    filtrarModelos();
}

