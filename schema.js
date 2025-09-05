// const joi = require('joi');

// // module.exports.listingSchema = joi.object({
// //     listing : joi.object({
// //         title: joi.string().required(),
// //         description: joi.string().required(),
// //         location: joi.string().required(),
// //         country: joi.string().required(),
// //         price: joi.number().required().min(0),
// //         image: joi.string({
// //             url:joi.string().allow("", null)
// //         })
// //     }).required()
// // });

// const joi = require('joi');

// module.exports.listingSchema = joi.object({
//   listing : joi.object({
//       title: joi.string().required(),
//       description: joi.string().required(),
//       location: joi.string().required(),
//       country: joi.string().required(),
//       price: joi.number().required().min(0),
//       image: joi.object({
//           url: joi.string().allow("", null)
//       })
//   }).required()
// });


// module.exports.reviewSchema = joi.object({
//     review: joi.object({
//         rating: joi.number().required().min(1).max(5),
//         comment: joi.string().required(),
//     }).required(),
// })


const Joi = require('joi');   // ✅ Use capital J for consistency

module.exports.listingSchema = Joi.object({
  listing : Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      country: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.object({
          url: Joi.string().allow("", null).default("")
      })
  }).required({})
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      comment: Joi.string().required(),
  }).required(),
});
