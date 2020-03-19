function createMeal() {
  const form = document.querySelector('form');
    const title = form.elements[0].value;  
    const location = form.elements[1].value;
    const when = form.elements[2].value;
    const max_reservations = form.elements[3].value;
    const price = form.elements[4].value;
    const data = {
      title: title,
      location: location,
      when: when,
      max_reservations: max_reservations,
      price: price
    }   
  console.log(data);
  if (title == "" || location == "" || when == "" || max_reservations == "" || price == ""){
    alert('Please fill in all the fields to create a meal')
  } else {
    fetch("/api/meals", { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)})
    .then(response => response.json())
    .then (result => {
      if(result.id) {
        alert('Succesfully created your meal')
      }
      })
  }
}

window.handleMealsRequest = () => {
  // make sure the backend api works before working with it here
  fetch("/api/meals")
    .then(response => response.json())
    .then(meals => {
      document.body.innerHTML = `
      <div id='meals-container'>
      <h1>Meals</h1>
      <div class='gridmeals-container'>
      ${meals.map(meal => {
        return `<div><img src = "${meal.title}.png" alt="Image not found" onerror="this.onerror=null;this.src='error.png';"><br>
        ${meal.title} ${meal.price} DKK<br>
        <a href='meal/${meal.id}'>Details</a>
        </div>`
      }).join('')} 
      </div>
      <br>
      </div>
      <div id='mealsform-container'>
      <h3>Create your own meal!!</h3>
      <form>
      Title: <input type = "text" name = "title" required>
      <br>
      Location: <input type = "text" name = "location" required>
      <br>
      When: <input type = "datetime-local" name = "when" value = "2020-03-12T19:30" required>
      <br>
      Maximum reservations: <input type = "number" name = "max_reservations" required>
      <br>
      Price: <input type = "number" name = "price" step = "any" required><br><br>
      <button type="button" onclick="createMeal()">Create Meal</button>
   </form>
   </div>
      `
    });
  router.updatePageLinks();
};
