const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const postController = require('../controller/postController');
const auth = require('../auth/mid')

router.post('/useradd', userController.createUser);
router.post('/userlogin', userController.loginUser);

router.post('/posts', auth.userAuth, postController.createPost);
router.get('/getposts', postController.getPosts)
router.get('/postsbystatus', auth.userAuth, postController.getPostByStatus);
router.patch('/updatepost/:postId', auth.userAuth, postController.updatePosts)
router.delete('/deletepost/:postId', auth.userAuth, postController.deleteById);

module.exports = router