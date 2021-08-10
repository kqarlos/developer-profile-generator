# Developer Profile Generator

</br>
<p align="center">
    <img src="https://img.shields.io/github/languages/count/kqarlos/developer-profile-generator?style=for-the-badge" alt="Languages" />
    <img src="https://img.shields.io/github/languages/top/kqarlos/developer-profile-generator?style=for-the-badge" alt="Top Language" />
    <img src="https://img.shields.io/github/languages/code-size/kqarlos/developer-profile-generator?style=for-the-badge" alt="Code Size" />
    <img src="https://img.shields.io/github/repo-size/kqarlos/developer-profile-generator?style=for-the-badge" alt="Repo Size" />   
    <img src="https://img.shields.io/tokei/lines/github/kqarlos/developer-profile-generator?style=for-the-badge" alt="Total Lines" />
    <img src="https://img.shields.io/github/package-json/dependency-version/kqarlos/developer-profile-generator/axios?style=for-the-badge" alt="Axios Version" />
    <img src="https://img.shields.io/github/package-json/dependency-version/kqarlos/developer-profile-generator/electron?style=for-the-badge" alt="Electron Version" />
    <img src="https://img.shields.io/github/package-json/dependency-version/kqarlos/developer-profile-generator/electron-html-to?style=for-the-badge" alt="Electron- html-to Version" />
    <img src="https://img.shields.io/github/package-json/dependency-version/kqarlos/developer-profile-generator/inquirer?style=for-the-badge" alt="Inquirer Version" />
    <img src="https://img.shields.io/github/last-commit/kqarlos/developer-profile-generator?style=for-the-badge" alt="Last Commit" />  
    <img src="https://img.shields.io/github/issues/kqarlos/developer-profile-generator?style=for-the-badge" alt="Issues" />  
    <img src="https://img.shields.io/github/followers/kqarlos?style=social" alt="Followers" />  
</p>

## Description

Generates a Github's user profile in PDF format given a Github's username and a chosen favorite color.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
    * [Screenshots](#screenshots)
    * [Snippets](#snippets)
* [Credits](#credits)
* [License](#license)

## Installation

  Install dependencies and start the application in the command line

     npm i
     node index.js

<p align="center">
    <a href="https://kqarlos.github.io/developer-profile-generator"><img src="https://img.shields.io/badge/-👉 See Sample Profile-success?style=for-the-badge"  alt="Live Site" /></a>
</p>

## Usage

### Screenshots

1. Generated PDF with username: _kqarlos_ and color choice: _red_

![Site](assets/images/profile.png)

2. Command-line prompts with _inquirer_

![Site](assets/images/inquirer.png)



### Snippets


1. Promise and callback

```javascript

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
    
```
* This portion of code calls on _getNumberOfStars()_. This return a promise that once is resolved will continue to execute the callback function. In other words, only once _getNumberOfStars()_ resolves the _userInfo_ object will be set and once all the user info is set, we call the generateHTML function.


2. _getNumberOfStars(repos_url)_

```javascript

function getNumberOfStars(repos_url) {
    return new Promise(function (resolve, reject) {
        if (repos_url == null) 
            return reject(Error("Invalid URL!"));
        var count = 0;
        axios.get(repos_url).then(function (response) {
            response.data.forEach(element => {
                count += element.stargazers_count;
            });
            resolve(count);
        }).catch(function (error) {
            console.log("Error", error.message);
        });
    });
}


```
* This function returns a promise. This is because inside this function there is an _axios.get()_ call that runs asynchronouslly. Returning apromise will ensure that whatever code follows this function call will execute only after this promise is resolved. This avoids issues such as referencing a variable that has not yet been set.

## Credits 

### Author

- 💼 Carlos Toledo: [portfolio](https://kqarlos.github.io/)
- :octocat: Github: [kqarlos](https://www.github.com/kqarlos)
- LinkedIn: [carlos-toledo415](https://www.linkedin.com/in/carlos-toledo415/)

### Built With

</br>
<p align="center">
    <a href="https://developer.mozilla.org/en-US/docs/Web/HTML"><img src="https://img.shields.io/badge/-HTML-orange?style=for-the-badge"  alt="HMTL" /></a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://img.shields.io/badge/-CSS-blue?style=for-the-badge" alt="CSS" /></a>
    <a href="https://www.javascript.com/"><img src="https://img.shields.io/badge/-Javascript-yellow?style=for-the-badge" alt="Javascript" /></a>
    <a href="https://getbootstrap.com/"><img src="https://img.shields.io/badge/-Bootstrap-blueviolet?style=for-the-badge" alt="Bootstrap" /></a>
    <a href="https://handlebarsjs.com/"><img src="https://img.shields.io/badge/-Inquirer-orange?style=for-the-badge" alt="Inquirer" /></a>

</p>

## License

</br>
<p align="center">
    <img align="center" src="https://img.shields.io/github/license/kqarlos/developer-profile-generator?style=for-the-badge" alt="MIT license" />
</p>