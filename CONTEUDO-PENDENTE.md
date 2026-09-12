# Conteúdo pendente: site da Sit Happens Dog Training

Tudo que está listado aqui ficou de fora do site porque a Isis ainda não enviou.
Nada foi inventado para preencher lacuna.

Atualizado em 11 de setembro de 2026.

## 1. Trava seções inteiras do site

| Item | O que está desligado hoje | Como ligar |
|---|---|---|
| **Valores dos serviços** | **A seção de preços não existe mais no HTML.** Ela foi removida no redesenho de 11/09/2026, junto com o array `PRECOS` e a chave `MOSTRAR_PRECOS`, porque estava oculta desde agosto e o pedido era enxugar o site. Ela marcou preços como obrigatório no briefing, então continua sendo a maior lacuna. | Quando a Isis mandar a tabela, os valores entram como uma `dl.ficha` dentro da seção **O trabalho**, no mesmo formato da ficha técnica da Isis. Não é preciso recriar a seção antiga. |
| **Depoimentos de clientes** | Resolvido em parte: a seção já está no ar com um depoimento, dos tutores do Perseu, autorizado por eles. Faltam os demais prints que ela declarou ter. | Transcrever cada print novo para o array `DEPOIMENTOS` em `js/site.js`, no formato `{ texto, autor }`. Confirmar autorização de cada pessoa antes de publicar. Quando passar de um depoimento, a classe `depoimentos--unico` deixa de ser aplicada e a grade volta a distribuir os cartões. |
| **Links de redes sociais** | O rodapé tem só o formulário e o WhatsApp. Não há Instagram nem qualquer outra rede. | Enviar as URLs. Entram na lista de contato do rodapé. |

## 2. Enfraquece páginas que já estão no ar

| Item | Impacto atual | Observação |
|---|---|---|
| **Foto de rosto da Isis** | A seção "Sobre a Isis" é só texto. Um site de serviço em que a confiança é o produto funciona muito melhor com o rosto de quem atende. | Ela declarou ter a foto. |
| **Fotos dos atendimentos** | O site usa apenas os sete vídeos. Ela marcou "fotos dos atendimentos" como seção obrigatória no briefing, e hoje isso está coberto só por vídeo. | Ela declarou ter algumas fotos trabalhando e poucas de antes e depois. |
| **Endereço do espaço próprio** | O site diz que ela atende "em espaço próprio" sem dizer onde. Quem prefere levar o cão até ela não consegue avaliar a distância. | Também é necessário para completar o JSON-LD de negócio local, que hoje só declara São Paulo e SP. |
| **Logo redesenhada de verdade** | Já existe um vetor em `assets/logo/logo-vetor.svg`, obtido por vetorização automática do JPEG. Ele resolve escala e impressão grande, mas não resolve bordado nem aplicação em uma cor só. Ver a seção 4 abaixo. | A arte original foi gerada com inteligência artificial e nunca teve arquivo editável. |

## 3. Trava a formalização da presença

| Item | Impacto atual |
|---|---|
| **Razão social e CNPJ** | O rodapé fica sem identificação legal. Há um comentário no HTML marcando o lugar. Ela respondeu que está abrindo a empresa. |
| **Domínio próprio** | O site está no ar em https://sit-happens-dog-training.vercel.app. Enquanto não houver domínio, cartão de visita e material impresso ficam parados. |
| **Nome completo da Isis** | O site inteiro a chama pelo primeiro nome, como ela pediu. Para o rodapé e para o JSON-LD, o nome completo ajudaria. |

## 4. Decisões de marca que continuam abertas

Nenhuma destas trava o site, mas todas apareceram no briefing e merecem resposta antes da papelaria.

- **A logo foi vetorizada, e isso resolve metade do problema.** O arquivo `assets/logo/logo-vetor.svg` foi gerado pelo vetorizador da Adobe a partir do PNG transparente, teve o retângulo branco de fundo removido e foi otimizado de 904 KB para 424 KB. Ele escala sem perda e serve para impressão grande, placa e adesivo colorido.
- **O que o vetor ainda não resolve.** O cão da arte é uma foto realista gerada por IA, e a vetorização transformou o pelo em cerca de 1.300 formas de cor chapada. O resultado é escalável, porém não é uma logo editável: ninguém consegue mexer nele no Illustrator de forma prática, e ele não funciona em uma cor só. Bordado em camiseta e boné, gravação em coleira e qualquer aplicação monocromática continuam pedindo um redesenho manual do escudo, da faixa e de uma silhueta simplificada do cão.
- **Ela não enviou nenhuma referência visual.** As perguntas sobre perfis do Instagram que ela acha bonitos e sobre um perfil que ela achou feio ficaram em branco, assim como a pergunta sobre concorrentes. O visual atual do site foi derivado apenas das notas de personalidade (profissional 4, tranquila 5, clássica 5, forte 5, sofisticada 4) e das cores medidas na logo.
- **Registro no INPI.** Ela respondeu que não sabe o que é. O nome "Sit Happens Dog Training" não está registrado, e o site já publica a marca.

## 4.1. Como o site vai para o ar

**O projeto na Vercel não está ligado ao GitHub.** Push na `main` não publica nada.
Descoberto em 11/09/2026, depois de três tentativas de publicar um depoimento que
nunca apareceram no site: o projeto tinha ficado 28 dias sem deploy.

Para publicar, da pasta do projeto:

```
vercel --prod
```

O `.vercelignore` mantém fora do ar o briefing, o CSV de respostas da Isis, as notas
internas e os vídeos brutos do WhatsApp. Até 11/09/2026 esses arquivos estavam
**públicos por engano**, baixáveis por qualquer um que soubesse o nome.

Ligar o projeto ao repositório no painel da Vercel resolveria de vez, e cada push
publicaria sozinho. Fica como pendência.

## 4.2. O redesenho de 11 de setembro de 2026

O site foi reescrito por inteiro (`index.html`, `css/style.css`, `js/site.js`) sobre a
linguagem visual da Lamborghini, a pedido do Adriano: palco preto, um único amarelo
`#ffc000`, tipografia industrial em caixa alta, zero arredondamento, zero sombra.

**Onze seções viraram seis.** O motivo do pedido era que o conteúdo estava picado em
lugares demais. O que foi fundido:

| Antes | Agora |
|---|---|
| Situações | **Situações**, com as 14 como índice tipográfico |
| Serviços + Como funciona | **O trabalho**: três frentes e a sequência de quatro passos |
| Sobre + Vídeos | **A Isis**: texto, citação, ficha técnica e a galeria |
| Depoimentos | **Depoimentos**, agora em caixa alta grande |
| Regiões + Dúvidas | **Onde e quando**, lado a lado |
| Contato | **Contato** |

Duas coisas do sistema original foram deliberadamente desobedecidas, com motivo:

1. **Texto corrido não é caixa alta.** A referência manda caixa alta em tudo a partir de
   16px. Parágrafo inteiro em caixa alta, em português, sobre medo e agressividade do
   cão, fica ilegível para quem chega cansado. Caixa alta vale para títulos, rótulos,
   botões, listas e legendas; parágrafo é caixa normal, em Barlow.
2. **O botão amarelo tem texto escuro, não branco.** A referência pede branco sobre
   `#ffc000`, que dá 1.54:1 de contraste e reprova em qualquer nível. Com `#202020` dá
   9.92:1.

A fonte LamboType não é pública. O substituto é **Barlow Condensed** para títulos e
interface, e **Barlow** para texto corrido, ambas do Google Fonts.

A página inteira foi medida em contraste: **nenhum elemento reprova em AA**.

## 4.3. Onde a logo pode e onde ela não pode aparecer

Descoberto em 12/09/2026, ao dar presença de marca ao escudo no site novo.

**O escudo não sobrevive em fundo escuro.** Ele foi testado em preto puro
(`#000`) e sumiu por inteiro, cão incluído: o azul marinho dele
(`#0d2142` a `#020811`) tem praticamente a mesma luminância do fundo, e o fio
dourado sozinho não segura a forma. Em `#202020` o resultado é só um pouco
melhor. Isso não é defeito do site, é a marca: ela foi desenhada para fundo
claro e não tem versão para fundo escuro.

Consequências práticas, já aplicadas:

- A faixa do brasão no site é **clara** (`#f5f5f5`), encaixada entre duas
  seções escuras, para o escudo aparecer como objeto sob luz.
- No rodapé, que é escuro, o escudo vai montado numa **chapa clara**, como
  distintivo aparafusado. Sem a chapa ele desaparece.
- No topo ele aparece a 42px, e a 42px **a faixa com o nome é ilegível**.
  Por isso o nome está escrito ao lado, em texto. O escudo ali serve para
  reconhecimento, não para leitura.
- Na faixa do brasão não existe botão amarelo. O dourado do escudo e o
  `#ffc000` do sistema brigariam pela mesma atenção na mesma tela.

Isso reforça a pendência do redesenho manual já descrita na seção 4: uma
versão em uma cor só resolveria fundo escuro, bordado, gravação e papelaria
de uma vez.

**Peso dos arquivos.** `logo.png` tem 770x852 e **780 KB**, tamanho certo para
a faixa do brasão em tela retina, mas pesado. Comprimir ou gerar um WebP
derrubaria isso para algo perto de 150 KB. Ainda não foi feito: não há
ferramenta de imagem instalada nesta máquina.

## 5. O que já está resolvido e não precisa de ação

- Número de WhatsApp: 11 97667-2133, configurado na constante `WHATSAPP` no topo de `js/site.js`.
- Como ela é chamada: **Isis**, só o primeiro nome, em todo o site, exatamente como ela respondeu no briefing. Chegou-se a testar a versão com sobrenome e ela foi descartada. Não trocar para "Isis Ribas" sem nova instrução.
- Sete vídeos de atendimento, otimizados e com pôster.
- Autorização de imagem dos tutores: ela declarou no briefing que todos autorizaram.
- Assinatura dos depoimentos: por pedido do cliente, assina-se pelo cão, no formato **Tutores do Perseu**, sem bairro. O formato antigo "Nome, bairro" foi descartado. A transcrição bruta de cada áudio fica em `originais/`, que está no .gitignore e não sobe para o GitHub.
- Mapa das regiões: ela respondeu que prefere decidir depois, então o site lista os quatorze bairros em texto e não tem mapa.
- Agendamento automático: ela recusou, e o formulário abre o WhatsApp em vez de marcar horário.
