// use express module
const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer')
const {requireAuth, checkUser} = require('../middleware/authAdminMiddleware')
const {requirePlayerAuth} = require('../middleware/authPlayerMiddleware')
// auth controller 
const {
  getLoginDashboard,
  postLoginDashboard,
  getLogoutDashboard,
  getSignupDashboard,
  postSignupDashboard,
  postLoginGame } = require('../controllers/auth')

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

const {fight, createRoom, playerHistory} = require('../controllers/game')

// Get request raw json from postman / api
app.use(express.json());
// Get request form form-urlencoded form postman / api
app.use(express.urlencoded({ extended: true }));
// all user_games data api endpoint
router.get('/api/users', getUsers);
router.get('/api/user', getUser);
router.post('/api/user', multer().none(), newUser);
router.post('/api/useredit/:id', multer().none(), editUser);
router.post('/api/userdelete/:id', deleteUser);

// dashboard route from controller
router.get('/', getHome);
router.get('/dashboard', checkUser,  requireAuth, getDashboard);
router.get('/edit', checkUser, requireAuth, getEdit);
router.get('/add', checkUser, requireAuth, getAdd);
router.get('/delete', checkUser, requireAuth, getDelete)
router.post('/edit', checkUser, requireAuth, postEdit);
router.post('/add', checkUser, requireAuth, postAdd);

// auth route
router.get('/login-dashboard', getLoginDashboard);
router.get('/signup-dashboard', getSignupDashboard)
router.post('/login-dashboard', postLoginDashboard);
router.post('/signup-dashboard', postSignupDashboard);
router.get('/logout-dashboard', getLogoutDashboard);
router.post('/login-game', postLoginGame)

//game route
// endpoint for user to see its own history
router.get('/player-history', requirePlayerAuth, playerHistory)
// fight room for battle endpoint
router.post('/fight/:roomname', requirePlayerAuth, fight)
// creaete room endpoint
router.post('/create-room', requirePlayerAuth, createRoom)

module.exports = router