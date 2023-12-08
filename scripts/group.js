function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            document.getElementById("name-goes-here").innerText = userName;    
        } else {
            // No user is signed in.
        }
    });
}
getNameFromAuth(); //run the function

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("groupTemplate"); 

    db.collection(collection).get()   
        .then(allCaptions=> {
            allCaptions.forEach(doc => { 
                var cap = doc.data().caption;     // name of caption key
                var img1 = doc.data().caption; 

                let newcard = groupTemplate.content.cloneNode(true); 

                newcard.querySelector('.caption').innerHTML = cap;

                document.getElementById(collection + "-go-here").appendChild(newcard);

            })
        })
}

displayCardsDynamically("captions"); // database name