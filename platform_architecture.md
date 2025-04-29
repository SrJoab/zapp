# Projeto de Arquitetura da Nova Plataforma

Com base nos requisitos definidos, este documento descreve a arquitetura proposta para a nova plataforma de automação de marketing e vendas omnichannel.

## 1. Visão Geral da Arquitetura

A plataforma será construída utilizando uma arquitetura baseada em microsserviços para garantir escalabilidade, resiliência e manutenibilidade. Os principais componentes serão:

*   **Frontend (Web Application):** Interface do usuário baseada na web, onde os usuários gerenciarão contatos, configurarão chatbots, criarão automações, visualizarão conversas e analisarão métricas.
*   **API Gateway:** Ponto de entrada único para todas as requisições do frontend, responsável por autenticação, autorização, roteamento e agregação de respostas de diferentes microsserviços.
*   **Serviço de Autenticação:** Gerencia o registro, login e gerenciamento de sessões de usuários.
*   **Serviço de Contatos (CRM):** Responsável pelo armazenamento e gerenciamento de informações de contatos, incluindo campos personalizados e tags.
*   **Serviço de Canais:** Gerencia a conexão e comunicação com as APIs dos diferentes canais (WhatsApp, E-mail, SMS, etc.). Recebe mensagens recebidas e envia mensagens de saída.
*   **Serviço de Conversas:** Armazena e gerencia o histórico de conversas e mensagens trocadas com os contatos através dos diferentes canais.
*   **Serviço de Chatbot:** Executa os fluxos de chatbot definidos pelos usuários, incluindo a integração com modelos de IA.
*   **Serviço de Automação:** Executa os fluxos de trabalho de automação definidos pelos usuários, interagindo com outros serviços conforme necessário.
*   **Serviço de Análises:** Coleta dados de outros serviços e processa métricas para exibição no dashboard.
*   **Serviço de Integrações:** Gerencia as conexões e o fluxo de dados com plataformas externas (CRMs, E-commerce, etc.) via APIs e webhooks.
*   **Message Queue:** Fila de mensagens (ex: RabbitMQ, Kafka) para comunicação assíncrona entre os microsserviços, garantindo desacoplamento e resiliência (ex: processamento de mensagens recebidas, execução de automações em segundo plano).
*   **Banco de Dados:** Um ou mais bancos de dados (ex: PostgreSQL para dados relacionais, MongoDB para documentos/conversas, Redis para cache/sessões) para persistir os dados da aplicação.
*   **Serviço de IA:** Interface para interagir com modelos de linguagem grandes (LLMs) externos ou internos para funcionalidades de IA no chatbot e outras áreas.

## 2. Escolha da Tecnologia (Proposta Inicial)

*   **Frontend:** **Next.js (React)** - Framework moderno, bom para SEO, renderização no servidor (SSR) e geração de sites estáticos (SSG), com um ecossistema rico. Utilizaremos o template `create_nextjs_app` conforme a orientação do Knowledge Module.
*   **Backend (Microsserviços):** **Node.js (TypeScript)** - Eficiente para operações I/O-bound, vasto ecossistema NPM, e consistência de linguagem com o frontend (JavaScript/TypeScript).
*   **API Gateway:** **Kong** ou **Express Gateway** (ou um serviço gerenciado na nuvem como AWS API Gateway).
*   **Banco de Dados:**
    *   **PostgreSQL:** Para dados relacionais estruturados (usuários, configurações, contatos básicos, metadados de automação).
    *   **MongoDB:** Para dados menos estruturados e de alto volume (mensagens, logs de conversa).
    *   **Redis:** Para caching e gerenciamento de sessões.
*   **Message Queue:** **RabbitMQ** - Robusto, maduro e com boa documentação e suporte da comunidade.
*   **Containerização:** **Docker** - Para empacotar e isolar os microsserviços.
*   **Orquestração:** **Kubernetes** - Para gerenciar, escalar e automatizar o deploy dos containers.
*   **Infraestrutura Cloud:** A ser definida (ex: AWS, Google Cloud, Azure), utilizando serviços gerenciados sempre que possível (ex: RDS para PostgreSQL, Managed Kafka/RabbitMQ, Kubernetes Engine).

## 3. Fluxo de Mensagem (Exemplo Simplificado - Mensagem Recebida no WhatsApp)

1.  API do WhatsApp envia webhook para o **Serviço de Canais**.
2.  **Serviço de Canais** valida a mensagem e a publica na **Message Queue** (tópico: `whatsapp_incoming_messages`).
3.  **Serviço de Conversas** consome a mensagem da fila, salva no banco de dados (MongoDB) e atualiza o perfil do contato (via API do **Serviço de Contatos**).
4.  **Serviço de Conversas** publica um evento na **Message Queue** (tópico: `new_message_received`).
5.  **Serviço de Chatbot** consome o evento. Verifica se há um chatbot ativo para o contato/canal. Se sim, processa a mensagem, interage com o **Serviço de IA** se necessário, determina a próxima resposta/ação e publica a resposta na **Message Queue** (tópico: `outgoing_messages`).
6.  **Serviço de Automação** consome o evento `new_message_received`. Verifica se algum gatilho de automação foi acionado. Se sim, executa as ações configuradas (ex: adicionar tag, enviar e-mail via **Serviço de Canais**).
7.  **Serviço de Canais** consome mensagens do tópico `outgoing_messages` e as envia para a API correspondente (neste caso, WhatsApp).
8.  **Frontend** (conectado via WebSockets ao **API Gateway** ou a um serviço específico) recebe atualizações em tempo real sobre novas mensagens para exibição na caixa de entrada unificada.

## 4. Próximos Passos no Projeto da Arquitetura

*   Detalhar o design do schema do banco de dados.
*   Definir as APIs internas entre os microsserviços.
*   Especificar os contratos de mensagem para a Message Queue.
*   Elaborar diagramas de arquitetura mais detalhados.

