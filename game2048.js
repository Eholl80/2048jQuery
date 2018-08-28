(function($) {
    $.fn.game2048 = function() {

        // SCORE
        var score;
 
        // BESTSCORE COOKIE
        var bestScoreCookie = Cookies.get('bestScore');
        
        function fbestScore() {
            if (bestScoreCookie != "" && bestScoreCookie != null) {
                var bestScore = bestScoreCookie;
                $('.bestScore').html(parseInt(bestScoreCookie)); 
            } else {
                var bestScore = 0;
                Cookies.set('bestScore', bestScore, { expires: 7 });
                $('.bestScore').html(bestScore); 
            }
            return bestScore;
        }       

        // GENERATION DU HTML
        function generate_map() {
            var i = 0;        
            var item = 1;     
            
            var c1 = $('<div class="grid"></div>');
                
            while (i < 4) {
                var c2 =  $('<div class="row"></div>').appendTo(c1);
                var j = 0;
                while (j < 4) {
                    var c3 = $('<div class="box empty" item="' + item + '" num="0"></div>').appendTo(c2);   
                    j++;
                    item++;
                }
                i++;
            }         
            return c1;
        }

       
        // INITIALISATION DES CASES
        function start(nbr) {
            var i = 0;

            while (i < nbr) {
                // 7/10 CHANCE pour 2, 3/10 pour 4
                var randomNumber = Math.floor(Math.random() * 10); 
                var newNumber = 0;
                if ((randomNumber > 0) && (randomNumber < 7)) 
                    newNumber = 2;
                else 
                    newNumber = 4;

                // NBR DE CASES EMPTY + ASSIGNATION ALEATOIRE DES PREMIERES CASES
                var nbrEmpty = $('.empty').length;
                var minNumber = nbrEmpty / nbrEmpty; 
                var maxNumber = nbrEmpty; 
                var emptyPlace = Math.floor(Math.random() * (maxNumber) + minNumber - 1); 
                var newDiv = "<div class='inner'>" + newNumber + "</div>";
                $('.box').removeClass('newCase');
                $('div.empty:eq(' + emptyPlace + ')')
                    .addClass('newCase num' + newNumber)
                    .attr("num", newNumber)
                    .removeClass('empty')
                    .html(newDiv);
                i++;
            }
        }
        // ANIMATION BEFORE GAME
        function beforeGame() {
            var nbrEmpty = $('.empty').length;
            var minNumber = nbrEmpty / nbrEmpty; 
            var maxNumber = nbrEmpty; 
            var emptyPlace = Math.floor(Math.random() * (maxNumber) + minNumber - 1); 
            var newDiv = "<div class='inner wait'>2048</div>";
            $('div.empty:eq(' + emptyPlace + ')')
                .addClass('num2048 intro')
                .attr("num", "2048")
                .removeClass('empty')
                .html(newDiv)
                .effect("highlight", "slow");                               
        }

        // MOUVEMENT DES CASES EN FONCTION DES KEYDOWN
        function moveTo(side) {

            var addNewNumber = false;
            var by4 = 0;

            if (side === "up") {
                var minUp = 1;
                var maxUp = 13;var maxUp2 = 14;var maxUp3 = 15;var maxUp4 = 16;
                var maxUp5 = 20;var maxUp6 = 21; var maxUp7 = 22;var maxUp8 = 23;
                var maxUp9 = 24;var maxUp10 = 25;var maxUp11 = 26;var maxUp12 = 27;
            } else if (side === "down") {
                var minUp = 16;
                var maxUp = 4; var maxUp2 = 3;var maxUp3 = 2;var maxUp4 = 1;
                var maxUp5 = -2;var maxUp6 = -3;var maxUp7 = -4;var maxUp8 = -5;
                var maxUp9 = -6;var maxUp10 = -7;var maxUp11 = -8;var maxUp12 = -9;
            } else if (side === "left") {
                var minUp = 1;
                var maxUp = 4; var maxUp2 = 8;var maxUp3 = 12;var maxUp4 = 16;
                var maxUp5 = 20;var maxUp6 = 21;var maxUp7 = 22;var maxUp8 = 23;
                var maxUp9 = 24;var maxUp10 = 25;var maxUp11 = 26;var maxUp12 = 27;
            } else if (side === "right") {
                var minUp = 16;
                var maxUp = 1; var maxUp2 = 5;var maxUp3 = 9;var maxUp4 = 13;
                var maxUp5 = -2;var maxUp6 = -3;var maxUp7 = -4;var maxUp8 = -5;
                var maxUp9 = -6;var maxUp10 = -7;var maxUp11 = -8;var maxUp12 = -9;
            }

            // BOUCLE 4 COLUMNS/ROWS
            while (by4 < 4) {
                
                var repeat = 0;
                var repeatAddition = 0;

                // ON BOUCLE 4 FOIS (NBR DE CASES HAUTEUR)
                while (repeat < 3) {   
                      
                    var i = minUp;

                    // VERIFIE L'ETAT DE LA CASE SUIVANTE ET ACTION EN FONCTION
                    while ( (i !== maxUp) && (i !== maxUp2) && (i !== maxUp3) && (i !== maxUp4)
                            && (i !== maxUp5) && (i !== maxUp6) && (i !== maxUp7) && (i !== maxUp8)
                            && (i !== maxUp9) && (i !== maxUp10) && (i !== maxUp11) && (i !== maxUp12)){
                        //console.log('minUP ' + minUp);
                        //console.log('i ' + i);
                        if (side === "up") 
                            var iNext = i + 4;
                        else if (side === "down") 
                            var iNext = i - 4;
                        else if (side === "left") 
                            var iNext = i + 1;
                        else if (side === "right") 
                            var iNext = i - 1;

                        var currentItem = $('.box[item="'+ i +'"]');
                        var currentItemNbr = currentItem.attr("num");
                        var currentItemClass = "num" + currentItemNbr;

                        //var currentItemNumero = currentItem.attr("item");

                        var nextItem = $('.box[item="'+ iNext +'"]');
                        var nextItemNbr = nextItem.attr("num");
                        var nextItemClass = "num" + nextItemNbr;

                        var newNumber = parseInt(currentItemNbr) + parseInt(nextItemNbr);
                        var newDivAddition = "<div class='inner'>" + newNumber + "</div>";
                        var newDivMovement = "<div class='inner'>" + nextItemNbr + "</div>";

                        // CASE PLEINE
                        if ( currentItemNbr !== "0" ) {
                            // CASE SUIVANTE PLEINE
                            if (nextItemNbr !== "0") {
                                // NOMBRE IDENTIQUE COTE A COTE
                                if (currentItemNbr === nextItemNbr) {
                                    // ADDITION POSSIBLE SI RIEN AU PREMIER PASSAGE OU 1er PASSAGE MAIS QUE 2 FOIS
                                    if (((repeat !== 0) && (repeatAddition === 0)) 
                                        || ((repeat === 0) && (repeatAddition < 2))) {
                                        currentItem.attr("num", newNumber)
                                            .removeClass(currentItemClass)
                                            .removeClass('empty')
                                            .addClass('num' + newNumber)
                                            .html(newDivAddition);
                                        nextItem.attr("num", "0")
                                            .removeClass(nextItemClass)
                                            .addClass('empty').html('');                                 
                                                   
                                        // SCORE
                                        if (!isNaN(newNumber)) {
                                            score += parseInt(newNumber);
                                        }
                                        $('.score').html(score);

                                        // ON AVANCE D'UNE CASE
                                        if (side === "up") 
                                            i += 4;
                                        else if (side === "down") 
                                            i -= 4;
                                        else if (side === "left") 
                                            i += 1;
                                        else if (side === "right") 
                                            i -= 1;  
                                        // ON INTERDIT NOUVELLE ADDITION
                                        repeatAddition += 1;
                                        // AJOUTER UNE NOUVELLE CASE
                                        addNewNumber = true;
                                    }
                                }   
                            }
                        // CASE VIDE  
                        } else {
                            // CASE SUIVANTE PLEINE
                            if (nextItemNbr !== "0") {
                                // MOUVEMENT
                                currentItem.attr("num", nextItemNbr)
                                    .removeClass(currentItemClass)
                                    .removeClass('empty')
                                    .addClass('num' + nextItemNbr)
                                    .html(newDivMovement);
                                nextItem.attr("num", "0")
                                    .removeClass(nextItemClass)
                                    .addClass('empty').html('');
                                // AJOUTER UNE NOUVELLE CASE
                                addNewNumber = true;
                            }
                        }
                        if (side === "up") 
                            i += 4;
                        else if (side === "down") 
                            i -= 4;
                        else if (side === "left") 
                            i += 1;
                        else if (side === "right") 
                            i -= 1;   
                    }
                    //console.log('FIN COLONNE/ROW UNE FOIS');
                    repeat++;
                } // fin repeat 
                //console.log('FIN COLONNE/ROW ENTIERE UNE FOIS');
                by4++;
                if (side === "up") 
                    minUp++;
                else if (side === "down") 
                    minUp--;
                 else if (side === "left") 
                    minUp += 4;
                else if (side === "right") 
                    minUp -= 4;         
            } // fin by4  
            //console.log('FIN KEY');

            if (addNewNumber){
                start(1);
            }       
        } // fin moveTo

        // ACTION QD KEYPRESS
        function keydown() {
            var alreadyGO = false;  
            blink('.play', stop);
            var retUndo;
            var undoOnce = true;

            $(document).on('keydown', function(e){

                retUndo = undo();
                console.log(retUndo);

                if (alreadyGO === false) {  
                    if (e.keyCode === 38) {
                        moveTo("up");
                    } else if (e.keyCode === 39) {
                        moveTo("right");
                    } else if (e.keyCode === 40) {
                        moveTo("down");
                    } else if (e.keyCode === 37) {
                        moveTo("left");
                    }
                }

                if (undoOnce === true) {
                    $('.undo').removeClass('inactive').addClass('actif');
                    $(document).on('click','.undo', function(){ 
                        console.log(retUndo);
                        makeUndo(retUndo);
                        $('.undo').removeClass('actif').addClass('inactive');
                        undoOnce === false;
                    });      
                }
                

                // GAME WIN ANIMATION
                var retWin = gameWin();
                if ((retWin) && (alreadyGO === false)) {
                    $('.box:not(.num2048)').hide();
                    $(".num2048").children().animate({
                        fontSize: "128px"
                    }, 500).prepend('YA HEY<br />');

                    // SAVE BEST SCORE
                    bestScore = fbestScore();
                    if (bestScore < score) {
                        bestScore = score;
                        // MODIFY COOKIE
                        Cookies.set('bestScore', bestScore, { expires: 7 });
                        $('.bestScore').html(bestScore); 
                    }
                }

                // GAME OVER ANIMATION
                var retGame = gameOver();
                if ((retGame) && (alreadyGO === false)) {
                    $('.gameOver').removeClass('hide').addClass('show');  
                    $('.gameOver').animate({ top: '206px' }, 1000, 'easeOutBounce', function () {})
                    blink('.play');
                    
                    // SAVE BEST SCORE
                    bestScore = fbestScore();
                    if (bestScore < score) {
                        bestScore = score;
                        // MODIFY COOKIE
                        Cookies.set('bestScore', bestScore, { expires: 7 });
                        $('.bestScore').html(bestScore); 
                    }                                      
                    alreadyGO = true;  
                }    
            });
        }

        // FONCTION GAMEWIN
        function gameWin() {
            var winClass = $('.box').hasClass('num2048'); 
            return winClass;
        }

        // FONCTION GAME OVER
        function gameOver() {
            
            var nbrEmpty = $('.empty').length;
            var i = 1;
            if (nbrEmpty === 0) {
                while ( i < 17 ) {   

                    var currentItem = $('.box[item="'+ i +'"]');
                    var currentItemNbr = parseInt(currentItem.attr("num"));
                    var currentItemNum = parseInt(currentItem.attr("item"));

                    var iR = i + 1; var nextIr = $('.box[item="'+ iR +'"]');
                    var iD = i + 4; var nextId = $('.box[item="'+ iD +'"]');
                    var iL = i - 1; var nextIl = $('.box[item="'+ iL +'"]');
                    var iU = i - 4; var nextIu = $('.box[item="'+ iU +'"]');
                    var nextR = parseInt(nextIr.attr("num"));var nextD = parseInt(nextId.attr("num"));
                    var nextL = parseInt(nextIl.attr("num"));var nextU = parseInt(nextIu.attr("num"));

                    // CHECK DES VALEURS AROUND
                    if ((currentItemNum === 4) || (currentItemNum === 8) || (currentItemNum === 12)) {
                        if ((currentItemNbr === nextD) || (currentItemNbr === nextL) || (currentItemNbr === nextU)) {
                            return false;
                        }
                    } else if ((currentItemNum === 5) || (currentItemNum === 9) || (currentItemNum === 13)) {
                        if ((currentItemNbr === nextD) || (currentItemNbr === nextR) || (currentItemNbr === nextU)) {
                            return false;
                        }
                    } else { 
                        if ( (currentItemNbr === nextR) || (currentItemNbr === nextD) ||
                        (currentItemNbr === nextL) || (currentItemNbr === nextU) ) {
                            return false;
                        }       
                    }        
                    i++;
                }
                return true;
            }     
        }

        // BLINK BTN START/RESTART
        function blink(selector, stop=null){
            if (stop) {
                $(selector).stop().animate();  
                $(selector).stop().delay(); 
                $(selector).css('opacity', '1');
                $(selector).show();
            } else {
                $(selector).animate({opacity:0}, 50, "linear", function(){
                    $(this).delay(800);
                    $(this).animate({opacity:1}, 50, function(){
                        blink(this);
                    });
                    $(this).delay(500);         
                });
            }
        }

        // FUNCTION UNDO
        function undo() {
            var undoArray = [];
            var i = 1;
            var retNum;
            while( i < 17) {
                retNum = $('.box[item="'+ i +'"]').attr('num');
                undoArray.push(retNum);
                i++;
            }
            return undoArray;
        }

        // BOUTON UNDO
        function makeUndo(retUndo) {            
            //console.log(retUndo);
            $('.box').show().removeClass().addClass('box empty');
            $('.gameOver').removeClass('show').addClass('hide'); 
            $('.inner').remove(); 
            
            var item;
            $.each( retUndo, function( key, value ) {
                item = key + 1;
                //console.log(item);
                if (value !== "0") {
                    $('.box[item="'+ item +'"]').addClass('num' + value).attr(value);
                    $('.box[item="'+ item +'"]').html("<div class='inner'>" + value + "</div>");
                }
            });
                //$('.box[item="'+ i +'"]').attr(retUndo[i]);
                //$('.box[item="'+ i +'"]').html("<div class='inner'>" + retUndo[i] + "</div>");
         
        }
        

        // BOUTON LANCEMENT PARTIE
        function playReplay() {
            fbestScore();
            blink('.play');
            /*
            beforeGame()
            var introAnim = setInterval(function(){
                    beforeGame();
                },3000)
            ;
            */
            $(document).on('click','.play', function(){  
                score = 0;  
                //clearInterval(introAnim);
                $('.box').show().removeClass().addClass('box empty').attr("num", "0");
                $('.gameOver').removeClass('show').addClass('hide'); 
                $('.inner').remove(); 
                $('.score').html(score); 
                start(2);    
                keydown(); 
            }); 
        }
        
        // INSERT LE TEMPLATE/HTML DANS L'ELEMENT SPECIFIE PAR L'UTILISATEUR
        $(this).append('<div class="header"><div class="gameOver hide">GAME OVER</div><div class="title box2">2048</div><div id="score" class="box2"><span>SCORE</span><span class="score">0</span></div><div id="bestScore" class="box2"><span>BEST</span><span class="bestScore">0</span></div><button class="play box2">START/RESTART</button><button class="undo inactive box2">UNDO</button></div>');
        $(this).append(generate_map());
        // ON LANCE LA PARTIE !!! 
        playReplay();

    };

})($);