const followButton = document.getElementById("followButton");

followButton.addEventListener("click", function() {
  if (followButton.classList.contains("following")) {
    followButton.textContent = "Follow";
    followButton.classList.remove("following");
    followButton.style.backgroundColor = "#4da6ff";
  } else {
    followButton.textContent = "Following";
    followButton.classList.add("following");
    followButton.style.backgroundColor = "#99ccff";
  }
});

function writeFollowers() {
  //define a variable for the collection you want to create in Firestore to populate data
  var followersRef = db.collection("followers");

  followersRef.add({
      number: 100,
      last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023")) //current system time
  });
}

function displayFollowersDynamically(collection) {
  let followerTemplate = document.getElementById("followerTemplate"); 

  db.collection(collection).get() 
      .then(allFollowers=> {
  
          allFollowers.forEach(doc => { //iterate thru each doc
              var follower = doc.data().number;       
            
              let newfollowers = followerTemplate.content.cloneNode(true);  

              newfollowers.querySelector('.followers').innerHTML = follower;
              
              document.getElementById(collection + "-go-here").appendChild(newfollowers);

          })
      })
}

displayFollowersDynamically("followers");  //input param is the name of the collection