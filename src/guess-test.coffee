xmlhttp = new XMLHttpRequest
url = 'data/java/lang/Math.json'
method = undefined
jsonData = undefined
points = undefined

randomSeed = (x) ->
  Math.floor Math.random() * x

newQuest = (arr) ->
  i = randomSeed(arr.length)
  buildQuest arr, i
  method = arr[i].Method
  return

buildQuest = (arr, i) ->
  document.getElementById('description').innerHTML = arr[i].Description
  guessInput = document.createElement('input')
  guessInput.setAttribute 'type', 'text'
  guessInput.setAttribute 'id', 'guessInput'
  guessInput.setAttribute 'maxlength', arr[i].Method.length
  guessInput.setAttribute 'style', 'width: calc(15px *' + arr[i].Method.length + ');'
  guessInput.setAttribute 'autofocus', 'autofocus'
  guessInput = (new XMLSerializer).serializeToString(guessInput)
  guessSubmit = document.createElement('input')
  guessSubmit.setAttribute 'type', 'submit'
  guessSubmit.setAttribute 'class', 'button'
  guessSubmit.setAttribute 'value', '>'
  guessSubmit.setAttribute 'onclick', 'check()'
  guessSubmit = (new XMLSerializer).serializeToString(guessSubmit)
  document.getElementById('guess').innerHTML = 'java.lang.Math.'
  document.getElementById('guess').innerHTML += guessInput + arr[i].Arguments + guessSubmit
  return

xmlhttp.onreadystatechange = ->
  if xmlhttp.readyState == 4 and xmlhttp.status == 200
    points = 0
    jsonData = JSON.parse(xmlhttp.responseText)
    newQuest jsonData
  return

xmlhttp.open 'GET', url, true
xmlhttp.send()

countPoint = ->
  points += 1
  return

timeoutResult = ->
  setTimeout 'blankResult()', 2000
  return

blankResult = ->
  document.getElementById('result').innerHTML = ''

isCorrect = ->
  x = undefined
  x = document.getElementById('guessInput').value
  if x == method
    true
  else
    false

check = ->
  text = undefined
  if isCorrect()
    countPoint()
    text = 'Correct'
  else
    text = 'Wrong, try again.'
  timeoutResult()
  document.getElementById('result').innerHTML = text

$(document).keypress (e) ->
  if e.which == 13 and isCorrect()
    check()
    newQuest jsonData
  else if e.which == 13
    check()
  return

# ---
# generated by js2coffee 2.0.3