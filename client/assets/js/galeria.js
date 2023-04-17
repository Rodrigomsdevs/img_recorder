let id_filho = $("#id_filho").val();

/* drop and drag fotos */
const cameraInput = document.getElementById("cameraInput");

Dropzone.autoDiscover = false;
// Inicialize a instância Dropzone
const myDropzone = new Dropzone("#myDropzone", {
    paramName: "file",
    maxFilesize: 50,
    parallelUploads: 1,
    acceptedFiles: "image/*",
    dictDefaultMessage: "Arraste e solte as imagens aqui ou clique para selecioná-los",
    sending: function (file, xhr, formData) {
        console.log({ file: file });
        formData.append('file', file);
        formData.append('id_filho', $("#id_filho").val());
        xhr.send(formData);
    },
});


cameraInput.addEventListener("change", function (event) {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
        myDropzone.addFile(files[i]);
    }
});
// Adicione event listeners, se necessário
myDropzone.on("success", function (file, response) {
    console.log("Arquivo enviado com sucesso:", file);
    initFotos();
});

myDropzone.on("complete", function (file) {
    myDropzone.removeFile(file);
});

myDropzone.on("error", function (file, errorMessage) {
    console.log("Erro ao enviar o arquivo:", errorMessage);
});

//final drag and drop

/* consultar fotos filho aberto */
initFotos();
function initFotos() {
    $.ajax({
        url: '/api/galeria/getFotos/' + id_filho,
        method: 'GET',
        dataType: 'json',
        success: (json) => {
            tratar_retorno_json_get_fotos(json);
        },
        error: (err) => {
            if (!err.responseJSON) {
                document.getElementById('submit').disabled = false;
                $("#submit").html(old_btn);
                alertError('AVISO', 'Ocorreu um erro ao efetuar login, tente novamente em alguns segundos!');
                return;
            }

            let json = err.responseJSON;
            tratar_retorno_json_get_fotos(json);
        }
    });
}

tratar_retorno_json_get_fotos = async (json) => {

    if (json.success) {
        let retorno = json.retorno;

        let grid = $('#grid');
        $('#grid > .grid-item').remove();

        for(var i = 0; i < retorno.length; i++){
            let item = retorno[i];
            await grid.html(grid.html() + `<div class="grid-item"><img src="/api/galeria/foto/${item.id}"></div>`);
            order();
        }

    }

    setTimeout(() => {
        order();
        setTimeout(() => {
            order();
            setTimeout(() => {
                order();
            }, 500);
        }, 500);
    }, 250);
}
var toggleSidebarBtn = document.getElementById('toggle-sidebar');
var sidebar = document.getElementById('sidebar');

toggleSidebarBtn.addEventListener('click', function () {
    sidebar.classList.toggle('show');
});
order = () => {
    let grid = document.getElementById('grid');
    var masonry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-item',
        gutter: 20
    });

    masonry.bindResize();
    grid.addEventListener('load', function () {
        masonry.layout();
    });
}