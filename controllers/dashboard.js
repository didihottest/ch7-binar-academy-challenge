// use request module to pull data from API
const axios = require('axios');
// use express validation module
const { validationResult } = require('express-validator');
// json web token module


//home end route 
exports.getHome = (req, res, next) => {
  res.render('home')
}



// dashboard end route
exports.getDashboard = (req, res, next) => {
  // flash message error handling
  let messageSuccess = req.flash('success')
  if (messageSuccess.length > 0) {
    messageSuccess = messageSuccess[0]
  } else {
    messageSuccess = null
  }
  let messageError = req.flash('error')
  if (messageError.length > 0) {
    messageError = messageError[0]
  } else {
    messageError = null
  }
  axios.get("http://localhost:3000/api/users").then(response => {
    res.render("crud", {
      data: response.data,
      messageSuccess,
      messageError
    })
  }).catch(error => {
    if (error) {
      console.log(error)
    }
  })
}

// edit page end route
exports.getEdit = (req, res, next) => {
  let id = req.query.id;
  // get data from api
  axios.get(`http://localhost:3000/api/user?id=${id}`).then(response => {
    if (response.data.status == "failed") {
      res.render("error", {
        headTitle: "Not Found!",
        title: response.data.message,
        subtitle: "Go To Main Page",
        location: "/"
      });
    } else {
      // render data to edit ejs
      res.render('edit', {
        data: response.data
      })
    }
  }).catch((error) => {
    console.log(error)
  })
}

exports.postEdit = (req, res, next) => {
  let id = req.query.id;
  const { username, password, firstName, lastName, age, win, lose } = req.body;
  const role = 'admin';
  // get data from api
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    // get data from api if there is an error message on validation
    axios.get(`http://localhost:3000/api/user?id=${id}`).then(response => {
      if (response.data.status == "failed") {
        res.render("error", {
          headTitle: "Not Found!",
          title: response.data.message,
          subtitle: "Go To Main Page",
          location: "/"
        });
      } else {
        // render data to edit ejs
        res.render('edit', {
          data: response.data
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  } else {
    // post data to api
    axios.post(`http://localhost:3000/api/useredit/${id}`, {
      username, password, firstName, lastName, age, win, lose, role
    }).then((response) => {
      res.redirect('/dashboard')
    }).catch((error => {
      if (error) console.log(error)
    }))
  }

}

// add user_game endpoint 
exports.getAdd = (req, res, next) => {
  res.render("add", {
    message: null
  })
}

exports.postAdd = (req, res, next) => {
  const { username, password, firstName, lastName, age, win, lose } = req.body;
  const role = "player";
  console.log(role)
  // post data to api
  axios.post("http://localhost:3000/api/user", {
    username, password, firstName, lastName, age, win, lose, role
  }).then(response => {
    // flash message success if successful
    req.flash("success", "Data Successfully Added")
    res.redirect('/dashboard')
  }).catch(error => {
    // if error use this function to send error message
    let message = error.response.data.message;
    if (message.includes("User_Game validation failed: username: Error, expected `username` to be unique.")) {
      message = "Username Already Used, Use Another Name"
    }
    res.render("add", {
      message
    })
  })
}

exports.getDelete = (req, res, next) => {
  const id = req.query.id
  // post data to delete file in database
  axios.post(`http://localhost:3000/api/userdelete/${id}`, {}).then(response => {
    req.flash('success', "Successfully Deleted")
    res.redirect('/dashboard')
  }).catch(error => {

    // error handling
    console.log(error)
    req.flash('error', "Delete Operation Failed")
    res.redirect('/dashboard')
  })
}
