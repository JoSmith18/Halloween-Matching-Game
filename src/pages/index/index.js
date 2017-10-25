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

function nonRandGrid() {
    grid = [];
    for (var c = 0; c < 6; c++) {
        grid.push([]);
        for (var i = 0; i < 6; i++) {
            grid[grid.length - 1].push({
                BlockType: 2,
                touched: false
            });
        }
    }
    return grid;
}

function get_img(block, month) {
    if (!block.touched) {
        if (month === 'Oct') {
            return IMAGES[block.BlockType];
        } else if (month == 'Nov') {
            return THANKS[block.BlockType];
        } else if (month == 'Dec') {
            return MAS[block.BlockType];
        }
    }
}

const IMAGES = [
    '../../assets/1.jpg',
    '../../assets/2.jpg',
    '../../assets/4.jpg',
    '../../assets/5.jpg',
    '../../assets/3.jpg'
];

const SCARY = [
    'superScary1',
    'superScary2',
    'superScary3',
    'superScary4',
    'superScary5'
];

const MAS = [
    '../../assets/mas.jpg',
    '../../assets/mas2.jpg',
    '../../assets/mas3.jpg',
    '../../assets/mas4.jpeg',
    '../../assets/mas5.jpg'
];

const CHRIST = ['mas1', 'mas2', 'mas3', 'mas4', 'mas5'];
function showGrid(grid, month) {
    return (
        '<table>' +
        grid.map((row, index) => showRow(row, index, month)).join('\n') +
        '</table><div class="well well-sm">' +
        DATA.score +
        '</div>'
    );
}

function showRow(row, r, month) {
    return (
        '<tr>' +
        row.map((b, c) => showBlock(b, r, c, month)).join('\n') +
        '</tr>'
    );
}

function showBlock(block, row, col, month) {
    return (
        '<td class="square"><button id="' +
        row +
        '-' +
        col +
        '"><img class="block" src="' +
        get_img(block, month) +
        '"/> </button> </td>'
    );
}

var DATA = {
    grid: randGrid(),
    score: 0
};

function getClass(month) {
    if (month === 'Oct') {
        return SCARY[randint(0, 5)];
    } else if (month === 'Nov') {
        return GIVING[randint(0, 5)];
    } else if (month === 'Dec') {
        return CHRIST[randint(0, 5)];
    }
}
function attachHandlers(month) {
    for (var x = 0; x < 6; x++) {
        for (var y = 0; y < 6; y++) {
            $('#' + x + '-' + y).on(
                'click',
                (function(x, y) {
                    return function() {
                        var clump = checked(DATA.grid, x, y);
                        DATA.score += touch(clump);
                        if (DATA.score >= 1000) {
                            var my_class = getClass(month);

                            $('#board')
                                .hide()
                                .html('')
                                .fadeIn()
                                .addClass('superScary')
                                .addClass(my_class)
                                .fadeOut(8000);
                            $('#board')
                                .promise()
                                .done(function() {
                                    clearTimeout(TIMEOUTID);
                                    afterGame(my_class);
                                });
                            return '';
                        }

                        draw(month);
                        hideFade(clump);
                    };
                })(x, y)
            );
        }
    }
}

function draw(month) {
    $('body')
        .attr('class', '')
        .addClass(month);
    $('#board').html(showGrid(DATA.grid, month));
    attachHandlers(month);
}

const GIVING = [
    'thanksGiving1',
    'thanksGiving2',
    'thanksGiving3',
    'thanksGiving4',
    'thanksGiving5'
];

const THANKS = [
    '../../assets/thanks1.jpg',
    '../../assets/thanks2.jpg',
    '../../assets/thanks3.jpg',
    '../../assets/thanks4.jpg',
    '../../assets/thanks5.jpg'
];
// Functions

function touch(clump) {
    if (clump.length > 1) {
        score = 0;
        for (var i = 0; i < clump.length; i++) {
            var x = clump[i][0];
            var y = clump[i][1];
            DATA.grid[x][y] = randBlock();
            score += Math.ceil(clump.length ** 2 / 1.25);
        }
        return Math.min(score, 750);
    } else {
        var x = clump[0][0];
        var y = clump[0][1];
        DATA.grid[x][y] = randBlock();
        return -10;
    }
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

function afterGame(my_class) {
    if (SCARY.indexOf(my_class) > -1) {
        $('#board')
            .removeClass(my_class)
            .html(
                '<div class="jumbotron endmessage"><h1 class="endmessage">' +
                    'You win with a score of 1000! Good Job!' +
                    '<br><img class="pic" src="../../assets/spooky2.gif">' +
                    '</h1></div>'
            )
            .fadeIn(200);
        clearTimeout(TIMEOUTID);
    } else if (GIVING.indexOf(my_class) > -1) {
        $('#board')
            .removeClass(my_class)
            .html(
                '<div class="jumbotron endmessage"><h1 class="endmessage">' +
                    'You win with a score of 1000! Good Job!' +
                    '<br><img class="pic" src="https://media.giphy.com/media/pea3hRwQbzWXS/giphy.gif">' +
                    '</h1></div>'
            )
            .fadeIn(200);
        clearTimeout(TIMEOUTID);
    } else if (CHRIST.indexOf(my_class) > -1) {
        $('#board')
            .removeClass(my_class)
            .html(
                '<div class="jumbotron endmessage"><h1 class="endmessage">' +
                    'You win with a score of 1000! Good Job!' +
                    '<br><img class="pic" src="https://media.giphy.com/media/I9ghnmJEzOh7G/giphy.gif">' +
                    '</h1></div>'
            )
            .fadeIn(200);
        clearTimeout(TIMEOUTID);
    }
}

function hideFade(clump) {
    clump.forEach(function(element) {
        var x = element[0];
        var y = element[1];
        $('#' + x + '-' + y).hide();
        $('#' + x + '-' + y).fadeIn();
    });
}

function clearTO() {
    clearTimeout(TIMEOUTID);
    return setTimeout(function() {
        if (DATA.score < 1000) {
            $('#board').html(
                '<div class="jumbotron endmessage"><h1 class="endmessage">' +
                    'You Did Not Reach The Required Score of 1000 with your score of ' +
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
        draw('Oct');

        TIMEOUTID = clearTO();
    });
    $('.start-2').click(() => {
        DATA.grid = nonRandGrid();
        DATA.score = 0;
        draw('Oct');

        TIMEOUTID = clearTO();
    });
    $('.Thanksgiving').click(() => {
        DATA.grid = randGrid();
        DATA.score = 0;
        draw('Nov');

        TIMEOUTID = clearTO();
    });

    $('.Christmas').click(() => {
        DATA.grid = randGrid();
        DATA.score = 0;
        draw('Dec');

        TIMEOUTID = clearTO();
    });
}

$(main);

// function setEasy() {
//     var d = new Date();
//     var month_index = d.getMonth();
//     if (month_index == 9) {

//     } else if (month_index == 10) {
//         // set turkey class
//     } else if (month_index == 11) {
//         // set santa class
//     }
// }
