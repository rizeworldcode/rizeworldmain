import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  List, ListOrdered, Image as ImageIcon, Link as LinkIcon, 
  Type, Sparkles, Plus, Search, Eye, Edit3, Trash2, 
  ArrowLeft, CheckCircle2, FileText, Upload, Palette, 
  Quote, Redo, Undo, Save, Globe, Tag, Layers, X, Loader2
} from 'lucide-react';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:45000';
  }
  return 'https://rizeworldmain.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

const FONT_FAMILIES = [
  { name: 'Default (Inter)', value: 'Inter, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' }
];

const FONT_SIZES = [
  { name: '12px (Small)', value: '12px' },
  { name: '14px (Normal)', value: '14px' },
  { name: '16px (Medium)', value: '16px' },
  { name: '18px (Large)', value: '18px' },
  { name: '20px (XL)', value: '20px' },
  { name: '24px (H3)', value: '24px' },
  { name: '28px (H2)', value: '28px' },
  { name: '32px (H1)', value: '32px' }
];

const TEXT_COLORS = [
  '#000000', '#1e293b', '#475569', '#2563eb', 
  '#7c3aed', '#db2777', '#dc2626', '#d97706', '#16a34a'
];

const HIGHLIGHT_COLORS = [
  'transparent', '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa'
];

const CATEGORIES = [
  'General', 'Digital Marketing', 'SEO', 'Content Strategy', 
  'Social Media', 'Branding', 'Web Development', 'News & Updates'
];

const BlogManagement = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'editor' | 'preview'
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ show: false, blogId: null });
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const savedRangeRef = useRef(null);

  // Current Blog Form State
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [subheading, setSubheading] = useState('');
  const [category, setCategory] = useState('Digital Marketing');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('Published');
  const [coverImage, setCoverImage] = useState('');
  const [contentHtml, setContentHtml] = useState('');

  // Selected Editor Controls
  const [currentFont, setCurrentFont] = useState('Inter, sans-serif');
  const [currentSize, setCurrentSize] = useState('16px');
  const [textColor, setTextColor] = useState('#1e293b');
  const [highlightColor, setHighlightColor] = useState('transparent');

  const editorRef = useRef(null);
  const inlineImageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  const getStaffToken = () => localStorage.getItem('staffToken') || '';

  const showToast = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data || []);
      } else {
        showToast(data.message || 'Failed to load blogs', 'error');
      }
    } catch (err) {
      console.error('Fetch blogs error:', err);
      showToast('Error connecting to backend server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Sync editor content with contentHtml when entering editor
  useEffect(() => {
    if (activeTab === 'editor' && editorRef.current) {
      editorRef.current.innerHTML = contentHtml || '<p>Start writing your blog content here...</p>';
    }
  }, [activeTab]);

  // Execute editor command preserving focus
  const executeCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
  };

  // Apply Font Family
  const handleFontFamilyChange = (fontVal) => {
    setCurrentFont(fontVal);
    executeCommand('fontName', fontVal);
  };

  // Apply Font Size
  const handleFontSizeChange = (sizeVal) => {
    setCurrentSize(sizeVal);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = sizeVal;
      range.surroundContents(span);
      if (editorRef.current) setContentHtml(editorRef.current.innerHTML);
    }
  };

  // Apply Block Formatting (Headings / Paragraph / Quote)
  const handleBlockFormat = (formatType) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const targetTag = formatType.toLowerCase(); // 'p', 'h1', 'h2', 'h3', 'blockquote'
    const sel = window.getSelection();

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      let anchor = range.startContainer;
      let currentBlock = anchor.nodeType === 3 ? anchor.parentNode : anchor;

      // Navigate up to find the closest block element inside editorRef
      while (
        currentBlock &&
        currentBlock !== editorRef.current &&
        !['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'BLOCKQUOTE', 'DIV', 'LI'].includes(currentBlock.tagName)
      ) {
        currentBlock = currentBlock.parentNode;
      }

      if (currentBlock && currentBlock !== editorRef.current) {
        const currentTag = currentBlock.tagName.toLowerCase();
        // Toggle back to paragraph if clicking the active heading button again
        const newTag = (currentTag === targetTag && targetTag !== 'p') ? 'p' : targetTag;

        const newBlock = document.createElement(newTag);

        // Copy all child nodes from currentBlock into newBlock
        while (currentBlock.firstChild) {
          newBlock.appendChild(currentBlock.firstChild);
        }

        // If converting back to paragraph 'p', clear any inline font-size overrides on inner elements
        if (newTag === 'p') {
          const innerSpans = newBlock.querySelectorAll('span[style*="font-size"]');
          innerSpans.forEach(span => {
            span.style.fontSize = '';
            if (!span.getAttribute('style') || span.getAttribute('style').trim() === '') {
              while (span.firstChild) {
                span.parentNode.insertBefore(span.firstChild, span);
              }
              span.parentNode.removeChild(span);
            }
          });
        }

        currentBlock.parentNode.replaceChild(newBlock, currentBlock);

        // Restore cursor focus inside the converted block
        try {
          const newRange = document.createRange();
          newRange.selectNodeContents(newBlock);
          newRange.collapse(false);
          sel.removeAllRanges();
          sel.addRange(newRange);
        } catch (e) {}
      } else {
        // Fallback for bare text or empty line
        let success = false;
        try {
          success = document.execCommand('formatBlock', false, `<${targetTag}>`);
        } catch (err) {}

        if (!success) {
          try {
            document.execCommand('formatBlock', false, targetTag.toUpperCase());
          } catch (e) {}
        }
      }
    }

    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
  };

  // Text Color Change
  const handleTextColorChange = (color) => {
    setTextColor(color);
    executeCommand('foreColor', color);
  };

  // Highlight Color Change
  const handleHighlightChange = (color) => {
    setHighlightColor(color);
    executeCommand('hiliteColor', color);
  };

  // Open Link Modal
  const handleOpenLinkModal = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      const selectedText = sel.toString().trim();
      setLinkText(selectedText);
    } else {
      savedRangeRef.current = null;
      setLinkText('');
    }
    setLinkUrl('');
    setShowLinkModal(true);
  };

  // Apply Link from Modal
  const handleApplyLink = (e) => {
    if (e) e.preventDefault();
    if (!linkUrl.trim()) return;

    if (editorRef.current) {
      editorRef.current.focus();
    }

    const sel = window.getSelection();
    if (savedRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }

    let url = linkUrl.trim();
    if (!/^https?:\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('#')) {
      url = 'https://' + url;
    }

    const selectedText = sel ? sel.toString().trim() : '';

    if (selectedText.length > 0) {
      document.execCommand('createLink', false, url);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.textContent = linkText.trim() || url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.color = '#7c3aed';
      a.style.textDecoration = 'underline';
      a.style.fontWeight = '600';

      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(a);
        range.setStartAfter(a);
        range.setEndAfter(a);
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (editorRef.current) {
        editorRef.current.appendChild(a);
      }
    }

    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
    setShowLinkModal(false);
  };

  // Inline Image Upload Handler
  const handleInlineImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getStaffToken()}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        const fullUrl = data.imageUrl.startsWith('http') 
          ? data.imageUrl 
          : `${API_BASE_URL}${data.imageUrl}`;
        
        // Insert image at cursor
        const imgHtml = `<div class="my-4 text-center"><img src="${fullUrl}" alt="Blog Image" class="max-w-full rounded-2xl shadow-lg mx-auto inline-block border border-gray-200" /><p class="text-xs text-gray-400 mt-1 italic">Image caption</p></div><p><br></p>`;
        executeCommand('insertHTML', imgHtml);
        showToast('Image inserted into content!');
      } else {
        showToast(data.message || 'Image upload failed', 'error');
      }
    } catch (err) {
      console.error('Inline image upload error:', err);
      showToast('Error uploading image', 'error');
    } finally {
      setUploadingImage(false);
      if (inlineImageInputRef.current) inlineImageInputRef.current.value = '';
    }
  };

  // Cover Image Upload Handler
  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getStaffToken()}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        const fullUrl = data.imageUrl.startsWith('http') 
          ? data.imageUrl 
          : `${API_BASE_URL}${data.imageUrl}`;
        setCoverImage(fullUrl);
        showToast('Cover image updated!');
      } else {
        showToast(data.message || 'Cover image upload failed', 'error');
      }
    } catch (err) {
      console.error('Cover image upload error:', err);
      showToast('Error uploading cover image', 'error');
    } finally {
      setUploadingImage(false);
      if (coverImageInputRef.current) coverImageInputRef.current.value = '';
    }
  };

  // Open Editor for New Blog
  const handleCreateNew = () => {
    setEditingId(null);
    setTitle('');
    setSubheading('');
    setCategory('Digital Marketing');
    setTags('Marketing, Growth, Tips');
    setStatus('Published');
    setCoverImage('');
    setContentHtml('<p>Write your engaging blog post here...</p>');
    setActiveTab('editor');
  };

  // Edit existing blog
  const handleEditBlog = (blog) => {
    setEditingId(blog._id);
    setTitle(blog.title || '');
    setSubheading(blog.subheading || '');
    setCategory(blog.category || 'General');
    setTags(Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''));
    setStatus(blog.status || 'Published');
    setCoverImage(blog.coverImage || '');
    setContentHtml(blog.content || '');
    setActiveTab('editor');
  };

  // Save / Update Blog Post
  const handleSaveBlog = async (e) => {
    if (e) e.preventDefault();

    const currentContent = editorRef.current ? editorRef.current.innerHTML : contentHtml;

    if (!title.trim()) {
      showToast('Blog title is required', 'error');
      return;
    }
    if (!currentContent || currentContent === '<p><br></p>' || currentContent.trim() === '') {
      showToast('Blog content cannot be empty', 'error');
      return;
    }

    setSaving(true);
    const payload = {
      title,
      subheading,
      content: currentContent,
      coverImage,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      status
    };

    try {
      const url = editingId 
        ? `${API_BASE_URL}/api/blogs/${editingId}` 
        : `${API_BASE_URL}/api/blogs`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getStaffToken()}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingId ? 'Blog updated successfully!' : 'Blog post published successfully!');
        fetchBlogs();
        setActiveTab('list');
      } else {
        showToast(data.message || 'Failed to save blog', 'error');
      }
    } catch (err) {
      console.error('Save blog error:', err);
      showToast('Connection error while saving blog', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Blog
  const handleDeleteBlog = async () => {
    if (!deleteModal.blogId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs/${deleteModal.blogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getStaffToken()}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Blog post deleted successfully');
        setBlogs(blogs.filter(b => b._id !== deleteModal.blogId));
      } else {
        showToast(data.message || 'Failed to delete blog', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Error deleting blog post', 'error');
    } finally {
      setDeleteModal({ show: false, blogId: null });
    }
  };

  // Filtered blogs for list view
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = searchQuery === '' || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.subheading && b.subheading.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              notification.type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            <CheckCircle2 size={20} />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-yellow-300" />
            Marketing Department Portal
          </div>
          <h1 className="text-3xl font-black tracking-tight">Marketing Blog Studio</h1>
          <p className="text-purple-100 text-sm mt-1 max-w-xl">
            Create, format, and publish MS Word-styled articles, SEO blog posts, and company announcements with rich typography and image support.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 flex-wrap">
          {activeTab === 'list' && (
            <button
              onClick={handleCreateNew}
              className="px-5 py-3 bg-white text-purple-700 hover:bg-purple-50 font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              <Plus size={18} />
              Write New Blog
            </button>
          )}
          {activeTab !== 'list' && (
            <button
              onClick={() => setActiveTab('list')}
              className="px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold rounded-2xl transition-all flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={18} />
              Back to All Blogs
            </button>
          )}
        </div>
      </div>

      {/* Hidden File Inputs for Images */}
      <input 
        type="file" 
        ref={inlineImageInputRef}
        onChange={handleInlineImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input 
        type="file" 
        ref={coverImageInputRef}
        onChange={handleCoverImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* LIST VIEW */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Controls & Search */}
          <div className="clay-flat p-6 rounded-3xl bg-[#eef2f6] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs by title or keyword..."
                className="w-full pl-11 pr-4 py-3 bg-[#eef2f6] clay-inset rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <span className="text-xs font-black uppercase text-gray-400 whitespace-nowrap">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-[#eef2f6] clay-inset rounded-xl text-xs font-bold text-purple-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin text-purple-600 mx-auto" size={40} />
              <p className="text-gray-500 font-bold text-sm mt-3">Loading blog posts...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="clay-flat p-12 rounded-3xl text-center bg-[#eef2f6]">
              <FileText className="mx-auto text-purple-300 mb-3" size={60} />
              <h3 className="text-xl font-black text-gray-700 uppercase">No Blogs Found</h3>
              <p className="text-gray-500 text-sm mt-1">Start writing your first marketing article using the MS Word editor.</p>
              <button
                onClick={handleCreateNew}
                className="mt-5 px-6 py-3 bg-purple-600 text-white font-black rounded-2xl shadow-lg hover:bg-purple-700 transition-all inline-flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <Plus size={16} /> Write First Article
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map(blog => (
                <motion.div
                  key={blog._id}
                  whileHover={{ y: -4 }}
                  className="clay-flat rounded-3xl bg-[#eef2f6] overflow-hidden flex flex-col justify-between border border-white/40 shadow-xl"
                >
                  <div>
                    {/* Cover image or placeholder */}
                    <div className="h-48 bg-gradient-to-br from-purple-100 to-indigo-100 relative overflow-hidden">
                      {blog.coverImage ? (
                        <img 
                          src={blog.coverImage.startsWith('http') ? blog.coverImage : `${API_BASE_URL}${blog.coverImage}`} 
                          alt={blog.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-300">
                          <FileText size={50} />
                        </div>
                      )}
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${
                        blog.status === 'Published' 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-amber-500 text-white'
                      }`}>
                        {blog.status || 'Published'}
                      </span>
                      <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md text-white rounded-xl text-[10px] font-bold">
                        {blog.category || 'General'}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="font-black text-gray-800 text-lg line-clamp-2 hover:text-purple-600 transition-colors">
                        {blog.title}
                      </h3>
                      {blog.subheading && (
                        <p className="text-gray-500 text-xs mt-2 line-clamp-2 font-medium">
                          {blog.subheading}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 text-[11px] text-gray-400 font-bold">
                        <span>
                          By {
                            (() => {
                              const wName = (blog.authorId && typeof blog.authorId === 'object' && blog.authorId.name) ? blog.authorId.name : (blog.authorName || 'Marketing Team');
                              const wRole = (blog.authorId && typeof blog.authorId === 'object' && blog.authorId.role && blog.authorId.role !== 'Other') ? blog.authorId.role : (blog.authorRole && blog.authorRole !== 'Other' ? blog.authorRole : '');
                              return wRole ? `${wName} (${wRole})` : wName;
                            })()
                          }
                        </span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-200/50 mt-4">
                    <button
                      onClick={() => {
                        setEditingId(blog._id);
                        setTitle(blog.title);
                        setSubheading(blog.subheading || '');
                        setCategory(blog.category || 'General');
                        setTags(Array.isArray(blog.tags) ? blog.tags.join(', ') : '');
                        setStatus(blog.status || 'Published');
                        setCoverImage(blog.coverImage || '');
                        setContentHtml(blog.content || '');
                        setActiveTab('preview');
                      }}
                      className="text-xs font-bold text-gray-600 hover:text-purple-600 flex items-center gap-1"
                    >
                      <Eye size={14} /> Preview
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditBlog(blog)}
                        className="p-2 clay-inset rounded-xl text-purple-600 hover:bg-purple-100 transition-all"
                        title="Edit Blog"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, blogId: blog._id })}
                        className="p-2 clay-inset rounded-xl text-rose-500 hover:bg-rose-100 transition-all"
                        title="Delete Blog"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDITOR & PREVIEW VIEW */}
      {(activeTab === 'editor' || activeTab === 'preview') && (
        <div className="space-y-6">
          {/* Sub-header Controls */}
          <div className="clay-flat p-4 rounded-2xl bg-[#eef2f6] flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-[#eef2f6] p-1 rounded-2xl clay-inset">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === 'editor' 
                    ? 'clay-flat text-purple-700 font-bold' 
                    : 'text-gray-500 hover:text-purple-700'
                }`}
              >
                <Edit3 size={14} /> MS Word Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === 'preview' 
                    ? 'clay-flat text-purple-700 font-bold' 
                    : 'text-gray-500 hover:text-purple-700'
                }`}
              >
                <Eye size={14} /> Reader Preview
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveBlog}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {editingId ? 'Update Article' : 'Publish Article'}
              </button>
            </div>
          </div>

          {activeTab === 'editor' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main MS Word Editor Canvas (2 columns) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Title & Subheading Card */}
                <div className="clay-flat p-6 rounded-3xl bg-[#eef2f6] space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-purple-700 ml-1">Article Title *</label>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter powerful blog title here..."
                      className="w-full mt-1 px-4 py-3 bg-[#eef2f6] clay-inset rounded-2xl font-black text-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subheading / Brief Summary</label>
                    <input 
                      type="text"
                      value={subheading}
                      onChange={(e) => setSubheading(e.target.value)}
                      placeholder="Brief excerpt or sub-headline..."
                      className="w-full mt-1 px-4 py-2.5 bg-[#eef2f6] clay-inset rounded-xl font-bold text-sm text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* MS WORD RICH TEXT TOOLBAR & CANVAS */}
                <div className="clay-flat p-6 rounded-3xl bg-[#eef2f6] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-purple-700 flex items-center gap-2">
                      <Sparkles size={14} /> MS Word Style Content Editor
                    </span>
                    <button
                      type="button"
                      onClick={() => inlineImageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                    >
                      {uploadingImage ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                      Insert Image into Article
                    </button>
                  </div>

                  {/* TOOLBAR CONTROLS */}
                  <div className="p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 shadow-inner space-y-3">
                    {/* Row 1: Font Family, Size, Heading selector */}
                    <div className="flex items-center gap-3 flex-wrap border-b border-gray-200 pb-3">
                      {/* Font Family */}
                      <select
                        value={currentFont}
                        onChange={(e) => handleFontFamilyChange(e.target.value)}
                        className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                        title="Font Family"
                      >
                        {FONT_FAMILIES.map(f => (
                          <option key={f.value} value={f.value}>{f.name}</option>
                        ))}
                      </select>

                      {/* Font Size */}
                      <select
                        value={currentSize}
                        onChange={(e) => handleFontSizeChange(e.target.value)}
                        className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                        title="Font Size"
                      >
                        {FONT_SIZES.map(s => (
                          <option key={s.value} value={s.value}>{s.name}</option>
                        ))}
                      </select>

                      {/* Headings */}
                      <div className="flex items-center gap-1 border-l border-r border-gray-200 px-2">
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleBlockFormat('p')}
                          className="px-2.5 py-1 hover:bg-purple-100 rounded text-xs font-bold text-gray-700 active:scale-95 transition-transform"
                          title="Normal Paragraph"
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleBlockFormat('h1')}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-200 rounded text-xs font-black text-purple-700 active:scale-95 transition-transform"
                          title="Heading 1 (Main Title)"
                        >
                          H1
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleBlockFormat('h2')}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-200 rounded text-xs font-bold text-purple-700 active:scale-95 transition-transform"
                          title="Heading 2 (Section)"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleBlockFormat('h3')}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-200 rounded text-xs font-bold text-purple-700 active:scale-95 transition-transform"
                          title="Heading 3 (Sub-section)"
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleBlockFormat('blockquote')}
                          className="px-2 py-1 hover:bg-purple-100 rounded text-xs font-bold text-gray-600 active:scale-95 transition-transform"
                          title="Quote Block"
                        >
                          <Quote size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Row 2: Formatting Buttons & Colors */}
                    <div className="flex items-center gap-2 flex-wrap justify-between">
                      <div className="flex items-center gap-1 flex-wrap">
                        {/* Bold / Italic / Underline / Strike */}
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeCommand('bold')}
                          className="p-2 hover:bg-purple-100 rounded-lg text-gray-700 hover:text-purple-700 transition-colors"
                          title="Bold (Ctrl+B)"
                        >
                          <Bold size={16} />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeCommand('italic')}
                          className="p-2 hover:bg-purple-100 rounded-lg text-gray-700 hover:text-purple-700 transition-colors"
                          title="Italic (Ctrl+I)"
                        >
                          <Italic size={16} />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeCommand('underline')}
                          className="p-2 hover:bg-purple-100 rounded-lg text-gray-700 hover:text-purple-700 transition-colors"
                          title="Underline (Ctrl+U)"
                        >
                          <Underline size={16} />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeCommand('strikeThrough')}
                          className="p-2 hover:bg-purple-100 rounded-lg text-gray-700 hover:text-purple-700 transition-colors"
                          title="Strikethrough"
                        >
                          <Strikethrough size={16} />
                        </button>

                        <div className="h-5 w-[1px] bg-gray-300 mx-1" />

                        {/* Alignments */}
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeCommand('justifyLeft')}
                          className="p-2 hover:bg-purple-100 rounded-lg text-gray-700 hover:text-purple-700 transition-colors"
                          title="Align Left"
                        >
                          <AlignLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeCommand('justifyCenter')}
                          className="p-2 hover:bg-purple-100 rounded-lg text-gray-700 hover:text-purple-700 transition-colors"
                          title="Align Center"
                        >
                          <AlignCenter size={16} />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeCommand('justifyRight')}
                          className="p-2 hover:bg-purple-100 rounded-lg text-gray-700 hover:text-purple-700 transition-colors"
                          title="Align Right"
                        >
                          <AlignRight size={16} />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeCommand('justifyFull')}
                          className="p-2 hover:bg-purple-100 rounded-lg text-gray-700 hover:text-purple-700 transition-colors"
                          title="Justify"
                        >
                          <AlignJustify size={16} />
                        </button>

                        <div className="h-5 w-[1px] bg-gray-300 mx-1" />

                        {/* Lists */}
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeCommand('insertUnorderedList')}
                          className="p-2 hover:bg-purple-100 rounded-lg text-gray-700 hover:text-purple-700 transition-colors"
                          title="Bulleted List"
                        >
                          <List size={16} />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeCommand('insertOrderedList')}
                          className="p-2 hover:bg-purple-100 rounded-lg text-gray-700 hover:text-purple-700 transition-colors"
                          title="Numbered List"
                        >
                          <ListOrdered size={16} />
                        </button>

                        <div className="h-5 w-[1px] bg-gray-300 mx-1" />

                        {/* Link & HR */}
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleOpenLinkModal}
                          className="p-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors font-bold flex items-center gap-1"
                          title="Insert Link"
                        >
                          <LinkIcon size={16} />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => executeCommand('insertHorizontalRule')}
                          className="px-2 py-1 text-xs font-bold hover:bg-purple-100 rounded-lg text-gray-700"
                          title="Horizontal Line"
                        >
                          — Line
                        </button>
                      </div>

                      {/* Text & Highlight Color Pickers */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Palette size={14} className="text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-500">Text:</span>
                          <div className="flex items-center gap-1">
                            {TEXT_COLORS.map(c => (
                              <button
                                key={c}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleTextColorChange(c)}
                                className="w-4 h-4 rounded-full border border-gray-300 shadow-sm transition-transform hover:scale-125"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-gray-500">Highlight:</span>
                          <div className="flex items-center gap-1">
                            {HIGHLIGHT_COLORS.map(hc => (
                              <button
                                key={hc}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleHighlightChange(hc)}
                                className="w-4 h-4 rounded-sm border border-gray-300 transition-transform hover:scale-125"
                                style={{ backgroundColor: hc === 'transparent' ? '#fff' : hc }}
                                title={hc === 'transparent' ? 'No highlight' : 'Highlight'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WYSIWYG Editable Document Area */}
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={() => {
                      if (editorRef.current) setContentHtml(editorRef.current.innerHTML);
                    }}
                    style={{ fontFamily: currentFont }}
                    className="editor-canvas min-h-[450px] p-8 bg-white rounded-3xl border border-gray-200 shadow-2xl focus:outline-none prose prose-purple max-w-none text-gray-800 leading-relaxed overflow-y-auto"
                  />
                </div>
              </div>

              {/* Sidebar Metadata (1 column) */}
              <div className="space-y-6">
                {/* Cover Image Uploader */}
                <div className="clay-flat p-6 rounded-3xl bg-[#eef2f6] space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-2">
                    <ImageIcon size={16} /> Cover Feature Image
                  </label>

                  <div className="h-44 rounded-2xl bg-white border-2 border-dashed border-purple-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                    {coverImage ? (
                      <>
                        <img 
                          src={coverImage.startsWith('http') ? coverImage : `${API_BASE_URL}${coverImage}`} 
                          alt="Cover preview" 
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => setCoverImage('')}
                          className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto text-purple-400 mb-2" size={30} />
                        <p className="text-xs font-bold text-gray-600">Upload Header Image</p>
                        <p className="text-[10px] text-gray-400 mt-1">JPEG or PNG up to 5MB</p>
                        <button
                          type="button"
                          onClick={() => coverImageInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="mt-3 px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-md hover:bg-purple-700 transition-all inline-flex items-center gap-1.5"
                        >
                          {uploadingImage ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                          Choose File
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Article Metadata */}
                <div className="clay-flat p-6 rounded-3xl bg-[#eef2f6] space-y-4">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-2">
                    <Layers size={16} /> Publishing Settings
                  </span>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 bg-[#eef2f6] clay-inset rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 bg-[#eef2f6] clay-inset rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
                    >
                      <option value="Published">Published (Public)</option>
                      <option value="Draft">Draft (Internal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tags (Comma Separated)</label>
                    <input 
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g. SEO, Marketing, Growth"
                      className="w-full mt-1 px-4 py-2.5 bg-[#eef2f6] clay-inset rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* READER PREVIEW MODE */
            <div className="clay-flat p-10 rounded-3xl bg-white shadow-2xl max-w-4xl mx-auto space-y-6">
              {coverImage && (
                <div className="h-80 w-full rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={coverImage.startsWith('http') ? coverImage : `${API_BASE_URL}${coverImage}`} 
                    alt={title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              <div className="space-y-2 border-b border-gray-100 pb-6">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-black uppercase">
                  {category}
                </span>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight mt-3">
                  {title || 'Untitled Article'}
                </h1>
                {subheading && (
                  <p className="text-lg text-gray-600 font-medium">
                    {subheading}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mt-4">
                  <span>
                    Author: {
                      (() => {
                        let staff = {};
                        try {
                          staff = JSON.parse(localStorage.getItem('staffInfo') || '{}');
                        } catch(e) {}
                        const currentBlog = blogs.find(b => b._id === editingId);
                        const wName = (currentBlog?.authorId && typeof currentBlog.authorId === 'object' && currentBlog.authorId.name) 
                          ? currentBlog.authorId.name 
                          : (currentBlog?.authorName || staff.name || 'Marketing Team');
                        const wRole = (currentBlog?.authorId && typeof currentBlog.authorId === 'object' && currentBlog.authorId.role && currentBlog.authorId.role !== 'Other') 
                          ? currentBlog.authorId.role 
                          : (currentBlog?.authorRole && currentBlog.authorRole !== 'Other' ? currentBlog.authorRole : (staff.role && staff.role !== 'Other' ? staff.role : ''));
                        return wRole ? `${wName} (${wRole})` : wName;
                      })()
                    }
                  </span>
                  <span>•</span>
                  <span>Date: {editingId && blogs.find(b => b._id === editingId) ? new Date(blogs.find(b => b._id === editingId).createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Formatted Article Output */}
              <div 
                className="prose prose-purple max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: contentHtml || '<p>No content preview available.</p>' }}
              />
            </div>
          )}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModal.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#eef2f6] clay-flat p-8 rounded-3xl max-w-md w-full text-center space-y-4"
            >
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-800 uppercase">Delete Blog Post?</h3>
              <p className="text-sm text-gray-500 font-medium">
                Are you sure you want to delete this blog post? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteModal({ show: false, blogId: null })}
                  className="px-5 py-2.5 clay-inset rounded-xl font-bold text-gray-600 text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBlog}
                  className="px-5 py-2.5 bg-rose-500 text-white font-black rounded-xl shadow-lg hover:bg-rose-600 text-xs uppercase tracking-wider"
                >
                  Delete Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LINK INSERTION MODAL */}
      <AnimatePresence>
        {showLinkModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#eef2f6] clay-flat p-8 rounded-3xl max-w-md w-full text-left space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-lg font-black text-gray-800 uppercase flex items-center gap-2">
                  <LinkIcon className="text-purple-600" size={18} /> Insert Hyperlink
                </h3>
                <button 
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleApplyLink} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Destination URL</label>
                  <input 
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com or /contact"
                    autoFocus
                    required
                    className="w-full mt-1 px-4 py-2.5 bg-white clay-inset rounded-xl font-medium text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Link Display Text (Optional)</label>
                  <input 
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Clickable anchor text..."
                    className="w-full mt-1 px-4 py-2.5 bg-white clay-inset rounded-xl font-medium text-sm text-gray-800 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(false)}
                    className="px-5 py-2.5 clay-inset rounded-xl font-bold text-gray-600 text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 text-white font-black rounded-xl shadow-lg hover:bg-purple-700 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <LinkIcon size={14} /> Add Link
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManagement;
