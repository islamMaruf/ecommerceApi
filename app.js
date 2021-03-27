const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const cors = require('cors')

require('dotenv').config()

//import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')

//app
const app = express()

//database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB connected')
  })

//middleware
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

//routes middleware
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)

//test route
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'this is test route. now server running ... ',
  })
})

//ports
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
