document.getElementById("przycisk-graj").addEventListener("click", startGame);
document.getElementById("przycisk-jakgrac").addEventListener("click", pokazInstrukcje);
document.getElementById("przycisk-sklep").addEventListener("click", pokazsklep);
document.getElementById("przycisk-ustawienia").addEventListener("click", pokazUstawienia);
document.getElementById("btn-latwy").addEventListener("click", easyMode);
document.getElementById("btn-sredni").addEventListener("click", normalMode);
document.getElementById("btn-trudny").addEventListener("click", hardMode);
document.getElementById("powrot").addEventListener("click", powrot);
document.getElementById("powrot1").addEventListener("click", powrot);
document.getElementById("powrot2").addEventListener("click", powrot);
document.getElementById("kup1").addEventListener("click", zakup1);
document.getElementById("kup2").addEventListener("click", zakup2);
document.getElementById("kup3").addEventListener("click", zakup3);
document.getElementById("kup4").addEventListener("click", zakup4);
document.getElementById("kup5").addEventListener("click", zakup5);

// ---- VARIABLES ----
const galaxy = document.querySelector(".galaxy");
const ship = document.querySelector(".pointer");
const healthBar = document.getElementById("healthPoints");
const gameAudio = document.getElementById("gameAudio");
const pauseAudio = document.getElementById("pauseAudio");
const collectAudio = document.getElementById("collectAudio");
const pointer = document.getElementById("pointer");
const clickAudio = document.getElementById("clickAudio");
const hoverAudio = document.getElementById("hoverAudio");
const buyAudio = document.getElementById("buyAudio");
const losingAudio= document.getElementById("losingAudio");
const hitAudio=document.getElementById("hitAudio");
let creatingArea = window.innerHeight - 300;
const min = Math.ceil(150);
const max = Math.floor(creatingArea + 150); // MAXIMUM TOP GAP
let x_ship, y_ship;
let starsArray = [], asteroidsArray = [], heartsArray = [];
let howManyCreatedStars = 0, howManyCreatedAsteroids = 0, howManyCreatedHearts = 0;
let howManyPoints = 0, savedPoints;
let heartsCount, howManyHearts = 2;    // Normal difficulty settings
let creatingStarIntervalTime = 750, creatingAsteroidsIntervalTime = 500;
let starAnimationDuration = 5, asteroidsAnimationDuration = 4;  // Normal difficulty settings
let difficultyLevel = "Medium";
let starsInterval = null, asteroidsInterval = null, updatingGameStateInterval = null;
let isGamePaused = false, gameoverDisplayed = false, ableToPause = false;
localStorage.setItem("points", 500);    // FOR GAME PRESENTATION
$(".pointer").css("background-image", localStorage.getItem("ship"));
// ------------------------

// GAME CODE
$(document).mousemove(function(e)
{
    if (isGamePaused == false)
    {
        $('.pointer').css({left:e.pageX, top:e.pageY});
        x_ship = e.pageX;
        y_ship = e.pageY;
        document.getElementById("ship_cords").innerHTML = "Ship cordinates X: " + x_ship + " Y: " + y_ship;
    }
});

$(document).keypress(function(e)
{
    if (e.code == 'KeyP' && ableToPause == true)
    {
        switch (isGamePaused)
        {
            case false:
            {
                pauseAudio.volume = 0.2;
                pauseAudio.play();
                gameAudio.pause();
                document.getElementById("main_body").style.animationPlayState = "paused";
                document.getElementById("pause").style.animationPlayState = "running";
                document.getElementById("pause").style.display = "block";
                clearInterval(starsInterval);
                clearInterval(asteroidsInterval);
                for (let i = 0; i < starsArray.length; i++)
                {
                    let element = document.getElementById(starsArray[i].newStar.id);
                    element.style.animationPlayState = "paused";
                }
            
                for (let i = 0; i < asteroidsArray.length; i++)
                {
                    let element = document.getElementById(asteroidsArray[i].newAsteroid.id);
                    element.style.animationPlayState = "paused";
                }
                isGamePaused = true;
                break;
            }

            case true:
            {
                gameAudio.play();
                document.getElementById("main_body").style.animationPlayState = "running";
                document.getElementById("pause").style.display = "none";
                starsInterval = setInterval(createStarsArray, creatingStarIntervalTime);
                asteroidsInterval = setInterval(createAsteroidsArray, creatingAsteroidsIntervalTime);
                for (let i = 0; i < starsArray.length; i++)
                {
                    let element = document.getElementById(starsArray[i].newStar.id);
                    element.style.animationPlayState = "running";
                }
            
                for (let i = 0; i < asteroidsArray.length; i++)
                {
                    let element = document.getElementById(asteroidsArray[i].newAsteroid.id);
                    element.style.animationPlayState = "running";
                }
                isGamePaused = false;
                break;
            }
        }
    }
});

$(document).keypress(function(e)
{
    if (e.code == 'Enter' && gameoverDisplayed == true)
    {
        displayMenu();
        
    }
});

function startGame() {
    gameAudio.play();
    //gameAudio.volume = 0.2;
    ship.style.display = "block";
    document.getElementById("main_html").style.cursor = "none";
    document.getElementById("black_top").style.animationPlayState = "running";
    document.getElementById("black_top").style.display = "block";
    document.getElementById("black_bottom").style.animationPlayState = "running";
    document.getElementById("black_bottom").style.display = "block";
    document.getElementById("menu").style.display = "none";
    document.getElementById("main_body").style.animationPlayState = "running";
    document.getElementById("counter").innerHTML = "Points: " + howManyPoints;
    document.getElementById("difficultyLevel").innerHTML = "Difficulty level: " + difficultyLevel;
    createHeartsArray(howManyHearts);
    starsInterval = setInterval(createStarsArray, creatingStarIntervalTime);
    asteroidsInterval = setInterval(createAsteroidsArray, creatingAsteroidsIntervalTime);
    updateGameState();
    heartsCount = heartsArray.length - 1;
    howManyPoints = 0;
    ableToPause = true;
}

function createStar() {
    this.newStar = document.createElement('div');
    this.newStar.setAttribute("class", "star");
    this.newStar.id = "star" + howManyCreatedStars;
    this.newStar.style.top = (Math.floor(Math.random() * (max - min) + min)) + "px";
    this.newStar.style.animationDuration = starAnimationDuration + 's';
    this.x = 0;
    this.y =  this.newStar.style.top;
    galaxy.appendChild(this.newStar);

    this.newPosition = function() {
        let elementCords = getOffset(this.newStar);
        this.x = elementCords.left;
        this.y = elementCords.top;
    }

    this.collisionDetection = function(x_ship, y_ship) {
        let leftSide = this.x - 10;
        let rightSide = this.x + 10;
        let topSide = this.y + 10;
        let bottomSide = this.y - 10;
        let collision  = false;
        
        if (((x_ship + 10) >= leftSide) && ((x_ship - 30) <= rightSide) && ((y_ship - 40) <= topSide) && ((y_ship + 30) >= bottomSide))
        {
            collision = true; 
        }
        return collision;
    }

    this.endOfFlight = function() {
        let leftSide = this.x - 10;
        let wall = false;

        if (leftSide < 0)
        {
            wall = true;
        }
        return wall;
    }
}

function createStarsArray() {
    starsArray.push(new createStar());
    howManyCreatedStars++;
}

function createAsteroid() {
    this.newAsteroid = document.createElement('div');
    this.newAsteroid.setAttribute("class", "asteroids");
    this.newAsteroid.id = "asteroid" + howManyCreatedAsteroids;
    this.newAsteroid.style.top = (Math.floor(Math.random() * (max - min) + min)) + "px";
    this.newAsteroid.style.animationDuration = asteroidsAnimationDuration + 's';
    this.x = 0;
    this.y =  this.newAsteroid.style.top;
    galaxy.appendChild(this.newAsteroid);

    this.newPosition = function() {
        let elementCords = getOffset(this.newAsteroid);
        this.x = elementCords.left;
        this.y = elementCords.top;
    }

    this.collisionDetection = function(x_ship, y_ship) {
        let leftSide = this.x - 20;
        let rightSide = this.x + 25;
        let topSide = this.y + 25;
        let bottomSide = this.y + 10;
        let collision  = false;
        
        if (((x_ship + 10) >= leftSide) && ((x_ship - 30) <= rightSide) && ((y_ship - 40) <= topSide) && ((y_ship + 30) >= bottomSide))
        {
            collision = true; 
        }
        return collision;
    }

    this.endOfFlight = function() {
        let leftSide = this.x - 10;
        let wall = false;

        if (leftSide < 0)
        {
            wall = true;
        }
        return wall;
    }
}

function createAsteroidsArray() {
    asteroidsArray.push(new createAsteroid());
    howManyCreatedAsteroids++;
}

function createHeart() {
    this.newHeart = document.createElement('div');
    this.newHeart.setAttribute("class", "heart");
    this.newHeart.id = "heart" + howManyCreatedHearts;
    healthBar.appendChild(this.newHeart);
}

function createHeartsArray(howManyHearts) {      
   // howManyHearts = 3;  // Delete this in the future and insert a parameter to the function
    for (let i = 0; i < howManyHearts; i++)
    {
        heartsArray.push(new createHeart());
        howManyCreatedHearts++;
    }
}

function updateGameState() {
    updatingGameStateInterval = requestAnimationFrame(updateGameState);
    // UPDATING STARS POSITION AND COLLISION
    for (let i = 0; i < starsArray.length; i++)
    {
        let element = document.getElementById(starsArray[i].newStar.id);
        starsArray[i].newPosition();
        if (starsArray[i].endOfFlight() == true)
        {
            element.remove();
            starsArray.splice(i, 1);
            return;
        }

        if (starsArray[i].collisionDetection(x_ship, y_ship) == true)
        {
            // Delete array and div element
            element.remove();
            starsArray.splice(i, 1);
            // Add point
            collectAudio.play();
            howManyPoints++;
            document.getElementById("counter").innerHTML = "Points: " + howManyPoints;
            return;
        }
    }
    // UPDATING ASTEROIDS POSITION AND COLLISION
    for (let i = 0; i < asteroidsArray.length; i++)
    {
        let element = document.getElementById(asteroidsArray[i].newAsteroid.id);
        asteroidsArray[i].newPosition();
        if (asteroidsArray[i].endOfFlight() == true)
        {
            element.remove();
            asteroidsArray.splice(i, 1);
            return;
        }

        if (asteroidsArray[i].collisionDetection(x_ship, y_ship) == true)
        {
            let heartElement = document.getElementById(heartsArray[heartsCount].newHeart.id);
            // Delete array and div element
            element.remove();
            asteroidsArray.splice(i, 1);
            // Lose HP
            heartElement.remove();
            heartsArray.pop();
            heartsCount--;
            hitAudio.play()
            return;
        }

        if (heartsCount < 0)
        {
            endOfGame();
        }
    }
} 

function endOfGame() {
    for (let i = 0; i < starsArray.length; i++)
    {
        let element = document.getElementById(starsArray[i].newStar.id);
        element.style.animationPlayState = "paused";
        element.remove();
    }

    for (let i = 0; i < asteroidsArray.length; i++)
    {
        let element = document.getElementById(asteroidsArray[i].newAsteroid.id);
        element.style.animationPlayState = "paused";
        element.remove();
    }
    clearInterval(starsInterval);
    clearInterval(asteroidsInterval);
    cancelAnimationFrame(updatingGameStateInterval);
    gameAudio.pause();
    ship.style.display = "none";
    document.getElementById("main_body").style.animationPlayState = "paused";
    document.getElementById("gameover").style.display = "flex";
    document.getElementById("gameover").style.animationPlayState = "running";
    losingAudio.play();
    starsArray = [];
    asteroidsArray = [];
    heartsArray = [];
    gameoverDisplayed = true;
    ableToPause = false;
    // ---- SAVE USER'S POINTS ----
    savedPoints = parseInt(localStorage.getItem("points")) + howManyPoints;
    localStorage.setItem("points", savedPoints);
}

function displayMenu() {
    gameoverDisplayed = false;

    document.getElementById("gameover").style.display = "none";
    document.getElementById("black_top").style.display = "none";
    document.getElementById("black_bottom").style.display = "none";
    document.getElementById("menu").style.display = "block";
    //document.getElementById("main_html").style.cursor = 'url("../jpg/cursor.png")';
}

function easyMode() {
    clickAudio.play();
    creatingStarIntervalTime = 1000;
    creatingAsteroidsIntervalTime = 750;
    starAnimationDuration = 9;
    asteroidsAnimationDuration = 8;
    howManyHearts = 3;
    difficultyLevel = "Easy";
    document.getElementById("difficultyLevel").innerHTML = "Difficulty level: " + difficultyLevel;
}

function normalMode() {
    clickAudio.play();
    creatingStarIntervalTime = 750;
    starAnimationDuration = 5;
    asteroidsAnimationDuration = 4;
    howManyHearts = 2;
    difficultyLevel = "Medium";
    document.getElementById("difficultyLevel").innerHTML = "Difficulty level: " + difficultyLevel;
}

function hardMode() {
    clickAudio.play();
    creatingStarIntervalTime = 1000;
    creatingAsteroidsIntervalTime = 300;
    starAnimationDuration = 3;
    asteroidsAnimationDuration = 2;
    howManyHearts = 1;
    difficultyLevel = "Hard";
    document.getElementById("difficultyLevel").innerHTML = "Difficulty level: " + difficultyLevel;
}

function getOffset(element) {
    let _x = 0;
    let _y = 0;
    while(element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
          _x += element.offsetLeft - element.scrollLeft;
          _y += element.offsetTop - element.scrollTop;
          element = element.offsetParent;
    }
    return { top: _y, left: _x };
}
// -----------------------------------

// ---- AUDIO FUNCTIONS ----
function pokazsklep() {
    clickAudio.play()
    document.getElementById("sklep").style.display = "block";
    document.getElementById("menu").style.display = "none";
    document.getElementById("coins").innerHTML = localStorage.getItem("points");
}

function pokazUstawienia() {
    clickAudio.play()
    document.getElementById("ustawienia").style.display = "block";
    document.getElementById("menu").style.display = "none";
}

function powrot() {
    clickAudio.play()
    document.getElementById("sklep").style.display = "none";
    document.getElementById("ustawienia").style.display = "none";
    document.getElementById("instrukcja").style.display = "none";
    document.getElementById("menu").style.display = "block";
}

function pokazInstrukcje() {
    clickAudio.play()
    document.getElementById("instrukcja").style.display = "block";
    document.getElementById("menu").style.display = "none";
}
// -------------------------
// SHOP
function displayHelper() {
    document.getElementById("warning").style.display = "none";
}

function zakup1() {
    const price = document.getElementById("price1").innerHTML;
    if ((localStorage.getItem("points") - price) < 0)
    {
        document.getElementById("warning").style.display = "block";
        document.getElementById("warning").style.animationPlayState = "running";
        hoverAudio.play();
        setTimeout(displayHelper, 1500);

    }
    else
    {
        // ---- CALCULATE USER'S POINTS ----
        buyAudio.play();
        savedPoints = parseInt(localStorage.getItem("points")) - price;
        localStorage.setItem("points", savedPoints);
        document.getElementById("coins").innerHTML = localStorage.getItem("points");
        $(".pointer").css("background-image", 'url(jpg/Statki/zestaw2/MStatek_1.png');
        // ---- SAVE BOUGHT SHIP TO LOCAL STORAGE
        localStorage.setItem("ship", 'url(jpg/Statki/zestaw2/MStatek_1.png');
    }
    
}

function zakup2() {
    const price = document.getElementById("price2").innerHTML;
    if ((localStorage.getItem("points") - price) < 0)
    {
        document.getElementById("warning").style.display = "block";
        document.getElementById("warning").style.animationPlayState = "running";
        hoverAudio.play();
        setTimeout(displayHelper, 1500);
    }
    else
    {
        // ---- CALCULATE USER'S POINTS ----
        buyAudio.play();
        savedPoints = parseInt(localStorage.getItem("points")) - price;
        localStorage.setItem("points", savedPoints);
        document.getElementById("coins").innerHTML = localStorage.getItem("points");
        $(".pointer").css("background-image", 'url(jpg/Statki/zestaw2/MStatek_2.png');
        // ---- SAVE BOUGHT SHIP TO LOCAL STORAGE
        localStorage.setItem("ship", 'url(jpg/Statki/zestaw2/MStatek_2.png');
    }
}

function zakup3() {
    const price = document.getElementById("price3").innerHTML;
    if ((localStorage.getItem("points") - price) < 0)
    {
        document.getElementById("warning").style.display = "block";
        document.getElementById("warning").style.animationPlayState = "running";
        hoverAudio.play();
        setTimeout(displayHelper, 1500);
    }
    else
    {
        // ---- CALCULATE USER'S POINTS ----
        buyAudio.play();
        savedPoints = parseInt(localStorage.getItem("points")) - price;
        localStorage.setItem("points", savedPoints);
        document.getElementById("coins").innerHTML = localStorage.getItem("points");
        $(".pointer").css("background-image", 'url(jpg/Statki/zestaw2/MStatek_3.png');
        // ---- SAVE BOUGHT SHIP TO LOCAL STORAGE
        localStorage.setItem("ship", 'url(jpg/Statki/zestaw2/MStatek_3.png');
    } 
}

function zakup4() {
    const price = document.getElementById("price4").innerHTML;
    if ((localStorage.getItem("points") - price) < 0)
    {
        document.getElementById("warning").style.display = "block";
        document.getElementById("warning").style.animationPlayState = "running";
        hoverAudio.play();
        setTimeout(displayHelper, 1500);
    }
    else
    {
        // ---- CALCULATE USER'S POINTS ----
        buyAudio.play();
        savedPoints = parseInt(localStorage.getItem("points")) - price;
        localStorage.setItem("points", savedPoints);
        document.getElementById("coins").innerHTML = localStorage.getItem("points");
        $(".pointer").css("background-image", 'url(jpg/Statki/zestaw2/MStatek_4.png');
        // ---- SAVE BOUGHT SHIP TO LOCAL STORAGE
        localStorage.setItem("ship", 'url(jpg/Statki/zestaw2/MStatek_4.png');
    }
}

function zakup5() {
    const price = document.getElementById("price5").innerHTML;
    if ((localStorage.getItem("points") - price) < 0)
    {
        document.getElementById("warning").style.display = "block";
        document.getElementById("warning").style.animationPlayState = "running";
        hoverAudio.play();
        setTimeout(displayHelper, 1500);
    }
    else
    {
        // ---- CALCULATE USER'S POINTS ----
        buyAudio.play();
        savedPoints = parseInt(localStorage.getItem("points")) - price;
        localStorage.setItem("points", savedPoints);
        document.getElementById("coins").innerHTML = localStorage.getItem("points");
        $(".pointer").css("background-image", 'url(jpg/Statki/zestaw2/MStatek_5.png');
        // ---- SAVE BOUGHT SHIP TO LOCAL STORAGE
        localStorage.setItem("ship", 'url(jpg/Statki/zestaw2/MStatek_5.png');
    }
}
function playHover(){
    hoverAudio.play();
}