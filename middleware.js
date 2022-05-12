const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER...", req.user);
    req.session.returnTo = req.originalUrl;

    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

const ObjectId = require('mongoose').Types.ObjectId;
function isValidObjectId(id) {

    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}

const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        req.flash('error', 'Not a valid path');
        return res.redirect('/');
    }
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}
const validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error)
        console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params;
    if (!isValidObjectId(reviewId)) {
        req.flash('error', 'Not a valid path');
        return res.redirect('/');
    }
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', 'Cannot find that Review');
        return res.redirect(`/campgrounds/${id}`);
    }
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports = { isLoggedIn, isAuthor, isReviewAuthor, validateCampground, validateReview };
