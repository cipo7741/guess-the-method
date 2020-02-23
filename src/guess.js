'use strict'

var currentPackage = ['java', 'lang', 'Number'];
var options = ['Double', 'Integer', 'Long']
var wrongResultColor = '#FFC4C4';
var rightResultColor = '#BAFFBD';
var resourcesPath = 'data';
var resourcesExtension = '.json';

numTries = 3;

var method, jsonData;
var numPoints, numQuests, numTries;

var loadJson = function(currentClassIndex){
    return new Promise(
        function(resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            var path = resourcesPath + '/' + currentPackage.join('/') + '/' + options[currentClassIndex] + resourcesExtension;
            console.log(path);
            xmlhttp.open('GET', path, true);
            xmlhttp.onload = function() {
                if (xmlhttp.status === 200) {
                    numPoints = 0;
                    numQuests = 0;
                    jsonData = JSON.parse(xmlhttp.responseText);
                    console.log(jsonData.length);
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

loadJson(0);

var randomSeed = function(x) {
    return Math.floor((Math.random() * x));
}

var newQuest = function(jsonArray) {
    console.log(jsonArray.length);
    numQuests += 1;
    var currentQuestIndex = randomSeed(jsonArray.length);
    var currentQuest = jsonArray[currentQuestIndex];
    buildQuest(currentQuest);
    method = currentQuest;
}

var buildQuest = function(currentQuest) {
    var selectBox = document.getElementById("guessDropdown");
    if (typeof(selectBox) === 'undefined' || selectBox === null)
    {
      buildParagraphPackage();
      console.log('hi fish');
    }
    buildParagraphDescription(currentQuest);
    buildParagraphGuess(currentQuest);
}

var buildParagraphPackage = function() {
    var guessClassSelect = document.createElement('select');
    guessClassSelect.setAttribute('id', 'guessDropdown');
    guessClassSelect.setAttribute('name', 'classes');
    guessClassSelect.setAttribute('size', '1');
    guessClassSelect.setAttribute('onchange', 'selectPackageClass()');
    for (var i = 0; i < options.length; i++) {
        var guessClassSelectOption = document.createElement('option');
        guessClassSelectOption.innerHTML = options[i];
        guessClassSelectOption.setAttribute('value',i);
        var guessClassSelectOptionXml = new XMLSerializer().serializeToString(guessClassSelectOption);
        guessClassSelect.innerHTML += guessClassSelectOptionXml;

    }
    var guessClassSelectXml = new XMLSerializer().serializeToString(guessClassSelect);
    document.getElementById('package').innerHTML = currentPackage.join('.') + '.';
    document.getElementById('package').innerHTML += guessClassSelectXml;
}

var buildParagraphDescription = function(currentQuest){
    var elm = document.getElementById('description');
    var newone = elm.cloneNode(true);
    newone.innerHTML = currentQuest.desc;
    elm.parentNode.replaceChild(newone, elm);
}

var buildParagraphGuess = function(currentQuest) {
    var guessInput = document.createElement('input');
    guessInput.setAttribute('type', 'text');
    guessInput.setAttribute('id', 'guessInput');
    guessInput.setAttribute('class', 'focus');
    guessInput.setAttribute('maxlength', currentQuest.name.length);
    guessInput.setAttribute('style', 'width: calc(15px *' + currentQuest.name.length + ');');
    var guessInputXml = new XMLSerializer().serializeToString(guessInput);
    document.getElementById('guess').innerHTML = currentQuest.type + ' ';
    document.getElementById('guess').innerHTML += guessInputXml + '(' + currentQuest.args + ')';
    document.querySelector('input.focus').focus();
}

var selectPackageClass = function(){
    var selectBox = document.getElementById("guessDropdown");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    loadJson(selectedValue);
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
