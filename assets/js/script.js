var request = require("request");
var inquirer = require("inquirer");
var electron = require("electron");
var axios = require("axios");
const fs = require('fs');
const convertFactory = require('electron-html-to');

var userName = "";
var color = "";
var htmlStr = `<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- CSS -->

    <!-- Bootstrap CSS  -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <!-- Font Awesome CSS Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
    <!-- My stylesheets -->
    <link rel="stylesheet" type="text/css" href="assets/css/reset.css">
    <link rel="stylesheet" type="text/css" href="assets/css/style.css">4

    <title>Developer Profile Generator</title>
</head>

<body>

    <h1>Github Profile 2.0 </h1>

    <!-- jQuery JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <!-- Bootstrap -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
        integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
        crossorigin="anonymous"></script>
    <!-- Moment.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>
    <!-- My JavaScript -->
    <script src="assets/js/script.js"></script>

</body>

</html>`;

var queryURL = "https://api.github.com/users/";


function start() {

    inquirer.prompt([
        {
            type: "input",
            message: "What is your Github username ",
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

        axios.get(queryURL).then(function (response) {
            console.log(response.data);
            var name = response.data.name;
            var location = response.data.location;
            var githubLink = response.data.html_url;
            var nOfRepos = response.data.public_repos;
            var nOfFollowers = response.data.followers;
            var nFollowing = response.data.following;
            var blogLink = rasponse.data.blog;
            generateHTML();
        }).catch(function (error) {
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
}

function generateHTML() {

    // write to a new HTML file
    fs.writeFile('index3.html', htmlStr, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
        // success case, the file was saved
        console.log('HTML generated!');
        generatePDF();
    });

}

function generatePDF() {

    fs.readFile('index3.html', 'utf8', (err, htmlString) => {
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
            result.stream.pipe(fs.createWriteStream('profile.pdf'));
            conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
            console.log("PDF Generated!");
        });
    });
}


start();


