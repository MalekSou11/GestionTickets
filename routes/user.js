const express = require('express');
const router = express.Router();

const User = require('../models/user')

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const data = req.body;
        const usr = new User(data);

        const salt = bcrypt.genSaltSync(10);
        const cryptedPass = await bcrypt.hashSync(data.password, salt);
        usr.password = cryptedPass;

        await usr.save(); // ATTENDRE que l'utilisateur soit enregistré

        res.redirect('/login'); // REDIRIGER après la sauvegarde réussie
    } catch (err) {
        res.status(400).send(err); // En cas d'erreur
    }
});


router.post('/login', async (req, res) => { 
    try {
        const data = req.body;
        const user = await User.findOne({ email: data.email });

        if (!user) {
            return res.status(404).send('email or password invalid');
        }

        const validPass = bcrypt.compareSync(data.password, user.password);

        if (!validPass) {
            return res.status(401).send('email or password invalid');
        }

        const payload = {
            _id: user._id,
            email: user.email,
            name: user.name
        };

        const token = jwt.sign(payload, '1234567');
        res.redirect('/ticket/dashboard');

    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});



router.post('/createUser', async (req, res)=>{

     try{
        data = req.body;
        usr = new User(data)
        savedUsera =  await usr.save()
       res.send(savedUsera)
     }
      catch (err) {
            res.send(err)
        }
    
})

router.get('/getAll', async (req, res) => {
    try {
users = await User.find();
res.send(users);

    }   catch (err) {
        res.send(err)
    }
})

router.delete('delete/:id', (req, res) => {
    id = res.params.id;
    User.findOneAndDelete({_id: id})
    .then(
        (deletedUser) => {
            res.send(deletedUser)
        }
    )  .catch(
        (err) => {
            res.send(err)
        }
    )
})

router.put('/update/:id', async (req, res)=>{

    try{
        id = req.params.id;
       newData = req.body;
       updated = await User.findByIdAndUpdate({_id: id}, newData);
     
      res.send(updated)
    }
     catch (err) {
           res.send(err)
       }
   
})



module.exports = router;