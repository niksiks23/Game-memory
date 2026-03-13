$(document).ready(function () {

    const symbols = ["⚽","🎧","🎮","🐨","💲","🔥","👑","🏰"];

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let gameStarted = false;
    let flipTimeout = null;
    let timerInterval = null;
    let timeLeft = 30;

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
        if ($("#timerDisplay").length === 0) {
            $("h1").after('<div id="timerDisplay" style="font-size: 24px; margin: 10px;">Time: 30s</div>');
        }
    }

    function startTimer() {
        timeLeft = 30;
        $("#timerDisplay").text(`Time: ${timeLeft}s`);
        
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        timerInterval = setInterval(function() {
            timeLeft--;
            $("#timerDisplay").text(`Time: ${timeLeft}s`);
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Time's up! You lose!");
                finishGame();
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function startGame() {
        if (flipTimeout) {
            clearTimeout(flipTimeout);
            flipTimeout = null;
        }
        
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        gameStarted = true;
        $(".card").removeClass("flipped matched");
        $("#controlBtn").text("Finish");
        startTimer();
    }

    function finishGame() {
        if (flipTimeout) {
            clearTimeout(flipTimeout);
            flipTimeout = null;
        }
        stopTimer();
        
        $(".card").addClass("flipped");
        $(".card").removeClass("matched");
        gameStarted = false;
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        $("#controlBtn").text("Start");
        $("#timerDisplay").text("Time: 30s");
    }

    function resetTurn() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    function checkWin() {
        if ($(".matched").length === $(".card").length) {
            stopTimer();
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
            flipTimeout = setTimeout(function () {
                firstCard.removeClass("flipped");
                secondCard.removeClass("flipped");
                resetTurn();
                flipTimeout = null;
            }, 2000);
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
