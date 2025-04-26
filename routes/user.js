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

        await usr.save(); 

        res.redirect('/login'); 
    } catch (err) {
        res.status(400).send(err);
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Utilisateur non trouvé');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Mot de passe incorrect');
        }

        req.session.user = {
            id: user._id,
            role: user.role, 
            email: user.email
        };

        res.redirect('/ticket/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur lors de la déconnexion');
        }
        res.redirect('/login');
    });
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