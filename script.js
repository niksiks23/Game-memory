$(document).ready(function () {

    const symbols = ["⚽","🎧","🎮","🐨","💲","🔥","👑","🏰"];

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let gameStarted = false;
    let flipTimeout=null;

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        $(".game-board").empty();

        const doubled = shuffle([...symbols, ...symbols]);

        $.each(doubled, function (index, symbol) {

            const card = $(`
                <div class="card" data-symbol="${symbol}">
                    <div class="card-inner">
                        <div class="card-face card-front"></div>
                        <div class="card-face card-back">${symbol}</div>
                    </div>
                </div>
            `);

            $(".game-board").append(card);
        });
        $(".card").addClass("flipped");
    }

    function startGame() {
        if(flipTimeout){
            clearTimeout(flipTimeout);
            flipTimeout=null;
        }
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        gameStarted = true;
        $(".card").removeClass("flipped matched");
        $("#controlBtn").text("Finish");
    }

    function finishGame() {
        if(flipTimeout){
            clearTimeout(flipTimeout);
            flipTimeout=null;
        }
        $(".card").addClass("flipped");
        $(".card").removeClass("matched");
        $(".card").off("click");

        gameStarted = false;
        $("#controlBtn").text("Start");
    }

    function resetTurn() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    function checkWin() {
        if ($(".matched").length === $(".card").length) {
            setTimeout(function () {
                alert("!YOU WIN!");
                finishGame();
            }, 500);
        }
    }

    $(".game-board").on("click", ".card", function () {
        if (!gameStarted) return;
        if (lockBoard) return;
        if ($(this).hasClass("flipped") || $(this).hasClass("matched")) return;

        $(this).addClass("flipped");

        if (!firstCard) {
            firstCard = $(this);
            return;
        }

        secondCard = $(this);
        lockBoard = true;

        if (firstCard.data("symbol") === secondCard.data("symbol")) {
            firstCard.addClass("matched");
            secondCard.addClass("matched");
            resetTurn();
            checkWin();
        } else {
            flipTimeout=setTimeout(function(){
                firstCard.removeClass("flipped");
                secondCard.removeClass("flipped");
                resetTurn();
                flipTimeout=null;
            },2000);
        }
    });
    $("#controlBtn").click(function () {
        if (!gameStarted) {
            startGame();
        } else {
            finishGame();
        }
    });
    createBoard();
});
