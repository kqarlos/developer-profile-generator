var request = require("request");
var inquirer = require("inquirer");
var electron = require("electron");
var axios = require("axios");
const fs = require('fs');
const convertFactory = require('electron-html-to');

var userName = "";
var color = "";

var queryURL = "https://api.github.com/users/";



inquirer.prompt([
    {
        type: "input",
        message: "What is your username ",
        name: "userName"
    },
    {
        type: "input",
        message: "What is your favorite color? ",
        name: "color"
    },

]).then(function (unserInput) {

    userName = unserInput.userName
    color = unserInput.color;
    queryURL += userName;

    axios.get(queryURL).then(
        function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });



})


fs.readFile('index.html', 'utf8', (err, htmlString) => {
  // add local path in case your HTML has relative paths
//   htmlString = htmlString.replace(/href="|src="/g, match => {
//      return match + 'file://path/to/you/base/public/directory';
//   });
  const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF,
    allowLocalFilesAccess: true
  });
  conversion({ html: htmlString }, (err, result) => {
    if (err) return console.error(err);
    result.stream.pipe(fs.createWriteStream('anywhere.pdf'));
    conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
  });
});

// var fs = require('fs'),
//     convertFactory = require('electron-html-to');

// var conversion = convertFactory({
//     converterPath: convertFactory.converters.PDF
// });

// conversion({ file: 'index.html' }, function (err, result) {
//     if (err) {
//         return console.error(err);
//     }

//     console.log(result.numberOfPages);
//     console.log(result.logs);
//     result.stream.pipe(fs.createWriteStream('anywhere.pdf'));
//     conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
// });







