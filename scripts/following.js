function diplayFollowPost() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let userID = user.uid;
            db.collection("users").doc(userID).get().then(userDoc => {
                let followerArray = userDoc.data().followerID || [];
                followerArray.forEach(followedUserID => {
                    db.collection('meals')
                        .where('author', '==', followedUserID)
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

diplayFollowPost();