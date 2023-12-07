/**
 * Event listener for the file input change event.
 * Updates the global variable `ImageFile` with the selected file and displays the image preview.
 */
var ImageFile;

function listenFileSelect() {
    var fileInput = document.getElementById("mypic-input"); 
    const image = document.getElementById("mypic-goes-here"); 

    fileInput.addEventListener('change', function (e) {
        ImageFile = e.target.files[0];   
        var blob = URL.createObjectURL(ImageFile);
        image.src = blob; 
    });
}

// Initialize the file selection listener
listenFileSelect();

/**
 * Saves a new post to the Firestore database.
 * Retrieves user input for title, description, and meal type.
 * Creates a new document in the "meals" collection and uploads the associated image.
 */
function savePost() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var desc = document.getElementById("description").value;
            var type = document.querySelector('input[name="type"]:checked').value;
            var title = document.getElementById("title").value;

            db.collection("meals").add({
                mealTitle: title,
                author: user.uid,
                description: desc,
                name: user.displayName,
                rating: null,
                mealTime: type,
                last_updated: firebase.firestore.FieldValue.serverTimestamp()
            }).then(doc => {
                console.log("1. Post document added!");
                console.log(doc.id);
                uploadPic(doc.id);
            });
        } else {
            console.log("Error, no user signed in");
        }
    });
}

/**
 * Uploads the selected image file to Cloud Storage.
 * Retrieves the download URL of the uploaded image and updates the corresponding Firestore document.
 *
 * @param {string} mealDocID - The ID of the meal document in Firestore.
 */
function uploadPic(mealDocID) {
    console.log("inside uploadPic " + mealDocID);
    var storageRef = storage.ref("images/" + mealDocID + ".jpg");

    storageRef.put(ImageFile)
        .then(function () {
            console.log('2. Uploaded to Cloud Storage.');
            storageRef.getDownloadURL()
                .then(function (url) {
                    console.log("3. Got the download URL.");

                    db.collection("meals").doc(mealDocID).update({
                        "image": url 
                    }).then(function () {
                        console.log('4. Added pic URL to Firestore.');
                        saveMealIDforUser(mealDocID);
                    });
                });
        })
        .catch((error) => {
            console.log("error uploading to cloud storage");
        });
}


/**
 * Saves the created meal's ID to the current user's document in Firestore.
 * Redirects the user to the main page after successful completion.
 *
 * @param {string} mealDocID - The ID of the meal document in Firestore.
 */
function saveMealIDforUser(mealDocID) {
    firebase.auth().onAuthStateChanged(user => {
        console.log("user id is: " + user.uid);
        console.log("mealdoc id is: " + mealDocID);
        db.collection("users").doc(user.uid).update({
            mymeals: firebase.firestore.FieldValue.arrayUnion(mealDocID)
        }).then(() => {
            console.log("5. Saved to user's document!");
            alert("Post is complete!");
            window.location.href = "main.html";
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    });
}
