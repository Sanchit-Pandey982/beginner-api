require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// FILE UPLOAD
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No file provided" });
        }

        const fileInfo = {
            originalName: req.file.originalname,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: `/uploads/${req.file.filename}`,
            uploadedAt: new Date()
        };

        res.json({
            msg: "File uploaded successfully",
            file: fileInfo
        });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// UPLOAD MULTIPLE FILES
exports.uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: "No files provided" });
        }

        const filesInfo = req.files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            path: `/uploads/${file.filename}`
        }));

        res.json({
            msg: "Files uploaded successfully",
            count: req.files.length,
            files: filesInfo
        });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// GET FILE INFO
exports.getFileInfo = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(uploadDir, filename);

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ msg: "File not found" });
        }

        const stats = fs.statSync(filepath);

        res.json({
            msg: "File found",
            file: {
                filename,
                size: stats.size,
                uploadedAt: stats.birthtime,
                modifiedAt: stats.mtime
            }
        });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// DELETE FILE
exports.deleteFile = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(uploadDir, filename);

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ msg: "File not found" });
        }

        fs.unlinkSync(filepath);

        res.json({
            msg: "File deleted successfully",
            filename
        });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
