function writeComments() {
    //define a variable for the collection you want to create in Firestore to populate data
    var commentsRef = db.collection("comments");

    commentsRef.add({
        username: "steepo123",
        content: "Wow this looks great",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("April 23, 2020"))
    });
    commentsRef.add({
        username: "abcd123",
        content: "I don't like that",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    commentsRef.add({
        username: "acasdpojc",
        content: "I'll make that later!",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 12, 2023"))
    });
    commentsRef.add({
        username: "adspojc",
        content: "It was so good!",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 10, 2023"))
    })
}

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