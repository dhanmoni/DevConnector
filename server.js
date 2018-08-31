const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const passport = require('passport')
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//db config
const db = require('./config/key').mongoURI;
//connect to mongodb
mongoose.connect(db)
   .then(()=> console.log('MongoDB connected'))
   .catch(err=> console.log(err))   

//passport middleware
app.use(passport.initialize())
//passport config
require('./config/passport')(passport)

//use routes
app.use('/api/posts', posts)
app.use('/api/profile', profile)
app.use('/api/users', users)

//Server static assets if in production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    app.get('*', (req,res)=> {
        res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


let port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
})