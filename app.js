if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');
const userRouter = require('./routes/user.js');

     // await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

const dbUrl = process.env.atlasdb_URI;

main()
    .then(() => console.log('✅ Connected to DB'))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60,
})

store.on("error", (err)=>{
    console.log("Session store error", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews',reviewsRouter);
app.use('/', userRouter);

// Error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.render('error.ejs', { message });
});

// app.get('/demoUser', async (req, res) => {
//     let fakeUser = new User({ username: 'johnDoe', email: 'delta-user'});

//     let registerUser = await User.register(fakeUser, 'hello');
//     res.send(registerUser);
// })

const port = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log('🚀 Server running on port 3000');
});
