const $ = require('jquery');
const R = require('ramda');
const other = require('../../lib/other');

var TIMEOUTID = setTimeout(function() {}, 1000 * 60 * 5);
var WIDTH = 6;
var HEIGHT = 6;

// model
function randint(lo, hi) {
    return lo + Math.floor(Math.random() * (hi - lo));
}

function randBlock() {
    return { BlockType: randint(0, 5), touched: false };
}

function randGrid() {
    grid = [];
    for (var c = 0; c < 6; c++) {
        grid.push([]);
        for (var i = 0; i < 6; i++) {
            grid[grid.length - 1].push(randBlock());
        }
    }
    return grid;
}

// view

const SCARY = [
    'superScary1',
    'superScary2',
    'superScary3',
    'superScary4',
    'superScary5'
];
const IMAGES = [
    '../../assets/1.jpg',
    '../../assets/2.jpg',
    '../../assets/4.jpg',
    '../../assets/5.jpg',
    '../../assets/3.jpg'
];

function get_img(block) {
    if (!block.touched) {
        return IMAGES[block.BlockType];
    }
}

var a = '../../assets/1.jpg';
var b = '../../assets/2.jpg';
var c = '../../assets/4.jpg';

function showGrid(grid) {
    return (
        '<table>' +
        grid.map(showRow).join('\n') +
        '</table><div class="well well-sm">' +
        DATA.score +
        '</div>'
    );
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

var DATA = {
    grid: randGrid(),
    score: 0
};

function draw() {
    $('#board').html(showGrid(DATA.grid));
    attachHandlers();
}

function touch(clump) {
    for (i = 0; i < clump.length; i++) {
        var x = clump[i][0];
        var y = clump[i][1];
        DATA.grid[x][y] = randBlock();
    }
    return 25 * clump.length;
}
function outOfBounds(x, y) {
    if (x < 0 || x >= 6 || y < 0 || y >= 6) {
        return true;
    }
}
function checked(grid, start_x, start_y) {
    var history = [];
    var clump_so_far = [];
    var to_explore = [[start_x, start_y]];
    while (to_explore.length > 0) {
        var pos = to_explore.pop();
        var x = pos[0];
        var y = pos[1];
        if (R.contains([x, y], history)) {
        } else if (outOfBounds(x, y)) {
            history.push([x, y]);
        } else if (grid[x][y].BlockType != grid[start_x][start_y].BlockType) {
            history.push([x, y]);
        } else {
            to_explore = R.concat(to_explore, [
                [x, y - 1],
                [x, y + 1],
                [x - 1, y],
                [x + 1, y]
            ]);
            history.push([x, y]);
            clump_so_far.push([x, y]);
        }
    }
    return clump_so_far;
}

function afterGame(spookyclass) {
    $('#board')
        .removeClass(spookyclass)
        .html(
            '<div class="jumbotron endmessage"><h1 class="endmessage">' +
                'You win with score of 3000! Good Job!' +
                '<br><img class="pic" src="../../assets/spooky2.gif">' +
                '</h1></div>'
        )
        .fadeIn(500);
    clearTimeout(TIMEOUTID);
}

function hideFade(clump) {
    clump.forEach(function(element) {
        var x = element[0];
        var y = element[1];
        $('#' + x + '-' + y).hide();
        $('#' + x + '-' + y).fadeIn();
    });
}
function attachHandlers() {
    for (var x = 0; x < 6; x++) {
        for (var y = 0; y < 6; y++) {
            $('#' + x + '-' + y).on(
                'click',
                (function(x, y) {
                    return function() {
                        var clump = checked(DATA.grid, x, y);
                        DATA.score += touch(clump);
                        if (DATA.score >= 3000) {
                            var spookyclass = SCARY[randint(0, 5)];
                            $('#board')
                                .hide()
                                .html('')
                                .fadeIn()
                                .addClass('superScary')
                                .addClass(spookyclass)
                                .fadeOut(8000);
                            $('#board')
                                .promise()
                                .done(function() {
                                    clearTimeout(TIMEOUTID);
                                    afterGame(spookyclass);
                                });
                            return '';
                        }

                        draw();
                        hideFade(clump);
                    };
                })(x, y)
            );
        }
    }
}

function clearTO() {
    clearTimeout(TIMEOUTID);
    return setTimeout(function() {
        if (DATA.score < 3000) {
            $('#board').html(
                '<div class="jumbotron endmessage"><h1 class="endmessage">' +
                    'You Did Not Reach The Required Score of 3000 with your score of ' +
                    DATA.score +
                    '</h1></div>'
            );
        }
    }, 35000);
}

function main() {
    $('.start').click(() => {
        DATA.grid = randGrid();
        DATA.score = 0;
        draw();

        TIMEOUTID = clearTO();
    });
}

$(main);
