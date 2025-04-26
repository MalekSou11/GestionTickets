// middlewares/auth.js

function isUser(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/login'); 
    }
}

function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).send('Accès refusé : réservé aux administrateurs');
    }
}


module.exports = { isAdmin, isUser };
