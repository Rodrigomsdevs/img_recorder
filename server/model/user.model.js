

async function checkLogin(email, senha) {
    try {
        let db = require('../db');
        let cript = require('../config/cript');

        let result = await db.query(`SELECT * FROM usuarios WHERE email = ?`, [email]);
        if (!result) {
            return { success: false, retorno: 'Erro ao buscar usuario', status: 200 };
        }

        if(result.length == 0){
            return { success: false, retorno: `Email '${email}' não esta cadastrado!`, status: 403 };
        }

        let senha_sql = result[0].senha;
        let valid = await cript.verificarSenha(senha, senha_sql);
        if (!valid) {
            return { success: false, retorno: 'Senha incorreta!', status: 200 };
        }


        return { success: true, retorno: result, status: 200 };
    } catch (error) {
        console.log(error);
        return { success: false, retorno: error, status: 400 };
    }
}

async function getUserByField(field, field_value, type = 'OR') {
    try {
        let db = require('../db');
        console.log(`SELECT * FROM usuarios WHERE ${field.join(` = ? ${(field.length > 1 ? type : '')} `)} = ?`, field_value);
        let result = await db.query(`SELECT * FROM usuarios WHERE ${field.join(` = ? ${(field.length > 1 ? type : '')} `)} = ?`, field_value);
        return result;
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function registerUser(usuario, email, senha, data_nascimento) {
    try {
        let db = require('../db');
        let cript = require('../config/cript');
        senha = await cript.criptografarSenha(senha);
        let result = await db.query(`INSERT INTO usuarios (user, email, senha, data_nascimento) values (?, ?, ?, ?)`, [
            usuario, email, senha, data_nascimento
        ]);
        return { success: true, retorno: result, status: 200 };
    } catch (error) {
        return { success: false, retorno: error, status: 400 };
    }
}




module.exports = {
    checkLogin,
    registerUser,
    getUserByField
}