// use express module
const express = require('express');
const app = express();
const router = express.Router();

const {requireAuth, checkUser} = require('../middleware/authAdminMiddleware')

// auth controller 
const {
  getLoginDashboard,
  postLoginDashboard,
  getLogoutDashboard,
  getSignupDashboard,
  postSignupDashboard
} = require('../controllers/auth')

// import dashboard controller function
const {
  getHome,
  getDashboard,
  getEdit,
  getAdd,
  postAdd,
  postEdit,
  getDelete,
 } = require('../controllers/dashboard')
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

// get all user_games data api
router.get('/api/users', getUsers);
router.get('/api/user', getUser);
router.post('/api/user', newUser);
router.post('/api/useredit/:id', editUser);
router.post('/api/userdelete/:id', deleteUser);

// dashboard route from controller
router.get('/', getHome);
router.get('/dashboard', requireAuth, getDashboard);
router.get('/edit', requireAuth, getEdit);
router.get('/add', requireAuth, getAdd);
router.get('/delete', requireAuth, getDelete)
router.post('/edit', requireAuth, postEdit);
router.post('/add', requireAuth, postAdd);

// auth route
router.get('/login-dashboard', getLoginDashboard);
router.get('/signup-dashboard', getSignupDashboard)
router.post('/login-dashboard', postLoginDashboard);
router.post('/signup-dashboard', postSignupDashboard);
router.get('/logout-dashboard', getLogoutDashboard);

module.exports = router