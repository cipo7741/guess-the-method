'use strict';

var loadJson = function(url){
  return new Promise(function(resolve, reject) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, true);
    xmlhttp.onload = function() {
      if (xmlhttp.status === 200) {
        resolve(JSON.parse(xmlhttp.responseText));
      }
    }
    xmlhttp.onerror = function() {
      reject(Error('Data didn\'t load successfully; error code:' + request.statusText));
    }
    xmlhttp.send();
  });
}

var Game = function(jsonData){
    var points = 0;
    var rounds = -1;
    return {
        countPoint:function() {
            points += 1;
        },
        nextRound:function() {
            var method = jsonData[randomSeed(jsonData.length)];
            rounds += 1;
            var quest = new Quest(method, function() {
                countPoint();
                nextRound();
            }, function() {
                nextRound();
            });
            return quest;
        },
        getPoints:function() {
            return points;
        },
        getRounds:function() {
            return rounds;
        }
    }

};

var Quest = function(method, successCallback, failureCallback){
    var numTries = 3;
    View.init(method);

    var check = function(input, hintFlag) {
        if (input === method.name) {
            successCallback();
            return 'Correct';
        } else if (numTries < 1) {
            failureCallback();
            return 'It was ' + method + '!\nMaybe this one?';
        } else if (hintFlag) {
            numTries -= 1;
            return 'Come on, now you\'ll know!';
        } else {
            numTries -= 1;
            return 'Wrong, try again.';
        }
    };

    return {
        submit:function(input) {
            return check(input, false);
            timeoutResult();
            document.getElementById('count').innerHTML = numPoints + '/' + (numQuests - 1);
            document.getElementById('result').innerHTML = text;
        },
        ask:function() {
            return check(input, true);
            // TODO: substring!!!
            document.getElementById('guessInput').value = method.name.substring(0, Math.floor(method.name.length / 2));
            
            timeoutResult();
            document.getElementById('count').innerHTML = numPoints + '/' + (numQuests - 1);
            document.getElementById('result').innerHTML = text;
        }
    }
};

var View = {
    init:function(method) {
        document.getElementById('description').innerHTML = method.desc;
        var guessInput = document.createElement('input');
        guessInput.setAttribute('type', 'text');
        guessInput.setAttribute('id', 'guessInput');
        guessInput.setAttribute('class', 'focus');
        guessInput.setAttribute('maxlength', method.name.length);
        guessInput.setAttribute('style', 'width: calc(14px *' + method.name.length + ');');
        guessInput = new XMLSerializer().serializeToString(guessInput)
        document.getElementById('guess').innerHTML = method.type + ' ' + javaPackage + '.'
        document.getElementById('guess').innerHTML += guessInput + '(' + method.args + ')';
        document.querySelector('input.focus').focus();

        // ###################   Controller  ##################################
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13) check();
        });
        document.querySelector('input.button').addEventListener('click', hint);
    },
    showHint:function() {
        document.getElementById('guessInput').value = method.name.substring(0, Math.floor(method.name.length / 2));
        
        timeoutResult();
        document.getElementById('count').innerHTML = numPoints + '/' + (numQuests - 1);
        document.getElementById('result').innerHTML = 'Come on, now you\'ll know!';
    },
    showResult:function() {
        
    }
};

var url = 'data/java/lang/Number/Double.json';
var javaPackage = url.substring(5, url.length - 5).split('/').join('.')

var randomSeed = function(x) {
    return Math.floor((Math.random() * x));
}

var timeoutResult = function() {
    setTimeout('blankResult()', 5000);
}

var blankResult = function() {
    return document.getElementById('result').innerHTML = ' ';
}







// ############## controller ################################################################



// ############## run #######################################################################

loadJson(url).then(function(jsonData) {
    document.addEventListener('DOMContentLoaded', function() {
            var game = new Game(jsonData);
            var quest = game.nextRound();
            if(quest.successful()) 

        }, false);
    }, function(Error){
        console.log(Error)
});
