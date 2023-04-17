$(document).ready(function () {

    $("#formLogin").submit((e) => {
        e.preventDefault();
        let seria = $("#formLogin").serialize();

        $.ajax({
            url: '/api/user/login',
            method: 'POST',
            dataType: 'json',
            data: seria + "&set_session=S",
            success: (json) => {
                console.log(json);
                tratarRetornoLogin(json);
            },
            error: (err) => {
                if (!err.responseJSON) {
                    alertError('AVISO', 'Ocorreu um erro ao efetuar login, tente novamente em alguns segundos!');
                    return;
                }

                let json = err.responseJSON;
                console.log(json);
                tratarRetornoLogin(json);
            }
        });
    });


    function tratarRetornoLogin(json) {

        if (json.success) {
            Swal.fire({
                icon: 'success',
                title: 'Login bem-sucedido',
                text: `Olá, ${json.sessao.conta.user}, seja bem-vindo!`,
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                // Redireciona para a página inicial após o login bem-sucedido (altere para a URL real)
                window.location.href = '/';
            });
            return;
        }

        let error_msg = 'Ocorreu um erro ao efetuar login, tente novamente em alguns segundos!';

        if (json.msg) {
            error_msg = json.msg;
        }

        if (json.retorno) {
            error_msg = json.retorno;
        }

        alertError('AVISO', error_msg);

    }

    function alertError(title, text) {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
        });
    }

});