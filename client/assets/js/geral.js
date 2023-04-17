class geral_class {
    constructor() {

    }

    logout = () => {
        let self = this;
        $.ajax({
            url: '/api/user/logout',
            method: 'GET',
            dataType: 'json',
            success: (json) => {

                if (!json.success) {
                    alertError('AVISO', json.msg);
                    return;
                }

                Swal.fire({
                    icon: 'success',
                    title: json.msg,
                    text: json.msg,
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    // Redireciona para a página inicial após o login bem-sucedido (altere para a URL real)
                    if (json.redirect) {
                        window.location.href = json.redirect;
                    } else {
                        window.location.href = '/login';
                    }
                });
            },
            error: (err) => {
                if (!err.responseJSON) {
                    document.getElementById('submit').disabled = false;
                    $("#submit").html(old_btn);
                    alertError('AVISO', 'Ocorreu um erro ao efetuar logout, tente novamente em alguns segundos!');
                    return;
                }

                let json = err.responseJSON;
                alertError('AVISO', 'Você não esta logado!');
            }
        });
    }

    alertError = (title, text) => {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
        });
    }
}

let geral = new geral_class();