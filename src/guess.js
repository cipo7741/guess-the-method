'use strict'

var url = 'data/java/lang/Number/Double.json';
var javaPackage = url.substring(5, url.length - 5).split('/').join('.')
var method, jsonData;
var numPoints, numQuests, numTries;

var loadJson = function(url){
  return new Promise(function(resolve, reject) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, true);
    xmlhttp.onload = function() {
      if (xmlhttp.status === 200) {
        numPoints = 0;
        numQuests = 0;
        jsonData = JSON.parse(xmlhttp.responseText);
        newQuest(jsonData);
      }
    }
    xmlhttp.onerror = function() {
      Error('Data didn\'t load successfully; error code:' + request.statusText);
    }
    xmlhttp.send();
  });
}

loadJson(url)

var randomSeed = function(x) {
    return Math.floor((Math.random() * x));
}

var newQuest = function(arr) {
    numQuests += 1;
    var i = randomSeed(arr.length)
    buildQuest(arr, i);
    method = arr[i].name;
}

function buildQuest(arr, i) {
    numTries = 3;
    var elm = document.getElementById('description')
    var newone = elm.cloneNode(true);
    newone.innerHTML = arr[i].desc;
    elm.parentNode.replaceChild(newone, elm);
    var guessInput = document.createElement('input');
    guessInput.setAttribute('type', 'text');
    guessInput.setAttribute('id', 'guessInput');
    guessInput.setAttribute('class', 'focus');
    guessInput.setAttribute('maxlength', arr[i].name.length);
    guessInput.setAttribute('style', 'width: calc(15px *' + arr[i].name.length + ');');
    guessInput = new XMLSerializer().serializeToString(guessInput)
    document.getElementById('guess').innerHTML = arr[i].type + ' ' + javaPackage + '.'
    document.getElementById('guess').innerHTML += guessInput + '(' + arr[i].args + ')';
    document.querySelector('input.focus').focus();
}

var timeoutResult = function() {
    setTimeout('blankResult()', 5000);
}

var blankResult = function() {
    return document.getElementById('result').innerHTML = ' ';
}

var isCorrect = function() {
    var x;
    x = document.getElementById('guessInput').value;
    if (x === method) {
        return true;
    } else {
        document.getElementById('result').innerHTML = ' ';
        return false;
    }
}

var check = function() {
    var text;
    if (isCorrect()) {
        text = 'Correct';
        numPoints += 1;
        newQuest(jsonData);
    } else if (numTries < 1) {
        text = 'It was ' + method + '!\nMaybe this one?';
        newQuest(jsonData);
    } else {
        numTries -= 1;
        text = 'Wrong, try again.';
    }
    timeoutResult();
    document.getElementById('count').innerHTML = numPoints + '/' + (numQuests - 1);
    document.getElementById('result').innerHTML = text;
};

var hint = function() {
    var text;
    if (isCorrect()) {
        text = 'Correct';
        numPoints += 1;
        newQuest(jsonData);
    } else {
        numTries -= 1;
        text = 'Come on, now you\'ll know!';
        document.getElementById('guessInput').value = method.substring(0, Math.floor(method.length / 2));
    }
    timeoutResult();
    document.getElementById('count').innerHTML = numPoints + '/' + (numQuests - 1);
    document.getElementById('result').innerHTML = text;
};

document.addEventListener('keypress', function(e) {
    if (e.keyCode === 13 && isCorrect()) {
        check();
    } else if (e.keyCode === 13) {
        check();
    }
});
