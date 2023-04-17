const express = require('express');
const router = express.Router();
const client = require('../controller/client.controller.js');

router.get('/login', hasDeslogged, client.telaLogin);
router.get('/register', hasDeslogged, client.telaRegister);
router.get('/', hasLogged, client.telaIndex);
router.get('/galeria/:filhoID', hasLogged, client.telaGaleria);
router.get('/galeria', hasLogged, client.telaGaleriaGeral);
router.get('/api/galeria/getFotos/:filhoID', hasLogged, client.getFotosByFilhoId);
router.get('/api/galeria/getFotos/', hasLogged, client.getFotosByAccountId);
router.get('/api/galeria/foto/:fotoID', hasLogged, client.gerarFoto);

//filhos
router.get('/filhos', hasLogged, client.telaFilhosListagem);

router.post('/api/uploadImage', hasLogged, client.uploadImage);
///////////////////

function hasLogged(req, res, next) {
    if (req.session.conta && req.session.conta.email) {
        next();
    } else {
        res.status(403).send({success: false, msg: 'Você não esta logado'});
    }
}

function hasDeslogged(req, res, next) {
    if (!(req.session.conta && req.session.conta.email)) {
        next();
    } else {
        res.status(403).send({success: false, msg: 'Você já esta logado'});
    }
}

module.exports = router;
