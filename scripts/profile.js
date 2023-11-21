const followButton = document.getElementById("followButton");

// This function will handle the click event on the follow button
followButton.addEventListener("click", function() {
  if (followButton.classList.contains("following")) {
    // Remove user from 'followers' collection
    removeFollower(currentUser); // Assuming currentUser is defined elsewhere
    followButton.textContent = "Follow";
    followButton.classList.remove("following");
    followButton.style.backgroundColor = "#4da6ff";
  } else {
    // Add user to 'followers' collection
    addFollower(currentUser); // Assuming currentUser is defined elsewhere
    followButton.textContent = "Following";
    followButton.classList.add("following");
    followButton.style.backgroundColor = "#99ccff";
  }
});

// Function to add a user to the 'followers' collection in Firestore
function addFollower(user) {
  db.collection("followers").doc(user.id).set({
    // You can store additional data or just use a timestamp
    followedAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("User added to followers");
  })
  .catch((error) => {
    console.error("Error adding user to followers: ", error);
  });
}

// Function to remove a user from the 'followers' collection in Firestore
function removeFollower(user) {
  db.collection("followers").doc(user.id).delete()
  .then(() => {
    console.log("User removed from followers");
  })
  .catch((error) => {
    console.error("Error removing user from followers: ", error);
  });
}


var currentUser;   

//Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);


            // the following functions are always called when someone is logged in
          
            insertNameFromFirestore();
        
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();


function insertNameFromFirestore() {
  currentUser.get().then(userDoc => {
      //get the user name
      var user_Name = userDoc.data().name;
      console.log(user_Name);
      $("#name-goes-here").text(user_Name); //jquery
      // document.getElementByID("name-goes-here").innetText=user_Name;
  })
}


function writeFollowers() {
  //define a variable for the collection you want to create in Firestore to populate data
  var followersRef = db.collection("followers");

  followersRef.add({
      number: 100,
      last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023")) //current system time
  });
}

function displayFollowersDynamically(collection) {
  let followerTemplate = document.getElementById("followerTemplate"); 

  db.collection(collection).get() 
      .then(allFollowers=> {
  
          allFollowers.forEach(doc => { //iterate thru each doc
              var follower = doc.data().number;       
            
              let newfollowers = followerTemplate.content.cloneNode(true);  

              newfollowers.querySelector('.followers').innerHTML = follower;
              
              document.getElementById(collection + "-go-here").appendChild(newfollowers);

          })
      })
}

displayFollowersDynamically("followers");  //input param is the name of the collection




function writeMeals() {
  //define a variable for the collection you want to create in Firestore to populate data
  var mealssRef = db.collection("meals");

  mealsRef.add({
      image: null, 
      last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023")) //current system time
  });
}

function displayMealsDynamically(collection) {
  let mealTemplate = document.getElementById("mealTemplate"); 

  db.collection(collection).get() 
      .then(allMeals=> {
  
          allMeals.forEach(doc => { //iterate thru each doc
              var meal = doc.data().image;       
            
              let newmeals = mealTemplate.content.cloneNode(true);  

              newmeals.querySelector('.followers').innerHTML = meal;
              
              document.getElementById(collection + "-go-here").appendChild(newmeals);

          })
      })
}

displayMealsDynamically("meals");  //input param is the name of the collection

