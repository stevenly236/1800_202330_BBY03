function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            getBookmarks(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();

function getBookmarks(user) {
    document.getElementById("noMealsMessage").style.display = "none";
    db.collection("users").doc(user.uid).get()
    
        .then(userDoc => {

            // Get the Array of bookmarks
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            // Get pointer the new card template
            let mealTemplate = document.getElementById("mealTemplate");

            if (!bookmarks || bookmarks.length === 0) {
                document.getElementById("noBookmarksMessage").style.display = "block"; // Display the Jumbotron
                document.getElementById("meals-go-here").style.display = "none"; // Hide the meals container
                document.getElementById("mealTimeDropdown").style.display = "none";
                return;
            }

            document.getElementById("noBookmarksMessage").style.display = "none";
            document.getElementById("meals-go-here").style.display = "block";



            // Iterate through the ARRAY of bookmarked hikes (document ID's)
            bookmarks.forEach(thisMeal => {
                console.log(thisMeal);
                db.collection("meals")
                    .doc(thisMeal)
                    .get()
                    .then(doc => {
                        var docID = doc.id;  //this is the autogenerated ID of the document
                        var image = doc.data().image;
                        var mealName = doc.data().name;
                        var desc = doc.data().description;
                        var update = doc.data().last_updated.toDate().toLocaleDateString();
                        //clone the new card
                        let newmeal = mealTemplate.content.cloneNode(true);

                        //update title and some pertinant information
                        let imgEvent = newmeal.querySelector(".meal-img");
                        imgEvent.src = image;
                        newmeal.querySelector('a').href = "meal.html?docID=" + docID;
                        newmeal.querySelector(".card-title").innerHTML = mealName;
                        newmeal.querySelector(".card-text").innerHTML = desc;
                        newmeal.querySelector(".update").innerHTML = update;

                        document.getElementById("meals-go-here").appendChild(newmeal);
                    })
            });
        })
}

function filterMealsByTimeAndBookmarks(mealTime) {
    // Clear the existing meals in the container
    document.getElementById("meals-go-here").innerHTML = "";
    document.getElementById("noMealsMessage").style.display = "none";

    // Get the current user
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Get the user's bookmarks
            db.collection("users").doc(user.uid).get()
                .then(userDoc => {
                    var bookmarks = userDoc.data().bookmarks;

                    // Check if there are no bookmarks
                    if (!bookmarks || bookmarks.length === 0) {
                        document.getElementById("noBookmarksMessage").style.display = "block"; // Display the Jumbotron
                        document.getElementById("meals-go-here").style.display = "none"; // Hide the meals container
                        return;
                    }

                    document.getElementById("noBookmarksMessage").style.display = "none";
                    document.getElementById("meals-go-here").style.display = "block";

                    // Iterate through the ARRAY of bookmarked meals (document ID's)
                    bookmarks.forEach(thisMeal => {
                        // Query meals collection based on mealTime and bookmarks
                        db.collection("meals")
                            .doc(thisMeal)
                            .get()
                            .then(doc => {
                                if (doc.data().mealTime === mealTime) {
                                    var mealId = doc.id; //this is the autogenerated ID of the document
                                    let image = doc.data().image;
                                    var mealName = doc.data().name;
                                    var desc = doc.data().description;
                                    var update = doc.data().last_updated.toDate().toLocaleDateString();

                                    // Clone the new card template
                                    let newmeal = mealTemplate.content.cloneNode(true);

                                    // Update title and some pertinent information
                                    let imgEvent = newmeal.querySelector(".meal-img");
                                    imgEvent.src = image;
                                    newmeal.querySelector('a').href = "meal.html?docID=" + mealId;
                                    newmeal.querySelector(".card-title").innerHTML = mealName;
                                    newmeal.querySelector(".card-text").innerHTML = desc;
                                    newmeal.querySelector(".update").innerHTML = update;

                                    // Append the new meal to the container
                                    document.getElementById("meals-go-here").appendChild(newmeal);
                                    document.getElementById("noMealsMessage").style.display = "none";
                                }
                            })
                    });

                    if (document.getElementById("meals-go-here").childElementCount === 0) {
                        document.getElementById("noMealsMessage").style.display = "block";
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
    clearFilterAndShowAllBookmarks();
});

function toggleDropdown() {
    var dropdown = document.getElementById("mealTimeDropdown");
    dropdown.classList.toggle("active");
}


// Function to clear the filter and show all bookmarked meals
function clearFilterAndShowAllBookmarks() {
    // Clear the existing meals and Jumbotron
    document.getElementById("meals-go-here").innerHTML = "";
    document.getElementById("noMealsMessage").style.display = "none";

    // Get the current user
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Get the user's bookmarks
            db.collection("users").doc(user.uid).get()
                .then(userDoc => {
                    var bookmarks = userDoc.data().bookmarks;

                    // Check if there are no bookmarks
                    if (!bookmarks || bookmarks.length === 0) {
                        document.getElementById("noBookmarksMessage").style.display = "block"; // Display the no bookmarks Jumbotron
                        document.getElementById("meals-go-here").style.display = "none"; // Hide the meals container
                        return;
                    }

                    // Iterate through the ARRAY of bookmarked meals (document ID's)
                    bookmarks.forEach(thisMeal => {
                        // Query meals collection based on bookmarks
                        db.collection("meals")
                            .doc(thisMeal)
                            .get()
                            .then(doc => {
                                var mealId = doc.id; //this is the autogenerated ID of the document
                                var image = doc.data().image;
                                var mealName = doc.data().name;
                                var desc = doc.data().description;
                                var update = doc.data().last_updated.toDate().toLocaleDateString();

                                // Clone the new card template
                                let newmeal = mealTemplate.content.cloneNode(true);

                                // Update title and some pertinent information
                                let imgEvent = newmeal.querySelector(".meal-img");
                                imgEvent.src = image;
                                newmeal.querySelector('a').href = "meal.html?docID=" + mealId;
                                newmeal.querySelector(".card-title").innerHTML = mealName;
                                newmeal.querySelector(".card-text").innerHTML = desc;
                                newmeal.querySelector(".update").innerHTML = update;

                                // Append the new meal to the container
                                document.getElementById("meals-go-here").appendChild(newmeal);
                                document.getElementById("noMealsMessage").style.display = "none";
                            })
                    });

                    // Display the no meals Jumbotron if no meals are found
                    if (document.getElementById("meals-go-here").childElementCount === 0) {
                        document.getElementById("noMealsMessage").style.display = "block";
                    } 
                })
        } else {
            console.log("Error, no user signed in");
        }
    });
}

document.querySelector("#noBookmarkButton").addEventListener('click', function () {
    window.location.assign("main.html")
})
