function saveProfileDocumentIDAndRedirect(){
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('profileDocID', ID);
    window.location.href = 'editProfile.html';
}


function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);


            // the following functions are always called when someone is logged in
          
            insertNameFromFirestore();
            insertBiographyFirestore();
            insertUserNameFromFirestore();
        
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

  function insertUserNameFromFirestore() {
    currentUser.get().then(userDoc => {
        //get the user name
        var user_userName = userDoc.data().username;
        console.log(user_userName);
        $("#username-goes-here").text(user_userName); //jquery
        // document.getElementByID("name-goes-here").innetText=user_Name;
    })
  }

  function insertBiographyFirestore() {
    currentUser.get().then(userDoc => {
        //get the user name
        var biography = userDoc.data().biography;
        console.log(biography);
        $("#bio-goes-here").text(biography); //jquery
        // document.getElementByID("name-goes-here").innetText=user_Name;
    })
  }

