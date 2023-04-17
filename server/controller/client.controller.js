const client_model = require('../model/client.model')


function telaLogin(req, res) {
    res.render(process.cwd() + "/client/pages/login.ejs");
}

function telaRegister(req, res) {
    res.render(process.cwd() + "/client/pages/register.ejs");
}

function telaIndex(req, res) {
    res.render(process.cwd() + "/client/pages/index.ejs");
}

async function telaGaleria(req, res) {

    let filhos_model = require('../model/filhos.model');
    let { filhoID } = req.params;
    let { id } = req.session.conta;

    console.log(['id', 'id_usuario'], [filhoID, id]);
    let filho_escolhido = await filhos_model.getFilhosByField(['id', 'id_usuario'], [filhoID, id], 'AND');

    if (filho_escolhido.length == 0) {
        res.status(400).json({ success: false, msg: 'Ocorreu algum erro :X' });
        return;
    }

    res.render(process.cwd() + "/client/pages/galeria.ejs", {
        dados: filho_escolhido[0]
    });
}

async function telaGaleriaGeral(req, res) {


    res.render(process.cwd() + "/client/pages/galeria.ejs", {
        dados: []
    });
}

function telaFilhosListagem(req, res) {
    res.render(process.cwd() + "/client/pages/filhos_listagem.ejs");
}


async function uploadImage(req, res) {

    let filhos_model = require('../model/filhos.model');
    let { name, data, size, mimetype } = req.files.file;
    let image_base64 = `data:${mimetype};base64,` + data.toString('base64');
    let { id_filho } = req.body;
    let id_usuario = req.session.conta.id;

    if(!id_filho){
        res.status(400).json({success: false, msg: 'imagem invalida ou vazia'});
        return;
    }

    let upload_foto = await filhos_model.uploadImage(id_filho, id_usuario, image_base64);

    if(!(upload_foto.success)){
        res.status(400).json({success: false, msg: 'Ocorreu um erro ao salvar a imagem no banco de dados!'});
        return;
    }

    res.status(200).json({success: true, msg: 'Imagem salva', retorno: upload_foto});
}

async function getFotosByFilhoId(req, res) {

    let filhos_model = require('../model/filhos.model');
    let { filhoID } = req.params;
    let id_usuario = req.session.conta.id;

    if(!filhoID){
        res.status(400).json({success: false, msg: 'id nao especificado!'});
        return;
    }

    let upload_foto = await filhos_model.getFotos(filhoID);

    if(!(upload_foto.success)){
        res.status(400).json({success: false, msg: 'Ocorreu um erro ao salvar a imagem no banco de dados!'});
        return;
    }

    res.status(200).json({success: true, msg: 'Fotos consultadas', retorno: upload_foto.retorno});
}

async function getFotosByAccountId(req, res) {

    let filhos_model = require('../model/filhos.model');
    let id_usuario = req.session.conta.id;

    let upload_foto = await filhos_model.getFotosByAccountId(id_usuario, true);

    if(!(upload_foto.success)){
        res.status(400).json({success: false, msg: 'Ocorreu um erro ao salvar a imagem no banco de dados!'});
        return;
    }

    res.status(200).json({success: true, msg: 'Fotos consultadas', retorno: upload_foto.retorno});
}

async function gerarFoto(req, res){
    let filhos_model = require('../model/filhos.model');
    let fotoID = req.params.fotoID;
    let id_user = req.session.conta.id;

    let fotos = await filhos_model.getFotosByField(['id', 'id_usuario'], [fotoID, id_user], 'AND');

    if(fotos.length == 0){
        res.status(400).json({success: false, msg: 'foto não encontrada!'});
    }

    fotos = fotos[0];

    try {
        const base64Image = fotos.foto_base64;
        const imageBuffer = Buffer.from(base64Image.split('base64,')[1], 'base64');
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': imageBuffer.length
        });
        res.end(imageBuffer);
      } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Internal Server Error');
      }
}


module.exports = {
    telaLogin,
    telaRegister,
    telaIndex,
    telaGaleria,
    uploadImage,
    telaFilhosListagem,
    getFotosByFilhoId,
    telaGaleriaGeral,
    getFotosByAccountId,
    gerarFoto
}