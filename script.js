$(document).ready(function () {

    const symbols = ["⚽","🎧","🎮","🐨","💲","🔥","👑","🏰"];

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let gameStarted = false;
    let gamePaused = false;
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
        $(".card").addClass("flipped");
        if ($("#timerDisplay").length === 0) {
            $("h1").after('<div id="timerDisplay" style="font-size: 24px; margin: 10px; font-weight: bold;">⏱️ Time: 30s</div>');
        }
        if ($("#pauseBtn").length === 0) {
            $("#controlBtn").after('<button id="pauseBtn" style="padding: 15px 50px; font-size: 15px; background-color: orange; margin-left: 10px;" disabled>⏸️ Pause</button>');
        }
    }

    function startTimer() {
        timeLeft = 30;
        $("#timerDisplay").text(`⏱️ Time: ${timeLeft}s`);
        
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        timerInterval = setInterval(function() {
            if (gameStarted && !gamePaused) {
                timeLeft--;
                $("#timerDisplay").text(`⏱️ Time: ${timeLeft}s`);
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    alert("⏰ Time's up! You lose!");
                    finishGame();
                }
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function togglePause() {
        console.log("Toggle pause called, gameStarted:", gameStarted, "gamePaused:", gamePaused);
        
        if (!gameStarted) {
            console.log("Game not started, ignoring pause");
            return;
        }
        gamePaused = !gamePaused;
        console.log("Game paused now:", gamePaused);
        
        if (gamePaused) {
            console.log("PAUSING GAME");
            $("#pauseBtn").text("▶️ Resume").css("background-color", "lightgreen");
            lockBoard = true;
            if (flipTimeout) {
                clearTimeout(flipTimeout);
                flipTimeout = null;
            }
            $(".game-board").css("opacity", "0.7");
            $(".game-board").css("filter", "grayscale(50%)");
            $("#timerDisplay").text(`⏱️ Time: ${timeLeft}s ⏸️ PAUSED`);
        } else {
            console.log("RESUMING GAME");
            $("#pauseBtn").text("⏸️ Pause").css("background-color", "orange");
            lockBoard = false;
            $(".game-board").css("opacity", "1");
            $(".game-board").css("filter", "none");
            $("#timerDisplay").text(`⏱️ Time: ${timeLeft}s`);
        }
    }

    function startGame() {
        console.log("Starting game");
        
        if (flipTimeout) {
            clearTimeout(flipTimeout);
            flipTimeout = null;
        }
        
        stopTimer();
        
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        gameStarted = true;
        gamePaused = false;
        $(".card").removeClass("flipped matched");
        $(".game-board").css("opacity", "1");
        $(".game-board").css("filter", "none");
        
        $("#controlBtn").text("🏁 Finish").css("background-color", "salmon");
        $("#pauseBtn").text("⏸️ Pause").prop("disabled", false).css("background-color", "orange");
        $("#timerDisplay").text("⏱️ Time: 30s");
        
        startTimer();
    }

    function finishGame() {
        console.log("Finishing game");
        
        if (flipTimeout) {
            clearTimeout(flipTimeout);
            flipTimeout = null;
        }
        
        stopTimer();
        $(".card").addClass("flipped");
        $(".card").removeClass("matched");
        $(".game-board").css("opacity", "1");
        $(".game-board").css("filter", "none");
        
        gameStarted = false;
        gamePaused = false;
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        
        $("#controlBtn").text("START").css("background-color", "aqua");
        $("#pauseBtn").text("⏸️ Pause").prop("disabled", true).css("background-color", "orange");
        $("#timerDisplay").text("⏱️ Time: 30s");
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
                alert("🎉🏆 !YOU WIN! 🏆🎉");
                finishGame();
            }, 500);
        }
    }
    $(".game-board").on("click", ".card", function () {
        if (!gameStarted) {
            console.log("Game not started");
            return;
        }
        if (gamePaused) {
            console.log("Game paused - clicks blocked");
            return;
        }
        if (lockBoard) {
            console.log("Board locked");
            return;
        }
        if ($(this).hasClass("flipped") || $(this).hasClass("matched")) {
            console.log("Card already flipped or matched");
            return;
        }

        console.log("Card clicked");
        $(this).addClass("flipped");

        if (!firstCard) {
            firstCard = $(this);
            return;
        }

        secondCard = $(this);
        lockBoard = true;

        if (firstCard.data("symbol") === secondCard.data("symbol")) {
            console.log("Match found!");
            firstCard.addClass("matched");
            secondCard.addClass("matched");
            resetTurn();
            checkWin();
        } else {
            console.log("No match");
            flipTimeout = setTimeout(function () {
                console.log("Flipping cards back");
                firstCard.removeClass("flipped");
                secondCard.removeClass("flipped");
                resetTurn();
                flipTimeout = null;
            }, 2000);
        }
    });
    $("#controlBtn").click(function () {
        console.log("Control button clicked");
        if (!gameStarted) {
            startGame();
        } else {
            finishGame();
        }
    });
    $("#pauseBtn").click(function() {
        console.log("Pause button clicked");
        togglePause();
    });
    createBoard();
});
