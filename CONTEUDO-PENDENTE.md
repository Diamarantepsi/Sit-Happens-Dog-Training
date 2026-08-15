# Conteúdo pendente: site da Sit Happens Dog Training

Tudo que está listado aqui ficou de fora do site porque a Isis ainda não enviou.
Nada foi inventado para preencher lacuna.

Atualizado em 14 de agosto de 2026.

## 1. Trava seções inteiras do site

| Item | O que está desligado hoje | Como ligar |
|---|---|---|
| **Valores dos serviços** | A seção de preços existe no HTML mas nasce oculta. Ela marcou preços como obrigatório no briefing, então essa é a maior lacuna do site. | Preencher o array `PRECOS` e trocar `MOSTRAR_PRECOS` para `true` no topo de `js/site.js`. |
| **Depoimentos de clientes** | A seção de depoimentos existe mas fica oculta sozinha enquanto o array estiver vazio. Ela declarou ter prints de mensagens de clientes satisfeitos. | Transcrever os prints para o array `DEPOIMENTOS` em `js/site.js`, no formato `{ texto, autor }`. Confirmar autorização de cada pessoa antes de publicar. |
| **Links de redes sociais** | O rodapé tem só o formulário e o WhatsApp. Não há Instagram nem qualquer outra rede. | Enviar as URLs. Entram na lista de contato do rodapé. |

## 2. Enfraquece páginas que já estão no ar

| Item | Impacto atual | Observação |
|---|---|---|
| **Foto de rosto da Isis** | A seção "Sobre a Isis" é só texto. Um site de serviço em que a confiança é o produto funciona muito melhor com o rosto de quem atende. | Ela declarou ter a foto. |
| **Fotos dos atendimentos** | O site usa apenas os sete vídeos. Ela marcou "fotos dos atendimentos" como seção obrigatória no briefing, e hoje isso está coberto só por vídeo. | Ela declarou ter algumas fotos trabalhando e poucas de antes e depois. |
| **Endereço do espaço próprio** | O site diz que ela atende "em espaço próprio" sem dizer onde. Quem prefere levar o cão até ela não consegue avaliar a distância. | Também é necessário para completar o JSON-LD de negócio local, que hoje só declara São Paulo e SP. |
| **Logo em arquivo aberto ou vetor** | A logo do site veio do único JPEG existente, com o fundo branco removido por processamento. Serve para tela, não serve para bordado, adesivo recortado nem impressão grande. | A arte foi gerada com inteligência artificial e não existe arquivo editável. Ver a seção 4 abaixo. |

## 3. Trava a formalização da presença

| Item | Impacto atual |
|---|---|
| **Razão social e CNPJ** | O rodapé fica sem identificação legal. Há um comentário no HTML marcando o lugar. Ela respondeu que está abrindo a empresa. |
| **Domínio próprio** | O site está publicado em um endereço da hospedagem. Enquanto não houver domínio, cartão de visita e material impresso ficam parados. |
| **Nome completo da Isis** | O site inteiro a chama pelo primeiro nome, como ela pediu. Para o rodapé e para o JSON-LD, o nome completo ajudaria. |

## 4. Decisões de marca que continuam abertas

Nenhuma destas trava o site, mas todas apareceram no briefing e merecem resposta antes da papelaria.

- **A logo é 100% gerada por inteligência artificial e existe só como imagem.** Isso significa que hoje não dá para redimensionar sem perda, mudar cor, aplicar em uma cor só, bordar em camiseta ou recortar em adesivo. Todo material físico que ela listou (camiseta, boné, adesivo de carro, coleira, bandana, caneca, sacola) depende de um vetor que ainda não existe.
- **Ela não enviou nenhuma referência visual.** As perguntas sobre perfis do Instagram que ela acha bonitos e sobre um perfil que ela achou feio ficaram em branco, assim como a pergunta sobre concorrentes. O visual atual do site foi derivado apenas das notas de personalidade (profissional 4, tranquila 5, clássica 5, forte 5, sofisticada 4) e das cores medidas na logo.
- **Registro no INPI.** Ela respondeu que não sabe o que é. O nome "Sit Happens Dog Training" não está registrado, e o site já publica a marca.

## 5. O que já está resolvido e não precisa de ação

- Número de WhatsApp: 11 97667-2133, configurado na constante `WHATSAPP` no topo de `js/site.js`.
- Sete vídeos de atendimento, otimizados e com pôster.
- Autorização de imagem dos tutores: ela declarou no briefing que todos autorizaram.
- Mapa das regiões: ela respondeu que prefere decidir depois, então o site lista os quatorze bairros em texto e não tem mapa.
- Agendamento automático: ela recusou, e o formulário abre o WhatsApp em vez de marcar horário.
