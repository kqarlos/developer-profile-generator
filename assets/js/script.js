var request = require("request");
var inquirer = require("inquirer");
var electron = require("electron");
var axios = require("axios");
const fs = require('fs');
const convertFactory = require('electron-html-to');

var userName = "";
var userInfo = {};
var htmlStr =
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
                    <div class="card text-center" style="width: 18rem;">
                        <div class="card-body">
                            <img class="pb-2" style="width: 15%;" id="pImage">
                            <h5 class="card-title" id="name"></h5>
                            <p class="card-text">
                                <i class="fas fa-map-marker-alt"></i> <a id="location"></a>
                                <i class="ml-4 fab fa-github-alt"></i> <a id="githubLink">Github</a>
                                <i class="ml-4 fas fa-blog"></i> <a id="blogLink">Blog</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card-deck">
                    <div class="card text-center" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Public Repositories</h5>
                            <p class="card-text" id="nOfRepos"></p>
                        </div>
                    </div>

                    <div class="card text-center" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Followers</h5>
                            <p class="card-text" id="nOfFollowers"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row pt-5">
            <div class="col-12">
                <div class="card-deck">
                    <div class="card text-center" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Github Stars</h5>
                            <p class="card-text" id="nOfStars"></p>
                        </div>
                    </div>

                    <div class="card text-center" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Following</h5>
                            <p class="card-text" id="nFollowing"></p>
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
            userInfo = {
                name: response.data.name,
                location: response.data.location,
                githubLink: response.data.html_url,
                nOfRepos: response.data.public_repos,
                nOfFollowers: response.data.followers,
                nFollowing: response.data.following,
                blogLink: response.data.blog,
                nOfStars: getNumberOfStars(response.data.repos_url),
                pImage: response.data.avatar_url,
                favoriteColor: unserInput.color
            }
            // console.log(userInfo);
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
    fillHTML();
    // write to a new HTML file
    fs.writeFile('index3.html', htmlStr, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
        // success case, the file was saved
        console.log('HTML generated!');
        generatePDF();
    });
}

function fillHTML() {
    console.log(userInfo);
    htmlStr = htmlStr.split(`id="pImage"`).join(`id="pImage" src="` + userInfo.pImage + `"`);
    htmlStr = htmlStr.split(`id="name">`).join(`id="name">` + userInfo.name);
    htmlStr = htmlStr.split(`id="location">`).join(`id="location">` + userInfo.location);
    htmlStr = htmlStr.split(`id="githubLink"`).join(`id="githubLink" href="` + userInfo.githubLink + `"`);
    htmlStr = htmlStr.split(`id="blogLink"`).join(`id="blogLink" href="` + userInfo.blogLink + `"`);
    htmlStr = htmlStr.split(`id="nOfRepos">`).join(`id="nOfRepos">` + userInfo.nOfRepos);
    htmlStr = htmlStr.split(`id="githubLink">`).join(`id="githubLink">` + userInfo.githubLink);
    htmlStr = htmlStr.split(`id="nOfFollowers">`).join(`id="nOfFollowers">` + userInfo.nOfFollowers);
    htmlStr = htmlStr.split(`id="nOfStars">`).join(`id="nOfStars">` + userInfo.nOfStars);
    htmlStr = htmlStr.split(`id="nFollowing">`).join(`id="nFollowing">` + userInfo.nFollowing);
    htmlStr = htmlStr.split(`style="`).join(`style="background-color: ` + userInfo.color + "; ");

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

function getNumberOfStars(repos_url) {
    var count = 0;
    axios.get(repos_url).then(function (response) {
        response.data.forEach(element => {
            count += element.stargazers_count;
        });
        // console.log("Star count: " + count);
        return count;
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

}

start();


// $(document).ready(function(){ 
//     $("#name").text("Carlos");

// });