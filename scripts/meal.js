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

                    // only populate title, and image
                    document.getElementById("mealName").innerHTML = mealName;
                    let imgEvent = document.querySelector(".meal-img");
                    imgEvent.src = doc.data().image;
                    //assigning unique ID to the bookmark icon 
                    //attatching an onclick. calling callback function (with hike's ID)
                    document.querySelector('i').id = 'save-' + ID;   //guaranteed to be unique
                    document.querySelector('i').onclick = () => saveBookmark(ID);

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

function saveBookmark(mealDocID) {
    // Manage the backend process to store the hikeDocID in the database, recording which hike was bookmarked by the user.
    currentUser.update({
        // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
        // This method ensures that the ID is added only if it's not already present, preventing duplicates.
        bookmarks: firebase.firestore.FieldValue.arrayUnion(mealDocID)
    })
        // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
        .then(function () {
            console.log("bookmark has been saved for" + mealDocID);
            var iconID = 'save-' + mealDocID;
            //console.log(iconID);
            //this is to change the icon of the hike that was saved to "filled"
            document.getElementById(iconID).innerText = 'bookmark';
        });
}