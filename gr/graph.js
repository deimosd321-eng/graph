// Получаем Canvas
const canvas = document.getElementById('canv');
const ctx = canvas.getContext('2d');

// Глобальные параметры графика
let x_left;
let x_right;
let y_down;
let y_up;
let st;
let pen_color;


// --------------------------------------------------
// Сокращение для получения элемента
// --------------------------------------------------

function el(id) {
    return document.getElementById(id);
}


// --------------------------------------------------
// Очистка Canvas
// --------------------------------------------------

function clear_canv() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// --------------------------------------------------
// Математические функции
// --------------------------------------------------

function abs(x) {
    return Math.abs(x);
}

function acos(x) {
    return Math.acos(x);
}

function acosh(x) {
    return Math.acosh(x);
}

function asin(x) {
    return Math.asin(x);
}

function asinh(x) {
    return Math.asinh(x);
}

function atan(x) {
    return Math.atan(x);
}

function atanh(x) {
    return Math.atanh(x);
}

function cos(x) {
    return Math.cos(x);
}

function cosh(x) {
    return Math.cosh(x);
}

function exp(x) {
    return Math.exp(x);
}

function log(x) {
    return Math.log(x);
}

function log10(x) {
    return Math.log10(x);
}

function sign(x) {
    return Math.sign(x);
}

function sin(x) {
    return Math.sin(x);
}

function sinh(x) {
    return Math.sinh(x);
}

function sqrt(x) {
    return Math.sqrt(x);
}

function tan(x) {
    return Math.tan(x);
}

function tanh(x) {
    return Math.tanh(x);
}

function pow(x, y) {
    return Math.pow(x, y);
}


// --------------------------------------------------
// Получение параметров
// --------------------------------------------------

function get_params() {

    x_left = Number(el('x_left').value);
    x_right = Number(el('x_right').value);

    y_down = Number(el('y_down').value);
    y_up = Number(el('y_up').value);

    st = el('func').value;
    pen_color = el('pencolor').value;
}


// --------------------------------------------------
// Перевод координаты X в координату Canvas
// --------------------------------------------------

function x2canv(x) {

    return 20 +
    (x - x_left) * 560 / (x_right - x_left);
}


// --------------------------------------------------
// Перевод координаты Y в координату Canvas
// --------------------------------------------------

function y2canv(y) {

    return 380 -
    (y - y_down) * 360 / (y_up - y_down);
}


// --------------------------------------------------
// Перевод координаты Canvas в X
// --------------------------------------------------

function canv2x(x_canv) {

    const x =
    x_left +
    (x_canv - 20) *
    (x_right - x_left) / 560;

    return x;
}


// --------------------------------------------------
// Перевод координаты Canvas в Y
// --------------------------------------------------

function canv2y(y_canv) {

    const y =
    y_down +
    (380 - y_canv) *
    (y_up - y_down) / 360;

    return y;
}


// --------------------------------------------------
// Расчёт минимального и максимального значения
// --------------------------------------------------

function calc_minmax() {

    get_params();

    if (!isFinite(x_left) ||
        !isFinite(x_right) ||
        x_left >= x_right) {

        alert('Проверьте границы по X.');
    return;
        }

        let x = x_left;

        const dx =
        (x_right - x_left) / 200;

        let y;

        try {
            y = eval(st);
        } catch (error) {
            alert('Ошибка в записи функции.');
            return;
        }

        let y_min = y;
        let y_max = y;

        for (let num = 1; num <= 200; num++) {

            x += dx;

            try {
                y = eval(st);
            } catch (error) {
                alert('Ошибка в записи функции.');
                return;
            }

            if (isFinite(y)) {

                if (y > y_max) {
                    y_max = y;
                }

                if (y < y_min) {
                    y_min = y;
                }
            }
        }

        el('func_min').value =
        y_min.toFixed(5);

        el('func_max').value =
        y_max.toFixed(5);
}


// --------------------------------------------------
// Рисование графика
// --------------------------------------------------

function draw_graph() {

    get_params();

    if (!isFinite(x_left) ||
        !isFinite(x_right) ||
        !isFinite(y_down) ||
        !isFinite(y_up)) {

        alert('Проверьте параметры графика.');
    return;
        }

        if (x_left >= x_right) {

            alert('x_left должен быть меньше x_right.');
            return;
        }

        if (y_down >= y_up) {

            alert('y_down должен быть меньше y_up.');
            return;
        }

        if (st.trim() === '') {

            alert('Введите функцию.');
            return;
        }

        clear_canv();

        const width = 2;

        const dx =
        (x_right - x_left) / 500;

        let x = x_left;
        let y;

        ctx.lineWidth = width;
        ctx.strokeStyle = pen_color;

        ctx.beginPath();

        let firstPoint = true;

        for (let num = 0; num <= 500; num++) {

            try {
                y = eval(st);
            } catch (error) {
                alert('Ошибка в записи функции.');
                return;
            }

            if (isFinite(y)) {

                const x_canv = x2canv(x);
                const y_canv = y2canv(y);

                if (firstPoint) {

                    ctx.moveTo(x_canv, y_canv);
                    firstPoint = false;

                } else {

                    ctx.lineTo(x_canv, y_canv);
                }
            } else {

                // Разрыв функции
                firstPoint = true;
            }

            x += dx;
        }

        ctx.stroke();

        draw_axes();
}


// --------------------------------------------------
// Рисование осей
// --------------------------------------------------

function draw_axes() {

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';

    // Ось X
    let y0_canv;

    if (y_down <= 0 && y_up >= 0) {

        y0_canv = y2canv(0);

    } else if (y_up < 0) {

        y0_canv = 380;

    } else {

        y0_canv = 20;
    }

    ctx.beginPath();

    ctx.moveTo(20, y0_canv);
    ctx.lineTo(580, y0_canv);

    ctx.stroke();


    // Ось Y
    let x0_canv;

    if (x_left <= 0 && x_right >= 0) {

        x0_canv = x2canv(0);

    } else if (x_right < 0) {

        x0_canv = 580;

    } else {

        x0_canv = 20;
    }

    ctx.beginPath();

    ctx.moveTo(x0_canv, 20);
    ctx.lineTo(x0_canv, 380);

    ctx.stroke();
}


// --------------------------------------------------
// Обработка движения мыши
// --------------------------------------------------

function hndl_move(ev) {

    get_params();

    const rect =
    canvas.getBoundingClientRect();

    const x_canv =
    ev.clientX - rect.left;

    const y_canv =
    ev.clientY - rect.top;

    const X =
    canv2x(x_canv);

    const Y =
    canv2y(y_canv);

    let F;

    let x = X;

    try {

        F = eval(st);

    } catch (error) {

        F = NaN;
    }

    // Удаляем старую информацию
    ctx.clearRect(500, 0, 100, 70);

    // Заливаем область фона
    ctx.fillStyle = '#ffffdd';
    ctx.fillRect(500, 0, 100, 70);

    // Возвращаем цвет текста
    ctx.fillStyle = 'black';

    ctx.font = '14px Arial';

    ctx.fillText(
        'X: ' + X.toFixed(2),
                 505,
                 25
    );

    if (isFinite(F)) {

        ctx.fillText(
            'F: ' + F.toFixed(2),
                     505,
                     45
        );

    } else {

        ctx.fillText(
            'F: —',
            505,
            45
        );
    }
}


// --------------------------------------------------
// Запуск после загрузки страницы
// --------------------------------------------------

window.addEventListener('load', function () {

    ctx.font = '14px Arial';

    canvas.addEventListener(
        'mousemove',
        hndl_move
    );

    draw_graph();
});
