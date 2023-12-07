/**
 * Saves the document ID from the URL's search parameters to local storage
 * and redirects the user to the 'editProfile.html' page.
 */
function saveProfileDocumentIDAndRedirect() {
    // Get the document ID from the URL's search parameters
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");

    // Save the document ID to local storage
    localStorage.setItem('profileDocID', ID);

    // Redirect the user to the 'editProfile.html' page
    window.location.href = 'editProfile.html';
}

/**
 * Performs various actions when a user is authenticated, including setting the global 'currentUser' variable
 * and calling functions to insert user information into the HTML.
 * Redirects to the login page if no user is signed in.
 */
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Set the global 'currentUser' variable to the authenticated user's document
            currentUser = db.collection("users").doc(user.uid);
            console.log(currentUser);

            // Call functions to insert user information into the HTML
            insertNameFromFirestore();
            insertBiographyFirestore();
            insertUserNameFromFirestore();
        } else {
            // No user is signed in, redirect to the login page
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();


//THIS SHOULD BE YOUR CODE TO MAKE ONLY USERS POSTS APPEAR
//function x{
// db.collection.get whatever ...
// if (user.uid === doc.data().author){
// document.query whatever to display it
//}

/**
 * Inserts the user's name, username, and biography from Firestore into the respective HTML elements.
 */
function insertNameFromFirestore() {
    currentUser.get().then(userDoc => {
        var user_Name = userDoc.data().name;
        console.log(user_Name);
        $("#name-goes-here").text(user_Name); //jquery
    });
}

function insertUserNameFromFirestore() {
    currentUser.get().then(userDoc => {
        var user_userName = userDoc.data().username;
        console.log(user_userName);
        $("#username-goes-here").text(user_userName); //jquery
    });
}

function insertBiographyFirestore() {
    currentUser.get().then(userDoc => {
        var biography = userDoc.data().biography;
        console.log(biography);
        $("#bio-goes-here").text(biography); //jquery
    });
}

/**
 * Displays cards dynamically for a specified collection, showing only the meals authored by the current user.
 * Inserts the meal information into HTML elements using the mealTemplate.
 * @param {string} collection - The name of the Firestore collection to retrieve meals from.
 */
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("mealTemplate");

    db.collection(collection)
        .orderBy('last_updated', 'desc')
        .get()
        .then(allMeals => {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    let currentUser = user.uid;
                    allMeals.forEach(doc => {
                        if (doc.data().author.includes(currentUser)) {
                            var cap = doc.data().description;
                            var user = doc.data().name;
                            var imageURL = doc.data().image;

                            let newcard = mealTemplate.content.cloneNode(true);

                            newcard.querySelector('.image').src = imageURL;
                            newcard.querySelector('.description').innerHTML = cap;
                            newcard.querySelector('.name').innerHTML = user;

                            document.getElementById(collection + "-go-here").appendChild(newcard);
                        }
                    });
                }
            });
        });
}

// Example usage:
displayCardsDynamically("meals");
