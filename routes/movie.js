const express = require("express");
const movieController = require("../controllers/movieController");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// Create
router.post("/addMovie", verify, verifyAdmin, movieController.addMovie);
router.patch("/addComment/:movieId", verify, movieController.addComment);
router.get("/getMovies", movieController.getMovies);
router.get("/getMovie/:movieId", verify, movieController.getMovie);
router.patch(
  "/updateMovie/:movieId",
  verify,
  verifyAdmin,
  movieController.updateMovie
);
router.delete(
  "/deleteMovie/:movieId",
  verify,
  verifyAdmin,
  movieController.deleteMovie
);

router.get("/getComments/:movieId", verify, movieController.getComments);
router.post("/upload-image", movieController.uploadImage);

module.exports = router;
