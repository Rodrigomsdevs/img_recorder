const filhos_model = require('../model/filhos.model');

async function getFilhos(req, res) {
    let session_id = req.session.conta.id;
    let { situacao } = req.query;


    if (!session_id || !situacao) {
        res.status(403).json({ success: false, msg: 'id de usuario não encontrado!' });
        return;
    }

    let filhos = await filhos_model.getFilhos(session_id);
    if (!(filhos.success)) {
        res.status(403).json({ success: false, msg: 'erro ao buscar filhos', error: filhos.error });
        return;
    }

    res.status(200).json({ success: true, msg: 'Busca finalizada', retorno: filhos.retorno });
}


async function newFilho(req, res) {

    let { nome, data_nascimento, altura, peso } = req.body;
    let usuario_id = req.session.conta.id;

    if (!nome || !data_nascimento || !altura || !peso || !usuario_id) {
        res.status(403).json({ success: false, msg: 'dados invalidos ou faltando!' });
        return;
    }

    let new_filho = await filhos_model.newFilho(usuario_id, nome, data_nascimento, altura, peso);

    if (!(new_filho.success)) {
        res.status(400).json({ success: false, msg: new_filho.msg });
        return;
    }

    res.status(200).json({ success: true, msg: 'Filho cadastrado com sucesso!', retorno: new_filho });
}

async function alterFilho(req, res) {

    let { nome, data_nascimento, altura, peso, id_filho } = req.body;
    let usuario_id = req.session.conta.id;


    if (Object.values({ nome, data_nascimento, altura, peso, id_filho }).some((campo) => campo === "")) {
        // Se algum dos campos estiver vazio, envia uma mensagem de erro:
        res.status(400).send("Preencha todos os campos!");
        return;
    }
    let new_filho = await filhos_model.alterFilho(usuario_id, nome, data_nascimento, altura, peso, id_filho);

    if (!(new_filho.success)) {
        res.status(400).json({ success: false, msg: new_filho.msg });
        return;
    }

    res.status(200).json({ success: true, msg: 'Filho alterado com sucesso!', retorno: new_filho });
}

async function deleteFilho(req, res) {

    const id_filho = req.params.filhoID;
    let usuario_id = req.session.conta.id;

    if (!id_filho) {
        res.status(400).send("Preencha todos os campos!");
        return;
    }

    let delete_filho = await filhos_model.ativa_desativa(usuario_id, id_filho, 'N');

    if (!(delete_filho.success)) {
        res.status(400).json({ success: false, msg: delete_filho.msg });
        return;
    }

    res.status(200).json({ success: true, msg: 'Filho deletado com sucesso!', retorno: delete_filho });
}

async function ativarFilho(req, res) {

    const id_filho = req.params.filhoID;
    let usuario_id = req.session.conta.id;

    if (!id_filho) {
        res.status(400).send("Preencha todos os campos!");
        return;
    }

    let delete_filho = await filhos_model.ativa_desativa(usuario_id, id_filho, 'S');

    if (!(delete_filho.success)) {
        res.status(400).json({ success: false, msg: delete_filho.msg });
        return;
    }

    res.status(200).json({ success: true, msg: 'Filho ativado com sucesso!', retorno: delete_filho });
}

async function getFilhosByUser(req, res) {

    let usuario_id = req.session.conta.id;
    let { situacao } = req.query;
    let get_filhos = await filhos_model.getFilhosByUser(usuario_id, situacao);

    if (!(get_filhos.success)) {
        res.status(400).json({ success: false, msg: delete_filho.msg });
        return;
    }
    let retorno = get_filhos.retorno;

    const contagem = retorno.reduce((acc, obj) => {
        if (obj.ATIVO === 'S') {
            acc.s++;
        } else if (obj.ATIVO === 'N') {
            acc.n++;
        }
        return acc;
    }, { s: 0, n: 0 });

    res.status(200).json({
        success: true,
        msg: 'Filhos listados com sucesso!',
        amouts: {
            ativos: contagem.s,
            deletados: contagem.n
        },
        retorno: retorno
    });
}


module.exports = {
    getFilhos,
    newFilho,
    alterFilho,
    deleteFilho,
    ativarFilho,
    getFilhosByUser
}