const Movie = require("../models/Movie");
// for the images
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Multer Image
// const imagesDir = "./public/images";

// if (!fs.existsSync(imagesDir)) {
//   fs.mkdirSync(imagesDir, { recursive: true });
// }

module.exports.addMovie = (req, res) => {
  return Movie.findOne({ title: req.body.title })
    .then((existingMovie) => {
      let newMovie = new Movie({
        title: req.body.title,
        director: req.body.director,
        year: req.body.year,
        description: req.body.description,
        genre: req.body.genre,
        comments: [],
      });

      if (existingMovie) {
        return res.status(409).send({ error: "Movie already exists" });
      }

      return newMovie
        .save()
        .then((savedMovie) => res.status(201).send({ savedMovie }))
        .catch((saveError) => {
          // the error message will be displayed in the terminal
          console.error("Error in saving the movie: ", saveError);

          // this will be sent as a response to the client
          res.status(500).send({ error: "Failed to save the movie" });
        });
    })
    .catch((findErr) => {
      // the error message will be displayed in the terminal
      console.error("Error in finding the course: ", findErr);

      // this will be sent as a response to the client
      return res.status(500).send({ message: "Error in finding the course" });
    });
};

module.exports.addComment = (req, res) => {
  // By storing data in descriptive variable, it enhances code readability
  let movieId = req.params.movieId;
  if (req.user.isAdmin) {
    // 403 status code means forbidden. This means that the action that the client is trying to do is not allowed.
    return res.status(403).send({ error: "Admin is forbidden" });
  }

  // created a variable to store the data coming from the request body
  let updatedMovie = {
    userId: req.user.userId,
    comment: req.body.comment,
  };

  // findByIdAndUpdate() finds the document in the database and updates it automatically
  // the first argument will be the id of the document to be udated, the second argument will be the updated values of the documents
  return Movie.findByIdAndUpdate(
    movieId,
    { $push: { comments: updatedMovie } },
    { new: true }
  )
    .then((updatedMovie) => {
      if (updatedMovie) {
        // modified the response to containe contextual nformation and the actual course that was updated
        return res.status(200).send({
          message: "Comment Added successfully",
          updatedMovie: updatedMovie,
        });
      } else {
        return res.status(404).send({ error: "Movie not found" });
      }
    })
    .catch((updateErr) => {
      console.error("Error in updating the movie: ", updateErr);

      return res.status(500).send({ error: "Error in updating the movie" });
    });
};

module.exports.getMovies = (req, res) => {
  return Movie.find({})
    .then((movies) => {
      // added validations to check if there are courses saved in the database
      if (movies.length > 0) {
        return res.status(200).send({ movies });
      } else {
        // 200 is a result of a successful request, even if the response returned no record/content
        return res.status(200).send({ message: "No movies found." });
      }
    })
    .catch((findErr) => {
      console.error("Error in finding all movies: ", findErr);

      return res.status(500).send({ error: "Error finding movies." });
    });
};

module.exports.getMovie = (req, res) => {
  return Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return res.status(404).send({ error: "Movie not found " });
      }

      return res.status(200).send({ movie });
    })
    .catch((findErr) => {
      console.error("Error finding movie: ", findErr);

      return res.status(500).send({ error: "Failed to fetch movie" });
    });
};

module.exports.updateMovie = (req, res) => {
  // By storing data in descriptive variable, it enhances code readability
  let movieId = req.params.movieId;

  // created a variable to store the data coming from the request body
  let updateMovie = {
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
    description: req.body.description,
    genre: req.body.genre,
  };

  // findByIdAndUpdate() finds the document in the database and updates it automatically
  // the first argument will be the id of the document to be udated, the second argument will be the updated values of the documents
  return Movie.findByIdAndUpdate(movieId, updateMovie, { new: true })
    .then((updateMovie) => {
      if (updateMovie) {
        // modified the response to containe contextual nformation and the actual course that was updated
        return res.status(200).send({
          message: "Movie updated successfully",
          updatedMovie: updateMovie,
        });
      } else {
        return res.status(404).send({ error: "Movie not found" });
      }
    })
    .catch((updateErr) => {
      console.error("Error in updating the Movie: ", updateErr);

      return res.status(500).send({ error: "Error in updating the Movie" });
    });
};

module.exports.deleteMovie = (req, res) => {
  const movieId = req.params.movieId;

  // Verify ownership before deleting
  Movie.findOne({ _id: movieId })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send({ error: "Workout not found" });
      }

      return Movie.deleteOne({ _id: movieId })
        .then((deleted) => {
          if (deleted) {
            res.status(200).send({
              message: "Movie deleted successfully",
              deleted: deleted,
            });
          } else {
            res.status(500).send({ error: "Failed to delete Movie" });
          }
        })
        .catch((deleteErr) =>
          res.status(500).send({ error: "Error deleting the Movie" })
        );
    })
    .catch((findError) =>
      res.status(500).send({ error: "Error finding the Movie" })
    );
};

module.exports.getComments = (req, res) => {
  return Movie.findById(req.params.movieId)
    .then((movies) => {
      if (!movies) {
        return res.status(404).send({ error: "movies not found " });
      }

      return res.status(200).send({ comments: movies.comments });
    })
    .catch((findErr) => {
      console.error("Error finding courses: ", findErr);

      return res.status(500).send({ error: "Failed to fetch Movie" });
    });
};

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {

//     cb(null, "./public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "_" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({
//   storage: storage,
// }).single("image");

// module.exports.uploadImage = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       console.error("Error uploading image:", err);
//       return res.status(500).send({ error: "Failed to upload image" });
//     }

//     try {
//       // Check if movie already exists
//       const existingMovie = await Movie.findOne({ title: req.body.title });

//       if (existingMovie) {
//         return res.status(409).send({ error: "Movie already exists" });
//       }

//       // Create a new movie instance with image file path
//       const newMovie = new Movie({
//         title: req.body.title,
//         director: req.body.director,
//         year: req.body.year,
//         description: req.body.description,
//         genre: req.body.genre,
//         // image: req.file ? req.file.filename : null, // Save the filename if file exists
//         image: req.body.image,
//         comments: [],
//       });

//       // Save the new movie instance
//       const savedMovie = await newMovie.save();
//       return res.status(201).send({ savedMovie });
//     } catch (error) {
//       console.error("Error in saving the movie:", error);
//       return res.status(500).send({ error: "Failed to save the movie" });
//     }
//   });
// };

module.exports.uploadImage = async (req, res) => {
  try {
    // Assuming you have already uploaded the image to Firebase Cloud Storage
    // and have the image URL available in req.body.image

    // Check if movie already exists
    const existingMovie = await Movie.findOne({ title: req.body.title });

    if (existingMovie) {
      return res.status(409).send({ error: "Movie already exists" });
    }

    // Create a new movie instance with image URL
    const newMovie = new Movie({
      title: req.body.title,
      director: req.body.director,
      year: req.body.year,
      description: req.body.description,
      genre: req.body.genre,
      image: req.body.image, // Assuming you're storing the image URL directly
      comments: [],
    });

    // Save the new movie instance
    const savedMovie = await newMovie.save();
    return res.status(201).send({ savedMovie });
  } catch (error) {
    console.error("Error in saving the movie:", error);
    return res.status(500).send({ error: "Failed to save the movie" });
  }
};
