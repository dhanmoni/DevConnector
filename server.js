const express = require('express')
const mongoose = require('mongoose')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

//db config
const db = require('./config/key').mongoURI;
//connect to mongodb
mongoose.connect(db)
   .then(()=> console.log('MongoDB connected'))
   .catch(err=> console.log(err))   

app.get('/', (req, res)=>{
    res.send('Hello')
})

//use routes
app.use('/api/posts', posts)
app.use('/api/profile', profile)
app.use('/api/users', users)



let port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
})