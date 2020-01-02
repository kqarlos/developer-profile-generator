var request = require("request");
var inquirer = require("inquirer");
var electron = require("electron");
var convertFactory = require("electron-html-to");
var axios = require("axios");

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








