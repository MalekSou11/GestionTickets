const express = require('express');
const router = express.Router();
const Tickets = require('../models/ticket');
const multer = require('multer');
const { isAdmin, isUser } = require('../Middleware/auth');


let filename = '';

const mystorage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1];
        callback(null, fl);
        filename = fl;
    }
});

const upload = multer({ storage: mystorage });


router.get('/dashboard', isUser, async (req, res) => {
    try {
        const tickets = await Tickets.find();
        res.render('dashboard', { tickets });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur du serveur');
    }
});

router.get('/createTicket', (req, res) => {
    res.render('createTicket');
});

router.get('/editTicket/:id', isAdmin, async (req, res) => {
    const ticketId = req.params.id;

    try {
        const ticket = await Tickets.findById(ticketId);
        if (!ticket) {
            return res.status(404).send('Ticket non trouvé');
        }

        res.render('editTicket', { ticket });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});


router.post('/createTicket', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const data = req.body;
        const newTicket = new Tickets(data);

        if (filename) {
            newTicket.image = filename;
            filename = '';
        }

        const savedTicket = await newTicket.save();
        res.redirect('/ticket/dashboard');
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});


router.get('/getAllTickets', isUser, async (req, res) => {
    try {
        const tickets = await Tickets.find();
        res.send(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

router.delete('/deleteTickets/:id', isAdmin,  async (req, res) => {
    const id = req.params.id;

    try {
        const deletedTicket = await Tickets.findByIdAndDelete(id);
        if (!deletedTicket) {
            return res.status(404).send('Ticket non trouvé');
        }
        return res.redirect('/ticket/dashboard');
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
});


const { sendStatusEmail } = require('../sendEmail'); 


 router.post('/updateTicketsStat/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;

        if (filename) {
            newData.image = filename;
            filename = '';
        }

        const updatedTicket = await Tickets.findByIdAndUpdate({ _id: id }, newData);

        if (!updatedTicket) {
            return res.status(404).send('Ticket non trouvé');
        }

        
    const userEmail = req.session.user?.email; 

        if (userEmail) {
          
            await sendEmail(updatedTicket.email, 'Mise à jour du statut', `Votre ticket est maintenant ${updatedTicket.status}`);
            console.log('Email envoyé à', userEmail);
        } else {
            console.log('Aucun utilisateur connecté, email non envoyé');
        }

       

        res.redirect('/ticket/dashboard');
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
}); 




 router.post('/updateTickets/:id', isAdmin,  upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
    
        if (filename) {
            newData.image = filename;
            filename = '';
        }
    
        const updatedTicket = await Tickets.findByIdAndUpdate(id, newData, { new: true });
    
        if (!updatedTicket) {
            return res.status(404).send('Ticket non trouvé');
        }
    
        return res.redirect('/ticket/dashboard');
        
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
    
}); 


module.exports = router;
