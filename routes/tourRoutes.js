const express = require('express');
const {
  aliasTopTours,
  getAllTours,
  getTourStats,
  getMonthlyPlan,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getToursWithin,
  getDistances, uploadTourImages, resizeTourImages,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

// POST /tour/5s5fd6vc2/reviews
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), uploadTourImages, resizeTourImages, updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
