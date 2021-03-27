const express = require('express')
const router = express.Router()

const {
  create,
  show,
  update,
  remove,
  list,
} = require('../controllers/category')
const { userById, isAuth, isAdmin } = require('../middleware/user')
const { categoryById } = require('../middleware/category')
const { requireJWT } = require('../middleware/auth')

router.get('/categories', list)
router.post('/create/category/:userId', requireJWT, isAuth, isAdmin, create)
router.get('/category/:categoryId', show)
router.put('/category/:categoryId/:userId', requireJWT, isAuth, isAdmin, update)
router.delete(
  '/category/:categoryId/:userId',
  requireJWT,
  isAuth,
  isAdmin,
  remove,
)

router.param('categoryId', categoryById)
router.param('userId', userById)

module.exports = router
