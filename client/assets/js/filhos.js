
$(document).ready(function () {

    let tabela;


    consultar();


    $("#situacao").change(() => {
        consultar();
    });

    function consultar() {
        if (tabela) {
            tabela.destroy();
        }
        $("#tbody > tr").remove();

        $.ajax({
            url: '/api/filhos',
            method: 'GET',
            dataType: 'json',
            data: {
                situacao: $("#situacao").val()
            },
            success: (json) => {
                tratarRetornoJson(json);
            },
            error: (err) => {
                if (!err.responseJSON) {
                    document.getElementById('submit').disabled = false;
                    $("#submit").html(old_btn);
                    alertError('AVISO', 'Ocorreu um erro ao efetuar login, tente novamente em alguns segundos!');
                    return;
                }

                let json = err.responseJSON;
                tratarRetornoJson(json);
            }
        });
    }

    tratarRetornoJson = (json) => {

        if (!(json.success)) {
            alertError('AVISO', 'Ocorreu um erro ao buscar, tente novamente em segundos ou atualize a pagina!');
            return;
        }

        let retorno = json.retorno;

        console.log(retorno);

        tabela = $('#minha-tabela').DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Portuguese-Brasil.json'
            }
        });

        for (var i = 0; i < retorno.length; i++) {
            let item = retorno[i];

            let data_nascimento = item.data_nascimento;
            let idade = calcularIdade(data_nascimento);
            let ATIVO = item.ATIVO;
            let btn_ativa_inativa = `<button class="btn btn-sm btn-success  text-white" onclick="ativa_inativa('${btoa(JSON.stringify(item))}', this)"><i class="fa fa-check"></i> Ativo</button>`;

            if (ATIVO == 'N') {
                btn_ativa_inativa = `<button class="btn btn-sm btn-warning text-white" onclick="ativa_inativa('${btoa(JSON.stringify(item))}', this)"><i class="fa fa-trash"></i> Inativo</button>`;
            }

            tabela.row.add([
                item.nome.toUpperCase(),
                `<b>${idade} ${idade > 1 ? 'anos' : 'ano'}</b> (${formatarDataBrasileira(new Date(data_nascimento))})`,
                `<b>${item.peso}</b> kg`,
                `<b>${item.altura}</b> cm`,
                `<button class="btn btn-sm btn-primary" onclick="alterar('${btoa(JSON.stringify(item))}')"><i class="fa fa-pen"></i> Alterar</button>
                 ${btn_ativa_inativa}
                 <a href="/galeria/${item.id}" class="btn btn-sm btn-info">Ver Fotos</a>`,

            ]).draw();
        }

    }


    /* ALTERAR FILHO */

    ativa_inativa = (json, btn) => {
        json = JSON.parse(atob(json));
        console.log(json);

        let url = (json.ATIVO == 'S' ? '/api/filhos/deletar/' : '/api/filhos/ativar/') + json.id;
        let method = (json.ATIVO == 'S' ? 'DELETE' : 'PUT');

        $.ajax({
            url: url,
            method: method,
            success: (json) => {
                tratar_retorno_ativa_inativa(json);
            },
            error: (err) => {
                if (!err.responseJSON) {
                    document.getElementById('submit').disabled = false;
                    $("#submit").html(old_btn);
                    alertError('AVISO', 'Ocorreu um erro ao efetuar login, tente novamente em alguns segundos!');
                    return;
                }

                let json = err.responseJSON;
                tratar_retorno_ativa_inativa(json);
            }
        });
    }

    tratar_retorno_ativa_inativa = (json) => {
        console.log(json);

        if (json.success) {
            Swal.fire({
                icon: 'success',
                title: 'SUCESSO',
                text: json.msg,
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                $("#meuModal").modal('hide');
                consultar();
            });
        }
    }

    alterar = (json) => {
        json = JSON.parse(atob(json));

        console.log(json);

        let id = json.id;
        let id_usuario = json.id_usuario;

        $("#tipo_req").val('PUT');
        $("#id_filho").val(id);
        $("#url_post").val('/api/filhos/alter');
        $("#nome").val(json.nome);
        $("#data_nascimento").val(json.data_nascimento.substr(0, 10));
        $("#peso").val(json.peso);
        $("#altura").val(json.altura);

        $("#meuModal").modal('show');
    }

    $("#new_filho").click(() => {
        $("#tipo_req").val('POST');
        $("#url_post").val('/api/filhos/register');
        $("#meuModal").modal('show');
    });

    let salvar_alteracao = $("#salvar_alteracao");
    let old_btn;

    salvar_alteracao.click(() => {

        if (salvar_alteracao.is(":disabled")) {
            return;
        }

        let method = $("#tipo_req").val();
        let url_method = $("#url_post").val();
        old_btn = salvar_alteracao.html();
        salvar_alteracao.attr('disabled', true);
        salvar_alteracao.html(`<i class="fa fa-spin fa-spinner"></i>`);

        let nome = $("#nome").val();
        let data_nascimento = $("#data_nascimento").val();
        let altura = $("#altura").val();
        let peso = $("#peso").val();
        let id_filho = $("#id_filho").val();

        $.ajax({
            url: url_method,
            method: method,
            dataType: 'json',
            data: {
                nome: nome,
                data_nascimento: data_nascimento,
                altura: altura,
                peso: peso,
                id_filho: id_filho
            },
            success: (json) => {
                tratarRetornoJsonAlterar(json);
            },
            error: (err) => {
                if (!err.responseJSON) {
                    document.getElementById('submit').disabled = false;
                    $("#submit").html(old_btn);
                    alertError('AVISO', 'Ocorreu um erro ao efetuar login, tente novamente em alguns segundos!');
                    return;
                }

                let json = err.responseJSON;
                tratarRetornoJsonAlterar(json);
            }
        });

    });

    tratarRetornoJsonAlterar = (json) => {
        console.log(json);

        salvar_alteracao.removeAttr('disabled');
        salvar_alteracao.html(old_btn);


        if (json.success) {

            Swal.fire({
                icon: 'success',
                title: 'Alterado com Sucesso',
                text: json.msg,
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                $("#meuModal").modal('hide');
            });

            if (tabela) {
                tabela.destroy();
            }
            $("#tbody > tr").remove();
            consultar();

            return;
        }

        alertError('AVISO', (json.msg || 'Ocorreu um erro ao alterar, tente novamente em segundos!'));
    }

    formatarDataBrasileira = (data) => {
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();

        return `${dia}/${mes}/${ano}`;
    }


    calcularIdade = (dataNascimento) => {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();

        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        return idade;
    }


    function alertError(title, text) {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
        });
    }

});
