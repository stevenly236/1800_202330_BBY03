document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const searchTerm = document.getElementById('searchInput').value;

    searchAndDisplayUsers(searchTerm);
});

function searchAndDisplayUsers(searchTerm) {
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    searchResultsContainer.innerHTML = '';

    db.collection('users')
        .where('name', '>=', searchTerm)
        .where('name', '<=', searchTerm + '\uf8ff')
        .get()
        .then((querySnapshot) => {
            const searchTemplate = document.getElementById('searchTemplate');

            querySnapshot.forEach((doc) => {
                const newUserCard = document.importNode(searchTemplate.content, true);
                const user = doc.data();

                newUserCard.querySelector('.profile-name').textContent = `${user.name}`;
                newUserCard.querySelector('.profile-email').textContent = `${user.email}`;

                const followButton = newUserCard.querySelector('.follow-button');
                followButton.setAttribute('data-user-id', doc.id);

                isUserFollowed(doc.id).then((isFollowed) => {
                    followButton.innerHTML = isFollowed ? 'Following' : 'Follow';
                });

                followButton.addEventListener('click', function() {
                    changeButtonText(this);
                }, { once: true }); 

                searchResultsContainer.appendChild(newUserCard);
            });

            if (querySnapshot.size === 0) {
                const noResultsElement = document.createElement('div');
                noResultsElement.textContent = 'No users found';
                searchResultsContainer.appendChild(noResultsElement);
            }
        })
        .catch((error) => {
            console.error('Error searching Firestore:', error);
        });
}

async function isUserFollowed(userID) {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                db.collection("users").doc(user.uid).get().then((doc) => {
                    const followerIDs = doc.data().followerID || [];
                    resolve(followerIDs.includes(userID));
                }).catch(reject);
            } else {
                resolve(false);
            }
        });
    });
}

// The rest of your existing code for changeButtonText, saveFollowedUserID, and removeFollowedUserID...

function changeButtonText(followButton) {
    if (followButton.innerHTML === 'Follow') {
        followButton.innerHTML = 'Following';
        const userID = followButton.getAttribute('data-user-id');
        saveFollowedUserID(userID);
    } else {
        followButton.innerHTML = 'Follow';
        const userID = followButton.getAttribute('data-user-id');
        removeFollowedUserID(userID);
    }
}

function saveFollowedUserID(userID) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).update({
                followerID: firebase.firestore.FieldValue.arrayUnion(userID)
            }).then(() => {
                console.log("Follow success");
            });
        }
    });
}

function removeFollowedUserID(userID) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).update({
                followerID: firebase.firestore.FieldValue.arrayRemove(userID)
            }).then(() => {
                console.log("Unfollow success");
            });
        }
    });
}
