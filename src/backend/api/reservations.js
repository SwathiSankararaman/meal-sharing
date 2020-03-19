const express = require("express");
const app = express();
const router = express.Router();
const pool = require("./../database");

// This function will be invoked when endpoint is passed with params
const reservationsFunctionParams = function (request, response) {
  const idString = request.params.id;
  const id = parseInt(idString);
  if (isNaN(id)) {
    response.send('Id should be an integer');
  } else {
    pool.query('SELECT * FROM reservation where id = ?', idString, function (error, results) {
      if (error) {
        console.error(`error ${error}`);
      } else {
        processArrayLength(results, response);
      }
    })
  }
}

// This function will be invoked when the endpoint has no params or any query parameters
const reservationsFunctionQuery = function (request, response) {
  pool.query('SELECT * FROM reservation', function (error, results) {
    if (error) {
      console.error(`error ${error}`);
    } else {
      if (isEmpty(request.query)) {
        response.send(results);
      }
    }
  });
};

// This function is for POST operation
const reservationsFunctionPost = function (request, response) {
  //const guestcount = request.body.guestcount;
  //const mealid = request.body.mealid;
  const { number_of_guests, meal_id, name, email, phone } = request.body;
  const data = {
    number_of_guests: number_of_guests,
    meal_id: meal_id,
    name: name,
    email: email,
    phone: phone
  }
  const idString = meal_id.toString();
  console.log(idString);
  console.log(data);
  console.log(number_of_guests);

  if (!number_of_guests || !meal_id || !name || !email) {
    return response.json({ 'Message': 'Please enter the required fields' });
  } else {
    pool.query('SELECT max_reservations FROM meal where id = ?', idString, function (error, results) {
      if (error) {
        console.error(`error ${error}`);
      } else if (results[0].max_reservations > number_of_guests) {
        //Insert
        pool.query('INSERT INTO reservation SET ?', data, function (error, results) {
          if (error) {
            console.error(`error ${error}`);
          }
          // response.json(results);
          return response.send({ id: results.insertId });
        })
      } else {
        return response.send({ 'Message': 'Cannot reserve the meal as there are no enough availability' });
      }
    })
  }
}

// This function is for PUT operation
const reservationsFunctionPut = function (request, response) {
  const idString = request.params.id;
  const id = parseInt(idString);
  const { guestcount, mealid, name, email, phone } = request.body;

  if (!guestcount || !mealid || !name || !email) {
    return response.send('Please enter the required fields');
  } else if (isNaN(id)) {
    response.send('Id should be an integer');
  } else {
    pool.query('UPDATE reservation SET number_of_guests = ?, meal_id = ?, name = ?, email = ?, phone = ? WHERE id = ?', [guestcount, mealid, name, email, phone, id], function (error, results) {
      if (error) {
        console.error(`error ${error}`);
      } else if (results.length === 0) {
        response.send('No match found');
      }
      reservationsFunctionParams(request, response);
    });
  }
}

// This function is for DELETE operation
const reservationsFunctionDelete = function (request, response) {
  const idString = request.params.id;
  const id = parseInt(idString);
  if (!id) {
    response.send('Id is required to proceed with delete operation');
  }
  else if (isNaN(id)) {
    response.send('Id should be an integer');
  } else {
    pool.query('DELETE FROM reservation  WHERE id = ?', id, function (error, results) {
      if (error) {
        console.error(`error ${error}`);
      } else if (results.affectedRows === 0) {
        response.send('No match found');
      }
      response.send({ Deleted: results.affectedRows > 0 });
    });
  }
}



// Function to check if the array has a match to the parameters in the endpoint
function processArrayLength(array, res) {
  if (array.length === 0) {
    res.send('No match found');
  } else {
    res.json(array);
  }
}

// This function is to check if request.params or request.query object is empty
function isEmpty(obj) {
  for (const key in obj) {
    return false;
  }
  return true;
}

router.get('/', reservationsFunctionQuery);
router.get("/:id", reservationsFunctionParams);
router.post('/', reservationsFunctionPost);
router.put("/:id", reservationsFunctionPut);
router.delete("/:id", reservationsFunctionDelete);

module.exports = router;
