var totalWinnings = 0;
var guaranteedWinnings = 0;
var level=0;
var blinksLeft=7
var winnings = new Array("0","1,000","5,000","10,000","25,000","50,000","100,000","175,000","300,000","500,000","1,000,000");
var finished;
var db = openDatabase('GBCatDB', '1.0', 'Scores data', 2 * 1024 * 1024);

db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS highscores3 (score INT)');
});      

var rtime = new Date(1, 1, 2000, 12,00,00);
var timeout = false;
var delta = 200;

$(window).resize(function() {
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
    }
});

var w_width;
var w_height;

function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;
        sizeStuff();
    }
}

function sizeStuff()
{
    w_width = $(window).outerWidth();
    w_height = $(window).outerHeight();

    var image_height = Math.round(w_height/7.5);
    var menu_padding = Math.round(w_height/30);
    var menu_margin = Math.round(w_height/15);

    $(".menubutton").css("padding",menu_padding);
    $(".menubutton").css("margin",menu_margin);

    $(".mainimage").css("height",image_height);
    $(".mainimage").css("width",w_width);

    var subject_height = Math.round(w_height/11);
    var subject_padding = Math.round(w_height/80);
    var line_height = Math.round(subject_height/2);

    $(".button").css("height",subject_height);
    $(".button").css("margin",subject_padding);
    $(".button").css("line-height",($(".button").css("height")));

    var bottom_height = Math.round(w_height/8);
    $(".menudiv").css("height",bottom_height);

    var answer_padding = Math.round(w_height/55);
    var answer_margin = Math.round(w_height/30);

    $(".answerbutton").css("padding",answer_padding);
    $(".answerbutton").css("margin",answer_margin);
    $(".correctanswerbutton").css("padding",answer_padding);
    $(".correctanswerbutton").css("margin",answer_margin);
    $(".wronganswerbutton").css("padding",answer_padding);
    $(".wronganswerbutton").css("margin",answer_margin);

    var rog_margin = Math.round(w_height/12);
    var rog_padding = Math.round(w_height/20);

    $("#rulesofthegame").css("padding",rog_padding);
    $("#rulesofthegame").css("margin",rog_margin);
}