const express = require('express');
const router = express.Router();
const releasesController = require("../controllers/releasesController");
const labelsController = require("../controllers/labelsController");
const artistsController = require("../controllers/artistsController");
const youtubeController = require("../controllers/youtubeController");
const distributorsController = require("../controllers/distributorsController");
const ownersController = require("../controllers/ownersController");
const countriesController = require("../controllers/countriesController");
const logsController = require("../controllers/logsController");
const tracksController = require("../controllers/tracksController");


/// Releases
router.get('/get-releases/', releasesController.getAll)
router.put('/edit-release/:id', releasesController.update)
router.post('/add-release/', releasesController.create)
router.delete('/delete-release/:id', releasesController.delete)
router.post('/export-releases/', releasesController.export)
router.post('/add-to-rvbd-many/', releasesController.addToRevibedMany)
router.post('/put-on-sale-release/', releasesController.putOnSale)
router.post('/check-release/', releasesController.checkRelease)
router.post('/update-by-revibed-id/', releasesController.updateByRevibedID)

/// Tracks
router.get('/get-tracks/', tracksController.getAll)
router.get('/get-release-tracks/:id', tracksController.getByRelease)
router.put('/edit-track/:id', tracksController.update)
router.post('/add-track/', tracksController.create)
router.delete('/delete-track/:id', tracksController.delete)


/// Labels
router.post('/add-label/', labelsController.create)
router.get('/get-labels/', labelsController.getAll)
router.put('/edit-label/:id', labelsController.update)
router.post('/export-labels/', labelsController.export)
router.put('/remove-parentlabel/:id', labelsController.removeParentLabel)
router.post('/sublabels-exist-update/', labelsController.sublabelsExistUpdate)
router.post('/sublabels-status-update/', labelsController.sublabelsStatusUpdate)

/// Artists
router.post('/add-artist/', artistsController.create)
router.get('/get-artists/', artistsController.getAll)
router.put('/edit-artist/:id', artistsController.update)


//// Youtube
router.get('/get-youtubes/', youtubeController.getAll)
router.post('/add-youtube/', youtubeController.create)
router.put('/edit-youtube/:id', youtubeController.update)
router.delete('/delete-youtube/:id', youtubeController.delete)


/// distributors
router.get('/get-distributors/', distributorsController.getAll)
router.put('/edit-distributor/:id', distributorsController.update)

/// owners
router.get('/get-owners/', ownersController.getAll)
router.put('/edit-owner/:id', ownersController.update)

/// countries
router.get('/get-countries/', countriesController.getAll)

/// countries
router.get('/get-logs/', logsController.getAll)



module.exports = router;
