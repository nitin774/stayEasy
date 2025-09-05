const { Query } = require('mongoose');
const Listing = require('../models/listing.js');
const { listingSchema } = require("../schema.js");
const geocode = require('../utils/geocode.js');
const { types } = require('joi');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new', { listing: {} });
}

module.exports.createListing = async (req, res, next) => {
    const geoData = await geocode(req.body.listing.location);
    if(!geoData){
        req.flash('error', 'Cloud not find location');
        return res.redirect('/listings/new');
    }else{
        req.body.listing.location = geoData.displayName;
        req.body.listing.country = geoData.displayName.split(',').pop().trim();
    }
    
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = {
        type: 'Point',
        coordinates: geoData.coordinates
    }
    const savedListing = await newListing.save();
    console.log(savedListing);

    req.flash('success','new listing created');
    res.redirect('/listings');
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const editListing = await Listing.findById(id);
    if (!editListing) {
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }

    let originalImageUrl = editListing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload/', '/upload/w_200/');
    res.render('listings/edit', { listing: editListing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== 'undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash('success','listing Updated');
    res.redirect(`/listings/${id}`);
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const foundListing = await Listing.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('owner');
    if (!foundListing) {
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    console.log(foundListing);
    res.render('listings/show', { listing: foundListing });
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success','listing deleted');
    res.redirect('/listings');
}

module.exports.searchListings = async (req, res) => {
    try {
        const { term } = req.params;
        const { location } = req.query;
        
        let query = {};
        
        // If location is provided, search by location
        if (location && location.trim() !== '') {
            // Use case-insensitive regex search for location
            query.location = { $regex: location.trim(), $options: 'i' };
        }
        
        // If term is provided, search by title or description
        if (term && term.trim() !== '') {
            query.$or = [
                { title: { $regex: term.trim(), $options: 'i' } },
                { description: { $regex: term.trim(), $options: 'i' } }
            ];
        }
        
        const filteredListings = await Listing.find(query);
        
        // If it's an AJAX request, return JSON
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({ 
                success: true, 
                listings: filteredListings,
                count: filteredListings.length,
                searchTerm: location || term
            });
        }
        
        // Otherwise render the page with filtered results
        res.render('listings/index', { 
            allListings: filteredListings,
            searchTerm: location || term,
            hasSearch: true
        });
        
    } catch (error) {
        console.error('Search error:', error);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({ 
                success: false, 
                error: 'Search failed' 
            });
        }
        req.flash('error', 'Search failed. Please try again.');
        res.redirect('/listings');
    }
}