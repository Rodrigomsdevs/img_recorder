// Adicione isso ao seu arquivo index.js

$(document).ready(function () {


    $('#toggle-sidebar').on('click', function () {
        $('.sidebar').toggleClass('d-none d-md-block');
    });



    function loadImages(images) {
        let grid = $('#grid');

        for (var i = 0; i < images.length; i++) {
            let image = images[i];

            setTimeout(() => {
                grid = $('#grid');
                grid.html(grid.html() + `<div class="grid-item"><img src="${image.url}"></div>`);
                order();
            }, i * 200);
        }

    }

    function order() {
        let grid = document.getElementById('grid');
        var masonry = new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-item',
            gutter: 20 /* Defina o valor do espaçamento (gutter) entre as colunas */
        });

        // Ativar resize do Masonry
        masonry.bindResize();

        // Reorganizar o layout sempre que uma imagem for carregada
        grid.addEventListener('load', function () {
            masonry.layout();
        });
    }

    // Exemplo de uso com um array de objetos de imagens
    const images = [
        { url: 'https://i.pinimg.com/564x/b9/0a/04/b90a0415206be5f25f548017e32e1edb.jpg' },
        { url: 'https://i.pinimg.com/236x/69/2c/15/692c156f3da740718453fd9c2e83dc03.jpg' },
        { url: 'https://i.pinimg.com/236x/04/39/06/0439067a3239773c4fe4a2333ff4b8a0.jpg' },
        { url: 'https://i.pinimg.com/564x/ca/87/cd/ca87cd9008b0c28eefa9a10d80b097af.jpg' },
        { url: 'https://i.pinimg.com/564x/84/99/21/849921c04e94e2c641ede3850d66412a.jpg' },
        { url: 'https://i.pinimg.com/564x/46/a7/56/46a756cf5970faf27feb37e51c419024.jpg' },
        { url: 'https://i.pinimg.com/564x/79/b8/00/79b800f638db35c0c12892b192845dcd.jpg' },
        { url: 'https://i.pinimg.com/564x/aa/cf/fc/aacffcbbaac2bc4ae40bb61131394e8f.jpg' },
        { url: 'https://i.pinimg.com/564x/dd/64/87/dd6487146addabbcc2566a52de19bdc7.jpg' },
    ];

    loadImages(images);
});
