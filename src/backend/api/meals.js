const express = require("express");
const app = express();
const router = express.Router();
const moment = require('moment');
const pool = require("./../database");

// This function will be invoked when endpoint is passed with params
const mealsFunctionParams = function (request, response) {
  const idString = request.params.id;
  const id = parseInt(idString);
  if (isNaN(id)) {
    response.send('Id should be an integer');
  } else {
    pool.query('SELECT * FROM meal where id = ?', idString, function (error, results) {
      if (error) {
        console.error(`error ${error}`);
      } else {
        processArrayLength(results, response);
      }
    })
  }
}

// This function will be invoked when the endpoint has no params and has query parameters
const mealsFunctionQuery = function (request, response) {
  let checkCondition = isValidQueryParam(request.query);
  console.log('Results are:' + checkCondition);
  
  if (checkCondition !== null) {
    response.send(checkCondition);
  } else {
    let query = getMealsDBquery(request.query);
    pool.query(query, function (error, results) {
      if (error) {
        console.error(`error ${error}`);
      }//else if (results.length === 0){
       // response.send('No Match Found');
      //} 
      else {
        response.send(results);
      }
    })
  }
};

// This function is for POST operation
const mealsFunctionPost = function (request, response) {
  //const guestcount = request.body.guestcount;
  //const mealid = request.body.mealid;
  const { title, location, when, max_reservations, price } = request.body;
  const data = {
    title: title,
    location: location,
    when: when,
    max_reservations: max_reservations,
    price: price
  }
  console.log(data);

  if (!title || !location || !when || !max_reservations) {
    return response.send('Please enter all the necessary fields');
  }
  pool.query('INSERT INTO meal SET ?', data, function (error, results) {
    if (error) {
      console.error(`error ${error}`);
    }
    // response.json(results);
    return response.send({ id: results.insertId });
  });
};

// This function is for PUT operation
const mealsFunctionPut = function (request, response) {
  const idString = request.params.id;
  const id = parseInt(idString);
  const { title, location, when, max_reservations, price } = request.body;

  if (isEmpty(request.body)) {
    return response.send('Please enter any one of required fields');
  } else if (isNaN(id)) {
    response.send('Id should be an integer');
  } else {
    pool.query('UPDATE meal SET ? WHERE id = ?', [request.body, id], function (error, results) {
      if (error) {
        console.error(`error ${error}`);
      } else if (results.length === 0) {
        response.send('No match found');
      }
      mealsFunctionParams(request, response);
    });
  }
}

// This function is for DELETE operation
const mealsFunctionDelete = function (request, response) {
  const idString = request.params.id;
  const id = parseInt(idString);
  if (isNaN(id)) {
    response.send('Id should be an integer');
  } else {
    pool.query('DELETE FROM meal  WHERE id = ?', id, function (error, results) {
      if (error) {
        console.error(`error ${error}`);
      } else if (results.affectedRows === 0) {
        response.send('No match found');
      }
      response.send({ Deleted: results.affectedRows > 0 });
    });
  }
}

// This function to pass specific queries based on the query param
function getMealsDBquery(object) {
  if (isEmpty(object)) {
    return `SELECT * FROM meal;`
  } else if (object.maxPrice) {
    return `SELECT * FROM meal WHERE price < ${object.maxPrice};`
  } else if (object.availableReservations) {
    return `select * from meal where max_reservations > (select number_of_guests from reservation where reservation.meal_id = meal.id);`
  } else if (object.title) {
    return `SELECT * FROM meal WHERE title LIKE '${object.title}%';`
  } else if (object.createdAfter) {
    return `SELECT * FROM meal WHERE created_date > ${object.createdAfter};`
  } else if (object.limit) {
    return `SELECT * FROM meal LIMIT ${object.limit};`
  }
}

// This function is to do some validations for the query params
function isValidQueryParam(object) {
  if (isEmpty(object)) {
    return null;
  } else if (object.maxPrice) {
    const maxPriceInInt = parseInt(object.maxPrice);
    if (isNaN(maxPriceInInt)) {
      return 'Maximum Price should be an integer';
    } else {
      return null;
    }
  } else if (object.availableReservations) {
    if (typeof(object.availableReservations) !== 'boolean') {
      return 'AvailableReservations should be a boolean';
    } else {
      return null;
    }
  } else if (object.title) {
    return null;
  } else if (object.createdAfter) {
    const dateInString = object.createdAfter;
    if (!moment(dateInString, 'YYYY-MM-DD', true).isValid()) {
      return 'Date should always be a valid date';
    } else {
      return null;
    }
  } else if (object.limit) {
    const limitInt = parseInt(object.limit);
    if (isNaN(limitInt)) {
      return 'Limit should be an integer';
    } else {
      return null;
    }
  }
}
// Function to check if the array has a match to the parameters in the endpoint
function processArrayLength(array, res) {
  if (array.length === 0) {
    res.send('No match found');
  } else {
    res.send(array);
  }
}

// This function is to check if request.params or request.query object is empty
function isEmpty(obj) {
  for (const key in obj) {
    return false;
  }
  return true;
}

router.get('/', mealsFunctionQuery);
router.get("/:id", mealsFunctionParams);
router.post('/', mealsFunctionPost);
router.put("/:id", mealsFunctionPut);
router.delete("/:id", mealsFunctionDelete);

module.exports = router;
