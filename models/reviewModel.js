const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'A review can not be empty!'],
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be above 1'],
    max: [5, 'Rating must be below 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats.length ? stats[0].avgRating : 4.5,
    ratingsQuantity: stats.length ? stats[0].nRating : 0,
  });
};

reviewSchema.post('save', function () {
  // this points to current review
  // this.constructor points to current model (Review)
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.reviewObj = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () { // query has already executed
  this.reviewObj.constructor.calcAverageRatings(this.reviewObj.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
