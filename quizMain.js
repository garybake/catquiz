function isElementinArray(element, parentArray) {
    var tobeReturned = false;
    var j =0;
    for (j=0;j<parentArray.length;j++) {
        if (parentArray[j]==element)
        {
            tobeReturned=true;
        }
    }
    return tobeReturned;
}

var selectedQuestions;

function upgrade()
{
    document.getElementById('questionsdiv').innerHTML = "<center><div id='rulesofthegame'><center><b><span>How to Play</span></b></center><p />- Each correct answer wins you money.                <br />- If you make £25,000 - that money becomes guaranteed. Otherwise, you lose everything with one wrong answer.<br />- You can drop out at any time to keep your earnings.<br />- If you answer all questions, you will win one million pounds.<p/>Good luck with the Million Pound Cat Quiz!</div><div class=\"menubutton\" style=\"width:200px;\" onClick=\"createMainMenu()\">Play Now!</div></center>";
    sizeStuff();
}

function createMainMenu()
{
    totalWinnings = 0;
    guaranteedWinnings = 0;
    level = 0;
    var mainmenuHTML;
    mainmenuHTML="<p /><br /><br /><div class=\"menubutton pure-button\" onclick=\"startQuiz()\">Play Game</div><div class=\"menubutton pure-button\" onclick=\"upgrade()\">How To Play</div><div class=\"menubutton pure-button\" onclick=\"getHighScores()\">Your Best Score</div>";
    document.getElementById('questionsdiv').innerHTML=mainmenuHTML;
    sizeStuff();
}

function dropOut()
{
    guaranteedWinnings = totalWinnings;
    var winningsInt = parseInt(guaranteedWinnings.toString().replace(/,/g,''));
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS highscores3 (score INT)');
        tx.executeSql('INSERT INTO highscores3 (score) VALUES (?)',[winningsInt]);
    });
    window.setTimeout(leaveQuiz,100)
}

function leaveQuiz()
{
    blinksLeft=7;
    document.getElementById('gamenav').style.display = "none";
    document.getElementById('questionsdiv').innerHTML="<p /><p /><br /><p /><br /><p /><br />You leave the game with total winnings of:<p /><div class=\"green pure-button\">£"+guaranteedWinnings+"</div>"
    document.getElementById('gamenav').innerHTML="";
    setTimeout(createMainMenu,4000);
}

function startQuiz()
{
    selectedQuestions = new Array();
    finished = new Array();
    var i=0;
    for (i=0;i<10;i++)
    {
        var randomNumber;
        randomNumber = Math.floor(Math.random()*questions.length);
        while (isElementinArray(randomNumber, selectedQuestions))
        {
            randomNumber = Math.floor(Math.random()*questions.length);
        }
        selectedQuestions.push(randomNumber);
    }
    document.getElementById('gamenav').style.display = "inline";
    generateQuiz();
}

function generateQuiz()
{
    blinksLeft=7;
    var returnHTML;
    var classes = new Array("red","yellow","blue","maroon","green");
    returnHTML = "<table width=\"100%\" style=\"padding-left:5px;padding-right:5px\"";
    var j = 0;
    for (j=0;j<10;j++)
    {
        var visibility = "";
        if (isElementinArray(j, finished))
        {
            visibility=" invisible";
        }
        var selectedQid = selectedQuestions[j];
        var classNo = Math.floor(j/2);
        if (j%2==0)
            returnHTML = returnHTML + "<tr>";
        returnHTML = returnHTML + "<td width=50%><div class=\""+classes[classNo]+visibility+" cat-button pure-button\" id=\"button"+j+"\" onclick=\"showQuestion("+j+")\">"+category[selectedQid]+"</div></td>";
        if (j%2==1)
            returnHTML = returnHTML + "</tr>";
    }
    returnHTML = returnHTML + "</table>";
    document.getElementById('questionsdiv').innerHTML = returnHTML;
    document.getElementById('gamenav').innerHTML = "<table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\"><tr><td width=\"37%\" class=\"menudiv\"><center>YOUR WINNINGS:<br /><div id=\"winnings\">£"+totalWinnings+"</font></div></center></td><td width=\"37%\" class=\"menudiv\"><center>GUARANTEED:<br /><div id=\"winnings\">£"+guaranteedWinnings+"</font></div></center></td><td width=\"26%\" id=\"dropoutdiv\" class=\"menudiv\" style=\"cursor: pointer;\" onclick=\"dropOut()\"><center><img src=\"resources/images/exit.gif\" height=\"30\" /><br />DROP OUT</center></td></tr></table></div>";
    sizeStuff();
}

function showQuestion(elementNo)
{
    questionNo = selectedQuestions[elementNo];
    var returnHTML;
    returnHTML = "<div class=question>"+questions[questionNo]+"</div>";
    var k=0;
    for (k=0;k<4;k++)
    {
        returnHTML = returnHTML + "<div class=\"answerbutton pure-button\" id=\"answer"+k+"\" onClick=\"answerQuestion("+elementNo+","+k+")\">"+answers[questionNo][k]+"</div>";
    }
    document.getElementById('questionsdiv').innerHTML=returnHTML;
    sizeStuff();
    
}

function numberFormat(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    return x1 + x2;
}

function donothing()
{
    //
}

function getHighScores()
{
    var highscoreHTML="<p /><p /><br /><p /><br /><p /><br /><br />Your Best Score is:<p /><div class=\"green pure-button\">£";
    db.transaction(function (tx)
    {
        tx.executeSql('SELECT * FROM highscores3 ORDER BY score desc LIMIT 0,5', [], function (tx, results) {
            var len = results.rows.length, i;
            if (len==0)
            {
                highscoreHTML += 0;
            }
            else
            {
                for (i = 0; i < 1; i++){
                    highscoreHTML += numberFormat(results.rows.item(i).score);
                }
            }
            highscoreHTML +="</div>";
            document.getElementById('questionsdiv').innerHTML=highscoreHTML;
        }, null);
    });
    window.setTimeout(createMainMenu,3000)
}


function answerQuestion(elementNo,answerNo)
{
    questionNo = selectedQuestions[elementNo];
    var correctDiv = "answer" + correct[questionNo];
    document.getElementById('answer0').onclick="donothing()";
    document.getElementById('answer1').onclick="donothing()";
    document.getElementById('answer2').onclick="donothing()";
    document.getElementById('answer3').onclick="donothing()";
    if (answerNo==correct[questionNo])
    {
        finished.push(elementNo);
        level++;
        totalWinnings = winnings[level];
        if (level==4)
        {
            guaranteedWinnings = totalWinnings;
        }
            updateWinnings();
            blinkButton(correctDiv);
        if (level==10)
        {
            window.setTimeout(dropOut,4100);
        }
        else
        {
            window.setTimeout(generateQuiz,4100)
        }
    }
    else
    {
        var wrongDiv = "answer" + answerNo;
        // document.getElementById(wrongDiv).className = "wronganswerbutton pure-button";
        $("#"+wrongDiv).fadeTo(1,0.5);
        blinkButton(correctDiv);

        var winningsInt = parseInt(guaranteedWinnings.toString().replace(/,/g,''));
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS highscores3 (score INT)');
            tx.executeSql('INSERT INTO highscores3 (score) VALUES (?)',[winningsInt]);
        });
        window.setTimeout(leaveQuiz,4100);
    }
}

function blinkButton(buttonId)
{
    $("#"+buttonId).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
    // var w_width = $(window).outerWidth();
    // var w_height = $(window).outerHeight();
    // var answer_padding = Math.round(w_height/55);
    // var answer_margin = Math.round(w_height/30);
    // if (blinksLeft>0)
    // {
    //     var className = document.getElementById(buttonId).className;
    //     if (className=="answerbutton pure-button")
    //     {
    //         document.getElementById(buttonId).className="correctanswerbutton pure-button";
    //         $("#someElement").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
    //     }
    //     else if (className=="correctanswerbutton pure-button")
    //     {
    //         document.getElementById(buttonId).className="answerbutton pure-button";
    //         $(".answerbutton").css("padding",answer_padding);
    //         $(".answerbutton").css("margin",answer_margin);
    //     }
    //     blinksLeft--;
    //     window.setTimeout(blinkButton,500,buttonId);
    // }
}

function updateWinnings()
{
    document.getElementById('winnings').innerHTML = "£" + totalWinnings;
}

createMainMenu();