'use strict'

var currentPackageArray = ['java', 'lang', 'Number', 'Double'];
var wrongResultColor = '#FFC4C4';
var rightResultColor = '#BAFFBD';
var resourcesPath = 'data';
var resourcesExtension = '.json';

var method, jsonData;
var numPoints, numQuests, numTries;

// 'java/lang/Number/Double' -> ['data', 'java', 'lang', 'Number', 'Double']
var getPackageArray = function(path) {
    return path.split('/').join('.')
}

// (['data', 'java', 'lang', 'Number', 'Double'], '/') -> 'data/java/lang/Number'
var getBasePackageString = function(packageArray, seperator) {
    return packageArray.splice(0,packageArray.length-1).join(seperator);
}

// ['data', 'java', 'lang', 'Number', 'Double'] -> 'Double'
var getClassString = function(packageArray) {
    return packageArray[packageArray.length-1]
}


var loadJson = function(packageArray){
    return new Promise(
        function(resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            var path = resourcesPath + '/' + getBasePackageString(packageArray, '/') + '/' + getClassString(packageArray) + resourcesExtension;
            xmlhttp.open('GET', path, true);
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
        }
        );
}

loadJson(currentPackageArray)

var randomSeed = function(x) {
    return Math.floor((Math.random() * x));
}

var newQuest = function(arr) {
    //document.getElementById('result').setAttribute('background', '#fff');
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
    var guessInputXml = new XMLSerializer().serializeToString(guessInput);
        
    // <select name='top5' size='5'>
    //     <option>Heino</option>
    //     <option>Michael Jackson</option>
    //     <option>Tom Waits</option>
    //     <option>Nina Hagen</option>
    //     <option>Marianne Rosenberg</option>
    //   </select>
    var guessClassSelect = document.createElement('select');
    guessClassSelect.setAttribute('name', 'classes');
    guessClassSelect.setAttribute('size', '2');
    var fs = require('fs');
    var path = resourcesPath + '/' + getBasePackageString(currentPackageArray, '/') + '/' + getClassString(currentPackageArray) + resourcesExtension;
    var files = fs.readdirSync(path);
    for (var i = files.length - 1; i >= 0; i--) {
        guessClassSelect.option = getClassString(files[i]);
    }
    var guessClassSelectXml = new XMLSerializer().serializeToString(guessClassSelect)

    document.getElementById('guess').innerHTML = arr[i].type + ' ';
    document.getElementById('guess').innerHTML += javaPackageString.replace(currentClass) + '.';
    document.getElementById('guess').innerHTML += guessClassSelectXml
    document.getElementById('guess').innerHTML += guessInputXml + '(' + arr[i].args + ')';
    document.querySelector('input.focus').focus();
}

var blankResult = function() {
    document.getElementById('flag').innerHTML = ' ';
    document.getElementById('flag').style.background = 'white';
}

var isCorrect = function() {
    return document.getElementById('guessInput').value === method;
}

var check = function() {
    var text;
    var color = 'white';
    var answer = '';
    if (isCorrect()) {
        text = 'Correct';
        color = rightResultColor;
        numPoints += 1;
        newQuest(jsonData);
    } else if (numTries < 1) {
        text = 'Wrong.';
        answer = 'It was<i> ' + method + '</i>!\nMaybe this one?';
        color = wrongResultColor;
        newQuest(jsonData);
    } else {
        numTries -= 1;
        text = 'Wrong, try again.';
    }
    printResult(text, answer, color);
};

var hint = function() {
    var text;
    var color = 'white';
    var answer = '';
    if (isCorrect()) {
        text = 'Correct';
        color = rightResultColor;
        numPoints += 1;
        newQuest(jsonData);
    } else {
        numTries -= 1;
        text = 'Come on, now you\'ll know!';
        document.getElementById('guessInput').value = method.substring(0, Math.floor(method.length / 2));
    }
    printResult(text, answer, color);
};

var printResult = function(text, answer, color) {
    document.getElementById('guessInput').value == method;
    document.getElementById('count').innerHTML = numPoints + '/' + (numQuests - 1);
    document.getElementById('flag').innerHTML = text;
    document.getElementById('flag').style.background = color;
    document.getElementById('answer').innerHTML = answer;
    setTimeout('blankResult()', 5000);

}

document.addEventListener('keypress', function(e) {
    if (e.keyCode === 13) {
        check();
    }
});
