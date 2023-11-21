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
                          document.getElementById("name").value = userName;
                      }
                      if (userUsername != null) {
                          document.getElementById("username").value = userUsername;
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
    // Get user entered values
    var userName = document.getElementById('name').value.trim();
    var userUsername = document.getElementById('username').value.trim();
    var userGender = document.getElementById('gender').value;
    var userBiography = document.getElementById('biography').value.trim();

    // Check if name, username, and biography are not blank
    if (userName !== '' && userUsername !== '' && userBiography !== '') {
        // Validate 'Name' field to accept only letters and have at least 3 characters
        if (!/^[a-zA-Z]{3,}$/.test(userName)) {
            // If the 'Name' field contains non-letter characters or is less than 3 characters, highlight it and show a message
            document.getElementById('name').style.borderColor = 'red';
            alert("Please enter at least 3 letters in the Name field.");
            return;
        }

        // Validate 'Username' field length
        if (userUsername.length < 3 || userUsername.length > 12) {
            // If the 'Username' field length doesn't meet the criteria, highlight it and show a message
            document.getElementById('username').style.borderColor = 'red';
            alert("Username must be at least 3 characters long and cannot exceed 12 characters.");
            return;
        }

        // Validate 'Biography' field word count
        var biographyWordCount = userBiography.split(/\s+/).length;
        if (biographyWordCount > 20) {
            // If the 'Biography' field exceeds 20 words, show a message and highlight the field
            document.getElementById('biography').style.borderColor = 'red';
            alert("Biography cannot exceed 20 words.");
            return;
        }

        // Update user's document in Firestore
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
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    } else {
        // Highlight the empty fields by adding a red border or changing background color
        if (userName === '') {
            document.getElementById('name').style.borderColor = 'red';
        }
        if (userUsername === '') {
            document.getElementById('username').style.borderColor = 'red';
        }
        if (userBiography === '') {
            document.getElementById('biography').style.borderColor = 'red';
        }
        // You can add more specific styling or customize as needed
    }
}





