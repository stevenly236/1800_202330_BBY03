function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method #1:  insert with JS
            document.getElementById("name-goes-here").innerText = userName;    

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
        }
    });
}
getNameFromAuth(); //run the function

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("mealTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 
    //currentUser = db.collection("users").doc(user.uid)
    db.collection(collection)
    .orderBy('last_updated', 'desc')
    .get()  
        .then(allMeals=> {
            allMeals.forEach(doc => { 
                var cap = doc.data().description;
                var user = doc.data().name;
                var imageURL = doc.data().image;
                var mealtime = doc.data().mealTime;
                var title = doc.data().mealTitle;

                let newcard = mealTemplate.content.cloneNode(true); 
                
                newcard.querySelector('.mealTitle').innerHTML = title;
                newcard.querySelector('.image').src = imageURL;
                newcard.querySelector('.description').innerHTML = cap;
                newcard.querySelector('.name').innerHTML = user;
                newcard.querySelector('.mealType').innerHTML = mealtime;
                newcard.querySelector('a').href = "meal.html?docID=" + doc.id;

                document.getElementById(collection + "-go-here").appendChild(newcard);
            })
        })
}

displayCardsDynamically("meals");  //input param is the name of the collection

