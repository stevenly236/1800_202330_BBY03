/**
 * Event listener for the search form submission.
 * Prevents the default form submission and calls the searchAndDisplayUsers function with the entered search term.
 *
 * @param {Event} event - The form submission event.
 */
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchInput').value;

    searchAndDisplayUsers(searchTerm);
});

/**
 * Fetches users from Firestore based on the provided search term and displays the results in the searchResultsContainer.
 *
 * @param {string} searchTerm - The term to search for in user names.
 */
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

                followButton.addEventListener('click', function () {
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


/**
 * Checks if the current authenticated user is following the user with the provided userID.
 *
 * @param {string} userID - The user ID to check for following.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user is followed, otherwise false.
 */
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


/**
 * Changes the text content of the follow button based on its current state.
 * If the button currently says 'Follow', it changes to 'Following' and vice versa.
 * Also calls the respective functions to save or remove the followed user ID.
 *
 * @param {HTMLElement} followButton - The follow button element.
 */
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

/**
 * Saves the provided userID as a followed user for the current authenticated user.
 *
 * @param {string} userID - The user ID to save as a followed user.
 */
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


/**
 * Removes the provided userID from the followed users for the current authenticated user.
 *
 * @param {string} userID - The user ID to remove from followed users.
 */
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
