
 //Sets up event listeners for sorting buttons and retrieves bookmarks for the authenticated user.
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Retrieve and display user's bookmarks
            getBookmarks(user);

            // Set up event listeners for sorting buttons
            document.getElementById("sortRecentButton").addEventListener("click", function () {
                sortBookmarksByDate(user, "recentlyAdded");
            });

            document.getElementById("sortOldestButton").addEventListener("click", function () {
                sortBookmarksByDate(user, "oldest");
            });

            document.getElementById("sortHighestRatingButton").addEventListener("click", function () {
                sortBookmarksByRating(user, "highest");
            });

            document.getElementById("sortLowestRatingButton").addEventListener("click", function () {
                sortBookmarksByRating(user, "lowest");
            });

        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();


document.getElementById("noBookmarkButton").addEventListener('click', function () {
    window.location.assign('main.html');
});

document.getElementById("noBookmarkMealButton").addEventListener('click', function () {
    window.location.assign('main.html');
});

// Function that retreives bookmarks from collection and displays it 
function getBookmarks(user) {
    document.getElementById("noMealsMessage").style.display = "none";
    db.collection("users").doc(user.uid).collection("bookmarks")
        .get()
        .then(snapshot => {
            const bookmarks = [];
            snapshot.forEach(doc => {
                bookmarks.push(doc.id);
            });

            // Check if there are no bookmarks removes certain elements to display/not display
            if (!bookmarks || bookmarks.length === 0) {
                document.getElementById("noBookmarksMessage").style.display = "block";
                document.getElementById("meals-go-here").style.display = "none";
                document.getElementById("mealTimeDropdown").style.display = "none";
                document.querySelector(".btn-group").style.display = "none";
                document.querySelector(".header-bar").style.display = "none";
                return;
            }
            // Otherwise, display them
            document.querySelector(".btn-group").style.display = "flex";
            document.getElementById("noBookmarksMessage").style.display = "none";
            document.getElementById("meals-go-here").style.display = "block";
            document.querySelector(".header-bar").style.display = "flex";

            // Iterate through the ARRAY of bookmarked hikes (document ID's)
            bookmarks.forEach(thisMeal => {
                // Query meal details from Firestore
                db.collection("meals")
                    .doc(thisMeal)
                    .get()
                    .then(doc => {
                        var docID = doc.id;
                        var mealPoster = doc.data().name;
                        var image = doc.data().image;
                        var mealName = doc.data().mealTitle;
                        var mealType = doc.data().mealTime;
                        var update = doc.data().last_updated.toDate().toLocaleDateString();
                        var arating = doc.data().averagerating;

                        // Clone the new card template
                        let newmeal = mealTemplate.content.cloneNode(true);

                        // Update title and some pertinent information
                        let imgEvent = newmeal.querySelector(".meal-img");
                        imgEvent.src = image;
                        newmeal.querySelector('a').href = "meal.html?docID=" + docID;
                        newmeal.querySelector(".card-title").innerHTML = mealName;
                        newmeal.querySelector(".card-text").innerHTML = mealType;
                        newmeal.querySelector(".update").innerHTML = update;
                        newmeal.querySelector(".rating-number").innerHTML = arating;
                        newmeal.querySelector(".card-poster").innerHTML = mealPoster;

                        // Assigning unique ID to the bookmark icon
                        // Attaching an onclick. Calling callback function (with meal's ID)
                        let bookmarkIcon = newmeal.querySelector("i");
                        if (bookmarkIcon) {
                            bookmarkIcon.id = 'save-' + docID;
                            bookmarkIcon.onclick = (function (mealID) {
                                return function () {
                                    toggleBookmark(mealID);
                                };
                            })(docID);
                        }

                        // Check if the meal is bookmarked and update the bookmark icon
                        let bookmarksCollectionRef = db.collection("users").doc(user.uid).collection("bookmarks");
                        bookmarksCollectionRef.doc(docID).get().then(bookmarkDoc => {
                            if (bookmarkDoc.exists) {
                                if (bookmarkIcon) {
                                    bookmarkIcon.innerText = 'bookmark';
                                }
                            }
                        });

                        // Append the new card to the meals container
                        document.getElementById("meals-go-here").appendChild(newmeal);
                    });
            });
        });
}



 // Filters and displays meals based on mealTime and bookmarks for the authenticated user.
function filterMealsByTimeAndBookmarks(mealTime) {
    // Clear the existing meals in the container
    document.getElementById("meals-go-here").innerHTML = "";
    document.getElementById("noMealsMessage").style.display = "none";

    // Get the current user
    var currentUser = firebase.auth().currentUser;

    // Check if the user is authenticated
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Get the user's bookmarks
            db.collection("users").doc(user.uid).collection("bookmarks")
                .get()
                .then(bookmarksSnapshot => {
                    const bookmarkIDs = bookmarksSnapshot.docs.map(doc => doc.id);

                    // Check if there are no bookmarks
                    if (!bookmarkIDs || bookmarkIDs.length === 0) {
                        document.getElementById("noBookmarksMessage").style.display = "block";
                        document.getElementById("meals-go-here").style.display = "none";
                        return;
                    }

                    document.getElementById("noBookmarksMessage").style.display = "none";
                    document.getElementById("meals-go-here").style.display = "block";

                    // Iterate through the ARRAY of bookmarked meals (document ID's)
                    bookmarkIDs.forEach(thisMeal => {
                        // Query meals collection based on mealTime and bookmarks
                        db.collection("meals")
                            .doc(thisMeal)
                            .get()
                            .then(doc => {
                                // Check if the meal's mealTime matches the specified mealTime
                                if (doc.data().mealTime === mealTime) {
                                    var docID = doc.id;
                                    var mealPoster = doc.data().name;
                                    let image = doc.data().image;
                                    var mealName = doc.data().mealTitle;
                                    var mealType = doc.data().mealTime;
                                    var update = doc.data().last_updated.toDate().toLocaleDateString();
                                    var arating = doc.data().averagerating;

                                    // Clone the new card template
                                    let newmeal = mealTemplate.content.cloneNode(true);

                                    // Update title and some pertinent information
                                    let imgEvent = newmeal.querySelector(".meal-img");
                                    imgEvent.src = image;
                                    newmeal.querySelector('a').href = "meal.html?docID=" + docID;
                                    newmeal.querySelector(".card-title").innerHTML = mealName;
                                    newmeal.querySelector(".card-text").innerHTML = mealType;
                                    newmeal.querySelector(".update").innerHTML = update;
                                    newmeal.querySelector(".rating-number").innerHTML = arating;
                                    newmeal.querySelector(".card-poster").innerHTML = mealPoster;

                                    document.getElementById("noMealsMessage").style.display = "none";

                                    // Assigning unique ID to the bookmark icon
                                    // Attaching an onclick. Calling callback function (with meal's ID)
                                    let bookmarkIcon = newmeal.querySelector("i");
                                    if (bookmarkIcon) {
                                        bookmarkIcon.id = 'save-' + docID;
                                        bookmarkIcon.onclick = (function (mealID) {
                                            return function () {
                                                toggleBookmark(mealID);
                                            };
                                        })(docID);
                                    }

                                    if (bookmarkIDs.includes(docID)) {
                                        if (bookmarkIcon) {
                                            bookmarkIcon.innerText = 'bookmark';
                                        }
                                    }
                                    document.getElementById("meals-go-here").appendChild(newmeal);
                                }
                            })
                    });

                    if (document.getElementById("meals-go-here").childElementCount === 0) {
                        document.querySelector(".btn-group").style.display = "none";
                        document.getElementById("noMealsMessage").style.display = "block";
                        document.querySelector(".header-bar").style.display = "none";
                    } 
                    
                })

        } else {
            console.log("Error, no user signed in");
        }
    });
}

// Example usage when the user selects a mealTime
document.getElementById("breakfast").addEventListener("click", function () {
    filterMealsByTimeAndBookmarks("Breakfast");
});

document.getElementById("lunch").addEventListener("click", function () {
    filterMealsByTimeAndBookmarks("Lunch");
});

document.getElementById("dinner").addEventListener("click", function () {
    filterMealsByTimeAndBookmarks("Dinner");
});

document.getElementById("snack").addEventListener("click", function () {
    filterMealsByTimeAndBookmarks("Snack");
});

document.getElementById("clearFilter").addEventListener("click", function () {
    refreshPage();
    document.getElementById("refresh").style.display = "";
});

function toggleDropdown() {
    var dropdown = document.getElementById("mealTimeDropdown");
    dropdown.classList.toggle("active");
}

// Function to change bookmark icon + open modal
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
                        // If not bookmarked, add it to the bookmarks subcollection
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

function refreshPage() {
    location.reload();
}

// Function to sort bookmarks by rating and display it
function sortBookmarksByRating(user, sortOrder) {
    // Clear existing meals and hide the noMealsMessage
    document.getElementById("meals-go-here").innerHTML = "";
    document.getElementById("noMealsMessage").style.display = "none";

    // Fetch the user's bookmarks
    db.collection("users").doc(user.uid).collection("bookmarks")
        .get()
        .then(snapshot => {
            const bookmarks = [];
            snapshot.forEach(doc => {
                bookmarks.push(doc.id);
            });

            // Check if there are no bookmarks display/not display certain elements
            if (!bookmarks || bookmarks.length === 0) {
                document.getElementById("noBookmarksMessage").style.display = "block";
                document.getElementById("meals-go-here").style.display = "none";
                return;
            }

            // Hide the noBookmarksMessage and display the meals container
            document.getElementById("noBookmarksMessage").style.display = "none";
            document.getElementById("meals-go-here").style.display = "block";

            // Get details for each bookmarked meal
            Promise.all(bookmarks.map(bookmark => {
                return db.collection("meals").doc(bookmark).get();
            })).then(bookmarkDocs => {
                // Sort bookmarks by averagerating
                bookmarkDocs.sort((a, b) => {
                    // Use 0 if averagerating is undefined
                    const ratingA = a.data().averagerating || 0;
                    const ratingB = b.data().averagerating || 0;

                    // Determine the sorting order
                    return sortOrder === "highest" ? ratingB - ratingA : ratingA - ratingB;
                });

                // Display sorted bookmarks
                bookmarkDocs.forEach(doc => {
                    var docID = doc.id;
                    var mealPoster = doc.data().name;
                    var image = doc.data().image;
                    var mealName = doc.data().mealTitle;
                    var mealType = doc.data().mealTime;
                    var update = doc.data().last_updated.toDate().toLocaleDateString();
                    var arating = doc.data().averagerating;

                    // Clone the new card template
                    let newmeal = mealTemplate.content.cloneNode(true);

                    // Update title and some pertinent information
                    let imgEvent = newmeal.querySelector(".meal-img");
                    imgEvent.src = image;
                    newmeal.querySelector('a').href = "meal.html?docID=" + docID;
                    newmeal.querySelector(".card-title").innerHTML = mealName;
                    newmeal.querySelector(".card-text").innerHTML = mealType;
                    newmeal.querySelector(".update").innerHTML = update;
                    newmeal.querySelector(".rating-number").innerHTML = arating;
                    newmeal.querySelector(".card-poster").innerHTML = mealPoster;

                    // Assigning unique ID to the bookmark icon
                    // Attaching an onclick. Calling callback function (with meal's ID)
                    let bookmarkIcon = newmeal.querySelector("i");
                    if (bookmarkIcon) {
                        bookmarkIcon.id = 'save-' + docID;
                        bookmarkIcon.onclick = (function (mealID) {
                            return function () {
                                toggleBookmark(mealID);
                            };
                        })(docID);
                    }

                    // Check if the meal is bookmarked and update the icon accordingly
                    let bookmarksCollectionRef = db.collection("users").doc(user.uid).collection("bookmarks");
                    bookmarksCollectionRef.doc(docID).get().then(bookmarkDoc => {
                        if (bookmarkDoc.exists) {
                            if (bookmarkIcon) {
                                bookmarkIcon.innerText = 'bookmark';
                            }
                        }
                    });

                    // Append the new meal card to the meals-go-here container
                    document.getElementById("meals-go-here").appendChild(newmeal);
                });
            });
        });
}



// Function to sort bookmarks by how recently they were added
function sortBookmarksByDate(user, sortOrder) {
    // Clear existing meals and hide the noMealsMessage
    document.getElementById("meals-go-here").innerHTML = "";
    document.getElementById("noMealsMessage").style.display = "none";

    // Fetch the user's bookmarks and their timestamps
    db.collection("users").doc(user.uid).collection("bookmarks").get().then(snapshot => {
        const bookmarks = [];
        snapshot.forEach(doc => {
            bookmarks.push({ id: doc.id, timestamp: doc.data().timestamp });
        });

        // Check if there are no bookmarks
        if (!bookmarks || bookmarks.length === 0) {
            document.getElementById("noBookmarksMessage").style.display = "block";
            document.getElementById("meals-go-here").style.display = "none";
            return;
        }

        // Hide the noBookmarksMessage and display the meals container
        document.getElementById("noBookmarksMessage").style.display = "none";
        document.getElementById("meals-go-here").style.display = "block";

        // Sort bookmarks by timestamp
        bookmarks.sort((a, b) => {
            const timestampA = a.timestamp || 0;
            const timestampB = b.timestamp || 0;

            // Determine the sorting order
            return sortOrder === "recentlyAdded" ? timestampB - timestampA : timestampA - timestampB;
        });

        // Display sorted bookmarks
        bookmarks.forEach(bookmark => {
            const bookmarkID = bookmark.id;

            // Fetch details for each bookmarked meal
            db.collection("meals").doc(bookmarkID).get().then(doc => {
                var docID = doc.id;  // Autogenerated ID of the document
                var mealPoster = doc.data().name;
                var image = doc.data().image;
                var mealName = doc.data().mealTitle;
                var mealType = doc.data().mealTime;
                var update = doc.data().last_updated.toDate().toLocaleDateString();
                var arating = doc.data().averagerating;

                // Clone the new card template
                let newmeal = mealTemplate.content.cloneNode(true);

                // Update title and some pertinent information
                let imgEvent = newmeal.querySelector(".meal-img");
                imgEvent.src = image;
                newmeal.querySelector('a').href = "meal.html?docID=" + docID;
                newmeal.querySelector(".card-title").innerHTML = mealName;
                newmeal.querySelector(".card-text").innerHTML = mealType;
                newmeal.querySelector(".update").innerHTML = update;
                newmeal.querySelector(".rating-number").innerHTML = arating;
                newmeal.querySelector(".card-poster").innerHTML = mealPoster;

                // Assigning unique ID to the bookmark icon
                // Attaching an onclick. Calling callback function (with meal's ID)
                let bookmarkIcon = newmeal.querySelector("i");
                if (bookmarkIcon) {
                    bookmarkIcon.id = 'save-' + docID;
                    bookmarkIcon.onclick = (function (mealID) {
                        return function () {
                            toggleBookmark(mealID);
                        };
                    })(docID);
                }

                // Check if the meal is bookmarked and update the icon accordingly
                let bookmarksCollectionRef = db.collection("users").doc(user.uid).collection("bookmarks");
                bookmarksCollectionRef.doc(docID).get().then(bookmarkDoc => {
                    if (bookmarkDoc.exists) {
                        if (bookmarkIcon) {
                            bookmarkIcon.innerText = 'bookmark';
                        }
                    }
                });

                // Append the new meal card to the meals-go-here container
                document.getElementById("meals-go-here").appendChild(newmeal);
            });
        });
    });
}
