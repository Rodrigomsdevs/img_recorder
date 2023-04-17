const mysql = require('mysql2/promise');
const db_condif = require('./config/db.config');

query = (sql, sql_array) => {
    return new Promise(async (resolve, reject) => {

        try {
            const connection = await mysql.createConnection(db_condif.db_config);
            // Use a conexão para fazer consultas ao banco de dados

            const [rows, fields] = await connection.execute(sql, sql_array);
            resolve(rows);

            //await connection.end();
        } catch (error) {
            console.log('Erro ao conectar ao banco de dados:', error.message);
            console.log(error);
            resolve([]);
        }

    });
};
module.exports = {
    query
};