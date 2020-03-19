function onInput() {
  const val = document.getElementById("searchbar").value;
  const opts = document.getElementById('mealsDataList').childNodes;
  for (let i = 0; i < opts.length; i++) {
    if (opts[i].value === val) {      
      // An item was selected from the list!
      // yourCallbackHere()
      const updatedList = document.querySelector('.gridhome-container');
      updatedList.innerHTML = `<div><img src = "${opts[i].value}.png" alt="Image not found" onerror="this.onerror=null;this.src='../error.png';"><br>
      ${opts[i].value}</div>`
      break;
    }
  }
}
function searchMeal() {
  let input = document.getElementById('searchbar').value;
  if (input.length === 0) {
    return;
  }
  fetch(`/api/meals/?title=${input}`)
    .then(response => response.json())
    .then(result => {
      if (result === '') {
        alert('No match found')
      } else {
        let searchedMeal = document.getElementById('mealsDataList');
        searchedMeal.innerHTML = result.map(meal => {
          return `<option value = '${meal.title}' />`
        }).join('')
      }
    })
}

window.handleHomeRequest = () => {
  console.log("reset")
  fetch(`/api/meals/`)
    .then(response => response.json())
    .then(meals => {
      document.body.innerHTML = `
      <div id='home-container'>
    <div class='menu-container'>
      <div class='menu'>
      <div class='logo'><a href = '/'><img src='logo.png'></div>
        <div class='meals'><a href="meals" data-navigo>Meals</a></div>
        <div class='meal'><a href="meal/1" data-navigo>meal/1</a></div>
        <div class='search'><input id="searchbar" onkeyup="searchMeal()" oninput="onInput()" list="mealsDataList" type="text"
        name="search" placeholder="Search meals..">
        <datalist id = 'mealsDataList'>
        </datalist>
         </div>
      </div>
    </div>
      <img src='meal.jpg'>
      <h2>Featured Meals</h2>
      <div class='gridhome-container'>
      ${meals.map(meal => {
        return `<div> <img src = "${meal.title}.png" alt="Image not found" onerror="this.onerror=null;this.src='../error.png';"><br>
        ${meal.title}
        </div>`
      }).join('')} 
      </div>
      <footer>
      <div class='footer'>
        <div class='copyrights'><p>© Swathi Sankararaman</p></div>
        <div class='contact'><p>Contact: swathi@mealsharing.com</p></div>
      </div>
      </footer>
      </div>
      `
    })

  // if any links are added to the dom, use this function
  // make the router handle those links.
  router.updatePageLinks();
};
