const user_model = require('../model/user.model');


async function login(req, res) {

    let { email, senha, set_session } = req.body;
    set_session = set_session || 'N';

    if (!email || !senha) {
        res.status(401).json({ success: false, msg: 'Email e/ou senha não estão sendo recebidos' });
        return;
    }

    let checkLogin = await user_model.checkLogin(email, senha);

    if (!checkLogin.success) {
        res.status(checkLogin.status).json(checkLogin);
        return;
    }

    let retorno = checkLogin.retorno;

    if (retorno.length == 0) {
        res.status(401).json({ success: false, msg: 'Email e/ou senha incorretos!', set_session: set_session });
        return;
    }

    if (set_session && set_session == 'S') {
        req.session.conta = retorno[0];
        res.status(200).json({ success: true, msg: 'Email e senha autenticada com sucesso, sessão criada!', set_session: set_session, sessao: req.session });
        return;
    }

    res.status(200).json({ success: true, msg: 'Email e senha autenticada com sucesso!', set_session: set_session });

}

async function register(req, res) {
    let { set_session, user, email, senha, data_nascimento } = req.body;
    set_session = set_session || 'N';

    if (!user || !email || !senha || !data_nascimento) {
        res.status(401).json({ success: false, msg: 'Email e/ou senha não estão sendo recebidos' });
        return;
    }

    let check_user_email = await user_model.getUserByField([/*'user',*/ 'email'], [/*user,*/ email]);

    if (check_user_email.length > 0) {
        res.status(401).json({ success: false, msg: 'Usuario e/ou email já cadastrados!' });
        return;
    }

    let registerUser = await user_model.registerUser(user, email, senha, data_nascimento);

    if (!registerUser.success) {
        res.status(registerUser.status).json(registerUser);
        return;
    }

    let retorno = registerUser.retorno;

    if (!(retorno.insertId)) {
        res.status(400).json({ success: false, msg: 'Ocorreu um erro ao registrar!' });
        return;
    }

    let insertId = retorno.insertId;

    if (set_session && set_session == 'S') {
        let session = await user_model.getUserByField(['id'], [insertId]);

        if (session.length == 0) {
            res.status(200).json({
                success: true,
                redirect: '/login',
                msg: 'Usuario criado, porem deu erro ao iniciar sessão, você será redirecionado para tela de Login, efetue o login!'
            });
            return;
        }

        req.session.conta = session[0];
        
        res.status(200).json({ success: true, msg: 'Cadastrado com sucesso e sessão criada!', set_session: set_session });
        return;
    }

    res.status(200).json({ success: true, msg: 'Cadastrado com sucesso!', set_session: set_session });
}

async function logout(req, res) {
    req.session.destroy((err) => {

        if (err) {
            console.log(err);
            res.status(200).json({ success: false, msg: 'Erro ao efetuar logout!', err: err });
            return;
        }

        // Sessão destruída com sucesso, redirecionar para a página inicial
        res.status(200).json({ success: true, msg: 'Logout efetuado com sucesso!' });
    });
}

async function getUser(req, res) {
    let { field, field_value } = req.body;

    if (!field || !field_value) {
        res.status(401).json({ success: false, msg: 'field e/ou field_value não estão sendo recebidos' });
        return;
    }

    let check_user_email = await user_model.getUserByField([field], [field_value]);

    if (check_user_email.length == 0) {
        res.status(401).json({ success: false, msg: 'Usuario não encontrado' });
        return;
    }


    res.status(200).json({ success: true, msg: 'Usuario encontrado!', retorno: check_user_email[0] });
}


module.exports = {
    login,
    register,
    logout,
    getUser
};