var ImageFile;
function listenFileSelect() {
      var fileInput = document.getElementById("mypic-input"); 
      const image = document.getElementById("mypic-goes-here"); 

      fileInput.addEventListener('change', function (e) {
          ImageFile = e.target.files[0];   
          var blob = URL.createObjectURL(ImageFile);
          image.src = blob; 
      })
}
listenFileSelect();

function savePost() {
  alert ("Posted!");
  firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
          var desc = document.getElementById("description").value;
          db.collection("meals").add({
              owner: user.uid,
              description: desc,
              last_updated: firebase.firestore.FieldValue
                  .serverTimestamp() 
          }).then(doc => {
              console.log("1. Post document added!");
              console.log(doc.id);
              uploadPic(doc.id);
          })
      } else {
         
          console.log("Error, no user signed in");
      }
  });
}

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
                      })

                      .then(function () {
                          console.log('4. Added pic URL to Firestore.');
                          saveMealIDforUser(mealDocID);
                      })
              })
      })
      .catch((error) => {
           console.log("error uploading to cloud storage");
      })
}


function saveMealIDforUser(mealDocID) {
  firebase.auth().onAuthStateChanged(user => {
        console.log("user id is: " + user.uid);
        console.log("mealdoc id is: " + mealDocID);
        db.collection("users").doc(user.uid).update({
              mymeals: firebase.firestore.FieldValue.arrayUnion(mealDocID)
        })
        .then(() =>{
              console.log("5. Saved to user's document!");
              alert ("Post is complete!");
         })
         .catch((error) => {
              console.error("Error writing document: ", error);
         });
  })
}


