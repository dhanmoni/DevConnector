const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport')

//import post model
const Post = require('../../models/post')
const Profile = require('../../models/profile')


//import validation
const validatePostInput = require('../../validation/post')

//@routes GET api/posts/test
//@desc   Test posts route
//@access Public
router.get('/test', (req, res)=> Post.find().populate('user').then(posts=> res.json(posts)))


//@routes GET api/posts/
//@desc   get all the post
//@access Public
router.get('/', (req, res) =>{
    Post.find()
        .sort({date: -1})
        .then(posts=> res.json(posts))
        .catch(err=> res.status(404).json({nopostfound: 'No post found'}))
})


//@routes GET api/posts/:id
//@desc   get posts by id
//@access Public
router.get('/:id', (req, res) =>{
    Post.findById(req.params.id)
        .then(post=> res.json(post))
        .catch(err=> res.status(404).json({nopostfound: 'No post found'}))
})


//@routes POST api/posts
//@desc   create posts
//@access Private

router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
    
    const {errors, isValid} = validatePostInput(req.body)
    if(!isValid){
        return res.status(400).json(errors)
    }

    const newPost = new Post({
        name: req.body.name,
        text: req.body.text,
        avatar: req.body.avatar,
        user: req.user.id,

    })
    newPost.save().then(post => res.json(post))
})


//@routes DELETE api/posts/:id
//@desc   delete posts
//@access Private

router.delete('/:id', passport.authenticate('jwt', {session: false}),
 (req, res)=>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
                .then(post =>{
                    //check for post owner
                    if(post.user.toString() !== req.user.id){
                        return res.status(401).json({noauth:'User not authorized'})
                    }
                    //delete
                    post.remove().then(() => res.json({success: true}))
                })
                .catch((err)=> res.status(404).json(err))
        })


})



//@routes post api/posts/like/:id
//@desc   like posts
//@access Private

router.post('/like/:id', passport.authenticate('jwt', {session: false}),
 (req, res)=>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
                .then(post =>{
                    if(post.likes.filter(like=> like.user.toString() === req.user.id)
                        .length > 0)
                    {
                        return res.status(400).json({alreadyliked:'User already liked this post'})
                    }
                    post.likes.unshift({user: req.user.id});
                    post.save().then(post => res.json(post))
                   
                })
                .catch((err)=> res.status(404).json(err))
        })


})



//@routes post api/posts/dislike/:id
//@desc   dislike posts
//@access Private

router.post('/dislike/:id', passport.authenticate('jwt', {session: false}),
 (req, res)=>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
                .then(post =>{
                    if(post.likes.filter(like=> like.user.toString() === req.user.id)
                        .length === 0)
                    {
                        return res.status(400).json({notliked:'You have not liked this post yet'})
                    }
                   const removeIndex = post.likes.map(item=> item.user.toString()).indexOf(req.user.id)
                    post.likes.splice(removeIndex, 1)
                   post.save().then(post => res.json(post))
                   
                })
                .catch((err)=> res.status(404).json(err))
        })


})


//@routes post api/posts/comment/:id
//@desc    add comment to posts
//@access Private

router.post('/comment/:id', passport.authenticate('jwt', {session: false}),
 (req, res)=>{

    const {errors, isValid} = validatePostInput(req.body)
    if(!isValid){
        return res.status(400).json(errors)
    }

    Post.findById(req.params.id).then(post =>{
        const newComment = {
            text: req.body.text,
            avatar: req.body.avatar,
            user: req.user.id,
            name: req.body.name,
        };
        //add comment to array
        post.comments.unshift(newComment)
        //Save comment
        post.save().then(post => res.json(post))

    }).catch((err)=> res.status(404).json(err))

})


//@routes delete api/posts/comment/:id/:comment_id
//@desc    delete comment from posts
//@access Private

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}),
 (req, res)=>{

    Post.findById(req.params.id).then(post =>{
       
        if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id)
         .length === 0)
         {
            return res.status(404).json({nocomment: 'Comment doesnot exist'})
        }
        //get remove index
        const removeIndex = post.comments
            .map(item =>item._id.toString())
            .indexOf(req.params.comment_id)

        //delete
        post.comments.splice(removeIndex, 1)
        //Save comment
        post.save().then(post => res.json(post))

    }).catch((err)=> res.status(404).json(err))

})



module.exports = router;