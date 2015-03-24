var xmlhttp = new XMLHttpRequest();
  var url = "data/java/lang/Math.json";
var method, jsonData;

  function randomSeed(x) {
    return Math.floor((Math.random() * x));
  }

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          jsonData = JSON.parse(xmlhttp.responseText);
          newQuest(jsonData);
      }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  function newQuest(arr){
      i = randomSeed(arr.length)
      buildQuest(arr, i);
      method = arr[i].Method;
  }

  function buildQuest(arr, i) {
      document.getElementById("description").innerHTML = arr[i].Description;
      var guessInput = document.createElement("input");
      guessInput.setAttribute('type', 'text');
      guessInput.setAttribute('id', 'guessInput');
      guessInput.setAttribute('maxlength', arr[i].Method.length);
      guessInput.setAttribute('style', 'width: calc(15px *' + arr[i].Method.length +');');
      guessInput.setAttribute('autofocus', 'autofocus');
      guessInput = new XMLSerializer().serializeToString(guessInput)
      var guessSubmit = document.createElement("input");
      guessSubmit.setAttribute('type', 'submit');
      guessSubmit.setAttribute('class', 'button');
      guessSubmit.setAttribute('value', '>');
      guessSubmit.setAttribute('onclick', 'check()');
      guessSubmit = new XMLSerializer().serializeToString(guessSubmit)
      document.getElementById("guess").innerHTML = "java.lang.Math."
      document.getElementById("guess").innerHTML += guessInput + arr[i].Arguments + guessSubmit;
  }

  timeoutResult = function() {
    setTimeout('blankResult()', 2000);
  }

  blankResult = function() {
    return document.getElementById("result").innerHTML = "";
  }

  isCorrect = function() {
    var x;
    x = document.getElementById("guessInput").value;
    if (x === method) {
      return true;
    } else {
      return false;
    }
  }

  check = function() {
  var text;
  if (isCorrect()) {
    text = "Correct";
  } else {
    text = "Wrong, try again.";
  }
  timeoutResult();
  return document.getElementById("result").innerHTML = text;
  };

  $(document).keypress(function(e) {
    if(e.which == 13) {
      check();
    } else if (e.which == 32 && isCorrect()) {
      console.log(e.which);
      newQuest(jsonData);
    }
});