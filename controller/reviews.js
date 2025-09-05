const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

module.exports.createReview = async (req, res) => {
    let foundListing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    foundListing.reviews.push(newReview);
    await newReview.save();
    await foundListing.save();
    req.flash('success','New review Created');
    res.redirect(`/listings/${foundListing._id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted');
    res.redirect(`/listings/${id}`);
}