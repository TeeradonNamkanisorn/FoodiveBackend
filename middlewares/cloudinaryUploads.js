const cloudinary = require('../utils/cloudinary');

const uploadImage = async (req, res, next) => {
  try {
    if (req.file) {
      const imagePath = req.file?.path;
      console.log(imagePath);

      const response = await cloudinary.upload(imagePath);

      req.imageFile = response;
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage };
