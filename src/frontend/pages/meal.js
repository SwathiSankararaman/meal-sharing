let globalMealId = 0;
function reserveMeal() {
  const form = document.querySelector('.reservemeal > form');
  const name = form.elements[0].value;
  const phonenumber = form.elements[1].value;
  const email = form.elements[2].value;
  const meal_id = form.elements[3].value;
  const number_of_guests = form.elements[4].value;
  const data = {
    number_of_guests: number_of_guests,
    meal_id: meal_id,
    name: name,
    email: email,
    phone: phonenumber
  }
  console.log(data);
  if (name == "" || phonenumber == "" || email == "" || meal_id == "" || number_of_guests == "") {
    alert('Please fill in all the fields to reserve a meal')
  } else {
    fetch("/api/reservations", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(response => response.json())
      .then(result => {
        if (result.id) {
          alert('Great!!You reserved the meal')
        } else if (result.Message) {
          alert(result.Message)
        }
      })
  }
}

function reviewMeal() {
  const form = document.querySelector('.reviewmeal > form');
  const meal_id = form.elements[0].value;
  const title = form.elements[1].value;
  const description = form.elements[2].value;
  const stars = form.elements[3].value;
  const data = {
    title: title,
    meal_id: meal_id,
    description: description,
    stars: stars
  }
  console.log(data);
  if (title == "" || meal_id == "") {
    alert('Please fill in all the fields to review a meal')
  } else {
    fetch("/api/reviews", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(response => response.json())
      .then(result => {
        if (result.id) {
          alert('Thanks!!You reviewed the meal')
        } else if (result.Message) {
          alert(result.Message)
        }
      })
  }
}


window.handleMealRequest = params => {
  globalMealId = params.id;
  fetch(`/api/meals/${params.id}`)
    .then(response => response.json())
    .then(meal => {
      meal.forEach(item => {
        console.log(item);
        const myDate = new Date(item.when);
        const day = myDate.getDate();
        const month = myDate.getMonth();
        const year = myDate.getFullYear();

        document.body.innerHTML = `
        <div id='meal-container'>
        <h1>Meal details for ${item.title}</h1><br>
        <img src = "../${item.title}.png" alt="Image not found" onerror="this.onerror=null;this.src='../error.png';">
        <p>Id of the Meal: ${item.id}<p><br>
        <p>Name of the Meal: ${item.title}<p><br>
        <p>Description: ${item.description}</p><br>
        <p>Location of the Meal: ${item.location}</p><br>
        <p>Available on: ${day}/${month}/${year}</p><br>
        <p>Maximum Reservations: ${item.max_reservations}</p><br>
        <p>Price of the meal: ${item.price}</p><br>
        </div>
        <div id ='mealform-container'>
        <div class = 'reservemeal'>
        <h3>Reserve this meal</h3>
      <form>
      Name: <input type = "text" name = "name" required>
      <br>
      Phonenumber: <input type = "number" name = "phonenumber">
      <br>
      email: <input type = "text" name = "email" placeholder='abc@example.com' required>
      <br>
      Meal Id: <input type = "number" name = "mealid" value = ${globalMealId} disabled><br>
      Guests: <input type = "number" name = "guestsnum" required><br><br>
      <button type="button" onclick="reserveMeal()">Reserve</button>
   </form>
   </div>
   <div class = 'reviewmeal'>
   <h3>Review this meal</h3>
 <form>
 Meal Id: <input type = "number" name = "mealid" value = ${globalMealId} disabled><br>
 Title: <input type = "text" name = "title" required>
 <br>
 Description: <input type = "text" name = "description">
 <br>
 Stars: <input type = "number" name = "stars">
 <br><br>
 <button type="button" onclick="reviewMeal()">Submit Review</button>
</form>
</div>
        </div>
        `
      })
    })
  router.updatePageLinks();
};
