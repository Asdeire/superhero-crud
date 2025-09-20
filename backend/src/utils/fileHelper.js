const fs = require('fs').promises;
const path = require('path');

const createUploadsDir = async () => {
    try {
        const uploadsPath = path.join(process.cwd(), 'uploads');
        await fs.access(uploadsPath);
        console.log('📁 Uploads directory exists');
    } catch {
        const uploadsPath = path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadsPath, { recursive: true });
        console.log('📁 Uploads directory created');
    }
};

const deleteFile = async (filePath) => {
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`🗑️ File deleted: ${filePath}`);
    } catch (error) {
        console.warn(`⚠️ Could not delete file: ${filePath}`, error.message);
    }
};

const getFileExtension = (filename) => {
    return path.extname(filename).toLowerCase();
};

const isImageFile = (filename) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const ext = getFileExtension(filename);
    return imageExtensions.includes(ext);
};

const generateUniqueFilename = (originalname) => {
    const ext = path.extname(originalname);
    const name = path.basename(originalname, ext);
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    return `${name}-${timestamp}-${random}${ext}`;
};

module.exports = {
    createUploadsDir,
    deleteFile,
    getFileExtension,
    isImageFile,
    generateUniqueFilename
};