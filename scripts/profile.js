/**
 * Changes the text of a button and updates the user's followers in Firestore based on the button action.
 * @param {HTMLButtonElement} followButton - The button element to change the text.
 * @param {string} userID - The ID of the user to follow or unfollow.
 */
function changeButtonText(followButton, userID) {
  if (followButton.innerHTML === 'Follow') {
    followButton.innerHTML = 'Following';
    saveFollowedUserID(userID);
  } else {
    followButton.innerHTML = 'Follow';
    removeFollowedUserID(userID);
  }
}

/**
 * Saves the followed user's ID to the current user's Firestore document.
 * @param {string} userID - The ID of the user to be followed.
 */
function saveFollowedUserID(userID) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection("users").doc(user.uid).update({
        followerID: firebase.firestore.FieldValue.arrayUnion(userID)
      }).then(() => {
        console.log("Follow success");
      });
    }
  });
}


/**
 * Removes the followed user's ID from the current user's Firestore document.
 * @param {string} userID - The ID of the user to be unfollowed.
 */
function removeFollowedUserID(userID) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection("users").doc(user.uid).update({
        followerID: firebase.firestore.FieldValue.arrayRemove(userID)
      }).then(() => {
        console.log("Unfollow success");
      });
    }
  });
}

/**
 * Performs necessary actions when a user is logged in, such as initializing global variables.
 * Redirects to the login page if no user is signed in.
 */
function doAll() {
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
          currentUser = db.collection("users").doc(user.uid); //global
          console.log(currentUser);

          // the following functions are always called when someone is logged in
      } else {
          // No user is signed in.
          console.log("No user is signed in");
          window.location.href = "login.html";
      }
  });
}
å
function insertNameFromFirestore(currentUser) {
  db.collection("users").doc(currentUser).get().then((userDoc) => {
    var user_Name = userDoc.data().name;
    console.log(user_Name);
    $("#name-goes-here").text(user_Name); //jquery
  })

}

function insertUserNameFromFirestore(currentUser) {
  db.collection("users").doc(currentUser).get().then((userDoc) => {
    var user_Name = userDoc.data().username;
    console.log(user_Name);
    $("#username-goes-here").text(user_Name); //jquery
  })
}

function insertBiographyFirestore(currentUser) {    
  db.collection("users").doc(currentUser).get().then((userDoc) => {
      //get the user name
      var biography = userDoc.data().biography;
      console.log(biography);
      $("#bio-goes-here").text(biography); //jquery
  })
}

/**
 * Displays meal cards dynamically based on the provided collection.
 * Fetches meals from Firestore, filters them based on the current user's meals,
 * and dynamically creates and appends HTML cards with relevant information.
 * Also handles follow button functionality for the displayed user.
 * @param {string} collection - The Firestore collection name containing meal data.
 */
function displayCardsDynamically(collection) {
  let cardTemplate = document.getElementById("mealTemplate"); 

  // Fetch meals from Firestore and order them by last_updated in descending order
  db.collection(collection)
    .orderBy('last_updated', 'desc')
    .get()
    .then(allMeals => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // Get the meal ID from the URL parameters
          let params = new URL(window.location.href);
          let ID = params.searchParams.get("docID");

          // Fetch the meal document based on the provided meal ID
          db.collection('meals').doc(ID).get().then((mealDoc) => {
            let currentUser = mealDoc.data().author;

            // Iterate through all meals and display only those by the current user
            allMeals.forEach(doc => { 
              if (doc.data().author.includes(currentUser)) {
                db.collection("users").doc(currentUser).get().then((userDoc) => {
                  // Insert user information into the respective HTML elements
                  insertNameFromFirestore(currentUser);
                  insertBiographyFirestore(currentUser);
                  insertUserNameFromFirestore(currentUser);

                  const followButton = document.getElementById('followButton');
                  const userID = userDoc.id;

                  // Check if the user is already being followed and set the initial button text
                  isUserFollowed(userID).then((isFollowed) => {
                    followButton.innerHTML = isFollowed ? 'Following' : 'Follow';
                  });

                  // Add event listener to the "Follow" button
                  followButton.addEventListener('click', function() {
                    changeButtonText(this, userID); // Pass the button and user ID as arguments
                  }, { once: true });

                });

                // Extract meal information from Firestore and create a new card
                var cap = mealDoc.data().description;
                var user = mealDoc.data().name;
                var imageURL = mealDoc.data().image;
                let newcard = mealTemplate.content.cloneNode(true); 

                // Update the card elements with meal information
                newcard.querySelector('.image').src = imageURL;
                newcard.querySelector('.description').innerHTML = cap;
                newcard.querySelector('.name').innerHTML = user;

                // Append the new card to the specified HTML container
                document.getElementById(collection + "-go-here").appendChild(newcard);
              }
            });
          });
        }
      });
    }) 
}

// Display meals dynamically for the specified collection (e.g., "meals")
displayCardsDynamically("meals");



/**
 * Checks if the current authenticated user is following the specified user.
 * @param {string} userID - The user ID to check for following status.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the user is followed.
 */
async function isUserFollowed(userID) {
  return new Promise((resolve, reject) => {
    // Listen for changes in the authentication state
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Fetch the current user's document from Firestore
        db.collection("users").doc(user.uid).get().then((doc) => {
          // Extract the follower IDs or use an empty array if none exists
          const followerIDs = doc.data().followerID || [];

          // Resolve the promise with a boolean indicating if the user is followed
          resolve(followerIDs.includes(userID));
        }).catch(reject);
      } else {
        // If no user is authenticated, resolve with false (user is not followed)
        resolve(false);
      }
    });
  });
}
