/*jslint browser: true, debug: true, evil: false, vars: true, maxlen: 80, unparam: true */
/*global $, method, XMLSerializer, console */

var alloha, selectedPackage, method, hint, jsonData, getGuessSelectValue;

alloha = function () {
    "use strict";
    /*jslint unparam: true */
    var xmlhttp, numPoints, numQuests, numTries,
        timeoutResult, blankResult, isCorrect, check, inputdata;

    inputdata = "Math,Double,Integer,Long";

    function randomSeed(x) {
        return Math.floor((Math.random() * x));
    }

    function arrangeSelectionLength() {
        var guessSelectIndexLength;
        guessSelectIndexLength = (getGuessSelectValue().length * 15).toString();
        $("#guessSelect").width(guessSelectIndexLength);
    }

    function buildQuest(arr, i) {
        var guessInput, guessInputText, guessSubmit, guessSubmitText,
            guessSelect, guessSelectText, option;

        numTries = 3;
        document.getElementById('description').innerHTML = arr[i].Description;
        guessInput = document.createElement('input');
        guessInput.setAttribute('type', 'text');
        guessInput.setAttribute('id', 'guessInput');
        guessInput.setAttribute('class', 'focus');
        guessInput.setAttribute('maxlength', arr[i].Method.length);
        guessInput.setAttribute('style', 'width: calc(15px *' + arr[i].Method.
            length + ');');
        guessInputText = new XMLSerializer().serializeToString(guessInput);

        guessSelect = document.createElement('select');
        guessSelect.setAttribute('id', 'guessSelect');
        guessSelect.setAttribute('onChange', 'changeSelect()');

        inputdata.split(',').forEach(function (item) {
            option = document.createElement('option');
            option.value = option.textContent = item;
            if (item === selectedPackage) {
                option.setAttribute("selected", 'true');
            }
            guessSelect.appendChild(option);
        });
        guessSelectText = new XMLSerializer().serializeToString(guessSelect);

        guessSubmit = document.createElement('input');
        guessSubmit.setAttribute('type', 'submit');
        guessSubmit.setAttribute('class', 'button');
        guessSubmit.setAttribute('value', '>');
        guessSubmit.setAttribute('onclick', 'check()');
        guessSubmitText = new XMLSerializer().serializeToString(guessSubmit);
        document.getElementById("guess").innerHTML = "java.lang." + guessSelectText + ".";
        document.getElementById("guess").innerHTML += guessInputText + arr[i].
            Arguments + guessSubmitText;

        arrangeSelectionLength();

        $("input.focus:last").focus();
    }

    function newQuest(arr) {
        var i;
        numQuests += 1;
        i = randomSeed(arr.length);
        buildQuest(arr, i);
        method = arr[i].Method;
    }
    //url = "data/java/lang/Math.json";
    function getUrl() {
        return "data/java/lang/" + getGuessSelectValue() + ".json";
    }

    function loadIt() {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                numPoints = 0;
                numQuests = 0;
                jsonData = JSON.parse(xmlhttp.responseText);
                newQuest(jsonData);
            }
        };
        xmlhttp.open("GET", getUrl(), true);
        xmlhttp.send();
    }

    loadIt();

    timeoutResult = function () {
        setTimeout(blankResult(), 5000);
    };

    blankResult = function () {
        document.getElementById("result").innerHTML = " ";
    };

    isCorrect = function () {
        var x;
        x = document.getElementById("guessInput").value;
        return x === method;
    };

    check = function () {
        var text;
        if (isCorrect()) {
            text = "Correct";
            numPoints += 1;
            newQuest(jsonData);
        } else if (numTries < 1) {
            text = "Maybe this one?";
            newQuest(jsonData);
        } else {
            numTries -= 1;
            text = "Wrong, try again.";
        }
        timeoutResult();
        document.getElementById("count").innerHTML = numPoints + "/" +
            (numQuests - 1);
        document.getElementById("result").innerHTML = text;
    };

    $(document).keypress(function (e) {
        if (e.which === 13 && isCorrect()) {
            check();
        } else if (e.which === 13) {
            check();
        }
    });
};

hint = function () {
    "use strict";
    return method;
};

getGuessSelectValue = function () {
    "use strict";
    var guessSelect, guessSelectIndex;
    guessSelect = $("#guessSelect");
    if (undefined === guessSelect[0]) {
        console.log("something is undefined");
        if (undefined === selectedPackage) {
            return "Math";
        }
        return selectedPackage;
    }
    guessSelectIndex = guessSelect[0].selectedIndex;
    return guessSelect.find("option:eq(" + guessSelectIndex + ")").attr("value");
};

var changeSelect = function () {
    "use strict";
    selectedPackage = getGuessSelectValue();
    alloha();
};

alloha();

//var changeSelect = function () {
//    "use strict";
//    var guessSelect, guessSelectIndex, guessSelectOption, guessSelectIndexLength;
//    guessSelect = $("#guessSelect");
//    guessSelectIndex = guessSelect[0].selectedIndex;
//    guessSelectOption = guessSelect.find("option:eq(" + guessSelectIndex + ")").attr("value");
//
//    url = "data/java/lang/" + guessSelectOption + ".json";
//
//    $.getJSON(url, function (response) {
//        jsonData = response;
//    });
//
//    guessSelectIndexLength = (guessSelectOption.length * 15).toString();
//    guessSelect.width(guessSelectIndexLength);
//};