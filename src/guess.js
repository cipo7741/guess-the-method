'use strict'

var currentClass = 'File';
var options = ['io', 'lang']
var wrongResultColor = '#FFC4C4';
var rightResultColor = '#BAFFBD';
var resourcesPath = 'data/java';
var resourcesExtension = '.json';

var packageInfoPath = 'data/java/test-java.json';
var jsonPackageInfo;

numTries = 3;

var correctAnswer, jsonData;
var numPoints, numQuests, numTries;

var loadGuessesJson = function(currentPackageIndex){
    var packagesDiv = document.getElementById('packages').children;
    console.log(packagesDiv.length)
    for (var i = 0; i < packagesDiv.length; i++) {
        console.log(packagesDiv[i]);
        if(packagesDiv[i].innerHTML.includes(options[currentPackageIndex])){
            console.log(packagesDiv[i])
            packagesDiv[i].setAttribute('style', 'background: yellow;')
        }
    }
    return new Promise(
        function(resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            var path = resourcesPath + '/' + options[currentPackageIndex]+ '/' + currentClass + resourcesExtension;
            console.log(path);
            xmlhttp.open('GET', path, true);
            xmlhttp.onload = function() {
                if (xmlhttp.status === 200) {
                    numPoints = 0;
                    numQuests = 0;
                    jsonData = JSON.parse(xmlhttp.responseText);
                    console.log(jsonData.length);
                    newQuest(jsonData);
                } else {
                    console.log(xmlhttp.status);
                }
            }
            xmlhttp.onerror = function() {
                Error('Data didn\'t load successfully; error code:' + request.statusText);
            }
            xmlhttp.send();
        }
        );
}

var loadPackageInfoJson = function(){
    return new Promise(
        function(resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', packageInfoPath, true);
            xmlhttp.onload = function() {
                if (xmlhttp.status === 200) {
                    jsonData = JSON.parse(xmlhttp.responseText);
                    console.log(jsonData.length);
                    loadSidebar(jsonData);
                    loadGuessesJson(0);
                }
            }
            xmlhttp.onerror = function() {
                Error('Data didn\'t load successfully; error code:' + request.statusText);
            }
            xmlhttp.send();
        }
        );
}

loadPackageInfoJson();

var loadSidebar = function(jsonData) {
    console.log(jsonData.packages);
    loadPackages(jsonData.packages);
}

var loadPackages = function(jsonPackagesArray) {
    for (var i = 0; i < jsonPackagesArray.length; i++) {
        options.push(jsonPackagesArray[i].name);
        var pText = document.createElement('p');
        pText.innerHTML = jsonPackagesArray[i].name;
        pText.innerHTML += '  0/' + jsonPackagesArray[i].classes.length;        
        var pTextXml = new XMLSerializer().serializeToString(pText);
        document.getElementById('packages').innerHTML += pTextXml;
        //var classesDivXml = loadClasses(jsonPackagesArray[i].classes);
        //document.getElementById('packages').innerHTML += classesDivXml;
    }
}

var loadClasses = function(jsonClassesArray) {
    var classesDiv = document.createElement('div');
    classesDiv.setAttribute('class','sub-checkboxes');

    for (var i = 0; i < jsonClassesArray.length; i++) {
        var pText = document.createElement('p');
        pText.innerHTML = jsonClassesArray[i];
        var pTextXml = new XMLSerializer().serializeToString(pText);
    }
    return new XMLSerializer().serializeToString(classesDiv);
}


var randomSeed = function(x) {
    return Math.floor((Math.random() * x));
}

var newQuest = function(jsonArray) {
    console.log(jsonArray.length);
    numQuests += 1;
    var currentQuestIndex = randomSeed(jsonArray.length);
    var currentQuest = jsonArray[currentQuestIndex];
    buildQuest(currentQuest);
    correctAnswer = currentQuest.name;
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
    guessClassSelect.setAttribute('name', 'package');
    guessClassSelect.setAttribute('size', '1');
    guessClassSelect.setAttribute('onchange', 'selectPackage()');
    for (var i = 0; i < options.length; i++) {
        var guessClassSelectOption = document.createElement('option');
        guessClassSelectOption.innerHTML = options[i];
        guessClassSelectOption.setAttribute('value',i);
        var guessClassSelectOptionXml = new XMLSerializer().serializeToString(guessClassSelectOption);
        guessClassSelect.innerHTML += guessClassSelectOptionXml;

    }
    var guessClassSelectXml = new XMLSerializer().serializeToString(guessClassSelect);
    document.getElementById('package').innerHTML = 'java.'
    document.getElementById('package').innerHTML += guessClassSelectXml + '.';
    document.getElementById('package').innerHTML += currentClass;
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

var selectPackage = function(){
    var selectBox = document.getElementById("guessDropdown");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    loadGuessesJson(selectedValue);
}

var blankResult = function() {
    document.getElementById('flag').innerHTML = ' ';
    document.getElementById('flag').style.background = 'white';
}

var isCorrect = function() {
    return document.getElementById('guessInput').value === correctAnswer;
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
        answer = 'It was<i> ' + correctAnswer + '</i>!\nMaybe this one?';
        console.log(correctAnswer);
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
        document.getElementById('guessInput').value = correctAnswer.substring(0, Math.floor(correctAnswer.length / 2));
    }
    printResult(text, answer, color);
};

var printResult = function(text, answer, color) {
    document.getElementById('guessInput').value == correctAnswer;
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
