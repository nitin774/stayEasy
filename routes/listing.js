const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const ListingController = require('../controller/listings.js');
const multer  = require('multer');
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage });

router
    .route('/')
    .get(wrapAsync(ListingController.index))
    .post(isLoggedIn , upload.single('listing[image][url]'), validateListing, wrapAsync(ListingController.createListing))

// 📌 New route
router.get('/new',isLoggedIn, ListingController.renderNewForm);


router
    .route('/:id')
    .get(wrapAsync(ListingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image][url]'), validateListing, wrapAsync(ListingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing))


//Edit route
router.get('/:id/edit',isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));
router.get('/search', wrapAsync(ListingController.searchListings));
router.get('/search/:term', wrapAsync(ListingController.searchListings));

module.exports = router;