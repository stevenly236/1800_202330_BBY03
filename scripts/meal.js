var currentUser;

function writeComment() {
    console.log("inside comments");
    let usercontent = document.getElementById("usercomment").value;
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"


    console.log(usercontent);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        // Get the document for the current user.
        db.collection("comments").add({
            docID: ID,
            userID: userID,
            content: usercontent,
            username: user.displayName,
        }).then(() => {
            window.location.href = "meal.html?docID=" + ID;
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'index.html';
    }
}

function displaymealInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    // doublecheck: is your collection called "Reviews" or "reviews"?
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);
            db.collection("meals")
                .doc(ID)
                .get()
                .then(doc => {
                    thisMeal = doc.data();
                    mealName = doc.data().name;
                    rating = doc.data().rating;

                    // only populate title, and image
                    document.getElementById("mealName").innerHTML = mealName;
                    let imgEvent = document.querySelector(".meal-img");
                    imgEvent.src = doc.data().image;
                    //assigning unique ID to the bookmark icon 
                    //attatching an onclick. calling callback function (with meal's ID)
                    document.querySelector('i').id = 'save-' + ID;   //guaranteed to be unique
                    document.querySelector('i').onclick = () => toggleBookmark(ID);

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
                   function displaymealInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    // doublecheck: is your collection called "Reviews" or "reviews"?
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);
            db.collection("meals")
                .doc(ID)
                .get()
                .then(doc => {
                    thisMeal = doc.data();
                    mealName = doc.data().name;

                    // only populate title, and image
                    document.getElementById("mealName").innerHTML = mealName;
                    let imgEvent = document.querySelector(".meal-img");
                    imgEvent.src = doc.data().image;
                    //assigning unique ID to the bookmark icon 
                    //attatching an onclick. calling callback function (with hike's ID)
                    document.querySelector('i').id = 'save-' + ID;   //guaranteed to be unique
                    document.querySelector('i').onclick = () => saveBookmark(ID);
                    document.querySelector('a').href = "profile.html?user.uid=" + user.uid;
                

                    currentUser.get().then(userDoc => {
                        //get the user name
                        var bookmarks = userDoc.data().bookmarks;
                        if (bookmarks.includes(ID)) {
                            document.getElementById('save-' + ID).innerText = 'bookmark';
                        }
                    })
                });
        } else {
            console.log("No user is signed in");
        }
    });
}
displaymealInfo();
                

                    currentUser.get().then(userDoc => {
                        //get the user name
                        var bookmarks = userDoc.data().bookmarks;
                        if (bookmarks.includes(ID)) {
                            document.getElementById('save-' + ID).innerText = 'bookmark';
                        }
                    })
                });
        } else {
            console.log("No user is signed in");
        }
    });
}
displaymealInfo();




function displayCommentsDynamically(collection) {
    let commentTemplate = document.getElementById("commentTemplate");
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");

    db.collection(collection)
        .where("docID", "==", ID)
        .get()
        .then(allComments => {
            allComments.forEach(doc => {
                var usernamee = doc.data().username;
                var content = doc.data().content;
                let newcomment = commentTemplate.content.cloneNode(true);

                newcomment.querySelector(".content").innerHTML = content;
                newcomment.querySelector(".username").innerHTML = usernamee;

                document.getElementById(collection + "-go-here").appendChild(newcomment);

            })
        })
}
displayCommentsDynamically("comments");

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

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        db.collection("meals").doc(ID).update({
            rating: mealRating
        })
    } else {
        console.log("No user is signed in");
    }
}
document.querySelector("#viewPoster").addEventListener('click', function() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");

    window.location.assign("profile.html?docID=" + ID)
})