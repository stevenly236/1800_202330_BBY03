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

//THIS SHOULD BE YOUR CODE TO MAKE ONLY USERS POSTS APPEAR
//function x{
    // db.collection.get whatever ...
// if (user.uid === doc.data().author){
    // document.query whatever to display it
//}

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

  function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("mealTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable.
    
    
    db.collection(collection)
    .orderBy('last_updated', 'desc')
    .get()  
    .then(allMeals=> {
        firebase.auth().onAuthStateChanged(user => {
            if (user) { 
    
            let currentUser = user.uid;
            allMeals.forEach(doc => { 
                if (doc.data().author.includes(currentUser)){

                var cap = doc.data().description;
                var user = doc.data().name;
                var imageURL = doc.data().image;

                let newcard = mealTemplate.content.cloneNode(true); 
                
                newcard.querySelector('.image').src = imageURL;
                newcard.querySelector('.description').innerHTML = cap;
                newcard.querySelector('.name').innerHTML = user;

                document.getElementById(collection + "-go-here").appendChild(newcard);
                }
            })
        }
    })
    })

    
    
}

displayCardsDynamically("meals");