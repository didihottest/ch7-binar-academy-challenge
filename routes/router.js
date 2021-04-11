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
  add } = require('../controllers/dashboard')
// import api controller function
const {
  getUsers, 
  getUser, 
  newUser, 
  editUser, 
  deleteUser } = require('../controllers/api')

// Get request raw json from postman / api
app.use(express.json());
// Get request form form-urlencoded form postman / api
app.use(express.urlencoded({ extended: true }));

router.get('/', home);
router.get('/login', login);
router.get('/dashboard', dashboard);
router.get('/edit', edit);
router.get('/add', add);

// get all user_games data api
router.get('/api/users', getUsers);
router.get('/api/user', getUser);
router.post('/api/user', newUser);
router.post('/api/useredit/:id', editUser);
router.post('/api/userdelete/:id', deleteUser);

module.exports = router