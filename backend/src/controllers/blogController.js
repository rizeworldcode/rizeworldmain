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

// Helper to upload any base64 data URIs found in blog HTML content to Cloudinary
const processBase64ImagesInContent = async (htmlContent) => {
  if (!htmlContent || typeof htmlContent !== 'string') return htmlContent;

  const base64Regex = /src=["'](data:image\/[a-zA-Z0-9.+_-]+;base64,[^"']+)["']/g;
  let match;
  const matches = [];
  while ((match = base64Regex.exec(htmlContent)) !== null) {
    if (!matches.includes(match[1])) {
      matches.push(match[1]);
    }
  }

  if (matches.length === 0) return htmlContent;

  let updatedContent = htmlContent;
  for (const dataUri of matches) {
    try {
      const uploadRes = await cloudinary.uploader.upload(dataUri, {
        folder: 'blogs',
        resource_type: 'image'
      });
      if (uploadRes && uploadRes.secure_url) {
        // Replace all occurrences of this data URI with the Cloudinary URL
        updatedContent = updatedContent.split(dataUri).join(uploadRes.secure_url);
      }
    } catch (uploadErr) {
      console.error('Failed to upload inline base64 image to Cloudinary:', uploadErr.message);
    }
  }

  return updatedContent;
};

// Helper to upload base64 cover image if provided
const processCoverImage = async (coverImage) => {
  if (!coverImage || typeof coverImage !== 'string') return coverImage || '';
  if (!coverImage.startsWith('data:image/')) return coverImage;

  try {
    const uploadRes = await cloudinary.uploader.upload(coverImage, {
      folder: 'blogs',
      resource_type: 'image'
    });
    return uploadRes.secure_url || coverImage;
  } catch (err) {
    console.error('Failed to upload base64 cover image to Cloudinary:', err.message);
    return coverImage;
  }
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
    const authorRole = (req.user && req.user.role) ? req.user.role : '';
    const authorId = req.user ? req.user._id : null;

    // Automatically detect and convert any pasted inline base64 images to Cloudinary URLs
    const sanitizedContent = await processBase64ImagesInContent(content);
    const sanitizedCover = await processCoverImage(coverImage);

    const newBlog = await Blog.create({
      title,
      slug,
      subheading: subheading || '',
      content: sanitizedContent,
      coverImage: sanitizedCover || '',
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      authorName,
      authorRole,
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

    const blogs = await Blog.find(query).sort({ createdAt: -1 }).populate('authorId', 'name role department profilePic').lean();

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
      blog = await Blog.findById(id).populate('authorId', 'name role department profilePic');
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id }).populate('authorId', 'name role department profilePic');
    }
    if (!blog && id.includes('-')) {
      const baseSlugWithoutNumber = id.replace(/-\d{4,5}$/, '');
      blog = await Blog.findOne({ slug: baseSlugWithoutNumber }).populate('authorId', 'name role department profilePic');
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
    const { title, subheading, content, coverImage, category, tags, status, authorName } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    if (title && title !== blog.title) {
      blog.title = title;
      blog.slug = await generateSlug(title, blog._id);
    }
    if (subheading !== undefined) blog.subheading = subheading;
    if (content !== undefined) {
      blog.content = await processBase64ImagesInContent(content);
    }
    if (coverImage !== undefined) {
      blog.coverImage = await processCoverImage(coverImage);
    }
    if (category !== undefined) blog.category = category;
    if (tags !== undefined) {
      blog.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);
    }
    if (status !== undefined) blog.status = status;
    if (authorName) {
      blog.authorName = authorName;
    }
    if (req.user) {
      if (!blog.authorId) blog.authorId = req.user._id;
      if (req.user.name && (blog.authorName === 'Marketing Team' || !blog.authorName)) {
        blog.authorName = req.user.name;
      }
      if (req.user.role) {
        blog.authorRole = req.user.role;
      }
    }

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
