Dropzone.autoDiscover = false;

let rowsSlider;
let colsSlider;
let myDropzone;
let filename;

function classify() {
    let cols = colsSlider.noUiSlider.get();
    let rows = rowsSlider.noUiSlider.get();
    let options = 'filename=' + filename + '&cols=' + cols + '&rows=' + rows;
    document.getElementById("classifier-form").style.display = 'none';
    document.getElementById("grid").style.display = 'none';
    document.getElementById("spin-loader").style.display = 'inline';
    http.post('/treat', options, r => {
        document.getElementById("spin-loader").style.display = 'none';
        document.getElementById("image-response").style.display = 'inline';
        document.getElementById("image-response").style.background = 'url(' + r + ')';
        document.getElementById("image-response").style.backgroundSize = 'contain';
        document.getElementById("image-response").style.backgroundPosition = 'center';
        document.getElementById("image-response").style.backgroundRepeat = 'no-repeat';
        document.getElementById("image2").src = r;
        document.getElementById("image2").style.opacity = '0';
        console.log(r);
    });
}

function done(fn) {
    filename = fn;
    // fn = '/img/perfect.jpg';

    document.getElementById("image").src = fn;
    document.getElementById("image").style.opacity = '0';

    document.getElementById("image-container").style.background = 'url(' + fn + ')';
    document.getElementById("image-container").style.backgroundSize = 'contain';
    document.getElementById("image-container").style.backgroundPosition = 'center';
    document.getElementById("image-container").style.backgroundRepeat = 'no-repeat';

}

function initializeSlider() {
    colsSlider = document.getElementById('cols-slider');
    rowsSlider = document.getElementById('rows-slider');

    noUiSlider.create(colsSlider, {
        start: [3],
        step: 1,
        connect: [true, false],
        range: {
            'min': [1],
            'max': [10]
        }
    });

    noUiSlider.create(rowsSlider, {
        start: [3],
        step: 1,
        connect: [true, false],
        range: {
            'min': [1],
            'max': [10]
        }
    });

    colsSlider.noUiSlider.on('update', function (values, handle) {
        drawGrid();
    });

    rowsSlider.noUiSlider.on('update', function (values, handle) {
        drawGrid();
    });
}

function drawGrid() {
    let x = colsSlider.noUiSlider.get();
    let y = rowsSlider.noUiSlider.get();
    let linkheight = document.getElementById("image").clientHeight / y;
    let linkwidth = document.getElementById("image").clientWidth / x;
    let t = '';

    for (let i = 0; i < x * y; i++) {
        t += '<div class="grid-link" style="height:' + linkheight + 'px;width:' + linkwidth + 'px;"></div>';
    }
    document.getElementById("grid").innerHTML = t;
}

myDropzone = new Dropzone("form#my-dz", {
    url: "/file-upload",
    maxFilesize: 30, // MB
    maxFiles: 1,
    paramName: 'file',
    // dictDefaultMessage: 'Drag an image here to upload, or click to select one',
    dictDefaultMessage: 'Faites glisser une image ici, ou bien cliquez pour en sélectionner une.',
    acceptedFiles: 'image/*',
    success: function (file, response) {
        setTimeout(() => {
            document.getElementById("my-dz").style.opacity = '0';
            setTimeout(() => {
                document.getElementById("my-dz").style.display = 'none';
                document.getElementById("result").style.display = 'inline-block';
                done(response);
            }, 700);
        }, 500);
    }
});

initializeSlider();
drawGrid();
