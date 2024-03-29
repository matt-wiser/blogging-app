const router = require("express").Router();
const sequelize = require("../config/connection");
const {Post, User, Comment} = require("../models");

//Serve homepage with all posts
router.get("/", (req, res) => {
    Post.findAll({
        attributes: ["id", "content", "title", "created_at"],
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            },
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
    .then(postData => {
        const posts = postData.map(post => post.get({plain: true}));
        res.render("homepage", {posts, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// serve log in page
router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
    }
    res.render("login");
});

router.get("/signup", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
    }
    res.render("signup");
});

//serve single post view
router.get("/post/:id", (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ["id", "content", "title", "created_at"],
        include:[
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            },
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
    .then(postData => {
        if (!postData) {
            res.status(404).json({message: "No post found with that id!"});
            return;
        }
        const post = postData.get({plain: true});
        res.render("single-post", {post, loggedIn: req.session.loggedIn})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
    
})

module.exports = router;