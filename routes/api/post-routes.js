const router = require('express').Router();
const { Post, User } = require('../../models');

//find all posts
router.get("/", (req, res)=> {
    console.log("=============================");
    Post.findAll({
        attributes: ["id", "content", "title", "created_at"],
        include:[
            {
                model: User,
                attributes: ["username"],
                order:[["created_at", "DESC"]]
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
                model: User,
                attributes: ["Username"]
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
router.post("/", ({body}, res) => {
  // expects {title: '', content: '', user_id: 1}
    Post.create({
        title: body.title,
        content: body.content,
        user_id: body.user_id
    })
    .then(postData => res.json(postData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

//update a post
router.put("/:id", ({body, params}, res) => {
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

router.delete("/:id", ({params}, res) => {
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