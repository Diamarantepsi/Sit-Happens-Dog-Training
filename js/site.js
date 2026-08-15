/* ==========================================================================
   Sit Happens Dog Training
   Sem framework, sem build. Tudo que e configuravel esta no topo do arquivo.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     CONFIGURACAO
     ------------------------------------------------------------------------ */

  /* WhatsApp da Isis Ribas, formato internacional, so numeros. */
  var WHATSAPP = '5511976672133';

  /* Ligue para true quando a Isis Ribas enviar a tabela de valores. */
  var MOSTRAR_PRECOS = false;

  /* PENDENTE: valores dos servicos. Preencha e ligue MOSTRAR_PRECOS.
     Formato: { titulo: '', resumo: '', itens: ['Servico: R$ 000'] } */
  var PRECOS = [];

  /* PENDENTE: depoimentos reais de clientes.
     Enquanto o array estiver vazio, a secao fica oculta sozinha.
     Formato: { texto: 'depoimento literal', autor: 'Nome, bairro' } */
  var DEPOIMENTOS = [];

  /* ------------------------------------------------------------------------
     UTILIDADES
     ------------------------------------------------------------------------ */
  var $ = function (seletor, escopo) { return (escopo || document).querySelector(seletor); };
  var $$ = function (seletor, escopo) {
    return Array.prototype.slice.call((escopo || document).querySelectorAll(seletor));
  };

  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     TOPO: estado ao rolar e menu de telas pequenas
     ------------------------------------------------------------------------ */
  var topo = $('#topo');
  var botaoMenu = $('#abre-menu');
  var navegacao = $('#navegacao');

  function atualizaTopo() {
    if (!topo) { return; }
    topo.classList.toggle('topo--rolado', window.scrollY > 24);
  }

  function fechaMenu() {
    if (!navegacao || !botaoMenu) { return; }
    navegacao.classList.remove('navegacao--aberta');
    botaoMenu.setAttribute('aria-expanded', 'false');
  }

  if (botaoMenu && navegacao) {
    botaoMenu.addEventListener('click', function () {
      var aberto = botaoMenu.getAttribute('aria-expanded') === 'true';
      botaoMenu.setAttribute('aria-expanded', String(!aberto));
      navegacao.classList.toggle('navegacao--aberta', !aberto);
    });

    $$('a', navegacao).forEach(function (link) {
      link.addEventListener('click', fechaMenu);
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape') { fechaMenu(); }
    });
  }

  /* ------------------------------------------------------------------------
     LINK ATIVO NA NAVEGACAO
     ------------------------------------------------------------------------ */
  var linksNavegacao = $$('#navegacao a[href^="#"]').filter(function (link) {
    return link.getAttribute('href').length > 1 && !link.classList.contains('botao');
  });
  var secoesObservadas = linksNavegacao
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && secoesObservadas.length) {
    var vigia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) { return; }
        linksNavegacao.forEach(function (link) {
          var alvo = link.getAttribute('href') === '#' + entrada.target.id;
          if (alvo) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    secoesObservadas.forEach(function (secao) { vigia.observe(secao); });
  }

  /* ------------------------------------------------------------------------
     REVELACAO AO ROLAR
     ------------------------------------------------------------------------ */
  var revelaveis = $$('.revela');
  if (menosMovimento || !('IntersectionObserver' in window)) {
    revelaveis.forEach(function (elemento) { elemento.classList.add('revela--visivel'); });
  } else {
    var vigiaRevela = new IntersectionObserver(function (entradas, observador) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) { return; }
        entrada.target.classList.add('revela--visivel');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    revelaveis.forEach(function (elemento) { vigiaRevela.observe(elemento); });
  }

  /* ------------------------------------------------------------------------
     VIDEO DE ABERTURA
     Carrega apenas depois da pagina pronta, e nunca com menos movimento pedido.
     ------------------------------------------------------------------------ */
  var videoAbertura = $('#video-abertura');
  if (videoAbertura && !menosMovimento) {
    var iniciaAbertura = function () {
      videoAbertura.load();
      var promessa = videoAbertura.play();
      if (promessa && typeof promessa.catch === 'function') {
        /* Alguns navegadores recusam autoplay. O poster continua no lugar. */
        promessa.catch(function () {});
      }
    };
    if (document.readyState === 'complete') {
      iniciaAbertura();
    } else {
      window.addEventListener('load', iniciaAbertura, { once: true });
    }
  }

  /* ------------------------------------------------------------------------
     GALERIA DE VIDEOS
     Nenhum arquivo desce antes do visitante pedir.
     ------------------------------------------------------------------------ */
  $$('.video-cartao').forEach(function (cartao) {
    var botao = $('.video-cartao__play', cartao);
    var caminho = cartao.getAttribute('data-video');
    var descricao = cartao.getAttribute('data-descricao') || 'Vídeo de atendimento';
    if (!botao || !caminho) { return; }

    botao.setAttribute('aria-label', 'Tocar o vídeo: ' + descricao);

    botao.addEventListener('click', function () {
      /* Pausa qualquer outro video da galeria antes de tocar este. */
      $$('.video-cartao video').forEach(function (outro) {
        if (!outro.paused) { outro.pause(); }
        var pai = outro.closest('.video-cartao');
        if (pai && pai !== cartao) { pai.classList.remove('video-cartao--tocando'); }
      });

      var video = $('video', cartao);
      if (!video) {
        video = document.createElement('video');
        video.setAttribute('controls', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('preload', 'metadata');
        video.setAttribute('title', descricao);
        video.setAttribute('poster', $('img', cartao).getAttribute('src'));
        video.src = caminho;
        cartao.appendChild(video);

        video.addEventListener('ended', function () {
          cartao.classList.remove('video-cartao--tocando');
        });
      }

      cartao.classList.add('video-cartao--tocando');
      var tocando = video.play();
      if (tocando && typeof tocando.catch === 'function') { tocando.catch(function () {}); }
      video.focus({ preventScroll: true });
    });
  });

  /* ------------------------------------------------------------------------
     DEPOIMENTOS
     ------------------------------------------------------------------------ */
  var secaoDepoimentos = $('#depoimentos');
  var listaDepoimentos = $('#lista-depoimentos');
  if (secaoDepoimentos && listaDepoimentos && DEPOIMENTOS.length) {
    DEPOIMENTOS.forEach(function (item) {
      var figura = document.createElement('figure');
      figura.className = 'depoimento';

      var citacao = document.createElement('blockquote');
      citacao.textContent = item.texto;

      var legenda = document.createElement('figcaption');
      legenda.textContent = item.autor;

      figura.appendChild(citacao);
      figura.appendChild(legenda);
      listaDepoimentos.appendChild(figura);
    });
    secaoDepoimentos.hidden = false;
  }

  /* ------------------------------------------------------------------------
     PRECOS
     ------------------------------------------------------------------------ */
  var secaoPrecos = $('#precos');
  var listaPrecos = $('#lista-precos');
  if (secaoPrecos && listaPrecos && MOSTRAR_PRECOS && PRECOS.length) {
    PRECOS.forEach(function (grupo, indice) {
      var cartao = document.createElement('article');
      cartao.className = 'frente';

      var numero = document.createElement('p');
      numero.className = 'frente__numero';
      numero.textContent = 'Opção 0' + (indice + 1);

      var titulo = document.createElement('h3');
      titulo.textContent = grupo.titulo;

      var resumo = document.createElement('p');
      resumo.className = 'frente__resumo';
      resumo.textContent = grupo.resumo || '';

      var lista = document.createElement('ul');
      (grupo.itens || []).forEach(function (texto) {
        var item = document.createElement('li');
        item.textContent = texto;
        lista.appendChild(item);
      });

      cartao.appendChild(numero);
      cartao.appendChild(titulo);
      cartao.appendChild(resumo);
      cartao.appendChild(lista);
      listaPrecos.appendChild(cartao);
    });
    secaoPrecos.hidden = false;
  }

  /* ------------------------------------------------------------------------
     LINK DIRETO DE WHATSAPP
     ------------------------------------------------------------------------ */
  var linkRodape = $('#link-whatsapp-rodape');
  if (linkRodape) {
    if (WHATSAPP) {
      linkRodape.href = 'https://wa.me/' + WHATSAPP;
      linkRodape.target = '_blank';
      linkRodape.textContent = 'WhatsApp (11) 97667-2133';
    } else {
      linkRodape.closest('li').remove();
    }
  }

  /* ------------------------------------------------------------------------
     BOTAO FLUTUANTE
     ------------------------------------------------------------------------ */
  var flutuante = $('#whats-flutuante');
  var abertura = $('#inicio');
  var contato = $('#contato');

  function atualizaFlutuante() {
    if (!flutuante || !abertura) { return; }
    var passouAbertura = window.scrollY > abertura.offsetHeight * 0.7;
    var noContato = contato
      ? contato.getBoundingClientRect().top < window.innerHeight * 0.9
      : false;
    flutuante.classList.toggle('whats-flutuante--visivel', passouAbertura && !noContato);
  }

  var esperandoQuadro = false;
  window.addEventListener('scroll', function () {
    if (esperandoQuadro) { return; }
    esperandoQuadro = true;
    window.requestAnimationFrame(function () {
      atualizaTopo();
      atualizaFlutuante();
      esperandoQuadro = false;
    });
  }, { passive: true });

  atualizaTopo();
  atualizaFlutuante();

  /* ------------------------------------------------------------------------
     FORMULARIO
     Monta a mensagem e abre o WhatsApp da Isis Ribas com o texto pronto.
     ------------------------------------------------------------------------ */
  var formulario = $('#formulario-contato');

  function envolucroDoCampo(elemento) {
    return elemento.closest('[data-campo]');
  }

  function marcaErro(elemento, temErro) {
    var envolucro = envolucroDoCampo(elemento);
    if (!envolucro) { return; }
    envolucro.classList.toggle('campo--erro', temErro);
    elemento.setAttribute('aria-invalid', temErro ? 'true' : 'false');
    var erro = $('.campo__erro', envolucro);
    if (erro && erro.id) {
      if (temErro) {
        elemento.setAttribute('aria-describedby', erro.id);
      } else {
        elemento.removeAttribute('aria-describedby');
      }
    }
  }

  function telefoneValido(valor) {
    var digitos = valor.replace(/\D/g, '');
    return digitos.length >= 10 && digitos.length <= 13;
  }

  function validaCampo(elemento) {
    var valor = (elemento.value || '').trim();
    var valido = valor !== '';
    if (valido && elemento.id === 'whatsapp') {
      valido = telefoneValido(valor);
    }
    marcaErro(elemento, !valido);
    return valido;
  }

  if (formulario) {
    var obrigatorios = $$('[required]', formulario);

    obrigatorios.forEach(function (elemento) {
      elemento.addEventListener('blur', function () { validaCampo(elemento); });
      elemento.addEventListener('input', function () {
        if (envolucroDoCampo(elemento).classList.contains('campo--erro')) {
          validaCampo(elemento);
        }
      });
    });

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();

      var primeiroInvalido = null;
      obrigatorios.forEach(function (elemento) {
        var ok = validaCampo(elemento);
        if (!ok && !primeiroInvalido) { primeiroInvalido = elemento; }
      });

      if (primeiroInvalido) {
        primeiroInvalido.focus();
        return;
      }

      var v = function (id) { return ($('#' + id).value || '').trim(); };

      var linhas = [
        'Olá, Isis Ribas. Vim pelo site da Sit Happens.',
        '',
        'Nome: ' + v('nome'),
        'WhatsApp: ' + v('whatsapp'),
        'Bairro ou cidade: ' + v('bairro'),
        '',
        'Cão: ' + v('cao'),
        'Idade aproximada: ' + (v('idade') || 'não informada'),
        'Porte: ' + v('porte'),
        '',
        'Principal desafio: ' + v('desafio'),
        'Prefiro atendimento: ' + v('atendimento')
      ];

      if (v('detalhes')) {
        linhas.push('', 'Mais detalhes: ' + v('detalhes'));
      }

      var mensagem = linhas.join('\n');

      if (!WHATSAPP) {
        /* PENDENTE: sem numero configurado, o site nao inventa destino. */
        window.alert('O número de WhatsApp ainda não foi configurado neste site.');
        return;
      }

      window.open(
        'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensagem),
        '_blank',
        'noopener'
      );
    });
  }
})();
