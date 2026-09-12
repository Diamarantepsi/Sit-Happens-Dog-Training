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
     Cada item vira uma tela de WhatsApp dentro de um aparelho.
     Enquanto o array estiver vazio, a secao fica oculta sozinha.

     Campos:
       autor      nome que aparece no topo da conversa
       formato    'audio' mostra o player e o rotulo de transcricao.
                  'texto' mostra so os paragrafos, como mensagem escrita.
       duracao    duracao real do audio, tipo '2:30'. Vazio nao desenha nada.
       hora       horario real da mensagem, tipo '08:47'. Vazio nao desenha.
       legenda    linha abaixo do aparelho
       paragrafos o depoimento, um paragrafo por item

     duracao e hora ficam vazios de proposito enquanto os valores reais nao
     forem confirmados. O site nao inventa detalhe de uma mensagem real. */
  var DEPOIMENTOS = [
    {
      autor: 'Tutores do Perseu',
      formato: 'audio',
      duracao: '',
      hora: '',
      legenda: 'Depoimento recebido por áudio no WhatsApp.',
      /* Trecho literal do proprio depoimento, ampliado ao lado do aparelho. */
      destaque: 'Você ouve muito a gente, sempre ouviu a gente falando da nossa rotina.',
      paragrafos: [
        'A gente gosta muito de você, o jeito que você trata a gente, trata o Perseu. Sempre foi tudo com você que a gente preferia conversar.',
        'As aulinhas que a gente fez com você sempre foram super tranquilas, super didáticas. Você ouve muito a gente, sempre ouviu a gente falando da nossa rotina, do jeito que a gente trata o Perseu quando vai passear.',
        /* ATENCAO: esta linha NAO esta no audio. A Isis pediu em 12/09/2026 para
           tirar o fecho original, "vamos manter com voce 100%", e o cliente
           escolheu esta frase no lugar. Falta os tutores confirmarem que
           assinam. Ver CONTEUDO-PENDENTE.md, secao 1. */
        'Adoramos o seu trabalho.'
      ]
    }
  ];

  /* Alturas fixas das barrinhas do audio. Fixas, e nao sorteadas, para o
     desenho nao mudar a cada carregamento. */
  var ONDA = [40, 70, 100, 55, 85, 35, 65, 95, 50, 75, 30, 60, 90, 45, 70, 40, 80, 55, 35, 65];

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

  /* Icones da tela do WhatsApp. Sao enfeite, entao saem do fluxo de leitura. */
  var ICONE_PATA = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.5 12.5a2 2 0 100-4 2 2 0 000 4zm4-4a2 2 0 100-4 2 2 0 000 4zm5 0a2 2 0 100-4 2 2 0 000 4zm4 4a2 2 0 100-4 2 2 0 000 4zm-6.5 1.2c-2.6 0-4.7 2.2-4.7 4.1 0 1.2.9 2 2.1 2 .9 0 1.7-.4 2.6-.4.9 0 1.7.4 2.6.4 1.2 0 2.1-.8 2.1-2 0-1.9-2.1-4.1-4.7-4.1z"/></svg>';

  function montaAparelho(item) {
    var ehAudio = item.formato === 'audio';

    var figura = document.createElement('figure');
    figura.className = 'wa-print';

    var fone = document.createElement('div');
    fone.className = 'wa-fone';

    /* Barra de topo. Nada aqui e conteudo, so a moldura da cena. */
    var topo = document.createElement('div');
    topo.className = 'wa-topo';
    topo.innerHTML =
      '<svg class="wa-topo__voltar" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>' +
      '<span class="wa-avatar" aria-hidden="true">' + ICONE_PATA + '</span>' +
      '<div class="wa-topo__info"><span class="wa-nome"></span></div>' +
      '<div class="wa-topo__acoes" aria-hidden="true">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 1.9.6 2.8a2 2 0 01-.4 2.1L8 9.6a16 16 0 006 6l1-1a2 2 0 012.1-.4c.9.3 1.8.5 2.8.6a2 2 0 011.7 2.1z"/></svg>' +
      '</div>';
    /* O nome entra como texto, nunca como marcacao. */
    $('.wa-nome', topo).textContent = item.autor;
    fone.appendChild(topo);

    var corpo = document.createElement('div');
    corpo.className = 'wa-corpo';

    var balao = document.createElement('div');
    balao.className = 'wa-balao' + (item.hora ? ' wa-balao--com-hora' : '');

    if (ehAudio) {
      var barras = ONDA.map(function (altura) {
        return '<i style="height:' + altura + '%"></i>';
      }).join('');

      var audio = document.createElement('div');
      audio.className = 'wa-audio';
      audio.innerHTML =
        '<span class="wa-audio__foto" aria-hidden="true">' + ICONE_PATA + '</span>' +
        '<span class="wa-audio__play" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>' +
        '<span class="wa-audio__onda" aria-hidden="true">' + barras + '</span>';

      if (item.duracao) {
        var tempo = document.createElement('span');
        tempo.className = 'wa-audio__tempo';
        tempo.textContent = item.duracao;
        audio.appendChild(tempo);
      }
      balao.appendChild(audio);
    }

    var transcricao = document.createElement('div');
    transcricao.className = 'wa-transcricao';

    if (ehAudio) {
      var rotulo = document.createElement('span');
      rotulo.className = 'wa-transcricao__rotulo';
      rotulo.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 5h16v2H4zm0 4h16v2H4zm0 4h11v2H4zm0 4h11v2H4z"/></svg>';
      rotulo.appendChild(document.createTextNode('Trechos do áudio'));
      transcricao.appendChild(rotulo);
    }

    item.paragrafos.forEach(function (texto) {
      var p = document.createElement('p');
      p.textContent = texto;
      transcricao.appendChild(p);
    });
    balao.appendChild(transcricao);

    if (item.hora) {
      var hora = document.createElement('span');
      hora.className = 'wa-hora';
      hora.textContent = item.hora;
      balao.appendChild(hora);
    }

    corpo.appendChild(balao);
    fone.appendChild(corpo);
    figura.appendChild(fone);

    if (item.legenda) {
      var legenda = document.createElement('figcaption');
      legenda.className = 'wa-print__legenda';
      legenda.textContent = item.legenda;
      figura.appendChild(legenda);
    }

    return figura;
  }

  if (secaoDepoimentos && listaDepoimentos && DEPOIMENTOS.length) {
    DEPOIMENTOS.forEach(function (item) {
      var par = document.createElement('div');
      par.className = 'depoimento-par';

      if (item.destaque) {
        var destaque = document.createElement('blockquote');
        destaque.className = 'depoimento-destaque';

        var frase = document.createElement('p');
        frase.textContent = item.destaque;

        var quem = document.createElement('cite');
        quem.textContent = item.autor;

        destaque.appendChild(frase);
        destaque.appendChild(quem);
        par.appendChild(destaque);
      }

      par.appendChild(montaAparelho(item));
      listaDepoimentos.appendChild(par);
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
