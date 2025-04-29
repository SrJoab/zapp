# Guia de Implantação na Netlify (Next.js + Supabase)

Este guia descreve os passos para implantar a aplicação ZappReport (integrada com Supabase) na plataforma Netlify.

## Pré-requisitos

1.  **Conta Netlify:** Você precisa de uma conta na Netlify (plano gratuito é suficiente para começar).
2.  **Código Fonte:** O código-fonte da aplicação ZappReport (o arquivo `.zip` que fornecerei ou um repositório Git contendo o código).
3.  **Projeto Supabase:** Seu projeto Supabase configurado com as tabelas necessárias (pelo menos `users`, `contacts`, `channels` com as colunas esperadas pelas APIs) e as credenciais (URL e Chave Anônima Pública).

## Passos para Implantação

Existem duas maneiras principais de implantar na Netlify:

**Método 1: Conectar um Repositório Git (Recomendado)**

1.  **Enviar Código para o Git:**
    *   Se ainda não o fez, crie um repositório Git (por exemplo, no GitHub, GitLab ou Bitbucket).
    *   Extraia o código-fonte do arquivo `.zip` fornecido.
    *   Inicialize um repositório Git no diretório do projeto (`git init`).
    *   Adicione um arquivo `.gitignore` (se não existir) para ignorar `node_modules`, `.next`, `.env.local`, etc.
    *   Adicione os arquivos (`git add .`), faça o commit (`git commit -m "Initial commit"`) e envie para o seu repositório remoto (`git push origin main`).

2.  **Criar um Novo Site na Netlify:**
    *   Faça login na sua conta Netlify.
    *   Clique em "Add new site" -> "Import an existing project".
    *   Conecte seu provedor Git (GitHub, GitLab, Bitbucket).
    *   Selecione o repositório que você acabou de criar/enviar.

3.  **Configurar Build:**
    *   A Netlify geralmente detecta automaticamente que é um projeto Next.js.
    *   Verifique as configurações de build:
        *   **Build command:** Deve ser `pnpm build` (ou `npm run build` / `yarn build` dependendo do seu gerenciador de pacotes).
        *   **Publish directory:** Deve ser `.next`.
    *   O arquivo `netlify.toml` incluído no projeto já define essas configurações, então a Netlify deve usá-las.

4.  **Configurar Variáveis de Ambiente:**
    *   Antes de clicar em "Deploy site", vá para "Advanced build settings" ou navegue até **Site settings > Build & deploy > Environment > Environment variables** após a criação inicial.
    *   Clique em "Edit variables".
    *   Adicione as seguintes variáveis de ambiente **obrigatórias**:
        *   `NEXT_PUBLIC_SUPABASE_URL`: Cole a URL do seu projeto Supabase (ex: `https://fywuurfiymuhcnryrnpf.supabase.co`).
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Cole a chave pública anônima (anon key) do seu projeto Supabase.
    *   **Importante:** Certifique-se de que os nomes das variáveis correspondem exatamente (incluindo `NEXT_PUBLIC_`).

5.  **Implantar:**
    *   Clique em "Deploy site" (ou acione uma nova implantação se já criou o site).
    *   A Netlify buscará o código, instalará as dependências, executará o build e implantará a aplicação.
    *   Você receberá uma URL pública para acessar sua aplicação (ex: `nome-do-site.netlify.app`).

**Método 2: Deploy Manual via Netlify CLI ou Arrastar e Soltar (Menos comum para Next.js)**

*   **Netlify CLI:** Instale a CLI (`npm install netlify-cli -g`), faça login (`netlify login`), execute o build localmente (`pnpm build`) e implante (`netlify deploy --prod --dir=.next`). Você precisará configurar as variáveis de ambiente na UI da Netlify.
*   **Arrastar e Soltar:** Execute o build localmente (`pnpm build`). Compacte o diretório `.next` e arraste-o para a seção "Deploys" do seu site na Netlify. Este método **não funciona bem** para aplicações Next.js que usam API Routes ou SSR, pois requer a Netlify Functions/Runtime.

**Recomendação:** Use o Método 1 (Conectar Git) para aproveitar a integração contínua (CI/CD) da Netlify, onde cada `push` para o seu repositório Git aciona automaticamente uma nova implantação.

## Pós-Implantação

1.  **Testar:** Acesse a URL fornecida pela Netlify e teste a funcionalidade de registro, login, logout e, se as tabelas Supabase estiverem configuradas, as operações de contatos/canais.
2.  **Domínio Personalizado (Opcional):** Configure um domínio personalizado nas configurações do site na Netlify.
3.  **Verificar Logs:** Se encontrar problemas, verifique os logs de build e de funções na interface da Netlify.

Lembre-se de que as credenciais do Supabase (especialmente a chave anônima) são configuradas como variáveis de ambiente na Netlify para segurança e para evitar expô-las diretamente no código-fonte.
