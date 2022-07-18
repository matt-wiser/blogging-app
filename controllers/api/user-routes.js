const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const withAuth = require('../../utils/auth');

// GET /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: {exclude: ['password']}
    })
    .then(userData => {
        res.json(userData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// GET /api/users/:user_id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ["id", "title", "content", "created_at"]
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "created_at"],
                include: {
                    model: Post,
                    attributes: ["title"]
                }
            }
        ]
    })
    .then(userData => {
        if (!userData) {
            res.status(404).json({message: "No user with that id"});
            return;
        }
        res.json(userData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// POST /api/users
// expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(userData => {
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;

            res.json(userData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// PUT /api/users/:user_id
// expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

router.put('/:id', withAuth, ({body, params}, res) => {
    User.update(body, {
        individualHooks: true,
        where: {
            id: params.id
        }
    })
    .then(userData => {
        if (!userData[0]) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(userData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// DELETE /api/users/:user_id
router.delete('/:id', withAuth, ({params}, res) => {
    User.destroy({
        where: {
            id: params.id
        }
    })
    .then(userData => {
        if (!userData) {
            res.status(404).json({message: "No user with that id"});
            return;
        }
        res.json(userData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});


// User login route
// expects {email: 'lernantino@gmail.com', password: 'password1234'}
router.post("/login", (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(userData => {
        if (!userData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }
        const validPassword = userData.checkPassword(req.body.password);
        
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect Password!' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;

            res.json({user: userData, message: "You are now logged in!"});
        });
    });
});

//User logout route
router.post("/logout", (req, res) => {
if (req.session.loggedIn) {
    req.session.destroy(() => {
        res.status(204).end();
    });
} else {
    res.status(404).end();
}
});


module.exports = router;