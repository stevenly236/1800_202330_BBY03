/**
 * Displays meals from users that the current user is following.
 */
function diplayFollowPost() {
    // Check if a user is signed in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Get the current user's ID
            let userID = user.uid;

            // Get the list of users that the current user is following
            db.collection("users").doc(userID).get().then(userDoc => {
                let followerArray = userDoc.data().followerID || [];

                // Iterate over the followed users
                followerArray.forEach(followedUserID => {
                    // Query the 'meals' collection for meals posted by the followed user
                    db.collection('meals')
                        .where('author', '==', followedUserID)
                        .get()
                        .then(querySnapshot => {
                            // Iterate over the meals found
                            querySnapshot.forEach(mealDoc => {
                                // Extract meal details
                                let description = mealDoc.data().description;
                                let imageurl = mealDoc.data().image;
                                let mealtime = mealDoc.data().mealTime;
                                let mealtitle = mealDoc.data().mealTitle;
                                let name = mealDoc.data().name;

                                // Clone the meal template
                                let cardTemplate = document.getElementById("mealTemplate");
                                let newcard = cardTemplate.content.cloneNode(true);

                                // Set meal details in the cloned template
                                newcard.querySelector('.image').src = imageurl;
                                newcard.querySelector('.mealTitle').innerText = mealtitle;
                                newcard.querySelector('.description').innerText = description;
                                newcard.querySelector('.name').innerText = name;
                                newcard.querySelector('.mealType').innerText = mealtime;
                                newcard.querySelector('a').href = "meal.html?docID=" + mealDoc.id;

                                // Append the cloned template to the 'meals-go-here' container
                                document.getElementById("meals-go-here").appendChild(newcard);
                            });
                        })
                        .catch(error => {
                            console.error("Error getting meals:", error);
                        });
                });
            });
        }
    });
}

// Call the function to display followed users' meals
diplayFollowPost();
