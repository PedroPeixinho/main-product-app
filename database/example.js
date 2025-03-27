const { getClient } = require('./connect.js');
// ou 
// const { getClient } = require('../database/connect.js');

(async () => {
    // conectar ao DB
    const client = await getClient();
    
    // query
    let SelectQuery = `
        SELECT * FROM users;
    `;      // pode ser qualquer comando SQL
    

    // enviar comando (com error handling)
    try {
        const res = await client.query(SelectQuery);
        console.log(res);           // printa toda a resposta da requisição
        console.log(res['rows']);   // printa somente as linhas da tabela retornada pela requisição
    } 

    catch (err) {
        console.log(err);   // Realizar tratamento de erros aqui
        // erros aqui no ambiente de desenvolvimento provavelmente vão ocorrer por erro de sintaxe algo similar
        // mas em um ambiente real podem ocorrer erros de conectividade, etc.
    }

    finally {
        await client.end();
    }
    
})();

// tente realizar mudanças nesse código para ver o que funciona ou não funciona,
// tente se familiarizar com a interação com o nosso banco de dados.
