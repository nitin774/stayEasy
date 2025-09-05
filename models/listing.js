const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');
const { required, string } = require('joi');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  image: {
    url: String,
    filename: String
  },
  price: {
    type: Number
  },
  location: {
    type: String
  },
  country: {
    type: String
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  geometry: {
  type: {
    type: String,
    enum: ['Point'], // GeoJSON requires "Point"
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
  }
});

listingSchema.post('findOneAndDelete', async function(listing) {
  if(listing){
  await Review.deleteMany({reviews : { $in: listing.reviews }});
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
