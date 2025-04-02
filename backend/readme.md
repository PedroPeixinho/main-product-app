# Como funciona o banco de dados

Para iniciar o projeto, primeiro instale as dependências com o comando:

```bash
npm install
```

Depois, basta rodar o comando:

```bash
npm run dev
```

A estrutura base do banco de dados está assim, mas se necessário, podem ser adicionados novos campos ou tabelas.

## Como atualizar uma tabela

Vá no arquivo `prisma/schema.prisma` e altere a definição da tabela conforme necessário.

Depois execute:

```bash
npx prisma migrate dev
```

(lembre-se de inserir uma descricao concisa das mudancas feitas, max 1 linha)

Dica: Instale a extensão do VS Code do Prisma e leia a documentação caso ela alerte erros.

## Como gerar dados para popular a tabela

Vá no arquivo `prisma/seed.js` e adicione os dados na função `main`, seguindo o modelo já existente no arquivo. Por exemplo:

```javascript
async function main() {
  await prisma.exercicio.createMany({
    data: [
      {
        id: 1,
        nome: "Lateralizar",
        duracao: 12.5,
        data: "2025-03-28",
        status: "Completo",
        nota: 4.5,
        cpfPaciente: "12345678900",
      },
      {
        id: 2,
        nome: "Afilar",
        duracao: 8.0,
        data: "2025-03-28",
        status: "Completo",
        nota: 3.8,
        cpfPaciente: "12345678900",
      },
    ],
  });
}
```

Depois disso, basta rodar o comando:

```bash
npx prisma db seed
```

para popular o banco de dados com os dados adicionados.

## Como visualizar as tabelas e os dados

Para visualizar as tabelas e os dados do banco de dados, basta rodar o comando:

```bash
npx prisma studio
```

Isso abrirá uma interface gráfica no navegador, permitindo explorar e editar os dados de forma intuitiva.
