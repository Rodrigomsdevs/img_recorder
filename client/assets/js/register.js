$(document).ready(function () {

    $("#registerForm").submit((e) => {
        e.preventDefault();

        if (document.getElementById('submit').disabled) {
            return;
        }

        let old_btn = $("#submit").html();
        document.getElementById('submit').disabled = true;
        $("#submit").html(`<i class="fa fa-spin fa-spinner"></i>`);

        let seria = $("#registerForm").serialize();

        let password = $('#senha').val();
        let password_confirm = $('#senha_confirm').val();

        if (password !== password_confirm) {
            alertError('Erro no cadastro', 'As senhas não coincidem. Por favor, tente novamente.');
            return;
        }

        $.ajax({
            url: '/api/user/register',
            method: 'POST',
            dataType: 'json',
            data: seria + "&set_session=S",
            success: (json) => {
                console.log(json);
                tratarRetornoLogin(json);
                document.getElementById('submit').disabled = false;
                $("#submit").html(old_btn);
            },
            error: (err) => {
                if (!err.responseJSON) {
                    document.getElementById('submit').disabled = false;
                    $("#submit").html(old_btn);
                    alertError('AVISO', 'Ocorreu um erro ao efetuar login, tente novamente em alguns segundos!');
                    return;
                }

                let json = err.responseJSON;
                console.log(json);
                tratarRetornoLogin(json);
                document.getElementById('submit').disabled = false;
                $("#submit").html(old_btn);
            }
        });
    });


    function tratarRetornoLogin(json) {

        if (json.success) {
            Swal.fire({
                icon: 'success',
                title: 'Cadastro bem-sucedido',
                text: json.msg,
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                // Redireciona para a página inicial após o login bem-sucedido (altere para a URL real)
                if (json.redirect) {
                    window.location.href = json.redirect;
                } else {
                    window.location.href = '/';
                }
            });
            return;
        }

        let error_msg = 'Ocorreu um erro ao cadastrar, tente novamente em alguns segundos!';

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