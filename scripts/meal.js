var currentUser;

function writeComment() {
    console.log("inside comments");
    let usercontent = document.getElementById("usercomment").value;
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"

    console.log(usercontent);

    var user = firebase.auth().currentUser;
    if (user) {
        let currentUser = db.collection("users").doc(user.uid);
        let userID = user.uid;

        // Get the document for the current user.
        db.collection("comments").add({
            docID: ID,
            userID: userID,
            content: usercontent,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "meal.html?docID=" + ID;
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'index.html';
    }
}


function displaymealInfo() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    console.log(ID);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            console.log(currentUser);

            db.collection("meals")
                .doc(ID)
                .get()
                .then(doc => {
                    thisMeal = doc.data();
                    mealName = doc.data().mealTitle;
                    mealDescription = doc.data().description;

                    document.getElementById("meal-description").innerHTML = mealDescription;

                    // Populate title, image, and star rating
                    document.getElementById("mealName").innerHTML = mealName;
                    let imgEvent = document.querySelector(".meal-img");
                    imgEvent.src = doc.data().image;
                    // Assigning unique ID to the bookmark icon
                    // Attaching an onclick. Calling callback function (with meal's ID)
                    document.querySelector('i').id = 'save-' + ID;   // Guaranteed to be unique
                    document.querySelector('i').onclick = () => toggleBookmark(ID);

                    // Check if the meal is bookmarked by the current user
                    currentUser.get().then(userDoc => {
                        // get the username
                        let bookmarks = userDoc.data().bookmarks;
                        if (bookmarks.includes(ID)) {
                            document.getElementById('save-' + ID).innerText = 'bookmark';
                        }
                    });

                    // Retrieve the rating from the "rating" subcollection
                    db.collection("meals")
                        .doc(ID)
                        .collection("rating")
                        .doc(user.uid)
                        .get()
                        .then(doc => {
                            if (doc.exists) {
                                rating = doc.data().rating;
                            }


                            // Initialize an empty string to store the star rating HTML
                            let starRating = "";
                            // This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
                            for (let i = 0; i < rating; i++) {
                                starRating += '<span class="material-icons">star</span>';
                            }
                            // After the first loop, this second loop runs from i=rating to i<5.
                            for (let i = rating; i < 5; i++) {
                                starRating += '<span class="material-icons">star_outline</span>';
                            }
                            document.querySelector(".star-rating").innerHTML = starRating;

                            calculateAverageRating(ID).then(averageRating => {
                                // Round the average rating to a single decimal place
                                const roundedAverageRating = averageRating.toFixed(1);

                                // Initialize an empty string to store the star rating HTML
                                let starRating = "";
                                // This loop runs from i=0 to i<roundedAverageRating, where 'roundedAverageRating' is the rounded average rating.
                                for (let i = 0; i < roundedAverageRating; i++) {
                                    starRating += '<span class="material-icons">star</span>';
                                }
                                // After the first loop, this second loop runs from i=roundedAverageRating to i<5.
                                for (let i = roundedAverageRating; i < 5; i++) {
                                    starRating += '<span class="material-icons">star_outline</span>';
                                }
                                document.querySelector(".average-rating").innerHTML = starRating;
                            });



                        })
                })
        } else {
            console.log("No user is signed in");
        }
    });
}
displaymealInfo();

function deleteComment(commentID, collection) {
    db.collection(collection).doc(commentID).delete()
        .then(() => {
            clearComments(collection);
            displayCommentsDynamically(collection);
        })
}

function clearComments(collection) {
    // Clear the existing comments before fetching and displaying the updated ones
    let commentsContainer = document.getElementById(collection + "-go-here");
    while (commentsContainer.firstChild) {
        commentsContainer.removeChild(commentsContainer.firstChild);
    }
}


function displayCommentsDynamically(collection) {
    let commentTemplate = document.getElementById("commentTemplate");
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");

    clearComments(collection);

    db.collection(collection)
        .where("docID", "==", ID)
        .get()
        .then(allComments => {
            allComments.forEach(doc => {
                let usernamee = doc.data().username;
                let content = doc.data().content;
                let commentID = doc.id;
                let userID = doc.data().userID;
                let newcomment = commentTemplate.content.cloneNode(true);

                newcomment.querySelector(".content").innerHTML = content;
                newcomment.querySelector(".username").innerHTML = usernamee;

                var user = firebase.auth().currentUser;

                // Check if the current user created the comment
                if (user && user.uid == userID) {
                    let deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.addEventListener("click", () => {
                        deleteComment(commentID, collection);
                    });

                    newcomment.appendChild(deleteButton);
                }

                document.getElementById(collection + "-go-here").appendChild(newcomment);

            })
        })
}
displayCommentsDynamically("comments");

function calculateAverageRating(mealID) {
    // Reference to the "rating" subcollection for the specified meal
    const ratingsRef = db.collection("meals").doc(mealID).collection("rating");

    // Get all the ratings for the meal
    return ratingsRef.get().then(snapshot => {
        if (snapshot.empty) {
            // Return 0 if there are no ratings
            return 0;
        }

        let totalRating = 0;
        let numRatings = 0;

        // Calculate the total rating and count the number of ratings
        snapshot.forEach(doc => {
            const rating = doc.data().rating;
            totalRating += rating;
            numRatings++;
        });

        // Calculate the average rating
        const averageRating = totalRating / numRatings;

        // Return the average rating
        return averageRating


    });
}

// Example usage:
const mealID = "yourMealID"; // Replace with the actual meal ID
calculateAverageRating(mealID).then(averageRating => {
    console.log("Average Rating:", averageRating);
});


function toggleBookmark(mealDocID) {
    var currentUser = firebase.auth().currentUser;
    var userDocRef = db.collection("users").doc(currentUser.uid);

    userDocRef.get()
        .then(function (doc) {
            if (doc.exists) {
                var isBookmarked = doc.data().bookmarks && doc.data().bookmarks.includes(mealDocID);

                if (isBookmarked) {
                    // If already bookmarked, remove it from the bookmarks array
                    return userDocRef.update({
                        bookmarks: firebase.firestore.FieldValue.arrayRemove(mealDocID)
                    })
                        .then(function () {
                            console.log("Bookmark has been removed for " + mealDocID);
                            var iconID = 'save-' + mealDocID;
                            document.getElementById(iconID).innerText = 'bookmark_border';
                            alert("Unbookmarked!");
                        })
                } else {
                    // If not bookmarked, add it to the bookmarks array
                    return userDocRef.update({
                        bookmarks: firebase.firestore.FieldValue.arrayUnion(mealDocID)
                    })
                        .then(function () {
                            console.log("Bookmark has been saved for " + mealDocID);
                            var iconID = 'save-' + mealDocID;
                            document.getElementById(iconID).innerText = 'bookmark';
                            alert("Bookmarked!");
                        })
                }
            }
        })
}



// Select all elements with the class name "star" and store them in the "stars" variable
const stars = document.querySelectorAll('.star');

// Iterate through each star element
stars.forEach((star, index) => {
    // Add a click event listener to the current star
    star.addEventListener('click', () => {
        // Fill in clicked star and stars before it
        for (let i = 0; i <= index; i++) {
            // Change the text content of stars to 'star' (filled)
            document.getElementById(`star${i + 1}`).textContent = 'star';
        }
    });
});

function writeRating() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    // Get the star rating
    // Get all the elements with the class "star" and store them in the 'stars' variable
    const stars = document.querySelectorAll('.star');
    // Initialize a variable 'mealRating' to keep track of the rating count
    let mealRating = 0;
    // Iterate through each element in the 'stars' NodeList using the forEach method
    stars.forEach((star) => {
        // Check if the text content of the current 'star' element is equal to the string 'star'
        if (star.textContent === 'star') {
            // If the condition is met, increment the 'mealRating' by 1
            mealRating++;
        }
    });

    let user = firebase.auth().currentUser;
    if (user) {
        let currentUser = db.collection("users").doc(user.uid);
        let userID = user.uid;

        db.collection("meals").doc(ID).collection("rating").doc(userID).set({
            rating: mealRating,
        }).then(() => {
            window.location.href = "meal.html?docID=" + ID;
        });

    } else {
        console.log("No user is signed in");
    }
}

document.querySelector("#viewPoster").addEventListener('click', function () {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");

    window.location.assign("profile.html?docID=" + ID)
})