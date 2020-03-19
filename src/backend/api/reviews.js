const express = require("express");
const app = express();
const router = express.Router();
const pool = require("./../database");

// This function will be invoked when endpoint is passed with params
const reviewsFunctionParams = function (request, response) {
  const idString = request.params.id;
  const id = parseInt(idString);
  if (isNaN(id)) {
    response.send('Id should be an integer');
  } else {
    pool.query('SELECT * FROM review where id = ?', idString, function (error, results) {
      if (error) {
        console.error(`error ${error}`);
      } else {
        processArrayLength(results, response);
      }
    })
  }
}

// This function will be invoked when the endpoint has no params or any query parameters
const reviewsFunctionQuery = function (request, response) {
  pool.query('SELECT * FROM review', function (error, results) {
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
const reviewsFunctionPost = function (request, response) {
  //const guestcount = request.body.guestcount;
  //const mealid = request.body.mealid;
  const { title, meal_id } = request.body;
  const data = {
    title: title,
    meal_id: meal_id
  }
  console.log(data);

  if (!title || !meal_id) {
    return response.send('Either title or mealid is required');
  }
  pool.query('INSERT INTO review SET ?', data, function (error, results) {
    if (error) {
      console.error(`error ${error}`);
    }
    // response.json(results);
    return response.send({ id: results.insertId });
  });
};

// This function is for PUT operation
const reviewsFunctionPut = function (request, response) {
  const idString = request.params.id;
  const id = parseInt(idString);
  const { title, mealid } = request.body;

  if (!title || !mealid) {
    return response.send('Either no of guests or mealid is required');
  } else if (isNaN(id)) {
    response.send('Id should be an integer');
  } else {
    pool.query('UPDATE review SET title = ?, meal_id = ? WHERE id = ?', [title, mealid, id], function (error, results) {
      if (error) {
        console.error(`error ${error}`);
      } else if (results.length === 0) {
        response.send('No match found');
      }
      reviewsFunctionParams(request, response);
    });
  }
}

// This function is for DELETE operation
const reviewsFunctionDelete = function (request, response) {
  const idString = request.params.id;
  const id = parseInt(idString);
  if (!id) {
    response.send('Id is required to proceed with delete operation');
  }
  else if (isNaN(id)) {
    response.send('Id should be an integer');
  } else {
    pool.query('DELETE FROM review  WHERE id = ?', id, function (error, results) {
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

router.get('/', reviewsFunctionQuery);
router.get("/:id", reviewsFunctionParams);
router.post('/', reviewsFunctionPost);
router.put("/:id", reviewsFunctionPut);
router.delete("/:id", reviewsFunctionDelete);

module.exports = router;
