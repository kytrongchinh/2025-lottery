const multer = require("multer");
const path = require("path");

const fs = require("fs");
const slugify = require("slugify");

function getTodayFolder() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}${mm}${dd}`;
}

// Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const today = getTodayFolder();
        const uploadPath = path.join("media/uploads/banners", today);

        // tạo folder nếu chưa có
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const originalName = path.basename(file.originalname, ext);

        const slugName = slugify(originalName, {
            replacement: '-',
            remove: undefined,
            lower: true,
            strict: true, // 🔥 loại bỏ ký tự đặc biệt
            trim: true,
        });

        cb(null, `${slugName}-${Date.now()}${ext}`);
    },
});

// Optional: file filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
});

module.exports = upload;
