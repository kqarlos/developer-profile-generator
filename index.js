var inquirer = require("inquirer");
var axios = require("axios");
const fs = require('fs');
const convertFactory = require('electron-html-to');


var userName = "";
var userInfo = {};
var htmlStr = "";
var queryURL = "https://api.github.com/users/";

const colors = {
    green: {
        wrapperBackground: "#c3e3c1",
        cardBackground: "#7cd6d2",
        headerColor: "white",
        photoBorderColor: "#0c6b05"
    },
    blue: {
        wrapperBackground: "#bfc9ff",
        cardBackground: "#545f96",
        headerColor: "white",
        photoBorderColor: "#031266"
    },
    pink: {
        wrapperBackground: "#ffd1f9",
        cardBackground: "#e882c3",
        headerColor: "white",
        photoBorderColor: "#b00081"
    },
    red: {
        wrapperBackground: "#f0c2c2",
        cardBackground: "#ff4a4a",
        headerColor: "white",
        photoBorderColor: "#b00000"
    }
};

//Prompts user for username and color
//makes an axios call to get user data from Github's api
//Populates userInfo object
function start() {

    inquirer.prompt([
        {
            type: "input",
            message: "What is your Github username ",
            name: "userName"
        },
        {
            type: "list",
            message: "What is your favorite color? ",
            name: "color",
            choices: ["green", "blue", "pink", "red"]
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
                    favoriteColor: unserInput.color,
                    bio: response.data.bio
                }

                console.log(userInfo);
                generateHTML();
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

//generates an HTML file by calling on fillHTML to get a complete html string and with fs.writeFile
function generateHTML() {
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

//fills htmlStr by declaring a string literal that refereces that userInfo and colors objects
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

    <style>
        .cardBack {
            background-color: ${colors[userInfo.favoriteColor].cardBackground} !important;
            -webkit-print-color-adjust: exact;
            width: 18rem;
        }

        .container {
            background-color: ${colors[userInfo.favoriteColor].wrapperBackground} !important;
            -webkit-print-color-adjust: exact;
        }

        a,
        a:hover {
            text-decoration: none !important;
            color: white;
        }

        img {
            position: absolute;
            top: -50px;
            left: calc(50% - 82.5px);
            border: 5px solid ${colors[userInfo.favoriteColor].photoBorderColor};
            border-radius: 25px;
        }

        #bio {
            color: ${colors[userInfo.favoriteColor].headerColor};
        }

    </style>

    <title>Developer Profile Generator</title>
</head>

<body>

    <div class="container my-3 pt-5 pb-3">
        <div class="row my-5 justify-content-center">
            <div class="col-1"></div>
            <div class="col-10">
                <div class="card-deck">
                    <div class="card text-center cardBack">
                        <div class="card-body pt-5">
                            <img style="width: 21%;" src="${userInfo.pImage}">
                            <h5 class="card-title pt-5 mb-0 mt-5 display-4 text-white">Welcome! My name is ${userInfo.name}.</h5>
                            <h5 class="card-title h4 text-white">&lt;Web Developer&gt;</h5>

                            <p class="card-text h4">
                                <i class="fas fa-map-marker-alt"></i> <a
                                    href="https://www.google.com/maps/place/${userInfo.location}" target="_blank">${userInfo.location}</a>
                                <i class="ml-4 fab fa-github-alt"></i> <a href="${userInfo.githubLink}" target="_blank">Github</a>
                                <i class="ml-4 fas fa-blog"></i> <a href="${userInfo.blogLink}" target="_blank">Blog</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-1"></div>
        </div>

        <h5 class="mb-5 h3 text-center" id="bio">${userInfo.bio}</h5>

        <div class="row text-white">
            <div class="col-2"></div>
            <div class="col-8">
                <div class="card-deck">
                    <div class="card text-center cardBack">
                        <div class="card-body">
                            <h5 class="card-title h4">Public Repositories</h5>
                            <p class="card-text h4">${userInfo.nOfRepos}</p>
                        </div>
                    </div>

                    <div class="card text-center cardBack">
                        <div class=" card-body">
                            <h5 class="card-title h4">Followers</h5>
                            <p class="card-text h4">${userInfo.nOfFollowers}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-2"></div>
        </div>
        <div class="row py-5 text-white">
            <div class="col-1"></div>
            <div class="col-10">
                <div class="card-deck">
                    <div class="card text-center cardBack">
                        <div class="card-body">
                            <h5 class="card-title h4">Github Stars</h5>
                            <p class="card-text h4">${userInfo.nOfStars}</p>
                        </div>
                    </div>

                    <div class="card text-center cardBack">
                        <div class="card-body">
                            <h5 class="card-title h4">Following</h5>
                            <p class="card-text h4">${userInfo.nFollowing}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-1"></div>
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

</html>



`;
}

//generates PDF file through electron-html-to
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

//Makes an Axios call to Github's api
//Loops through all the repos to get total star count
//Returns a promise
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