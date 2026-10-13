import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  List, ListOrdered, Image as ImageIcon, Link as LinkIcon, 
  Type, Sparkles, Plus, Search, Eye, Edit3, Trash2, 
  ArrowLeft, CheckCircle2, FileText, Upload, Palette, 
  Quote, Redo, Undo, Save, Globe, Tag, Layers, X, Loader2,
  Table as TableIcon, Grid, Check, Move, GripVertical, ArrowUp, ArrowDown
} from 'lucide-react';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.') || h.startsWith('10.') || h.endsWith('.local')) {
      return `http://${h}:45000`;
    }
  }
  return 'https://rizeworldmain.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

const TABLE_PRESETS = [
  { id: 'modern', name: 'Modern Clean', desc: 'Soft slate header, clean dividers' },
  { id: 'striped', name: 'Zebra Striped', desc: 'Alternating rows for large data' },
  { id: 'brand', name: 'Brand Purple', desc: 'Vibrant purple gradient header' },
  { id: 'emerald', name: 'Emerald Growth', desc: 'Green accent, great for stats' },
  { id: 'minimal', name: 'Minimal Borderless', desc: 'Underlined rows only' }
];

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

  // Table Modal & Controls State
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tablePreset, setTablePreset] = useState('modern');
  const [tableHasHeader, setTableHasHeader] = useState(true);
  const [tableFirstColHeader, setTableFirstColHeader] = useState(false);
  const [tableCaption, setTableCaption] = useState('');
  const [hoverGrid, setHoverGrid] = useState({ r: 3, c: 3 });
  const [activeTableContext, setActiveTableContext] = useState(null); // { tableEl, cellEl, rowEl }

  // Inline Image Modal State
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageSourceType, setImageSourceType] = useState('upload'); // 'upload' | 'url'
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [inlineImageCaption, setInlineImageCaption] = useState('');
  const [inlineImageAlt, setInlineImageAlt] = useState('');
  const [inlineImageAlign, setInlineImageAlign] = useState('center'); // 'center' | 'full' | 'left' | 'right'
  const [inlineImageWidth, setInlineImageWidth] = useState('100%'); // '25%' | '50%' | '75%' | '100%'

  // In-Editor Image Adjustment State
  const [selectedImageContext, setSelectedImageContext] = useState(null); // { imgEl, figureEl, width, widthPercent }
  const [imageOverlayRect, setImageOverlayRect] = useState(null);
  const [isResizingImage, setIsResizingImage] = useState(false);
  const editorWrapperRef = useRef(null);
  const draggedElementRef = useRef(null);

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

  // Helper to save selection range
  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      const range = sel.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  };

  // Helper to restore saved selection range
  const restoreSavedSelection = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const sel = window.getSelection();
    if (savedRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
      return sel.getRangeAt(0);
    }
    return null;
  };

  // Check if cursor is inside a table
  const checkActiveTable = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current) {
      setActiveTableContext(null);
      return;
    }
    try {
      const range = sel.getRangeAt(0);
      let node = range.startContainer;
      if (node.nodeType === 3) node = node.parentNode;
      
      const tableEl = node ? node.closest('table') : null;
      const cellEl = node ? node.closest('td, th') : null;
      const rowEl = node ? node.closest('tr') : null;

      if (tableEl && editorRef.current.contains(tableEl)) {
        setActiveTableContext({ tableEl, cellEl, rowEl });
      } else {
        setActiveTableContext(null);
      }
    } catch (e) {
      setActiveTableContext(null);
    }
  };

  // Insert Table into Editor
  const handleInsertTable = (e) => {
    if (e) e.preventDefault();
    restoreSavedSelection();

    let tableHtml = `<div class="table-responsive my-6"><table class="blog-table blog-table-${tablePreset}">`;
    if (tableCaption && tableCaption.trim()) {
      tableHtml += `<caption class="blog-table-caption">${tableCaption.trim()}</caption>`;
    }

    if (tableHasHeader) {
      tableHtml += `<thead><tr>`;
      for (let c = 1; c <= tableCols; c++) {
        tableHtml += `<th>Header ${c}</th>`;
      }
      tableHtml += `</tr></thead>`;
    }

    tableHtml += `<tbody>`;
    for (let r = 1; r <= tableRows; r++) {
      tableHtml += `<tr>`;
      for (let c = 1; c <= tableCols; c++) {
        const isHeader = tableFirstColHeader && c === 1;
        const tag = isHeader ? 'th' : 'td';
        tableHtml += `<${tag}>Data ${r},${c}</${tag}>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table></div><p><br></p>`;

    const sel = window.getSelection();
    if (savedRangeRef.current && sel && editorRef.current && editorRef.current.contains(savedRangeRef.current.commonAncestorContainer)) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
      const range = sel.getRangeAt(0);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = tableHtml;
      const frag = document.createDocumentFragment();
      let node, lastNode;
      while ((node = tempDiv.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.deleteContents();
      range.insertNode(frag);
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
      }
    } else if (editorRef.current) {
      editorRef.current.insertAdjacentHTML('beforeend', tableHtml);
    }

    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
    setShowTableModal(false);
    setTableCaption('');
    showToast('Table inserted successfully!');
  };

  // Table Row Addition
  const handleAddRow = (direction = 'below') => {
    if (!activeTableContext?.tableEl) return;
    const { tableEl, cellEl } = activeTableContext;
    const targetRow = cellEl ? cellEl.closest('tr') : tableEl.querySelector('tr:last-child');
    if (!targetRow) return;

    const colCount = targetRow.children.length;
    const newTr = document.createElement('tr');
    for (let i = 0; i < colCount; i++) {
      const newTd = document.createElement('td');
      newTd.innerHTML = 'Data';
      newTr.appendChild(newTd);
    }

    if (direction === 'above') {
      targetRow.parentNode.insertBefore(newTr, targetRow);
    } else {
      targetRow.parentNode.insertBefore(newTr, targetRow.nextSibling);
    }

    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
    showToast(`Row added ${direction}!`);
  };

  // Table Column Addition
  const handleAddCol = (direction = 'right') => {
    if (!activeTableContext?.tableEl) return;
    const { tableEl, cellEl } = activeTableContext;
    const targetRow = cellEl ? cellEl.closest('tr') : tableEl.querySelector('tr');
    if (!targetRow) return;

    const colIndex = cellEl ? Array.from(targetRow.children).indexOf(cellEl) : targetRow.children.length - 1;
    const allRows = tableEl.querySelectorAll('tr');

    allRows.forEach(row => {
      const isHeaderRow = row.parentNode.tagName === 'THEAD' || row.querySelector('th');
      const newCell = document.createElement(isHeaderRow ? 'th' : 'td');
      newCell.innerHTML = isHeaderRow ? 'Header' : 'Data';

      const currentCell = row.children[colIndex];
      if (currentCell) {
        if (direction === 'left') {
          row.insertBefore(newCell, currentCell);
        } else {
          row.insertBefore(newCell, currentCell.nextSibling);
        }
      } else {
        row.appendChild(newCell);
      }
    });

    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
    showToast(`Column added ${direction}!`);
  };

  // Table Delete Row
  const handleDeleteRow = () => {
    if (!activeTableContext?.cellEl || !activeTableContext?.tableEl) return;
    const row = activeTableContext.cellEl.closest('tr');
    if (!row) return;

    const tableEl = activeTableContext.tableEl;
    row.parentNode.removeChild(row);

    if (tableEl.querySelectorAll('tr').length === 0) {
      handleDeleteTable();
      return;
    }

    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
    setActiveTableContext(null);
    showToast('Row deleted');
  };

  // Table Delete Column
  const handleDeleteCol = () => {
    if (!activeTableContext?.cellEl || !activeTableContext?.tableEl) return;
    const row = activeTableContext.cellEl.closest('tr');
    if (!row) return;

    const colIndex = Array.from(row.children).indexOf(activeTableContext.cellEl);
    const tableEl = activeTableContext.tableEl;
    const allRows = tableEl.querySelectorAll('tr');

    allRows.forEach(r => {
      if (r.children[colIndex]) {
        r.removeChild(r.children[colIndex]);
      }
    });

    const firstRow = tableEl.querySelector('tr');
    if (!firstRow || firstRow.children.length === 0) {
      handleDeleteTable();
      return;
    }

    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
    setActiveTableContext(null);
    showToast('Column deleted');
  };

  // Table Delete Table
  const handleDeleteTable = () => {
    if (!activeTableContext?.tableEl) return;
    const tableEl = activeTableContext.tableEl;
    const wrapper = tableEl.closest('.table-responsive') || tableEl;
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
    setActiveTableContext(null);
    showToast('Table deleted');
  };

  // Insert Inline Image into Blog Content
  const handleInsertInlineImage = (e) => {
    if (e) e.preventDefault();
    if (!inlineImageUrl.trim()) {
      showToast('Please upload an image or provide an image URL', 'error');
      return;
    }

    restoreSavedSelection();

    const cleanUrl = inlineImageUrl.trim();
    const captionHtml = inlineImageCaption.trim() 
      ? `<figcaption class="blog-caption">${inlineImageCaption.trim()}</figcaption>` 
      : '';
    const altAttr = inlineImageAlt.trim() || 'Blog Illustration';

    const figureWidth = inlineImageWidth || '100%';
    const figureStyle = `style="width: ${figureWidth}; max-width: 100%;"`;
    const figureHtml = `<figure class="blog-figure blog-figure-${inlineImageAlign} my-6" ${figureStyle} draggable="true"><img src="${cleanUrl}" alt="${altAttr}" class="blog-inline-img" draggable="true" style="width: 100%; max-width: 100%; height: auto;" />${captionHtml}</figure><p><br></p>`;

    const sel = window.getSelection();
    if (savedRangeRef.current && sel && editorRef.current && editorRef.current.contains(savedRangeRef.current.commonAncestorContainer)) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
      const range = sel.getRangeAt(0);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = figureHtml;
      const frag = document.createDocumentFragment();
      let node, lastNode;
      while ((node = tempDiv.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.deleteContents();
      range.insertNode(frag);
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
      }
    } else if (editorRef.current) {
      editorRef.current.insertAdjacentHTML('beforeend', figureHtml);
    }

    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }

    setShowImageModal(false);
    setInlineImageUrl('');
    setInlineImageCaption('');
    setInlineImageAlt('');
    setInlineImageAlign('center');
    setInlineImageWidth('100%');
    showToast('Image inserted into blog content!');
  };

  // Re-calculate image overlay box position & dimensions relative to editor
  const updateOverlayPosition = () => {
    if (!selectedImageContext?.imgEl || !editorWrapperRef.current) {
      setImageOverlayRect(null);
      return;
    }
    if (!editorWrapperRef.current.contains(selectedImageContext.imgEl)) {
      setSelectedImageContext(null);
      setImageOverlayRect(null);
      return;
    }
    const imgRect = selectedImageContext.imgEl.getBoundingClientRect();
    const wrapperRect = editorWrapperRef.current.getBoundingClientRect();
    setImageOverlayRect({
      top: imgRect.top - wrapperRect.top,
      left: imgRect.left - wrapperRect.left,
      width: imgRect.width,
      height: imgRect.height,
      widthPercent: selectedImageContext.widthPercent
    });
  };

  // Keep overlay tracked during scroll or window resize
  useEffect(() => {
    updateOverlayPosition();
    const handleScrollOrResize = () => {
      updateOverlayPosition();
    };
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [selectedImageContext, selectedImageContext?.widthPercent]);

  // Editor Click Handler: detects clicking on an image or inside a table
  const handleEditorClick = (e) => {
    saveCurrentSelection();
    checkActiveTable();

    // Check if clicked element is an image or inside a figure
    const clickedImg = e.target && e.target.tagName === 'IMG' 
      ? e.target 
      : (e.target && e.target.closest('figure')?.querySelector('img'));

    if (clickedImg) {
      if (editorRef.current) {
        editorRef.current.querySelectorAll('img.selected-blog-img').forEach(el => {
          el.classList.remove('selected-blog-img');
        });
      }

      clickedImg.classList.add('selected-blog-img');
      const figure = clickedImg.closest('figure');
      const targetEl = figure || clickedImg;
      const currentWidthStr = targetEl.style.width || clickedImg.style.width || '100%';
      let numericWidth = parseInt(currentWidthStr) || 100;
      setSelectedImageContext({
        imgEl: clickedImg,
        figureEl: figure,
        width: currentWidthStr,
        widthPercent: numericWidth
      });
      setTimeout(() => {
        updateOverlayPosition();
      }, 20);
    } else if (!e.target.closest('.image-control-bar') && !e.target.closest('.image-resize-overlay')) {
      if (editorRef.current) {
        editorRef.current.querySelectorAll('img.selected-blog-img').forEach(el => {
          el.classList.remove('selected-blog-img');
        });
      }
      setSelectedImageContext(null);
      setImageOverlayRect(null);
    }
  };

  // Interactive Mouse Drag-to-Resize on handles
  const startResize = (e, handleType) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImageContext?.imgEl || !editorRef.current) return;

    const isTouch = e.type.startsWith('touch');
    const startClientX = isTouch ? e.touches[0].clientX : e.clientX;
    const startClientY = isTouch ? e.touches[0].clientY : e.clientY;

    const targetEl = selectedImageContext.figureEl || selectedImageContext.imgEl;
    const startWidth = targetEl.offsetWidth;
    const startHeight = targetEl.offsetHeight;
    const aspectRatio = startWidth / (startHeight || 1);
    const editorWidth = editorRef.current.clientWidth - 64; // accounting for padding

    // Set cursor on body while resizing so it stays smooth even if mouse wanders
    const cursors = {
      nw: 'nwse-resize',
      se: 'nwse-resize',
      ne: 'nesw-resize',
      sw: 'nesw-resize',
      e: 'ew-resize',
      w: 'ew-resize',
      s: 'ns-resize',
      n: 'ns-resize'
    };
    if (cursors[handleType]) {
      document.body.style.cursor = cursors[handleType];
      document.body.style.userSelect = 'none';
    }

    setIsResizingImage(true);

    const onMove = (moveEvent) => {
      const clientX = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const dx = clientX - startClientX;
      const dy = clientY - startClientY;

      let newWidth = startWidth;

      if (handleType === 'se') {
        const delta = Math.abs(dx) > Math.abs(dy * aspectRatio) ? dx : (dy * aspectRatio);
        newWidth = startWidth + delta;
      } else if (handleType === 'sw') {
        const delta = Math.abs(dx) > Math.abs(dy * aspectRatio) ? -dx : (dy * aspectRatio);
        newWidth = startWidth + delta;
      } else if (handleType === 'ne') {
        const delta = Math.abs(dx) > Math.abs(dy * aspectRatio) ? dx : (-dy * aspectRatio);
        newWidth = startWidth + delta;
      } else if (handleType === 'nw') {
        const delta = Math.abs(dx) > Math.abs(dy * aspectRatio) ? -dx : (-dy * aspectRatio);
        newWidth = startWidth + delta;
      } else if (handleType === 'e') {
        newWidth = startWidth + dx;
      } else if (handleType === 'w') {
        newWidth = startWidth - dx;
      } else if (handleType === 's') {
        newWidth = startWidth + (dy * aspectRatio);
      } else if (handleType === 'n') {
        newWidth = startWidth - (dy * aspectRatio);
      }

      newWidth = Math.max(100, Math.min(newWidth, editorWidth));
      const percent = Math.min(100, Math.max(15, Math.round((newWidth / editorWidth) * 100)));

      if (selectedImageContext.figureEl) {
        selectedImageContext.figureEl.style.width = `${percent}%`;
        selectedImageContext.figureEl.style.maxWidth = '100%';
      }
      selectedImageContext.imgEl.style.width = selectedImageContext.figureEl ? '100%' : `${percent}%`;
      selectedImageContext.imgEl.style.maxWidth = '100%';
      selectedImageContext.imgEl.style.height = 'auto';

      setSelectedImageContext(prev => ({
        ...prev,
        width: `${percent}%`,
        widthPercent: percent
      }));

      // Immediate overlay tracking
      if (editorWrapperRef.current && selectedImageContext.imgEl) {
        const imgRect = selectedImageContext.imgEl.getBoundingClientRect();
        const wrapperRect = editorWrapperRef.current.getBoundingClientRect();
        setImageOverlayRect({
          top: imgRect.top - wrapperRect.top,
          left: imgRect.left - wrapperRect.left,
          width: imgRect.width,
          height: imgRect.height,
          widthPercent: percent
        });
      }
    };

    const onEnd = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setIsResizingImage(false);
      updateOverlayPosition();
      if (editorRef.current) {
        setContentHtml(editorRef.current.innerHTML);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  };

  // Drag and Drop Placement System with Mouse
  const handleImageDragStart = (e, elToDrag) => {
    const target = elToDrag || selectedImageContext?.figureEl || selectedImageContext?.imgEl;
    if (!target) return;
    draggedElementRef.current = target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'image-placement');
    target.classList.add('opacity-40');
    setImageOverlayRect(null);
  };

  const handleEditorDragStart = (e) => {
    if (e.target && e.target.tagName === 'IMG') {
      const targetElement = e.target.closest('figure') || e.target;
      handleImageDragStart(e, targetElement);
    }
  };

  const handleEditorDragOver = (e) => {
    if (!draggedElementRef.current || !editorRef.current) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const pointEl = document.elementFromPoint(e.clientX, e.clientY);
    if (!pointEl || !editorRef.current.contains(pointEl)) return;

    let block = pointEl;
    while (block && block.parentNode !== editorRef.current && block !== editorRef.current) {
      block = block.parentNode;
    }

    let indicator = document.getElementById('blog-drop-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'blog-drop-indicator';
      indicator.className = 'blog-drop-indicator';
    }

    if (!block || block === editorRef.current) {
      if (editorRef.current.lastChild !== indicator) {
        editorRef.current.appendChild(indicator);
      }
      return;
    }

    if (block === draggedElementRef.current) return;

    const rect = block.getBoundingClientRect();
    const isAfter = (e.clientY - rect.top) > (rect.height / 2);

    if (isAfter) {
      if (block.nextSibling !== indicator) {
        block.parentNode.insertBefore(indicator, block.nextSibling);
      }
    } else {
      if (block !== indicator.nextSibling) {
        block.parentNode.insertBefore(indicator, block);
      }
    }
  };

  const handleEditorDrop = (e) => {
    if (!draggedElementRef.current || !editorRef.current) return;
    e.preventDefault();

    const indicator = document.getElementById('blog-drop-indicator');
    const targetToMove = draggedElementRef.current;

    if (indicator && indicator.parentNode) {
      indicator.parentNode.insertBefore(targetToMove, indicator);
      indicator.parentNode.removeChild(indicator);
    } else {
      const pointEl = document.elementFromPoint(e.clientX, e.clientY);
      let block = pointEl;
      while (block && block.parentNode !== editorRef.current && block !== editorRef.current) {
        block = block.parentNode;
      }
      if (block && block !== editorRef.current && block !== targetToMove) {
        const rect = block.getBoundingClientRect();
        const isAfter = (e.clientY - rect.top) > (rect.height / 2);
        if (isAfter) {
          block.parentNode.insertBefore(targetToMove, block.nextSibling);
        } else {
          block.parentNode.insertBefore(targetToMove, block);
        }
      } else {
        editorRef.current.appendChild(targetToMove);
      }
    }

    targetToMove.classList.remove('opacity-40');
    draggedElementRef.current = null;

    const movedImg = targetToMove.tagName === 'IMG' ? targetToMove : targetToMove.querySelector('img');
    if (movedImg) {
      movedImg.classList.add('selected-blog-img');
      const fig = movedImg.closest('figure');
      const targetEl = fig || movedImg;
      const curWidth = targetEl.style.width || movedImg.style.width || '100%';
      setSelectedImageContext({
        imgEl: movedImg,
        figureEl: fig,
        width: curWidth,
        widthPercent: parseInt(curWidth) || 100
      });
      setTimeout(() => {
        updateOverlayPosition();
      }, 50);
    }

    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
    showToast('Image placed at new position!');
  };

  const handleEditorDragLeave = (e) => {
    if (e.target === editorRef.current) {
      const indicator = document.getElementById('blog-drop-indicator');
      if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }
  };

  const handleEditorDragEnd = () => {
    const indicator = document.getElementById('blog-drop-indicator');
    if (indicator && indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
    if (draggedElementRef.current) {
      draggedElementRef.current.classList.remove('opacity-40');
      draggedElementRef.current = null;
    }
    updateOverlayPosition();
  };

  // Move Selected Image Block Up or Down
  const handleMoveImageBlock = (direction) => {
    if (!selectedImageContext) return;
    const target = selectedImageContext.figureEl || selectedImageContext.imgEl;
    if (!target || !editorRef.current) return;

    if (direction === 'up') {
      const prev = target.previousElementSibling;
      if (prev && prev !== editorRef.current) {
        target.parentNode.insertBefore(target, prev);
        updateOverlayPosition();
        if (editorRef.current) setContentHtml(editorRef.current.innerHTML);
        showToast('Moved image up');
      }
    } else if (direction === 'down') {
      const next = target.nextElementSibling;
      if (next && next !== editorRef.current) {
        target.parentNode.insertBefore(next, target);
        updateOverlayPosition();
        if (editorRef.current) setContentHtml(editorRef.current.innerHTML);
        showToast('Moved image down');
      }
    }
  };

  // Update Selected Image Width / Size
  const handleUpdateImageSize = (percent) => {
    if (!selectedImageContext?.imgEl) return;
    const { figureEl, imgEl } = selectedImageContext;

    if (figureEl) {
      figureEl.style.width = `${percent}%`;
      figureEl.style.maxWidth = '100%';
    }
    imgEl.style.width = figureEl ? '100%' : `${percent}%`;
    imgEl.style.maxWidth = '100%';
    imgEl.style.height = 'auto';

    setSelectedImageContext(prev => ({
      ...prev,
      width: `${percent}%`,
      widthPercent: percent
    }));

    setTimeout(() => {
      updateOverlayPosition();
    }, 20);

    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
  };

  // Update Selected Image Alignment
  const handleUpdateImageAlign = (alignId) => {
    if (!selectedImageContext) return;
    const { figureEl, imgEl } = selectedImageContext;
    if (figureEl) {
      ['blog-figure-center', 'blog-figure-full', 'blog-figure-left', 'blog-figure-right'].forEach(c => {
        figureEl.classList.remove(c);
      });
      figureEl.classList.add(`blog-figure-${alignId}`);
      if (alignId === 'full') {
        figureEl.style.width = '100%';
        setSelectedImageContext(prev => ({ ...prev, width: '100%', widthPercent: 100 }));
      }
    } else if (imgEl) {
      if (alignId === 'left') {
        imgEl.style.float = 'left';
        imgEl.style.margin = '0 1.5rem 1rem 0';
      } else if (alignId === 'right') {
        imgEl.style.float = 'right';
        imgEl.style.margin = '0 0 1rem 1.5rem';
      } else if (alignId === 'full') {
        imgEl.style.float = 'none';
        imgEl.style.width = '100%';
        imgEl.style.margin = '1.5rem 0';
        imgEl.style.display = 'block';
        setSelectedImageContext(prev => ({ ...prev, width: '100%', widthPercent: 100 }));
      } else {
        imgEl.style.float = 'none';
        imgEl.style.margin = '1.5rem auto';
        imgEl.style.display = 'block';
      }
    }

    setTimeout(() => {
      updateOverlayPosition();
    }, 30);

    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
    showToast(`Alignment set to ${alignId}`);
  };

  // Delete Selected Image
  const handleDeleteSelectedImage = () => {
    if (!selectedImageContext) return;
    const { figureEl, imgEl } = selectedImageContext;
    const target = figureEl || imgEl;
    if (target && target.parentNode) {
      target.parentNode.removeChild(target);
    }
    setSelectedImageContext(null);
    setImageOverlayRect(null);
    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
    showToast('Image deleted');
  };

  // Inline Image Upload File Handler
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
        
        setInlineImageUrl(fullUrl);
        setShowImageModal(true);
        showToast('Image uploaded! Choose alignment and insert.');
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

    if (editorRef.current) {
      editorRef.current.querySelectorAll('img.selected-blog-img').forEach(el => {
        el.classList.remove('selected-blog-img');
      });
      editorRef.current.querySelectorAll('.opacity-40').forEach(el => {
        el.classList.remove('opacity-40');
      });
      editorRef.current.querySelectorAll('.blog-drop-indicator, #blog-drop-indicator').forEach(el => {
        el.remove();
      });
    }

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
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-purple-700 flex items-center gap-2">
                      <Sparkles size={14} /> MS Word Style Content Editor
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          saveCurrentSelection();
                          setShowImageModal(true);
                        }}
                        className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <ImageIcon size={14} />
                        Insert Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          saveCurrentSelection();
                          setShowTableModal(true);
                        }}
                        className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <TableIcon size={14} />
                        Insert Table
                      </button>
                    </div>
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

                        {/* Table, Image, Link & HR */}
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            saveCurrentSelection();
                            setShowTableModal(true);
                          }}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 transition-colors font-bold flex items-center gap-1"
                          title="Insert Table"
                        >
                          <TableIcon size={16} />
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            saveCurrentSelection();
                            setShowImageModal(true);
                          }}
                          className="p-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors font-bold flex items-center gap-1"
                          title="Insert Image into Article"
                        >
                          <ImageIcon size={16} />
                        </button>
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

                  {/* Contextual Table Controls Floating Bar */}
                  {activeTableContext && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 bg-gradient-to-r from-purple-100/90 via-indigo-50/90 to-purple-100/90 border border-purple-200/80 rounded-2xl flex items-center justify-between gap-2 flex-wrap shadow-sm backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-black text-purple-900">
                        <TableIcon size={14} className="text-purple-600" />
                        <span>Table Controls:</span>
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleAddRow('below')}
                          className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-700 font-bold rounded-lg text-[11px] shadow-sm border border-purple-200 flex items-center gap-1"
                          title="Add Row Below"
                        >
                          <Plus size={12} /> Row Below
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleAddRow('above')}
                          className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-700 font-bold rounded-lg text-[11px] shadow-sm border border-purple-200 flex items-center gap-1"
                          title="Add Row Above"
                        >
                          <Plus size={12} /> Row Above
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleAddCol('right')}
                          className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-700 font-bold rounded-lg text-[11px] shadow-sm border border-purple-200 flex items-center gap-1"
                          title="Add Column Right"
                        >
                          <Plus size={12} /> Col Right
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleAddCol('left')}
                          className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-700 font-bold rounded-lg text-[11px] shadow-sm border border-purple-200 flex items-center gap-1"
                          title="Add Column Left"
                        >
                          <Plus size={12} /> Col Left
                        </button>
                        <div className="h-4 w-[1px] bg-purple-300 mx-1" />
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleDeleteRow}
                          className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-600 font-bold rounded-lg text-[11px] shadow-sm border border-rose-200"
                          title="Delete Current Row"
                        >
                          Del Row
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleDeleteCol}
                          className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-600 font-bold rounded-lg text-[11px] shadow-sm border border-rose-200"
                          title="Delete Current Column"
                        >
                          Del Col
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleDeleteTable}
                          className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-[11px] shadow-sm flex items-center gap-1"
                          title="Delete Entire Table"
                        >
                          <Trash2 size={12} /> Delete Table
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Contextual Image Adjustment Controls Bar */}
                  {selectedImageContext && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="image-control-bar p-3 bg-gradient-to-r from-purple-100/95 via-indigo-50/95 to-purple-100/95 border-2 border-purple-300 rounded-2xl flex items-center justify-between gap-3 flex-wrap shadow-lg backdrop-blur-md sticky top-2 z-20"
                    >
                      <div className="flex items-center gap-2 text-xs font-black text-purple-900">
                        <ImageIcon size={16} className="text-purple-600" />
                        <span>Adjust Image:</span>
                        <span className="px-2 py-0.5 bg-purple-200/80 rounded-md text-[11px] font-bold text-purple-800">
                          {selectedImageContext.widthPercent}%
                        </span>
                      </div>

                      {/* Quick Width Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1">Size:</span>
                        {[
                          { label: '25%', value: 25 },
                          { label: '50%', value: 50 },
                          { label: '75%', value: 75 },
                          { label: '100%', value: 100 }
                        ].map((size) => (
                          <button
                            key={size.value}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleUpdateImageSize(size.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              selectedImageContext.widthPercent === size.value
                                ? 'bg-purple-600 text-white shadow-sm font-black'
                                : 'bg-white hover:bg-purple-50 text-gray-700 border border-purple-200'
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}

                        {/* Slider for precision adjustment */}
                        <div className="flex items-center gap-2 px-2 py-0.5 bg-white rounded-lg border border-purple-200 ml-1">
                          <input
                            type="range"
                            min="15"
                            max="100"
                            step="5"
                            value={selectedImageContext.widthPercent}
                            onChange={(e) => handleUpdateImageSize(parseInt(e.target.value))}
                            className="w-24 accent-purple-600 cursor-pointer"
                          />
                          <span className="text-[10px] font-mono font-bold text-purple-800 w-8">
                            {selectedImageContext.widthPercent}%
                          </span>
                        </div>

                        <div className="h-5 w-[1px] bg-purple-300 mx-1" />

                        {/* Alignment Buttons */}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1">Align:</span>
                        {[
                          { id: 'left', icon: AlignLeft, title: 'Float Left (Text Wrap)' },
                          { id: 'center', icon: AlignCenter, title: 'Center' },
                          { id: 'right', icon: AlignRight, title: 'Float Right (Text Wrap)' },
                          { id: 'full', icon: AlignJustify, title: 'Full Width' }
                        ].map((align) => (
                          <button
                            key={align.id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleUpdateImageAlign(align.id)}
                            className="p-1.5 bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-700 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                            title={align.title}
                          >
                            <align.icon size={14} />
                          </button>
                        ))}

                        <div className="h-5 w-[1px] bg-purple-300 mx-1" />

                        {/* Delete Image */}
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleDeleteSelectedImage}
                          className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                          title="Delete Image"
                        >
                          <Trash2 size={12} /> Delete
                        </button>

                        {/* Close button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (editorRef.current) {
                              editorRef.current.querySelectorAll('img.selected-blog-img').forEach(el => el.classList.remove('selected-blog-img'));
                            }
                            setSelectedImageContext(null);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-700 rounded-lg ml-1 cursor-pointer"
                          title="Deselect"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* WYSIWYG Editable Document Area */}
                  <div ref={editorWrapperRef} className="relative">
                    <div
                      ref={editorRef}
                      contentEditable
                      onInput={(e) => {
                        if (editorRef.current) setContentHtml(editorRef.current.innerHTML);
                        handleEditorClick(e);
                      }}
                      onKeyUp={(e) => {
                        handleEditorClick(e);
                      }}
                      onMouseUp={(e) => {
                        handleEditorClick(e);
                      }}
                      onClick={(e) => {
                        handleEditorClick(e);
                      }}
                      onDragStart={handleEditorDragStart}
                      onDragOver={handleEditorDragOver}
                      onDragLeave={handleEditorDragLeave}
                      onDrop={handleEditorDrop}
                      onDragEnd={handleEditorDragEnd}
                      style={{ fontFamily: currentFont }}
                      className="editor-canvas min-h-[450px] p-8 bg-white rounded-3xl border border-gray-200 shadow-2xl focus:outline-none prose prose-purple max-w-none text-gray-800 leading-relaxed overflow-y-auto"
                    />

                    {/* Interactive Image Mouse Resize & Placement Overlay */}
                    {selectedImageContext && imageOverlayRect && (
                      <div
                        style={{
                          position: 'absolute',
                          top: `${imageOverlayRect.top}px`,
                          left: `${imageOverlayRect.left}px`,
                          width: `${imageOverlayRect.width}px`,
                          height: `${imageOverlayRect.height}px`,
                          pointerEvents: isResizingImage ? 'none' : 'auto'
                        }}
                        draggable={!isResizingImage}
                        onDragStart={(e) => {
                          if (e.target.closest('.resize-handle') || e.target.closest('.image-control-bar') || e.target.closest('button')) {
                            e.preventDefault();
                            return;
                          }
                          handleImageDragStart(e, selectedImageContext.figureEl || selectedImageContext.imgEl);
                        }}
                        onDragEnd={handleEditorDragEnd}
                        className="image-resize-overlay border-2 border-purple-600 rounded-xl select-none cursor-grab active:cursor-grabbing group transition-shadow"
                        title="Drag with mouse to reposition anywhere in the article • Pull handles to resize"
                      >
                        {/* Center Drag Hint visible on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                          <div className="bg-gray-900/85 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-xl border border-purple-400/40">
                            <Move size={12} className="text-purple-300" />
                            <span>Drag anywhere with mouse to place</span>
                          </div>
                        </div>

                        {/* Floating On-Image Placement & Sizing Bar */}
                        <div
                          style={{ pointerEvents: 'auto' }}
                          className="image-control-bar absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white px-2.5 py-1.5 rounded-2xl shadow-2xl flex items-center gap-1.5 whitespace-nowrap z-40 border border-purple-500/40"
                        >
                          {/* Drag to Place handle */}
                          <div
                            draggable="true"
                            onDragStart={(e) => handleImageDragStart(e, selectedImageContext.figureEl || selectedImageContext.imgEl)}
                            onDragEnd={handleEditorDragEnd}
                            className="flex items-center gap-1 px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-black cursor-grab active:cursor-grabbing shadow-sm"
                            title="Click and drag with mouse to place anywhere in the article"
                          >
                            <Move size={12} />
                            <span>Drag to Place</span>
                          </div>

                          {/* Quick Step Move Up / Down Buttons */}
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleMoveImageBlock('up')}
                            className="p-1 hover:bg-gray-800 text-gray-300 hover:text-white rounded-md text-[10px] transition-colors cursor-pointer"
                            title="Move Up (Before previous paragraph)"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleMoveImageBlock('down')}
                            className="p-1 hover:bg-gray-800 text-gray-300 hover:text-white rounded-md text-[10px] transition-colors cursor-pointer"
                            title="Move Down (After next paragraph)"
                          >
                            <ArrowDown size={13} />
                          </button>

                          <div className="h-3 w-[1px] bg-gray-700 mx-0.5" />

                          {/* Alignment / Placement shortcuts */}
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleUpdateImageAlign('left')}
                            className="p-1 hover:bg-gray-800 text-gray-300 hover:text-white rounded-md text-[10px] transition-colors cursor-pointer"
                            title="Float Left (Wrap text on right)"
                          >
                            <AlignLeft size={13} />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleUpdateImageAlign('center')}
                            className="p-1 hover:bg-gray-800 text-gray-300 hover:text-white rounded-md text-[10px] transition-colors cursor-pointer"
                            title="Center on page"
                          >
                            <AlignCenter size={13} />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleUpdateImageAlign('right')}
                            className="p-1 hover:bg-gray-800 text-gray-300 hover:text-white rounded-md text-[10px] transition-colors cursor-pointer"
                            title="Float Right (Wrap text on left)"
                          >
                            <AlignRight size={13} />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleUpdateImageAlign('full')}
                            className="p-1 hover:bg-gray-800 text-gray-300 hover:text-white rounded-md text-[10px] transition-colors cursor-pointer"
                            title="Full Width (100%)"
                          >
                            <AlignJustify size={13} />
                          </button>

                          <div className="h-3 w-[1px] bg-gray-700 mx-0.5" />

                          {/* Quick Size Chips */}
                          {[25, 33, 50, 75, 100].map(pct => (
                            <button
                              key={pct}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleUpdateImageSize(pct)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                selectedImageContext.widthPercent === pct
                                  ? 'bg-purple-600 text-white font-black'
                                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                              }`}
                              title={`Set size to ${pct}%`}
                            >
                              {pct}%
                            </button>
                          ))}

                          <div className="h-3 w-[1px] bg-gray-700 mx-0.5" />

                          {/* Delete button */}
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleDeleteSelectedImage}
                            className="p-1 text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 rounded-md cursor-pointer transition-colors"
                            title="Delete Image"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Corner and Edge Resize Handles */}
                        {/* Top-Left (NW) */}
                        <div
                          style={{ top: -6, left: -6, cursor: 'nwse-resize', pointerEvents: 'auto' }}
                          onMouseDown={(e) => startResize(e, 'nw')}
                          onTouchStart={(e) => startResize(e, 'nw')}
                          className="resize-handle"
                          title="Drag with mouse to resize image"
                        />
                        {/* Top-Center (N) */}
                        <div
                          style={{ top: -6, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize', pointerEvents: 'auto' }}
                          onMouseDown={(e) => startResize(e, 'n')}
                          onTouchStart={(e) => startResize(e, 'n')}
                          className="resize-handle"
                          title="Drag with mouse to resize height"
                        />
                        {/* Top-Right (NE) */}
                        <div
                          style={{ top: -6, right: -6, cursor: 'nesw-resize', pointerEvents: 'auto' }}
                          onMouseDown={(e) => startResize(e, 'ne')}
                          onTouchStart={(e) => startResize(e, 'ne')}
                          className="resize-handle"
                          title="Drag with mouse to resize image"
                        />
                        {/* Bottom-Left (SW) */}
                        <div
                          style={{ bottom: -6, left: -6, cursor: 'nesw-resize', pointerEvents: 'auto' }}
                          onMouseDown={(e) => startResize(e, 'sw')}
                          onTouchStart={(e) => startResize(e, 'sw')}
                          className="resize-handle"
                          title="Drag with mouse to resize image"
                        />
                        {/* Bottom-Right (SE) - Primary handle */}
                        <div
                          style={{ bottom: -7, right: -7, cursor: 'nwse-resize', pointerEvents: 'auto' }}
                          onMouseDown={(e) => startResize(e, 'se')}
                          onTouchStart={(e) => startResize(e, 'se')}
                          className="resize-handle w-4 h-4 bg-purple-600 border-2 border-white ring-2 ring-purple-500/50"
                          title="Drag with mouse to resize image"
                        />
                        {/* Middle-Right (E) */}
                        <div
                          style={{ top: '50%', right: -6, transform: 'translateY(-50%)', cursor: 'ew-resize', pointerEvents: 'auto' }}
                          onMouseDown={(e) => startResize(e, 'e')}
                          onTouchStart={(e) => startResize(e, 'e')}
                          className="resize-handle"
                          title="Drag with mouse to resize width"
                        />
                        {/* Middle-Left (W) */}
                        <div
                          style={{ top: '50%', left: -6, transform: 'translateY(-50%)', cursor: 'ew-resize', pointerEvents: 'auto' }}
                          onMouseDown={(e) => startResize(e, 'w')}
                          onTouchStart={(e) => startResize(e, 'w')}
                          className="resize-handle"
                          title="Drag with mouse to resize width"
                        />
                        {/* Bottom-Center (S) */}
                        <div
                          style={{ bottom: -6, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize', pointerEvents: 'auto' }}
                          onMouseDown={(e) => startResize(e, 's')}
                          onTouchStart={(e) => startResize(e, 's')}
                          className="resize-handle"
                          title="Drag with mouse to resize height"
                        />

                        {/* Live Dimensions Tooltip Badge */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 border border-purple-500/30 text-white text-[10px] font-mono font-bold px-3 py-0.5 rounded-full shadow-md whitespace-nowrap pointer-events-none flex items-center gap-1.5">
                          <span>{Math.round(imageOverlayRect.width)}px</span>
                          <span className="text-purple-400">•</span>
                          <span>{selectedImageContext.widthPercent}% width</span>
                        </div>
                      </div>
                    )}
                  </div>
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
                className="prose prose-purple max-w-none text-gray-800 leading-relaxed preview-canvas"
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

      {/* TABLE INSERTION MODAL */}
      <AnimatePresence>
        {showTableModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#eef2f6] clay-flat p-6 sm:p-8 rounded-3xl max-w-xl w-full text-left space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-lg font-black text-gray-800 uppercase flex items-center gap-2">
                  <TableIcon className="text-indigo-600" size={20} /> Insert Content Table
                </h3>
                <button 
                  type="button"
                  onClick={() => setShowTableModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick Grid Selector */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-700 block mb-2">
                  Quick Grid Selector ({hoverGrid.r} Rows × {hoverGrid.c} Columns)
                </label>
                <div 
                  className="inline-grid grid-cols-6 gap-1.5 p-3 bg-white rounded-2xl border border-gray-200 shadow-inner"
                  onMouseLeave={() => setHoverGrid({ r: tableRows, c: tableCols })}
                >
                  {Array.from({ length: 6 }).map((_, rIdx) => (
                    Array.from({ length: 6 }).map((_, cIdx) => {
                      const r = rIdx + 1;
                      const c = cIdx + 1;
                      const isHovered = r <= hoverGrid.r && c <= hoverGrid.c;
                      return (
                        <div
                          key={`${r}-${c}`}
                          onMouseEnter={() => setHoverGrid({ r, c })}
                          onClick={() => {
                            setTableRows(r);
                            setTableCols(c);
                            setHoverGrid({ r, c });
                          }}
                          className={`w-6 h-6 rounded-md border cursor-pointer transition-colors ${
                            isHovered 
                              ? 'bg-indigo-600 border-indigo-700' 
                              : 'bg-gray-100 border-gray-200 hover:bg-indigo-200'
                          }`}
                          title={`${r} rows × ${c} columns`}
                        />
                      );
                    })
                  ))}
                </div>
              </div>

              {/* Exact Rows and Columns Number Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                    Rows count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={tableRows}
                    onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-white clay-inset rounded-xl font-bold text-sm text-gray-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                    Columns count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={tableCols}
                    onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-white clay-inset rounded-xl font-bold text-sm text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Table Style Presets */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                  Table Design Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TABLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setTablePreset(preset.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                        tablePreset === preset.id
                          ? 'border-indigo-600 bg-indigo-50/80 shadow-md font-black text-indigo-900 ring-2 ring-indigo-500/20'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{preset.name}</span>
                        {tablePreset === preset.id && <Check size={14} className="text-indigo-600" />}
                      </div>
                      <p className="text-[10px] text-gray-400 font-normal mt-0.5 line-clamp-1">{preset.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options: Headers & Caption */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={tableHasHeader}
                      onChange={(e) => setTableHasHeader(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    Include Header Row (TH)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={tableFirstColHeader}
                      onChange={(e) => setTableFirstColHeader(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    Header on First Column
                  </label>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                    Table Caption / Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={tableCaption}
                    onChange={(e) => setTableCaption(e.target.value)}
                    placeholder="e.g. Table 1: Feature Matrix & Comparison"
                    className="w-full px-3 py-2 bg-white clay-inset rounded-xl font-medium text-xs text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTableModal(false)}
                  className="px-5 py-2.5 clay-inset rounded-xl font-bold text-gray-600 text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertTable}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <TableIcon size={14} /> Insert Table
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INLINE IMAGE INSERTION MODAL */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#eef2f6] clay-flat p-6 sm:p-8 rounded-3xl max-w-xl w-full text-left space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-lg font-black text-gray-800 uppercase flex items-center gap-2">
                  <ImageIcon className="text-purple-600" size={20} /> Insert Image in Article
                </h3>
                <button 
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Source Tabs: Upload from Computer vs Image Link */}
              <div className="flex items-center gap-2 bg-[#eef2f6] p-1 rounded-2xl clay-inset">
                <button
                  type="button"
                  onClick={() => setImageSourceType('upload')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    imageSourceType === 'upload'
                      ? 'clay-flat text-purple-700 font-bold'
                      : 'text-gray-500 hover:text-purple-700'
                  }`}
                >
                  <Upload size={14} /> Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => setImageSourceType('url')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    imageSourceType === 'url'
                      ? 'clay-flat text-purple-700 font-bold'
                      : 'text-gray-500 hover:text-purple-700'
                  }`}
                >
                  <LinkIcon size={14} /> Image URL
                </button>
              </div>

              {imageSourceType === 'upload' ? (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                    Choose Image File
                  </label>
                  <div className="p-4 border-2 border-dashed border-purple-200 rounded-2xl bg-white text-center flex flex-col items-center justify-center gap-2">
                    <input
                      type="file"
                      id="modal-inline-file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingImage(true);
                        const formData = new FormData();
                        formData.append('image', file);
                        try {
                          const res = await fetch(`${API_BASE_URL}/api/blogs/upload-image`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${getStaffToken()}` },
                            body: formData
                          });
                          const data = await res.json();
                          if (data.success && data.imageUrl) {
                            const full = data.imageUrl.startsWith('http') ? data.imageUrl : `${API_BASE_URL}${data.imageUrl}`;
                            setInlineImageUrl(full);
                            showToast('Image uploaded successfully!');
                          } else {
                            showToast(data.message || 'Upload failed', 'error');
                          }
                        } catch(err) {
                          showToast('Error uploading image', 'error');
                        } finally {
                          setUploadingImage(false);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="modal-inline-file"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md inline-flex items-center gap-2 transition-all"
                    >
                      {uploadingImage ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                      {uploadingImage ? 'Uploading to Cloudinary...' : 'Browse Computer'}
                    </label>
                    <span className="text-[10px] text-gray-400">Supports PNG, JPG, WEBP, GIF, SVG (up to 5MB)</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                    Image Direct URL
                  </label>
                  <input
                    type="text"
                    value={inlineImageUrl}
                    onChange={(e) => setInlineImageUrl(e.target.value)}
                    placeholder="https://example.com/images/sample.jpg"
                    className="w-full px-3 py-2.5 bg-white clay-inset rounded-xl font-medium text-xs text-gray-800 focus:outline-none"
                  />
                </div>
              )}

              {/* Preview Thumbnail if image is selected */}
              {inlineImageUrl && (
                <div className="p-3 bg-white rounded-2xl border border-gray-200 flex items-center gap-3">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    <img src={inlineImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{inlineImageUrl}</p>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={12} /> Image ready to insert
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInlineImageUrl('')}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg text-xs cursor-pointer"
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Image Width / Size Options */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Image Width / Size
                  </label>
                  <span className="text-xs font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                    {inlineImageWidth}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: '25% (Small)', value: '25%' },
                    { label: '50% (Medium)', value: '50%' },
                    { label: '75% (Large)', value: '75%' },
                    { label: '100% (Full)', value: '100%' }
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setInlineImageWidth(s.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        inlineImageWidth === s.value
                          ? 'bg-purple-600 text-white font-black ring-2 ring-purple-500/20'
                          : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-gray-200 ml-auto flex-1 sm:flex-initial">
                    <span className="text-[10px] text-gray-400 font-bold">Slider:</span>
                    <input
                      type="range"
                      min="15"
                      max="100"
                      step="5"
                      value={parseInt(inlineImageWidth) || 100}
                      onChange={(e) => setInlineImageWidth(`${e.target.value}%`)}
                      className="w-24 accent-purple-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Alignment / Placement Options */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                  Placement & Layout
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'center', label: 'Centered', desc: 'Standard width' },
                    { id: 'full', label: 'Full Width', desc: '100% banner' },
                    { id: 'left', label: 'Float Left', desc: 'Text wraps right' },
                    { id: 'right', label: 'Float Right', desc: 'Text wraps left' }
                  ].map((align) => (
                    <button
                      key={align.id}
                      type="button"
                      onClick={() => setInlineImageAlign(align.id)}
                      className={`p-2.5 rounded-xl text-center border transition-all text-xs cursor-pointer ${
                        inlineImageAlign === align.id
                          ? 'border-purple-600 bg-purple-50 text-purple-900 font-black ring-2 ring-purple-500/20'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold'
                      }`}
                    >
                      <div>{align.label}</div>
                      <div className="text-[9px] text-gray-400 font-normal">{align.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption & Alt Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                    Image Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={inlineImageCaption}
                    onChange={(e) => setInlineImageCaption(e.target.value)}
                    placeholder="e.g. Figure 1: Growth Analytics"
                    className="w-full px-3 py-2 bg-white clay-inset rounded-xl font-medium text-xs text-gray-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                    Alt Text (SEO & Accessibility)
                  </label>
                  <input
                    type="text"
                    value={inlineImageAlt}
                    onChange={(e) => setInlineImageAlt(e.target.value)}
                    placeholder="e.g. Growth Analytics chart showing SEO traffic"
                    className="w-full px-3 py-2 bg-white clay-inset rounded-xl font-medium text-xs text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-5 py-2.5 clay-inset rounded-xl font-bold text-gray-600 text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertInlineImage}
                  disabled={!inlineImageUrl.trim()}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-lg text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ImageIcon size={14} /> Insert into Blog
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManagement;
