const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//find all posts
router.get("/", (req, res)=> {
    console.log("=============================");
    Post.findAll({
        attributes: ["id", "content", "title", "created_at"],
        order:[["created_at", "DESC"]],
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
                attributes: ["username"],
            }
        ]
    })
    .then(postData => {
        res.json(postData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//find a single post
router.get("/:id", ({params}, res) => {
    Post.findOne({
        where: {
            id: params.id
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
        res.json(postData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create a new post
router.post("/", withAuth, (req, res) => {
  // expects {title: '', content: '', user_id: 1}
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(postData => res.json(postData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

//update a post
router.put("/:id", withAuth, ({body, params}, res) => {
    Post.update(
        {
            title: body.title,
            content: body.content
        },
        {
            where: {
                id: params.id
            }
        }
    )
    .then(postData => {
        if (!postData) {
            res.status(404).json({message: "No post found with that id!"});
            return;
        }
        res.json(postData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

router.delete("/:id", withAuth,({params}, res) => {
    Post.destroy({
        where: {
            id: params.id
        }
    })
    .then(postData => {
        if (!postData) {
            res.status(404).json({message: "No post found with that id!"});
            return;
        }
        res.json(postData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

module.exports = router;