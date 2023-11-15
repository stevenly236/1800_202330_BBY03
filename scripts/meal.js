function displaymealInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log( ID );

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection("meals")
        .doc( ID )
        .get()
        .then( doc => {
             thisMeal = doc.data();
             mealName = doc.data().name;
            
            // only populate title, and image
            document.getElementById("mealName").innerHTML = mealName;
            let imgEvent = document.querySelector(".meal-img");
            imgEvent.src = doc.data().image;
        } );
}
displaymealInfo();

function displayCommentsDynamically(collection) {
    let commentTemplate = document.getElementById("commentTemplate"); 

    db.collection(collection).get()   
        .then(allComments=> {
            allComments.forEach(doc => { 
                var usernamee = doc.data().username;   
                var content = doc.data().content;  
                let newcomment = commentTemplate.content.cloneNode(true); 

                newcomment.querySelector(".content").innerHTML = content;
                newcomment.querySelector(".username").innerHTML = usernamee;


                document.getElementById(collection + "-go-here").appendChild(newcomment);

            })
        })
}

displayCommentsDynamically("comments"); 

function writeComment() {
    console.log("inside comments");
    let usercontent = document.getElementById("usercomment").value;

    console.log(usercontent);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        // Get the document for the current user.
        db.collection("comments").add({
            content: usercontent,
            username: user.displayName,
            last_updated: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            document.getElementById("usercomment").value = ''
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'index.html';
    }
}