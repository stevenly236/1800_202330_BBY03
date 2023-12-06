var currentUser;

// Get the reference to the delete post button
const deletePostButton = document.getElementById('deletePost');

// Add a click event listener to trigger the deletePost function
deletePostButton.addEventListener('click', function() {
    // Assuming you have the meal ID stored somewhere or fetched dynamically
    const mealID = 'yourMealID'; // Replace 'yourMealID' with the actual meal ID or fetch it dynamically

    // Call the deleteMealInfo function with the meal ID
    deleteMealById();
});

function deleteMealById(mealID) {
    db.collection("meals").doc(mealID).delete()
        .then(() => {
            console.log("Meal document deleted successfully");
        })
        .catch(error => {
            console.error("Error deleting meal document: ", error);
        });
}




