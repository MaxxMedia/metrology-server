export const uploadBannerImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Banner image upload failed" });
    }

    res.status(200).json({
      imageUrl: req.file.path, // Cloudinary URL
    });
  } catch (error) {
    res.status(500).json({ message: "Image upload error" });
  }
};
