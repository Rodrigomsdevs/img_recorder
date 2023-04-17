const express = require('express');
const router = express.Router();
const filhos = require('../controller/filhos.controller.js');

router.post('/', hasLogged, filhos.getFilhos);
router.post('/register', hasLogged, filhos.newFilho);
router.put('/alter', hasLogged, filhos.alterFilho);
router.delete('/deletar/:filhoID', hasLogged, filhos.deleteFilho);
router.put('/ativar/:filhoID', hasLogged, filhos.ativarFilho);
router.get('/', hasLogged, filhos.getFilhosByUser);

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
