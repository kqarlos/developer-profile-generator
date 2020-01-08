var request = require("request");
var inquirer = require("inquirer");
var electron = require("electron");
var axios = require("axios");
const fs = require('fs');
const convertFactory = require('electron-html-to');
const pdf = require('html-pdf');
const generateHTML = require('electron-prebuilt');

var userName = "";
var userInfo = {};
var htmlStr = "";
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
        queryURL += userName;

        axios.get(queryURL).then(function (response) {
            // console.log(response.data);
            getNumberOfStars(queryURL + "/repos").then(function (stars) {
                userInfo = {
                    name: response.data.name,
                    location: response.data.location,
                    githubLink: response.data.html_url,
                    nOfRepos: response.data.public_repos,
                    nOfFollowers: response.data.followers,
                    nFollowing: response.data.following,
                    blogLink: response.data.blog,
                    nOfStars: stars,
                    pImage: response.data.avatar_url,
                    favoriteColor: unserInput.color
                }
                console.log(userInfo);
                generateHTML1();
            }).catch(function (err) {
                console.log(err);
            });
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

function generateHTML1() {
    fillHTML();
    // write to a new HTML file
    fs.writeFile('index.html', htmlStr, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
        // success case, the file was saved
        console.log('HTML generated!');
        generatePDF();
    });
}

function fillHTML() {
    console.log(userInfo);
    htmlStr =
        `
<!doctype html>
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
    <link rel="stylesheet" type="text/css" href="assets/css/style.css">

    <title>Developer Profile Generator</title>
</head>

<body>

    <div class="container">
        <div class="row my-5 justify-content-center">
            <div class="col-12">
                <div class="card-deck">
                    <div class="card text-center" style="background-color: ${userInfo.favoriteColor} !important; -webkit-print-color-adjust: exact; width: 18rem;">
                        <div class="card-body">
                            <img class="pb-2" style="width: 15%;" id="pImage" src="${userInfo.pImage}">
                            <h5 class="card-title" id="name">${userInfo.name}</h5>
                            <p class="card-text">
                                <i class="fas fa-map-marker-alt"></i> <a id="location">${userInfo.location}</a>
                                <i class="ml-4 fab fa-github-alt"></i> <a id="githubLink" href="${userInfo.githubLink}">Github</a>
                                <i class="ml-4 fas fa-blog"></i> <a id="blogLink" href="${userInfo.blogLink}">Blog</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card-deck">
                    <div class="card text-center" style="background-color: ${userInfo.favoriteColor} !important; -webkit-print-color-adjust: exact; width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Public Repositories</h5>
                            <p class="card-text" id="nOfRepos">${userInfo.nOfStars}</p>
                        </div>
                    </div>

                    <div class="card text-center" style="background-color: ${userInfo.favoriteColor} !important; -webkit-print-color-adjust: exact; width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Followers</h5>
                            <p class="card-text" id="nOfFollowers">${userInfo.nOfFollowers}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row pt-5">
            <div class="col-12">
                <div class="card-deck">
                    <div class="card text-center" style="background-color: ${userInfo.favoriteColor} !important; -webkit-print-color-adjust: exact; width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Github Stars</h5>
                            <p class="card-text" id="nOfStars">${userInfo.nOfStars}</p>
                        </div>
                    </div>

                    <div class="card text-center" style="background-color: ${userInfo.favoriteColor} !important; -webkit-print-color-adjust: exact; width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Following</h5>
                            <p class="card-text" id="nFollowing">${userInfo.nFollowing}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- jQuery JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <!-- Bootstrap -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
        integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
        crossorigin="anonymous"></script>
    <!-- Moment.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>
    <!-- My JavaScript -->
    <script src="script.js"></script>

</body>

</html>`;
}

function generatePDF() {

    fs.readFile('index.html', 'utf8', (err, htmlString) => {
        const conversion = convertFactory({
            converterPath: convertFactory.converters.PDF,
            allowLocalFilesAccess: true
        });
        conversion({ html: htmlString }, (err, result) => {
            if (err) return console.error(err);
            result.stream.pipe(fs.createWriteStream('profile.pdf', { mode: "0766", flag: "w" }));
            conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
            console.log("PDF Generated!");
        });
    });
    
}

function getNumberOfStars(repos_url) {
    return new Promise(function (resolve, reject) {
        if (repos_url == null) return reject(Error("Invalid URL!"));

        var count = 0;
        axios.get(repos_url).then(function (response) {
            response.data.forEach(element => {
                count += element.stargazers_count;
            });
            resolve(count);
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
    });
}

start();


// $(document).ready(function(){ 
//     $("#name").text("Carlos");

// });