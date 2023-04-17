/*

*/

async function getFilhos(id_usuario) {
    try {
        let db = require('../db');
        let result = await db.query(`SELECT * FROM filhos WHERE id_usuario = ?`, [id_usuario]);
        return { success: true, retorno: result };
    } catch (error) {
        return { success: false, error: error };
    }
}

async function newFilho(id_usuario, nome, data_nascimento, altura, peso) {
    try {
        let db = require('../db');
        let result_select = await db.query(`SELECT * FROM filhos WHERE nome = ?`, [nome]);

        if (result_select.length > 0) {
            return { success: false, msg: 'Filho com nome `' + nome + '` já cadastrado!' }
        }

        let sql = `insert into filhos(id_usuario, nome, data_nascimento, altura, peso) values (?, ?, ?, ?, ?)`;
        let result_insert = await db.query(sql, [id_usuario, nome, data_nascimento, altura, peso])
        return { success: true, retorno: result_insert };
    } catch (error) {
        return { success: false, error: error };
    }
}

async function alterFilho(id_usuario, nome, data_nascimento, altura, peso, id_filho) {
    try {
        let db = require('../db');
        let result_select = await db.query(`SELECT * FROM filhos WHERE id = ? AND id_usuario = ?`, [id_filho, id_usuario]);

        if (result_select.length <= 0) {
            return { success: false, msg: 'Filho não encontrado' }
        }

        let sql = "update filhos set ";
        let sql_values = [];

        if (nome) {
            sql += `nome = ?`;
            sql_values.push(nome);
        }

        if (data_nascimento) {
            sql += (sql_values.length > 0 ? ', ' : '') + `data_nascimento = ?`;
            sql_values.push(data_nascimento);
        }

        if (altura) {
            sql += (sql_values.length > 0 ? ', ' : '') + `altura = ?`;
            sql_values.push(altura);
        }

        if (peso) {
            sql += (sql_values.length > 0 ? ', ' : '') + `peso = ?`;
            sql_values.push(peso);
        }

        sql += ` where id = ? and id_usuario = ?`
        sql_values.push(id_filho);
        sql_values.push(id_usuario);
        let result_insert = await db.query(sql, sql_values);

        if (!(result_insert) || !(result_insert.affectedRows) || (result_insert.affectedRows < 1)) {
            return { success: false, msg: 'Ocorreu um erro ao alterar!' };
        }
        return { success: true, retorno: result_insert };
    } catch (error) {
        return { success: false, error: error };
    }
}

async function getFilhosByField(field, field_value, type = 'OR') {
    try {
        let db = require('../db');
        let result = await db.query(`SELECT * FROM filhos WHERE ${field.join(` = ? ${(field.length > 1 ? type : '')} `)} = ?`, field_value);
        return result;
    } catch (error) {
        console.log(error);
        return [];
    }
}


async function ativa_desativa(id_usuario, id_filho, ativo = 'N') {
    try {

        let db = require('../db');
        let result_select = await db.query(`SELECT * FROM filhos WHERE id = ? AND id_usuario = ?`, [id_filho, id_usuario]);

        if (result_select.length <= 0) {
            return { success: false, msg: 'Filho não encontrado' }
        }

        if (result_select[0].ATIVO == ativa_desativa) {
            return { success: false, msg: (ativo == 'N' ? 'Filho já deletado' : 'Filho já ativado') }
        }

        let resultado_update = await db.query(`update filhos set ATIVO = '${ativo}' WHERE id = ? AND id_usuario = ?`, [id_filho, id_usuario])
        return { success: true, retorno: resultado_update };

    } catch (error) {
        console.log(error);
        return [];
    }
}

async function getFilhosByUser(id_usuario, situacao = '') {
    try {

        let db = require('../db');

        let sql = `SELECT * FROM filhos WHERE id_usuario = ?`;
        let sql_values = [id_usuario];

        if(situacao != ''){
            sql += ` AND ATIVO = ?`;
            sql_values.push(situacao);
        }

        console.log(sql, sql_values);

        let result_select = await db.query(sql, sql_values);
        return { success: true, retorno: result_select };

    } catch (error) {
        console.log(error);
        return [];
    } 
}

async function uploadImage(id_filho, id_usuario, image_base64){
    try {

        let db = require('../db');

        console.log({foto_base64: image_base64.length});

        let sql = `INSERT into fotos (foto_base64, id_usuario, id_filho) values (?, ?, ?)`;
        let sql_values = [image_base64, id_usuario, id_filho];

        let result_select = await db.query(sql, sql_values);
        return { success: true, retorno: result_select };

    } catch (error) {
        console.log(error);
        return [];
    } 
}


async function getFotos(id_filho) {
    try {
        let db = require('../db');
        let result = await db.query(`SELECT * FROM filhos f inner join fotos ff on (ff.id_filho = f.id) WHERE f.id = ?`, [id_filho]);
        return { success: true, retorno: result };
    } catch (error) {
        return { success: false, error: error };
    }
}

async function getFotosByAccountId(account_id, id_only = false) {
    try {
        let db = require('../db');
        let result = await db.query(`SELECT ${id_only ? 'ff.id' : '*'} FROM filhos f inner join fotos ff on (ff.id_filho = f.id) WHERE f.id_usuario = ?`, [account_id]);
        return { success: true, retorno: result };
    } catch (error) {
        return { success: false, error: error };
    }
}

async function getFotosByField(field, field_value, type = 'OR') {
    try {
        let db = require('../db');
        let result = await db.query(`SELECT * FROM fotos WHERE ${field.join(` = ? ${(field.length > 1 ? type : '')} `)} = ?`, field_value);
        return result;
    } catch (error) {
        console.log(error);
        return [];
    }
}

module.exports = {
    getFilhos,
    newFilho,
    getFilhosByField,
    alterFilho,
    ativa_desativa,
    getFilhosByUser,
    uploadImage,
    getFotos,
    getFotosByAccountId,
    getFotosByField
}