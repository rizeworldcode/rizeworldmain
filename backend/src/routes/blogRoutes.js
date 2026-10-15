const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  uploadBlogImage
} = require('../controllers/blogController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

// Public routes (for viewing blogs on website/app)
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes (for marketing team & admin)
router.use(protect);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

// Upload image with clean JSON error handling for file size / format errors
router.post('/upload-image', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const isSizeError = err.code === 'LIMIT_FILE_SIZE';
      return res.status(400).json({
        success: false,
        message: isSizeError
          ? 'Image file is too large. Maximum file size allowed is 5MB.'
          : (err.message || 'Error uploading image')
      });
    }
    next();
  });
}, uploadBlogImage);

module.exports = router;
