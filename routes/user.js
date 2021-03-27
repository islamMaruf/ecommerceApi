const express = require('express')
const router = express.Router()

const { userById, isAuth, isAdmin } = require('../middleware/user')
const { requireJWT } = require('../middleware/auth')
const { create, show, update, remove, list } = require('../controllers/user')

router.get('/users', list)
router.post('/create/user/:userId', requireJWT, isAuth, isAdmin, create)
router.get('/user/:userId', isAuth, show)
router.put('/user/:userId', requireJWT, isAuth, update)
router.delete('/user/:userId', requireJWT, isAuth, isAdmin, remove)

router.param('userId', userById)

module.exports = router
