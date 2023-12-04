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
                    mealPoster = doc.data().name;
                    mealType = doc.data().mealTime;

                    document.getElementById("meal-description").innerHTML = mealDescription;
                    document.getElementById("mealPoster").innerHTML = mealPoster;
                    document.getElementById("mealType").innerHTML = mealType;


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
                        let bookmarksCollectionRef = currentUser.collection("bookmarks");
                        bookmarksCollectionRef.doc(ID).get().then(bookmarkDoc => {
                            if (bookmarkDoc.exists) {
                            document.querySelector('i').innerText = 'bookmark';
                            }
                        });
                    });

                    // Retrieve the rating from the "rating" subcollection
                    db.collection("meals")
                        .doc(ID)
                        .collection("rating")
                        .doc(user.uid)
                        .get()
                        .then(doc => {
                            let rating = 0;
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
                                const roundedAverageRating = Math.round(averageRating || 0);
                                console.log("Average Rating:", roundedAverageRating);

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

                                return db.collection("meals")
                                    .doc(ID)
                                    .update({ averagerating: Math.round(roundedAverageRating) })
                                    .then(() => {
                                        console.log("Average rating updated in the meal document");
                                    })
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
            if (allComments.size === 0) {
                displayNoCommentsAlert();
            } else {
                allComments.forEach(doc => {

                    let usernamee = doc.data().username;
                    let content = doc.data().content;
                    let commentID = doc.id;
                    let userID = doc.data().userID;
                    var date = doc.data().timestamp.toDate();
                    let newcomment = commentTemplate.content.cloneNode(true);

                    var timeDiff = Date.now() - date.getTime();
                    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

                    // Calculate days, hours, and remaining minutes
                    const daysDiff = Math.floor(minutesDiff / (24 * 60));
                    const hoursDiff = Math.floor((minutesDiff % (24 * 60)) / 60);
                    const remainingMinutes = minutesDiff % 60;

                    let timeAgo;

                    if (daysDiff > 0) {
                        timeAgo = daysDiff + " days ago";
                    } else if (hoursDiff > 0) {
                        timeAgo = hoursDiff + " hours ago";
                    } else {
                        timeAgo = remainingMinutes + " minutes ago";
                    }

                    newcomment.querySelector(".content").innerHTML = content;
                    newcomment.querySelector(".username").innerHTML = usernamee;
                    newcomment.getElementById("timeAgo").innerHTML = timeAgo;

                    var user = firebase.auth().currentUser;

                    // Check if the current user created the comment
                    if (user && user.uid == userID) {
                        let deleteButton = document.createElement("span");
                        deleteButton.innerHTML = '<span class="material-icons">delete</span>';
                        deleteButton.classList.add("delete-button");
                        deleteButton.addEventListener("click", () => {
                            openDeleteModal(commentID, collection);
                        });

                        newcomment.getElementById("delete-icon").appendChild(deleteButton);
                    }

                    document.getElementById(collection + "-go-here").appendChild(newcomment);
                    removeNoCommentsAlert();

                })
            }
        })

}
displayCommentsDynamically("comments");

// Function to open the delete confirmation modal
function openDeleteModal(commentID, collection) {
    // Get the modal element
    document.getElementById("deleteModal")
        .querySelector("#modalDeleteButton")
        .onclick = function () {
            // Call the deleteComment function when the modal delete button is clicked
            deleteComment(commentID, collection);
            // Close the modal after deletion
            $('#deleteModal').modal('hide');
        };
    // Open the modal
    $('#deleteModal').modal('show');
}

function displayNoCommentsAlert() {
    let alertContainer = document.getElementById("alert-container");

    let alertElement = document.createElement("div");
    alertElement.classList.add("alert", "alert-success", "alert-dismissible", "fade", "show");

    alertElement.innerHTML = `
        Be the <strong>first</strong> to leave a comment!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
        </button>
    `;

    alertContainer.appendChild(alertElement);
}

function removeNoCommentsAlert() {
    let alertContainer = document.getElementById("alert-container");
    alertContainer.innerHTML = "";
}

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

const mealID = "MealID";
calculateAverageRating(mealID).then(averageRating => {
    console.log("Average Rating:", averageRating);
});


function toggleBookmark(mealDocID) {
    var currentUser = firebase.auth().currentUser;
    var userDocRef = db.collection("users").doc(currentUser.uid);
    var bookmarksCollectionRef = userDocRef.collection("bookmarks");

    userDocRef.get()
        .then(function (doc) {
            if (doc.exists) {
                return bookmarksCollectionRef.doc(mealDocID).get().then(bookmarkDoc => {
                    var isBookmarked = bookmarkDoc.exists;

                    if (isBookmarked) {
                        // If already bookmarked, remove it from the bookmarks array
                        return bookmarksCollectionRef.doc(mealDocID).delete().then(function () {
                            console.log("Bookmark has been removed for " + mealDocID);
                            var iconID = 'save-' + mealDocID;
                            document.getElementById(iconID).innerText = 'bookmark_border';
                            document.getElementById('bookmarkModalLabel').innerHTML = 'Bookmark Removed!';
                        });
                    } else {
                        return bookmarksCollectionRef.doc(mealDocID).set({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        }).then(function () {
                            console.log("Bookmark has been saved for " + mealDocID);
                            var iconID = 'save-' + mealDocID;
                            document.getElementById(iconID).innerText = 'bookmark';
                            document.getElementById('bookmarkModalLabel').innerHTML = 'Bookmark Added!';
                        });
                    }
                });
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
    console.log("working");

    db.collection('meals').doc(ID).get().then(mealDoc => {
        let posterID = mealDoc.data().author

        firebase.auth().onAuthStateChanged(user => {
            let userID = user.uid

            if (userID == posterID) {
                console.log("hahaha")
                window.location.assign("profileSelf.html")
            } else {
                console.log("nonono")
                window.location.assign("profile.html?docID=" + ID)
            }
        })
    })


})