const asyncHandler = require('express-async-handler');
const Club = require('../models/Club');
const ErrorResponse = require('../utils/errorResponse');

// @desc Create new club
// @route POST /api/v1/clubs
// @access Private (admin only)
exports.createClub = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  let club = await Club.findOne({ name });

  if (club) {
    return next(new ErrorResponse('Club already exists', 400));
  }

  club = await Club.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Successfully created new club!',
    data: club,
  });
});

// @desc Get all clubs
// @route GET /api/v1/clubs
// @access Private
exports.getClubs = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get clubs list
// @route GET /api/v1/clubs/list
// @access Private
exports.getClubsList = asyncHandler(async (req, res) => {
  const clubs = await Club.find().select('name').sort('name');

  return res.status(200).json({
    success: true,
    count: clubs.length,
    data: clubs,
  });
});

// @desc Get single club
// @route GET /api/v1/clubs/:id
// @access Private
exports.getClub = asyncHandler(async (req, res, next) => {
  const club = await Club.findById(req.params.id);

  if (!club) {
    return next(
      new ErrorResponse(`Club not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: club,
  });
});

// @desc Get clubs in a voivodeship
// @route GET /api/v1/clubs/voivodeship/:voivodeship
// @access Private
exports.getClubsInVoivodeship = asyncHandler(async (req, res) => {
  const { voivodeship } = req.params;

  const clubs = await Club.find({
    'location.voivodeshipSlug': voivodeship,
  });

  res.status(200).json({
    success: true,
    count: clubs.length,
    data: clubs,
  });
});

// @desc Get clubs in an active radius
// @route GET /api/v1/clubs/radius/activeradius
// @access Private
exports.getClubsInRadius = asyncHandler(async (req, res) => {
  const { coords, activeRadius } = req.user;

  const radius = activeRadius / 6378;

  const clubs = await Club.find({
    location: {
      $geoWithin: {
        $centerSphere: [coords, radius],
      },
    },
  });

  res.status(200).json({
    success: true,
    count: clubs.length,
    data: clubs,
  });
});

// @desc Update club details
// @route PUT /api/v1/clubs/:id
// @access Private (admin only)
exports.updateClub = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const club = await Club.findById(id);

  if (!club) {
    return next(new ErrorResponse(`Club not found with id of ${id}`, 404));
  }

  Object.keys(req.body).forEach((key) => (club[key] = req.body[key]));

  await club.save({ validateModifiedOnly: true });

  res.status(200).json({
    success: true,
    data: club,
  });
});

// @desc Delete club
// @route DELETE /api/v1/clubs/:id
// @access Private (admin only)
exports.deleteClub = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const club = await Club.findById(id);

  if (!club) {
    return next(new ErrorResponse(`Club not found with id of ${id}`, 404));
  }

  await club.remove();

  res.status(200).json({
    success: true,
    message: `Club with the id of ${id} successfully removed!`,
  });
});
