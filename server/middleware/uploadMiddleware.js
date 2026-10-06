const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const extensions = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp' };
        cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${extensions[file.mimetype] || ''}`);
    },
});

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => cb(null, allowedTypes.has(file.mimetype)),
});

module.exports = upload;
