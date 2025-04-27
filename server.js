const express = require('express');
const methodOverride = require('method-override');
const ticketRoute = require('./routes/ticket');
const userRoute = require('./routes/user');
const path = require('path');
const session = require('express-session');

require('./config/connect');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(methodOverride('_method'));


app.use(session({
    secret: 'yourSecretKey',  
    resave: false,
    saveUninitialized: false
}));

/* const cookieParser = require('cookie-parser');
app.use(cookieParser());
 */

app.use((req, res, next) => {
    res.locals.user = req.session.user; 
    next();
});


app.use('/uploads', express.static('uploads'));
app.use('/ticket', ticketRoute);
app.use('/user', userRoute);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.redirect('/login'); 
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
