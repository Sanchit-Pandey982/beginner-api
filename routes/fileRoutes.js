const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../middlewares/fileUpload');

// URL: POST /files/upload
// Upload a single file
router.post('/upload', upload.single('file'), fileController.uploadFile);

// URL: POST /files/upload-multiple
// Upload multiple files
router.post('/upload-multiple', upload.array('files', 10), fileController.uploadMultipleFiles);

// URL: GET /files/info/:filename
// Get file information
router.get('/info/:filename', fileController.getFileInfo);

// URL: DELETE /files/delete/:filename
// Delete a file
router.delete('/delete/:filename', fileController.deleteFile);

module.exports = router;
