const Blog = require('../models/Blog');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const { updateBlogSitemap } = require('../utils/sitemapGenerator');

// Helper to generate clean SEO slug strictly from title
const generateSlug = async (title, currentBlogId = null) => {
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!baseSlug) {
    baseSlug = 'blog-post';
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Blog.findOne({ slug });
    if (!existing || (currentBlogId && existing._id.toString() === currentBlogId.toString())) {
      break;
    }
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};

// POST /api/blogs - Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, subheading, content, coverImage, category, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const slug = await generateSlug(title);
    const authorName = req.user ? req.user.name : 'Marketing Team';
    const authorId = req.user ? req.user._id : null;

    const newBlog = await Blog.create({
      title,
      slug,
      subheading: subheading || '',
      content,
      coverImage: coverImage || '',
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      authorName,
      authorId,
      department: (req.user && req.user.department) ? req.user.department : 'Marketing',
      status: status || 'Published'
    });

    // Automatically update sitemap-blogs.xml
    await updateBlogSitemap();

    return res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog
    });
  } catch (error) {
    console.error('Error in createBlog:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/blogs - Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subheading: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: blogs
    });
  } catch (error) {
    console.error('Error in getAllBlogs:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/blogs/:id - Get Single Blog
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    let blog = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }
    if (!blog && id.includes('-')) {
      const baseSlugWithoutNumber = id.replace(/-\d{4,5}$/, '');
      blog = await Blog.findOne({ slug: baseSlugWithoutNumber });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Increment views counter
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    return res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error in getBlogById:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/blogs/:id - Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subheading, content, coverImage, category, tags, status } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    if (title && title !== blog.title) {
      blog.title = title;
      blog.slug = await generateSlug(title, blog._id);
    }
    if (subheading !== undefined) blog.subheading = subheading;
    if (content !== undefined) blog.content = content;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (category !== undefined) blog.category = category;
    if (tags !== undefined) {
      blog.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);
    }
    if (status !== undefined) blog.status = status;

    await blog.save();

    // Automatically update sitemap-blogs.xml
    await updateBlogSitemap();

    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('Error in updateBlog:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/blogs/:id - Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Automatically update sitemap-blogs.xml
    await updateBlogSitemap();

    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteBlog:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/blogs/upload-image - Upload Image for Editor / Cover to Cloudinary
exports.uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    // Upload image to Cloudinary in 'blogs' folder
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blogs',
      resource_type: 'auto'
    });

    // Cleanup local temp file after uploading to Cloudinary
    if (req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Failed to unlink local file:', unlinkErr);
      }
    }

    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      message: 'Image uploaded to Cloudinary successfully'
    });
  } catch (error) {
    console.error('Error in uploadBlogImage:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
