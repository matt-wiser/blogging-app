const router = require('express').Router();
const { Comment, User, Post } = require('../../models');

//get all comments
router.get('/', (req, res) => {
    Comment.findAll({
        include: [
            {
                model: User,
                attributes: ["username"],
            },
            {
                model: Post,
                attributes: ["title"],
            }
        ]
    })
    .then(commentData => {
        res.json({commentData})
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

//create a comment
//expects {comment_text: "", user_id: "", post_id: ""}
router.post('/', ({body}, res) => {
    Comment.create({
        comment_text: body.comment_text,
        user_id: body.user_id,
        post_id: body.post_id
    })
    .then(commentData => {
        res.json({commentData})
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

//update a comment
//expects {comment_text: ""}
router.put('/:id', ({body, params}, res) => {
    Comment.update(
        {
            comment_text: body.comment_text
        },
        {
            where: {
                id: params.id
            }
        }
    )
    .then(commentData => {
        if (!commentData) {
            res.status(404).json({message: "No comment found with that id!"});
            return;
        }
        res.json({commentData});
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

//delete a comment
router.delete('/:id', ({params}, res) => {
    Comment.destroy({
        where: {
            id: params.id
        }
    })
    .then(commentData => {
        if (!commentData) {
            res.status(404).json({message: "No comment found with that id!"});
            return;
        }
        res.json({commentData});
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

module.exports = router;