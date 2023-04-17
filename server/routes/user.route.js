const express = require('express');
const router = express.Router();
const user = require('../controller/user.controller');

router.post('/login', hasDeslogged, user.login);
router.post('/register', hasDeslogged, user.register);
router.get('/logout', hasLogged, user.logout);
router.post('/', hasLogged, user.getUser);




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
