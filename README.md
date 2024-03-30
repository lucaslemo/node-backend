# Projeto Back-end com Node.js, Express, Prisma, TypeScript e Docker

Este é um projeto back-end básico criado com Node.js, Express, Prisma, TypeScript e Docker. Ele fornece uma estrutura simples para começar a construir sua aplicação back-end.

## Configuração do Ambiente

Certifique-se de ter o Docker instalado em sua máquina.

1. Clone este repositório:

   ```bash
   git clone git@github.com:lucaslemo/node-backend.git
   ```

2. Mude para o diretório do projeto:

   ```bash
   cd node-backend
   ```

3. Configure as variáveis de ambiente. Renomeie o arquivo `.env.example` para `.env` e ajuste conforme necessário.

4. Monte as imagens do Dockerfile:

   ```bash
   docker compose build
   ```

5. Execute o projeto em modo de desenvolvimento:

   ```bash
   docker compose up
   ```

   Isso iniciará os containers do banco de dados MySQL e do Node.js e rodará o script `npm run dev`.

6. Para executar os scripts npm use o bash do container:

   ```bash
   docker exec -it $(docker ps -aqf "name=^node-backend-node$") /bin/bash
   ```

## Scripts Disponíveis

Descrição dos scripts:

### `npm run dev`

Executa o projeto em modo de desenvolvimento usando o Nodemon. (Roda automaticamente ao iniciar os containers)

### `npm run build`

Compila o projeto para a pasta `dist`, pronta para produção.

### `npm start`

Inicia o projeto em modo de produção a partir da pasta `dist`.

### `npm run prisma:generate`

Regenera os arquivos do Prisma com base no seu schema.

### `npm run migrate`

Executa todas as migrações pendentes para atualizar o banco de dados.

## Estrutura do Projeto

- `src/`: Contém o código-fonte da aplicação.
  - `controllers/`: Controladores da aplicação.
  - `middlewares/`: Middlewares da aplicação.
  - `models/`: Modelos de dados da aplicação.
  - `routes/`: Rotas da aplicação.
  - `services/`: Serviços da aplicação.
  - `index.ts`: Arquivo principal da aplicação.
- `prisma/`: Contém os arquivos relacionados ao Prisma, como o schema e os arquivos de migração.
- `dist/`: Pasta gerada após a compilação do TypeScript.

## Contribuindo

Sinta-se à vontade para enviar sugestões, melhorias ou correções de bugs através de pull requests.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
