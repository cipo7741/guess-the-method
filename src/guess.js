var xmlhttp = new XMLHttpRequest();
var url = "data/java/lang/Number/Double.json";
var javaPackage = url.substring(5, url.length - 5).split("/").join(".")
var method, jsonData;
var numPoints, numQuests, numTries;

script = document.createElement("script");
script.type = "text/javascript";
script.src = url + "?callback=my_callback";

function randomSeed(x) {
    return Math.floor((Math.random() * x));
}

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        numPoints = 0;
        numQuests = 0;
        jsonData = JSON.parse(xmlhttp.responseText);
        newQuest(jsonData);
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();

function newQuest(arr) {
    numQuests += 1;
    i = randomSeed(arr.length)
    buildQuest(arr, i);
    method = arr[i].name;
}

function buildQuest(arr, i) {
    numTries = 3;
    document.getElementById("description").innerHTML = arr[i].desc;
    var guessInput = document.createElement("input");
    guessInput.setAttribute('type', 'text');
    guessInput.setAttribute('id', 'guessInput');
    guessInput.setAttribute('class', 'focus');
    guessInput.setAttribute('maxlength', arr[i].name.length);
    guessInput.setAttribute('style', 'width: calc(15px *' + arr[i].name.length + ');');
    guessInput = new XMLSerializer().serializeToString(guessInput)
    document.getElementById("guess").innerHTML = arr[i].type + " " + javaPackage + "."
    document.getElementById("guess").innerHTML += guessInput + "(" + arr[i].args + ")";
    document.querySelector("input.focus").focus();
}

countPoint = function() {
    numPoints += 1;
}

timeoutResult = function() {
    setTimeout('blankResult()', 5000);
}

blankResult = function() {
    return document.getElementById("result").innerHTML = " ";
}

isCorrect = function() {
    var x;
    x = document.getElementById("guessInput").value;
    if (x === method) {
        return true;
    } else {
        document.getElementById("result").innerHTML = " ";
        return false;
    }
}

check = function() {
    var text;
    if (isCorrect()) {
        text = "Correct";
        numPoints += 1;
        newQuest(jsonData);
    } else if (numTries < 1) {
        text = "It was " + method + "!\nMaybe this one?";
        newQuest(jsonData);
    } else {
        numTries -= 1;
        text = "Wrong, try again.";
    }
    timeoutResult();
    document.getElementById("count").innerHTML = numPoints + "/" + (numQuests - 1);
    document.getElementById("result").innerHTML = text;
};

hint = function() {
    var text;
    if (isCorrect()) {
        text = "Correct";
        numPoints += 1;
        newQuest(jsonData);
    } else {
        numTries -= 1;
        text = "Come on, now you'll know!";
        document.getElementById("guessInput").value = method.substring(0, Math.floor(method.length / 2));
    }
    timeoutResult();
    document.getElementById("count").innerHTML = numPoints + "/" + (numQuests - 1);
    document.getElementById("result").innerHTML = text;
};



document.addEventListener('keypress', function(e) {
    if (e.keyCode === 13 && isCorrect()) {
        check();
    } else if (e.keyCode === 13) {
        check();
    }
});
