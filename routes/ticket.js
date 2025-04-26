const express = require('express');
const router = express.Router();
const Tickets = require('../models/ticket');
const multer = require('multer');

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


router.get('/dashboard', async (req, res) => {
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

router.get('/editTicket/:id', async (req, res) => {
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


router.post('/createTicket', upload.single('image'), async (req, res) => {
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


router.get('/getAllTickets', async (req, res) => {
    try {
        const tickets = await Tickets.find();
        res.send(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

router.delete('/deleteTickets/:id', async (req, res) => {
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


router.post('/updateTickets/:id', upload.single('image'), async (req, res) => {
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
