const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    title: { type: String },
    status: { type: String },
    description: { type: String },
    image: {
        type: String
    }
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;