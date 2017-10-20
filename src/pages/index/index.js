const $ = require('jquery');
const other = require('../../lib/other');

function randint(lo, hi) {
    return lo + Math.floor(Math.random() * (hi - lo));
}

function randBlock() {
    return randint(0, 3);
}

const IMAGES = [
    '../../assets/1.jpg',
    '../../assets/2.jpg',
    '../../assets/4.jpg'
];

function get_img(l) {
    return IMAGES[l];
}

$('#start').on('click', function() {
    $('.candyimg').each(function() {
        $(this)
            .attr('src', get_img(randBlock()))
            .attr('width', '65%')
            .attr('height', '65%')
            .html('');
    });

    // GARBAGE CODE BELOW HERE
    var buttons = $('.candybutton');
    // probably need to do a for each to loop through all the buttons
    var button = $('#somebutton'); // WONT BE INDEXED BY AN ID
    button.attr('src', 'someimage.png');
    $('app').html();
});
