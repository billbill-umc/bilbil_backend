import multer from 'multer';
import path from 'path';

// 업로드 디렉터리의 절대 경로 설정
const uploadDir = path.resolve(__dirname, '../uploads'); // 현재 파일 위치 기준으로 '../uploads' 경로

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Uploading to:', uploadDir); // 디렉터리 확인
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + path.extname(file.originalname);
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: { files: 10 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type, only images are allowed!'));
        }
    }
}).array('images', 10);

export default upload;
