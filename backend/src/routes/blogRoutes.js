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
router.post('/upload-image', upload.single('image'), uploadBlogImage);

module.exports = router;
