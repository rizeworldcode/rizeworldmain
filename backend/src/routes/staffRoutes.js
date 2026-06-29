const express = require('express');
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  clockOutStaff,
  clockInStaff,
  clearSalary,
  updateAttendance,
  loginStaff,
  updateTodayWork,
  toggleTaskComplete,
  submitWorkReport,
  getWorkReports,
  submitAllReports,
  markLeave,
  getStaffLeaves,
  uploadDocument,
  deleteDocument,
  addExtraTask,
  getMyReportees
} = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { requireOfficeWifi } = require('../middleware/officeWifi');
const upload = require('../middleware/upload');

router.post('/login', loginStaff);

router.use(protect);

router.post('/', createStaff);
router.get('/', getAllStaff);
router.get('/my-reportees', getMyReportees);

// Static/literal routes first
router.get('/reports', getWorkReports);
router.get('/leaves/all', getStaffLeaves);
router.post('/submit-all-reports', submitAllReports);
router.post('/mark-leave', markLeave);

// Dynamic parameter routes
router.get('/:id', getStaffById);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);
router.patch('/:id/clock-out', requireOfficeWifi, clockOutStaff);
router.patch('/:id/clock-in', requireOfficeWifi, clockInStaff);
router.patch('/:id/today-work', updateTodayWork);
router.patch('/:id/toggle-task', toggleTaskComplete);
router.post('/:id/add-extra-task', addExtraTask);
router.post('/:id/submit-report', submitWorkReport);
router.patch('/:id/clear-salary', clearSalary);
router.post('/:id/attendance', updateAttendance);

// Document routes
router.post('/:id/upload-document', upload.single('document'), uploadDocument);
router.delete('/:id/document/:docId', deleteDocument);

module.exports = router;
