/** 
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
    let cardTemplate = document.getElementById("groupTemplate"); 

    db.collection(collection).get()   
        .then(allCaptions=> {
            allCaptions.forEach(doc => { 
                var cap = doc.data().caption;     // name of caption key
                var img1 = doc.data().caption; 
                // var cap = doc.data().caption;     // name of caption key
                // var cap = doc.data().caption;     // name of caption key
                // var cap = doc.data().caption;     // name of caption key
                // var cap = doc.data().caption;     // name of caption key
                let newcard = groupTemplate.content.cloneNode(true); 

                // newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg` //image 1
                // newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg` //image 2
                // newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg` //image 3
                // newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg` //image 4
                newcard.querySelector('.caption').innerHTML = cap;

                document.getElementById(collection + "-go-here").appendChild(newcard);

            })
        })
}

displayCardsDynamically("captions"); // database name
*/

function diplayFollowPost() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let userID = user.uid;
            db.collection("users").doc(userID).get().then(userDoc => {
                let followerArray = userDoc.data().followerID || [];

                followerArray.forEach(followedUserID => {
                    // Get all meals by the followed user
                    db.collection("meals")
                        .where("author", "==", followedUserID)
                        .get()
                        .then(querySnapshot => {
                            querySnapshot.forEach(mealDoc => {
                                let description = mealDoc.data().description;
                                let imageurl = mealDoc.data().image;
                                let mealtime = mealDoc.data().mealTime;
                                let mealtitle = mealDoc.data().mealTitle;
                                let name = mealDoc.data().name;

                                let cardTemplate = document.getElementById("mealTemplate");
                                let newcard = cardTemplate.content.cloneNode(true);

                                newcard.querySelector('.image').src = imageurl;
                                newcard.querySelector('.mealTitle').innerText = mealtitle;
                                newcard.querySelector('.description').innerText = description;
                                newcard.querySelector('.name').innerText = name;
                                newcard.querySelector('.mealType').innerText = mealtime;
                                newcard.querySelector('a').href = "meal.html?docID=" + mealDoc.id;

                                document.getElementById("meals-go-here").appendChild(newcard);
                            });
                        })
                        .catch(error => {
                            console.error("Error getting meals:", error);
                        });
                });
            });
        }
    });
}

diplayFollowPost()