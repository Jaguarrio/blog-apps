const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    fs.access(path.join(__dirname, `../public/images/${req.user._id}`), (err) => {
      const dest = path.join(__dirname, `../public/images/${req.user._id}`);

      if (err) {
        fs.mkdirSync(dest);
      }
      done(null, dest);
    });
  },
  filename: (req, file, done) => {
    const name = `${req.user._id}-${Date.now() + Math.round(Math.random() * 1e9)}.png`;
    done(null, name);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
