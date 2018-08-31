const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const bodYParser = require('body-parser')

const keys = require('../../config/key')
//import model
const User = require('../../models/User')

//validate user
const  validateRegisterInput = require('../../validation/register')
const  validateLoginInput = require('../../validation/login')


//@routes GET api/users/test
//@desc   Test users route
//@access Public

router.get('/test', (req, res)=> res.json({msg:'Users work'}))
//@routes GET api/users/register
//@desc   register user
//@access Public

router.post('/register', (req, res)=>{

    const { errors, isValid } = validateRegisterInput(req.body)

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors)
    }

    User.findOne({email: req.body.email })
        .then(user =>{
            errors.email = 'Email already exists';
            if(user){
                return  res.status(400).json(errors)
            } else{

                const avatar = gravatar.url(req.body.email, {
                    s:'200', //size
                    r:'pg', //Rating
                    'd': 'mm' //Default
                });
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    avatar,
                    password:req.body.password,
                });
                bcrypt.genSalt(10,(err, salt) =>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })

            }
        })
})
//@routes GET api/users/login
//@desc   login user / returning JWT web token
//@access Public

router.post('/login', (req, res)=>{

    const { errors, isValid } = validateLoginInput(req.body)

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    //find user by email

    User.findOne({email})
        .then(user =>{  
            //check fro user         
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors) 
            }
           //compare password
           bcrypt.compare(password, user.password)
            .then(isMatch =>{
                if(isMatch){
                   //isMatched
                   const payload = {
                       id: user.id,
                       name:user.name,
                       avatar: user.avatar
                   }
                   //sign token
                   jwt.sign(
                    payload ,
                    keys.secretOrKey,
                    { expiresIn: '6h' },
                    (err, token)=>{
                        res.json({
                            success: true,
                            token: 'Bearer '+ token
                        })
                    }
                );
                }
                else{
                    errors.password= 'password incorrect'
                    return res.status(400).json(errors)
                }
            })
        })
})


//@routes GET api/users/current
//@desc   return current user
//@access Private
router.get('/current',
     passport.authenticate('jwt', {session: false}),
     (req, res)=>{
         res.json({
             id: req.user.id,
             name: req.user.name,
             email: req.user.email
         })
     }

)


module.exports = router;