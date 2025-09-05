const User = require('../models/user.js');
const listing = require('../models/listing.js')

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs')
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.logIn(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'User was registered successfully');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', 'User is already registered');
        res.redirect('/signup'); // must redirect or render
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = async(req, res) => {
    req.flash('success', 'Welcome back!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have been logged out!');
        res.redirect('/listings');
    });
}
