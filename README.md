## PlatePals

* [General info] (#general-info)
* [Technologies] (#technologies)
* [Contents] (#content)
* [Limitations] (#limitations)
* [Resources] (#resources)
* [Contact] (#contact)
* [Acknowledgements] (#acknowledgements)

## General Info
PlatePals is a social media Meal Tracking app. It allows you to post your daily meals and share them with other users. You are able to interact with other users by following them, commenting on their posts, and rating their meals. In addition to meal tracking, PlatePals allows you to save other users' meal post as a source of inspiration for your own meals. Through the combination of social media and meal tracking features, users will feel more motivated to continue their diet, find new ideas for their diet, and keep other users accountable to their diet!

## Technologies
Technologies used for this project: 
* HTML 5, CSS 
* JavaScript
* Bootstrap 5.0 
* Firebase 8.0 (Authentication, Firestor, Storage, Hosting)

## Content
Content of the project folder:

```
 Top level of project folder: 
├── following.html           # following HTML file, this is where users view all the posts from users they follow 
├── .gitignore               # Git ignore file 
├── index.html               # landing HTML file, this is what users see when they come to url
├── login.html               # login HTML file, the login page
├── main.html                # main HTML file, landing page after successful login or user set-up, displays all posts
├── meal.html                # meal HTML file, page that displays further post information
├── profile.html             # profile HTML file, displays the information for other users' profile 
├── profileSelf.html         # profileSelf HTML file, displays the information for current user's profile
├── README.md                # What you're currently reading!!
├── savedmeals.html          # savedmeals HTML file, displays all posts that current user saved/bookmarked
├── search.html              # search HTML file, displays users based on search 
└── uploading.html           # uploading HTML file, page for creating a post 

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
        /logo.jpg            # Logo from https://app.logo.com
├── scripts                  # Folder for scripts
    /authentication.js       # 
    /editProfile.js          # JS for editProfile.html
    /firebaseAPI_BBY03.js    # firebase API stuff, shared across pages 
    /following.js            # JS for following.html
    /main.js                 # JS for main.html
    /meal.js                 # JS for meal.html
    /profile.js              # JS for profile.html
    /profileSelf.js          # JS for profileSelf.html
    /savedmeals.js           # JS for savedmeals.html
    /script.js               # JS for all html pages 
    /search.js               # JS for search.html
    /skeleton.js             # JS for skeleton items (navbar and footer) of all html pages
    /uploading.js            # JS for uploading.html

├── styles                   # Folder for styles
    /meal.css                # style for meal.html
    /profile.css             # style for profile.html
    /savedmeals.css          # style for savedmeals.html
    /search.css              # style for search.html
    /style.css               # style for following.html, index.html, login.html, main.html, profileSelf.html, and uploading.html

Firebase hosting files: 
├── .firebase
        /hosting..cache
├── .firebaserc
├── 404.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
└── storage.rules

```
## Limitations 
- Searching for users on Search.html page is case-senstive

## Resources 
- In-app icons from Google Fonts Material Symbols and Icons (Open Source https://fonts.google.com/icons)
- Logo from Logo (https://app.logo.com)

## Contact
* Steven Ly - sly19@my.bcit.ca
* Henry Tan - ttan21@my.bcit.ca
* Victor Wong - vwong143@my.bcit.ca

## Acknowledgements 
* <a href="https://getbootstrap.com/">Bootstrap</a>