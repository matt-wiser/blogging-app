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
        res.render("homepage", {posts});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
    }
    res.render("login");
});

module.exports = router;