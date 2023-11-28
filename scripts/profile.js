function changeButtonText() {
  let followButton = document.querySelector('.follow-button');

  if (followButton.innerHTML === 'Follow') {
    followButton.innerHTML = 'Following';
    // Call a function to save the followed user's ID into Firestore
    let params = new URL(window.location.href)
    let ID = params.searchParams.get("docID");
    saveFollowedUserID(ID);
  } else {
    followButton.innerHTML = 'Follow';
    // Call a function to remove the followed user's ID from Firestore
    let params = new URL(window.location.href)
    let ID = params.searchParams.get("docID");
    removeFollowedUserID(ID);
  }
}

function saveFollowedUserID (userID) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      db.collection("users").doc(user.uid).update({
        followerID: firebase.firestore.FieldValue.arrayUnion(userID)
      }).then(() => {
        console.log("Follow success")
      })
    }
  })
}

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
doAll();

//THIS SHOULD BE YOUR CODE TO MAKE ONLY USERS POSTS APPEAR
//function x{
  // db.collection.get whatever ...
// if (user.uid === doc.data().author){
  // document.query whatever to display it
//}

function insertNameFromFirestore(currentUser) {
  db.collection("users").doc(currentUser).get().then((userDoc) => {
    var user_Name = userDoc.data().name;
    console.log(user_Name);
    $("#name-goes-here").text(user_Name); //jquery
    // document.getElementByID("name-goes-here").innetText=user_Name;
  })

}

function insertUserNameFromFirestore(currentUser) {
  db.collection("users").doc(currentUser).get().then((userDoc) => {
    var user_Name = userDoc.data().username;
    console.log(user_Name);
    $("#username-goes-here").text(user_Name); //jquery
    // document.getElementByID("name-goes-here").innetText=user_Name;
  })
}

function insertBiographyFirestore(currentUser) {    
  db.collection("users").doc(currentUser).get().then((userDoc) => {
      //get the user name
      var biography = userDoc.data().biography;
      console.log(biography);
      $("#bio-goes-here").text(biography); //jquery
      // document.getElementByID("name-goes-here").innetText=user_Name;
  })
}

function displayCardsDynamically(collection) {
  let cardTemplate = document.getElementById("mealTemplate"); 
  
  
  db.collection(collection)
  .orderBy('last_updated', 'desc')
  .get()  
  .then(allMeals=> {
      firebase.auth().onAuthStateChanged(user => {
          if (user) { 
            let params = new URL(window.location.href);
            let ID = params.searchParams.get("docID");

            db.collection('meals').doc(ID).get().then((mealDoc) => {
              let currentUser = mealDoc.data().author;

              


            
          
          allMeals.forEach(doc => { 
              if (doc.data().author.includes(currentUser)){
                db.collection("users").doc(currentUser).get().then((userDoc) =>{
                  insertNameFromFirestore(currentUser);
                  insertBiographyFirestore(currentUser);
                  insertUserNameFromFirestore(currentUser);
                })

                  var cap = mealDoc.data().description;
                  var user = mealDoc.data().name;
                  var imageURL = mealDoc.data().image;
                  let newcard = mealTemplate.content.cloneNode(true); 
              console.log(imageURL);
              console.log(mealDoc.data())
              newcard.querySelector('.image').src = imageURL;
              newcard.querySelector('.description').innerHTML = cap;
              newcard.querySelector('.name').innerHTML = user;


              document.getElementById(collection + "-go-here").appendChild(newcard);
                
              

              
              }
          })
        })
      }
  })
  }) 
}

displayCardsDynamically("meals");


