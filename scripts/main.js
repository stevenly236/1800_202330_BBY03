function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); 
            console.log(user.displayName); 
            userName = user.displayName;

            document.getElementById("name-goes-here").innerText = userName;    
        } else {
            console.log("Please log in"); 
        }
    });
}
getNameFromAuth();

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("mealTemplate"); 
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

displayCardsDynamically("meals");  

