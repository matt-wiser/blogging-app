const router = require("express").Router();
const { User } = require("../../models")

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

// POST /api/users
// expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
router.post('/', ({body}, res) => {
    User.create({
        username: body.username,
        email: body.email,
        password: body.password
    })
    .then(userData => {
        res.json(userData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// PUT /api/users/:user_id
// expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

router.put('/:id', ({body, params}, res) => {
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
router.delete('/:id', ({params}, res) => {
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
        const validPassword = userData.checkPassword(req.body.password)
        
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect Password!' });
            return;
        }
        res.json({user: userData, message: "You are now logged in!"});
    });
});


module.exports = router;