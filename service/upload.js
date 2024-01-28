const multer = require('multer');
const path = require('node:path');
const crypto = require('node:crypto');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb (null, path.join(__dirname, "..", "temp"));
    },
    filename:(req, file,cb) => {
        
        const extname = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extname);
        const suffix = crypto.randomUUID();

        cb(null, `${basename}-${suffix}${extname}`);
    }
})

module.exports = multer({storage});