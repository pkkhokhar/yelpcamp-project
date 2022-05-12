const User = require('../models/user');

const renderRegisterForm = (req, res) => {
    res.render('users/register');
};

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to yelpcamp');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

const renderLoginForm = (req, res) => {
    res.render('users/login');
};

const login = async (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

const logout = (req, res) => {
    req.logout();
    delete req.session.returnTo;
    req.flash('success', 'Good Bye!');
    res.redirect('/');
};

module.exports = { renderRegisterForm, register, renderLoginForm, login, logout };