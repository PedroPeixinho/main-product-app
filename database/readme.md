# Database de desenvolvimento
Banco de Dados de desenvolvimento do projeto Foninho

![Diagrama ER](src/diagrama.png)

### Sumário:

1. Diretório
2. Modo de uso
3. Testar o funcionamento
    - Manualmente
    - Utilizando JavaScript
    - Importante
4. Acessando o Banco de Dados pelo código do projeto

# Diretório
Esse diretorio contém a seguinte árvore de arquivos importantes:

```
connect.js
docker-compose.yml
init/
 | init.sql
```

```connect.js``` é o módulo JavaScript que será utilizado para realizar requisições ao banco de dados
```docker-compose.yml``` é o arquivo de configuração do ambiente docker, ele seleciona a imagem do postgres e configura as variáveis necessárias.
```init/``` é o diretorio que será clonado para o ambiente docker para executar os scripts dentro.
```init.sql``` é o arquivo que contém o script SQL que será executado durante a inicialização do container, esse é o arquivo que pode ser modificado para montar o banco de dados inicial

# Modo de uso
Para inicializar o banco de dados, certifique-se de possuir Docker instalado na sua máquina.
Pelo terminal acesse o diretório ```database``` do projeto.

Execute o seguinte comando:
```
docker-compose up -d
```

```docker-compose``` é o comando Docker que utiliza o arquivo ```docker-compose.yml```
```up``` é o comando de inicialização do container Docker
```-d``` é a flag que faz o ambiente ser executado em segundo plano para não tomar controle do seu terminal (caso prefira pode omitir essa flag, e encerrar o container utilizando ctrl+c)

Agora o container docker está em execução.
- O usuário de acesso é ```dev```
- A senha é ```dev```
- O banco de dados principal é ```devdb```
- O host é o ```localhost``` ou ```127.0.0.1```
- A porta é ```5432```

O banco de dados agora pode ser acessado.

# Testar o funcionamento 

### manualmente

Se quiser testar manualmente o funcionamento do banco de dados, abra um terminal e rode o seguinte comando:
```
docker exec -it dev_postgres psql -U dev -b devdb
```

Onde:
- ```docker``` é o comando docker
- ```exec``` serve para enviar uma linha de comando à linha de - terminal do container
- ```-it``` é para acessar o terminal do container pelo seu terminal
- ```dev_postgres``` é o nome do container que vai receber o comando
- ```psql -U dev -b devdb``` é o comando que será enviado ao container

E:
- ```psql``` é o comando para acessar a interface do postgres
- ```-U dev``` para informar o usuário
- ```-b devdb``` para especificar o banco de dados

Uma nova interface no terminal agora deve aparecer da seguinte maneira:
```devdb=#```

Agora pode ser digitado comandos SQL manualmente, tente, por exemplo:
```
SELECT * FROM users;
```

Uma saída deve aparecer da seguinte forma:
```
 id | name  | age
----+-------+-----
  1 | joao  |  34
  2 | maria |  28
(2 rows)
```

Se essa foi a saída, então o banco de dados está funcionando como esperado.
Para mais comandos tente digitar:
```\help```
```\h```
```\?```

E digite ```\quit``` para sair.

Ps.: Para entender melhor essa saída, dê uma olhada no arquivo ```init/init.sql```


### Utilizando JavaScript

Se quiser testar o funcionamento do banco de dados com JavaScript, abra um terminal e rode o seguinte comando:
```
node example.js
```

Esse código vai realizar a requisição ```SELECT * FROM users;``` ao banco de dados e printar o resultado.


### Importante

Para encerrar o container docker, rode o seguinte comando:
```docker-compose down``` *Todas as modificações realizadas serão PERDIDAS*

Para reiniciar:
```docker-compose restart``` As modificações feitas não são perdidas

O arquivo ```init/init.sql``` é o arquivo que será lido pelo Postgres quando o comando ```docker-compose up``` for executado. Dessa forma, você pode editar esse arquivo para comportar as tabelas e valores necessários para o desenvolvimento da sua feature, sem perder o progresso ou os dados quando reiniciar a sua máquina. Isso o torna uma excelente forma de criar casos testes, e um ponto de partida para o seu desenvolvimento caso precise reiniciar seu ambiente para um estado "estável" se realizar diversas modificações e decidir voltar atrás.



# Acessando o Banco de Dados pelo código do projeto

Para realizar as requisições ao banco de dados em código JS dê uma olhada nos arquivos ```connect.js``` e ```example.js``` desse diretório.
- ```connect.js``` é o módulo que realiza a conexão ao banco de dados.
- ```example.js``` é um arquivo que demonstra a utilização da função ```getClient``` do módulo ```connect.js```.

Em geral, funcina da seguinte forma:

para importar a função ```getClient```:
```
const { getClient } = require('./caminho/relativo/para/database/connect.js');
```
```getClient``` realiza a conexão ao banco de dados e retorna um objeto que permite realizar requisições.

Em uma função assíncrona, o uso de ```getClient``` é como demonstrado a seguir
```
const client = await getClient();
```
onde ```client``` é a variável que será utilizada para realizar requisições ao banco de dados
    
uma requisição pode ser realizada a partir de qualquer string contendo um script SQL
```
let query = `
    SELECT * FROM users;
`;

// ou

let query = `
    CREATE OR REPLACE TABLE pets (
        id SERIAL PRIMARY KEY,
        nome VARCHAR,
        especie VARCHAR,
        idade INT
    );
`

// ou

let query = `
    INSERT INTO pets (nome, especie, idade) VALUES
        ('toto', 'cachorro', 4)
        ('rex', 'gato', 7)
        ('blobie', 'tartaruga', 153)
`
```


É importante sempre realizar as requisições com error handling para tratar quaisquer possíveis erros em um cenário real, ou ao menos não quebrar todo o seu ambiente de desenvolvimento devido a uma requisição com erro de sintaxe ou falha na conexão com o docker (pouco provável, mas quem sabe?).
Abaixo segue um exemplo de como a realização da(s) requisições pode(m) ser estruturada(s)
```
// enviar comando (com error handling)
try {
    const res = await client.query(query);
    console.log(res);   // fazer qualquer procedimento com o resultado da requisição
} 

catch (err) {
    console.log(err);   // Realizar tratamento de erros aqui
}

finally {
    await client.end(); // quando a conexão não for mais necessária, encerrar (boa prática)
}
```

