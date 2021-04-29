// use express module
const express = require('express');
const app = express();
const router = express.Router();
// import dashboard controller function
const {
  home,
  login,
  dashboard,
  edit,
  add,
  loginPost,
  logout } = require('../controllers/dashboard')
// import api controller function
const {
  getUsers,
  getUser,
  newUser,
  editUser,
  deleteUser } = require('../controllers/api')
// import middleware to check if user has logged in or not
const {checkAuthenticated, checkNotAuthenticated} = require('../middleware/authenticationCheck')
// Get request raw json from postman / api
app.use(express.json());
// Get request form form-urlencoded form postman / api
app.use(express.urlencoded({ extended: true }));
// dashboard route from controller
router.get('/', checkNotAuthenticated, home);
router.get('/login', checkNotAuthenticated, login);
router.get('/dashboard', checkAuthenticated, dashboard);
router.get('/edit', checkAuthenticated, edit);
router.get('/add', checkAuthenticated, add);
router.post('/login', checkNotAuthenticated, loginPost);
router.post('/logout', logout);

// get all user_games data api
router.get('/api/users', getUsers);
router.get('/api/user', getUser);
router.post('/api/user', newUser);
router.post('/api/useredit/:id', editUser);
router.post('/api/userdelete/:id', deleteUser);


module.exports = router