'use strict'
var resourcesPath = 'data/java/java.json';
var jsonData;

var loadJson = function(){
    return new Promise(
        function(resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', resourcesPath, true);
            xmlhttp.onload = function() {
                if (xmlhttp.status === 200) {
                    jsonData = JSON.parse(xmlhttp.responseText);
                    console.log(jsonData.length);
                    loadSidebar(jsonData);
                }
            }
            xmlhttp.onerror = function() {
                Error('Data didn\'t load successfully; error code:' + request.statusText);
            }
            xmlhttp.send();
        }
        );
}

loadJson();

var loadSidebar = function(jsonData) {
    console.log(jsonData.packages);
    loadPackages(jsonData.packages);
}
//         <label>
//             <input type="checkbox" checked="checked">
//           <span class="checkmark"></span>
//           <p>One</p>
//           <p>0/1</p>
//         </label>
//         <label>
//             <input type="checkbox" checked="checked">
//           <span class="checkmark"></span>
//           <p>One</p>
//           <p>0/1</p>
//         </label>
//         <label>
//             <input type="checkbox" checked="checked">
//           <span class="checkmark"></span>
//           <p>One</p>
//           <p>0/1</p>
//         </label>
//         <label>
//             <input type="checkbox" checked="checked">
//           <span class="checkmark"></span>
//           <p>One</p>
//           <p>0/1</p>
//         </label>
var loadPackages = function(jsonPackagesArray) {
    for (var i = 0; i < jsonPackagesArray.length; i++) {
        var label = document.createElement('label');
        var input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        var inputXml = new XMLSerializer().serializeToString(input);
        label.innerHTML = inputXml;
        var pText = document.createElement('p');
        var pTextCount = document.createElement('p');
        pText.innerHTML = jsonPackagesArray[i].name;
        var pTextXml = new XMLSerializer().serializeToString(pText);
        label.innerHTML += pTextXml;
        pTextCount.innerHTML = '0/' + jsonPackagesArray[i].classes.length;
        var pTextCountXml = new XMLSerializer().serializeToString(pTextCount);
        label.innerHTML += pTextCountXml;
        var labelXml = new XMLSerializer().serializeToString(label);
        document.getElementById('packages').innerHTML += labelXml;
        var classesDivXml = loadClasses(jsonPackagesArray[i].classes);
        document.getElementById('packages').innerHTML += classesDivXml;
    }
}
var loadClasses = function(jsonClassesArray) {
    var classesDiv = document.createElement('div');
    classesDiv.setAttribute('class','sub-checkboxes');

    for (var i = 0; i < jsonClassesArray.length; i++) {
        var label = document.createElement('label');
        var input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        var inputXml = new XMLSerializer().serializeToString(input);
        label.innerHTML = inputXml;
        var pText = document.createElement('p');
        pText.innerHTML = jsonClassesArray[i];
        var pTextXml = new XMLSerializer().serializeToString(pText);
        label.innerHTML += pTextXml;
        var labelXml = new XMLSerializer().serializeToString(label);
        classesDiv.innerHTML += labelXml;
    }
    return new XMLSerializer().serializeToString(classesDiv);
}