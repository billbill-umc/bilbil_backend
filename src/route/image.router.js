import express from 'express';
import fs from 'fs';
import path from 'path'; // path 모듈을 import 합니다
import upload from '../config/multer-config';
import { getDatabase } from '../config/db';

const router = express.Router();

//이미지 삽입
router.post('/posts/:postId/images', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(500).json({
                success: false,
                code: "UPLOAD_ERROR",
                message: '파일 업로드에 실패했습니다.',
                error: err.message
            });
        }

        const { postId } = req.params;
        const files = req.files;
        const db = getDatabase();

        console.log('Received files:', files); 
        console.log('Post ID:', postId);

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No images were uploaded' });
        }

        try {
            const imageUrls = files.map(file => `/uploads/${file.filename}`);

            console.log('Image URLs:', imageUrls);

            const query = 'INSERT INTO postImage (postId, url) VALUES ?';
            const values = imageUrls.map(url => [postId, url]);

            await db.query(query, [values]);

            res.status(200).json({
                message: 'Images uploaded successfully',
                imageUrls
            });
        } catch (error) {
            console.error('Error inserting images:', error.stack);
            res.status(500).json({
                success: false,
                code: "UNKNOWN_ERROR",
                message: '알 수 없는 오류가 발생했습니다.',
                error: error.message
            });
        }
    });
});


router.get('/posts/:postId/images', async (req, res) => {
    const { postId } = req.params;
    const db = getDatabase();

    try {
        const query = 'SELECT id, url FROM postImage WHERE postId = ?';
        const [rows] = await db.query(query, [postId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                code: "NOT_FOUND",
                message: "해당 게시물에 대한 이미지가 없습니다."
            });
        }

        res.status(200).json({
            success: true,
            code: "SUCCESS",
            message: "이미지 목록을 가져왔습니다.",
            data: rows
        });
    } catch (error) {
        console.error('Error fetching images:', error.stack);
        res.status(500).json({
            success: false,
            code: "UNKNOWN_ERROR",
            message: "알 수 없는 오류가 발생했습니다.",
            error: error.message
        });
    }
});


router.delete('/posts/:postId/images/:imageId', async (req, res) => {
    const { postId, imageId } = req.params; 
    const db = getDatabase();

    // 데이터베이스에서 이미지 URL 조회
    try {
        const query = 'SELECT url FROM postImage WHERE id = ? AND postId = ?';
        const [rows] = await db.query(query, [imageId, postId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                code: 'FILE_NOT_FOUND',
                message: '이미지를 찾을 수 없습니다.'
            });
        }

        const imageUrl = rows[0].url;
        const filePath = path.join(__dirname, '..', 'uploads', path.basename(imageUrl));

        console.log('Attempting to delete file at:', filePath); // 파일 경로를 로그에 출력합니다

        // 파일 존재 여부 확인
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('File does not exist:', filePath);
                return res.status(404).json({
                    success: false,
                    code: 'FILE_NOT_FOUND',
                    message: '파일이 존재하지 않습니다.',
                    error: err.message
                });
            }

            // 파일 삭제 시도
            fs.unlink(filePath, async (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({
                        success: false,
                        code: 'FILE_DELETE_ERROR',
                        message: '파일 삭제에 실패했습니다.',
                        error: err.message
                    });
                }

                // 데이터베이스에서 이미지 정보 삭제
                const deleteQuery = 'DELETE FROM postImage WHERE id = ?';
                try {
                    await db.query(deleteQuery, [imageId]);
                    res.status(200).json({
                        success: true,
                        code: 'SUCCESS',
                        message: '이미지가 삭제되었습니다.'
                    });
                } catch (dbError) {
                    console.error('Error deleting image from database:', dbError);
                    res.status(500).json({
                        success: false,
                        code: 'DB_ERROR',
                        message: '데이터베이스에서 이미지를 삭제하는 데 실패했습니다.',
                        error: dbError.message
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error deleting image from database:', error.stack);
        res.status(500).json({
            success: false,
            code: 'DB_ERROR',
            message: '데이터베이스에서 이미지를 조회하는 데 실패했습니다.',
            error: error.message
        });
    }
});

export default router;
