const $ = require('jquery');
const other = require('../../lib/other');
// model
function randint(lo, hi) {
    return lo + Math.floor(Math.random() * (hi - lo));
}

function randBlock() {
    return { BlockType: randint(0, 3), touched: false };
}

function randGrid() {
    grid = [];
    for (var c = 0; c < 5; c++) {
        grid.push([]);
        for (var i = 0; i < 5; i++) {
            grid[grid.length - 1].push(randBlock());
        }
    }
    return grid;
}

// view
const IMAGES = [
    '../../assets/1.jpg',
    '../../assets/2.jpg',
    '../../assets/4.jpg'
];

function get_img(block) {
    if (!block.touched) {
        return IMAGES[block.BlockType];
    } else {
        return '../../assets/3.jpg';
    }
}

var a = '../../assets/1.jpg';
var b = '../../assets/2.jpg';
var c = '../../assets/4.jpg';

function showGrid(grid) {
    return grid.map(showRow).join('\n');
}

function showRow(row, r) {
    return '<tr>' + row.map((b, c) => showBlock(b, r, c)).join('\n') + '</tr>';
}

function showBlock(block, row, col) {
    return (
        '<td class="square"><button id="' +
        row +
        '-' +
        col +
        '"><img class="block" src="' +
        get_img(block) +
        '"/> </button> </td>'
    );
}

var DATA = randGrid();

function draw() {
    $('#app').html(showGrid(DATA));
    attachHandlers();
}

function touch(x, y) {
    DATA[x][y].touched = true;
}

function checked(grid, start_x, start_y, block) {
    var history = [];
    var to_explore = [(start_x, start_y)];
    var clump_so_far = [];
    while (to_explore) {}
}

function attachHandlers() {
    for (var x = 0; x < 5; x++) {
        for (var y = 0; y < 5; y++) {
            $('#' + x + '-' + y).on(
                'click',
                (function(x, y) {
                    return function() {
                        touch(x, y);
                        $('#' + x + '-' + y).add('disabled', true);
                        draw();
                    };
                })(x, y)
            );
        }
    }
}

// $('#start').on('click', function() {
//     var table = '';
//     for (var c = 0; c < 5; c++) {
//         DATA.push([]);
//         table += '<tr>';
//         for (var i = 0; i < 5; i++) {
//             var img = get_img(randBlock());
//             table +=
//                 '<td class="square"><button onclick="dosomething(id)"><img id="' +
//                 c +
//                 i +
//                 '" class=" ' +
//                 (img === a
//                     ? 'pumpkin'
//                     : img == b ? 'house' : img == c ? 'witch' : 'witch') +
//                 '"src="' +
//                 img +
//                 '"></img></button></td>';
//             DATA[DATA.length - 1].push();
//         }
//         table += '</tr>';
//         console.log(DATA);
//     }
//     $('#app').html(table);
// });
// function dosomething(id) {
//     var x = Number(id[0]);
//     var y = Number(id[1]);

//     for (i = 0; i < x; i++) {
//         for (n = 0; i < y; n++) {
//             if ((i === x && n === y - 1) || n === y + 1) {
//             }
//         }
//     }
// }

function main() {
    $('#start').click(() => {
        DATA = randGrid();
        draw();
    });
    draw();
}

$(main);
