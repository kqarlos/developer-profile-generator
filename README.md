# Developer Profile Generator

Generates a Github's user profile in PDF format given a Github's username and a chosen favorite color.

## Getting Started

This application is compatible with the most commonly used web browsers.

## Site Pictures

1. Generated PDF with username: _kqarlos_ and color choice: _red_

![Site](assets/images/profile.png)

2. Command-line prompts with _inquirer_

![Site](assets/images/inquirer.png)



## Code Snippets


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


## Built With

* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Bootstrap](https://getbootstrap.com/)
* [Javascript](https://www.javascript.com/)
* [Moment.js](https://momentjs.com/docs/)

## Deployed Link

* [See Live Site](https://kqarlos.github.io/developer-profile-generator)

## Author

 * **Carlos Toledo** 

## Links

- [Link to site repository](https://github.com/kqarlos/developer-profile-generator)
- [Link to Github](https://www.github.com/kqarlos)
- [Link to LinkedIn](https://www.linkedin.com/in/carlos-toledo415/)


## Acknowledgments

* [W3 Schools](https://www.w3schools.com/)
* [Bootstrap components](https://getbootstrap.com/docs/4.4/components/navbar/)
* [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)