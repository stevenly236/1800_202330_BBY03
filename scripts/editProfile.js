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

  var currentUser;               //points to the document of the user who is logged in
  function populateUserInfo() {
      firebase.auth().onAuthStateChanged(user => {
          // Check if user is signed in:
          if (user) {
  
              //go to the correct user document by referencing to the user uid
              currentUser = db.collection("users").doc(user.uid)
              //get the document for current user.
              currentUser.get()
                  .then(userDoc => {
                      //get the data fields of the user
                      var userName = userDoc.data().name;
                      var userUsername = userDoc.data().username;
                      var userGender = userDoc.data().gender;
                      var userBiography= userDoc.data().biography;
  
                      //if the data fields are not empty, then write them in to the form.
                      if (userName != null) {
                          document.getElementById("name").value = name;
                      }
                      if (userUsername != null) {
                          document.getElementById("username").value = userName;
                      }
                      if (userGender != null) {
                          document.getElementById("gender").value = userGender;
                      }
                      if (userBiography != null) {
                        document.getElementById("biography").value = userBiography;
                    }

                  })
          } else {
              // No user is signed in.
              console.log("No user is signed in");
          }
      });
  }
  
  //call the function to run it 
  populateUserInfo();
  
 
  
  function saveProfile() {
      //enter code here
  
      //a) get user entered values
     userName = document.getElementById('name').value;       
      userUsername = document.getElementById('username').value;    
      userGender = document.getElementById('gender').value;       
      userBiography = document.getElementById('biography').value;  
      //b) update user's document in Firestore
      currentUser.update({
          name: userName,
          username: userUsername,
          gender: userGender,
          biography: userBiography
      })
          .then(() => {
              console.log("Document successfully updated!");
              window.location.href = "profileSelf.html";
          })
        }



 