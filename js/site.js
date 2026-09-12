/* ==========================================================================
   Sit Happens Dog Training
   Sem framework, sem build. Tudo que e configuravel esta no topo do arquivo.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     CONFIGURACAO
     ------------------------------------------------------------------------ */

  /* WhatsApp da Isis, formato internacional, so numeros. */
  var WHATSAPP = '5511976672133';

  /* Depoimentos reais de clientes, publicados com autorizacao dos tutores.
     Enquanto o array estiver vazio, a secao fica oculta sozinha.
     Formato: { texto: 'depoimento literal', autor: 'Assinatura' } */
  var DEPOIMENTOS = [
    {
      texto: 'A gente gosta muito de você, o jeito que você trata a gente, trata o Perseu. As aulinhas com você sempre foram super tranquilas, super didáticas. Você ouve muito a gente, sempre ouviu a gente falando da nossa rotina. Vamos manter com você 100%.',
      autor: 'Tutores do Perseu'
    }
  ];

  /* ------------------------------------------------------------------------
     UTILIDADES
     ------------------------------------------------------------------------ */
  var $ = function (seletor, escopo) { return (escopo || document).querySelector(seletor); };
  var $$ = function (seletor, escopo) {
    return Array.prototype.slice.call((escopo || document).querySelectorAll(seletor));
  };

  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     MENU DE TELAS PEQUENAS
     ------------------------------------------------------------------------ */
  var botaoMenu = $('#abre-menu');
  var navegacao = $('#navegacao');

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
     REVELACAO AO ROLAR
     O conteudo nasce visivel no CSS. A classe .js e quem liga a animacao,
     entao um navegador sem JS, ou um leitor que nunca dispara o observador,
     continua vendo a pagina inteira.
     ------------------------------------------------------------------------ */
  function ligaRevelacao() {
    var revelaveis = $$('.revela');

    /* Cada filho de um bloco escalonado recebe seu proprio atraso. */
    $$('.revela--escalonado').forEach(function (bloco) {
      Array.prototype.forEach.call(bloco.children, function (filho, indice) {
        filho.style.setProperty('--i', indice);
      });
    });

    if (menosMovimento || !('IntersectionObserver' in window)) {
      revelaveis.forEach(function (elemento) { elemento.classList.add('revela--visivel'); });
      return;
    }

    var vigia = new IntersectionObserver(function (entradas, observador) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) { return; }
        entrada.target.classList.add('revela--visivel');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    revelaveis.forEach(function (elemento) { vigia.observe(elemento); });

    /* Rede de seguranca: o que continuar escondido depois de 3s aparece. */
    window.setTimeout(function () {
      revelaveis.forEach(function (elemento) {
        if (elemento.getBoundingClientRect().top < window.innerHeight) {
          elemento.classList.add('revela--visivel');
        }
      });
    }, 3000);
  }

  /* ------------------------------------------------------------------------
     VIDEO DA ABERTURA
     Entra so depois que a pagina carregou, e nunca com menos movimento pedido.
     Ate la, e depois se falhar, o poster segura a cena.
     ------------------------------------------------------------------------ */
  function ligaAbertura() {
    if (menosMovimento) { return; }
    var palco = $('.heroi__midia');
    var poster = $('#heroi-poster');
    if (!palco || !poster) { return; }

    var video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');
    video.setAttribute('preload', 'auto');
    video.poster = poster.getAttribute('src');
    video.src = 'assets/video/abertura.mp4';

    video.addEventListener('playing', function () {
      poster.style.display = 'none';
    });

    palco.appendChild(video);

    var promessa = video.play();
    if (promessa && typeof promessa.catch === 'function') {
      /* Alguns navegadores recusam autoplay. O poster continua no lugar. */
      promessa.catch(function () {
        palco.removeChild(video);
      });
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
      if (tocando && typeof tocando.catch === 'function') {
        tocando.catch(function () {});
      }
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

    if (DEPOIMENTOS.length === 1) {
      listaDepoimentos.classList.add('depoimentos--unico');
    }
    secaoDepoimentos.hidden = false;
  } else {
    /* Sem depoimento, o menu nao deve apontar para uma secao oculta. */
    var linkDepoimentos = $('#navegacao a[href="#depoimentos"]');
    if (linkDepoimentos && linkDepoimentos.parentNode) {
      linkDepoimentos.parentNode.parentNode.removeChild(linkDepoimentos.parentNode);
    }
  }

  /* ------------------------------------------------------------------------
     LINK DE WHATSAPP DO RODAPE
     ------------------------------------------------------------------------ */
  var linkWhatsapp = $('#link-whatsapp');
  if (linkWhatsapp && WHATSAPP) {
    linkWhatsapp.href = 'https://wa.me/' + WHATSAPP;
    linkWhatsapp.target = '_blank';
    linkWhatsapp.rel = 'noopener';
  }

  /* ------------------------------------------------------------------------
     FORMULARIO
     Nada e enviado sozinho. O botao monta o texto e abre o WhatsApp.
     ------------------------------------------------------------------------ */
  var formulario = $('#formulario-contato');

  function envolucroDoCampo(elemento) {
    return elemento.closest('.campo') || elemento.parentNode;
  }

  function marcaErro(elemento, temErro) {
    envolucroDoCampo(elemento).classList.toggle('campo--erro', temErro);
    elemento.setAttribute('aria-invalid', temErro ? 'true' : 'false');
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
        'Olá, Isis. Vim pelo site da Sit Happens.',
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
        /* Sem numero configurado, o site nao inventa destino. */
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

  /* ------------------------------------------------------------------------
     PARTIDA
     ------------------------------------------------------------------------ */
  ligaRevelacao();

  if (document.readyState === 'complete') {
    ligaAbertura();
  } else {
    window.addEventListener('load', ligaAbertura);
  }
})();
