# Product API TS - Fastify, TypeScript, MongoDB

Esta é uma estrutura básica para uma API CRUD de produtos construída com Fastify, TypeScript e MongoDB.

## Pré-requisitos

*   Node.js (versão 18 ou superior recomendada)
*   npm ou yarn
*   MongoDB (rodando localmente ou uma instância acessível)

## Estrutura do Projeto

```
product-api-ts/
├── dist/                # Diretório de saída da compilação TypeScript (gerado após `npm run build`)
├── node_modules/        # Dependências do projeto
├── src/
│   ├── controller/
│   │   └── productController.ts # Lógica de negócio e interação com o banco
│   └── routes/
│       └── productRoutes.ts     # Definição das rotas da API
├── package.json         # Metadados do projeto e dependências
├── server.ts            # Ponto de entrada da aplicação e configuração do Fastify
├── tsconfig.json        # Configurações do compilador TypeScript
└── README.md            # Este arquivo
```

## Instalação

1.  Clone ou faça o download deste projeto.
2.  Navegue até o diretório raiz `product-api-ts`:
    ```bash
    cd product-api-ts
    ```
3.  Instale as dependências:
    ```bash
    npm install
    # ou
    # yarn install
    ```

## Configuração

*   **Banco de Dados MongoDB**: Certifique-se de que você tem uma instância do MongoDB rodando.
*   **String de Conexão**: O arquivo `server.ts` utiliza a string de conexão `mongodb://localhost:27017/productdb` por padrão. Você pode:
    *   Alterar diretamente no arquivo `server.ts`.
    *   Definir uma variável de ambiente `MONGO_URI` com sua string de conexão.

## Execução

### Modo de Desenvolvimento

Para rodar a API em modo de desenvolvimento com hot-reload (usando `tsx`):

```bash
npm run dev
# ou
# yarn dev
```

O servidor iniciará (por padrão na porta 3000) e reiniciará automaticamente a cada alteração nos arquivos `.ts`.

### Modo de Produção

1.  Compile o código TypeScript para JavaScript:
    ```bash
    npm run build
    # ou
    # yarn build
    ```
    Isso gerará o diretório `dist` com os arquivos JavaScript compilados.

2.  Inicie o servidor a partir dos arquivos compilados:
    ```bash
    npm start
    # ou
    # yarn start
    ```

## Endpoints da API (Base: `/api/products`)

*   `POST /` : Cria um novo produto. (Corpo: `{ "name": "Nome", "price": 10.99, "description": "Descrição opcional" }`)
*   `GET /` : Retorna todos os produtos.
*   `GET /:id` : Retorna um produto específico pelo seu ID.
*   `PUT /:id` : Atualiza um produto existente pelo seu ID. (Corpo: campos a serem atualizados)
*   `DELETE /:id` : Deleta um produto pelo seu ID.

## Próximos Passos

*   Implementar validação de entrada (ex: usando schemas do Fastify).
*   Adicionar tratamento de erros mais robusto.
*   Implementar autenticação e autorização.
*   Escrever testes unitários e de integração.
*   Considerar variáveis de ambiente para configurações sensíveis (como a string de conexão do DB).

