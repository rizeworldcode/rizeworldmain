const express = require('express');
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  getRemovedStaff,
  getAllCounselors,
  getStaffById,
  updateStaff,
  deleteStaff,
  rejoinStaff,
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
  getMyReportees,
  updateProfilePic,
  createAdmission,
  getAllAdmissions,
  updateAdmission,
  deleteAdmission
} = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { requireOfficeWifi } = require('../middleware/officeWifi');
const upload = require('../middleware/upload');

router.post('/login', loginStaff);

router.use(protect);

router.post('/', createStaff);
router.get('/', getAllStaff);
router.get('/removed', getRemovedStaff);
router.get('/counselors', getAllCounselors);
router.get('/my-reportees', getMyReportees);

// Admission routes
router.post('/admissions', createAdmission);
router.get('/admissions', getAllAdmissions);
router.put('/admissions/:id', updateAdmission);
router.delete('/admissions/:id', deleteAdmission);

// Static/literal routes first
router.get('/reports', getWorkReports);
router.get('/leaves/all', getStaffLeaves);
router.post('/submit-all-reports', submitAllReports);
router.post('/mark-leave', markLeave);

// Dynamic parameter routes
router.get('/:id', getStaffById);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);
router.patch('/:id/rejoin', rejoinStaff);
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
router.post('/:id/profile-pic', upload.single('profilePic'), updateProfilePic);

module.exports = router;
