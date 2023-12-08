/**
 * Retrieves the user information from Firebase authentication and updates the DOM.
 * If a user is signed in, it retrieves the user's UID and display name and updates the DOM element.
 * If no user is signed in, it logs a message to the console.
 */
function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // If a user is signed in
            console.log(user.uid); // Log user UID to console
            console.log(user.displayName); // Log user display name to console
            userName = user.displayName;

            // Update the DOM element with the user's display name
            document.getElementById("name-goes-here").innerText = userName;
        } else {
            // If no user is signed in
            console.log("Please log in"); // Log a message to console
        }
    });
}

// Call the function to retrieve and display user information
getNameFromAuth();


/**
 * Dynamically displays meal cards based on the specified Firestore collection.
 * Retrieves meals from the Firestore collection, orders them by last updated timestamp in descending order,
 * and dynamically creates and appends HTML cards for each meal to the specified container.
 * @param {string} collection - The name of the Firestore collection to retrieve meals from.
 */
function displayCardsDynamically(collection) {
    // Get the meal template element
    let cardTemplate = document.getElementById("mealTemplate");

    // Query the Firestore collection for meals, order them by last updated timestamp in descending order
    db.collection(collection)
        .orderBy('last_updated', 'desc')
        .get()
        .then(allMeals => {
            // Iterate over the retrieved meals
            allMeals.forEach(doc => {
                // Extract meal details
                var cap = doc.data().description;
                var user = doc.data().name;
                var imageURL = doc.data().image;
                var mealtime = doc.data().mealTime;
                var title = doc.data().mealTitle;

                // Clone the meal template
                let newcard = cardTemplate.content.cloneNode(true);

                // Set meal details in the cloned template
                newcard.querySelector('.mealTitle').innerHTML = title;
                newcard.querySelector('.image').src = imageURL;
                newcard.querySelector('.description').innerHTML = cap;
                newcard.querySelector('.name').innerHTML = user;
                newcard.querySelector('.mealType').innerHTML = mealtime;
                newcard.querySelector('a').href = "meal.html?docID=" + doc.id;

                // Append the cloned template to the specified container
                document.getElementById(collection + "-go-here").appendChild(newcard);
            });
        })
        .catch(error => {
            console.error("Error getting meals:", error);
        });
}

// Call the function to dynamically display meal cards for the 'meals' collection
displayCardsDynamically("meals");
