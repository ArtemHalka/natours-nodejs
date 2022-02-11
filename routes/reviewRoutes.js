const express = require('express');
const {
  getAllReviews, createReview, deleteReview, updateReview, getReview, setTourUserIds,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(
    // POST /reviews
    // POST /tour/5s5fd6vc2/reviews
    restrictTo('user'),
    setTourUserIds,
    createReview,
  );

router
  .route('/:id')
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .get(getReview);

module.exports = router;
