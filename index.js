const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Only for Multer Image
// ==============================================
// const Movie = require("./models/Movie");
// const { verify, verifyAdmin } = require("./auth");
// const multer = require("multer");
// const path = require("path");

// ==============================================

const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");

const app = express();
const port = 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(
  "mongodb+srv://admin:admin1234@vondb.rdyxmaz.mongodb.net/Movie-Catalog?retryWrites=true&w=majority&appName=vonDB"
);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

db.once("open", () => console.log(`We're now connected to MongoDb Atlas`));

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);

// Multer Image
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
// });

// app.post("/upload-image", upload.single("file"), (req, res) => {
//   console.log(req.body);
//   // res.json("Uploaded!");
//   const imageName = req.file.filename;

//   try {
//     Movie.create({ image: imageName });
//     res.json({ status: "ok" });
//   } catch (error) {
//     res.json({ status: error });
//   }
// });

if (require.main === module) {
  app.listen(process.env.PORT || port, () =>
    console.log(`API is now online on port ${process.env.PORT || port}`)
  );
}

module.exports = { app, mongoose };
