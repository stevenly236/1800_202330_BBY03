function displaymealsDynamically(collection) {
    let mealTemplate = document.getElementById("mealTemplate"); 

    db.collection(collection).get()   
        .then(allMeals=> {
            allMeals.forEach(doc => { 
                var docID = doc.id;
                let newmeal = mealTemplate.content.cloneNode(true); 

                newmeal.querySelector('a').href = "meal.html?docID="+docID;
            
                document.getElementById(collection + "-go-here").appendChild(newmeal);

            })
        })
}

displaymealsDynamically("meals"); 