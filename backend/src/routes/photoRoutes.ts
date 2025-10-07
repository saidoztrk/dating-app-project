import { Router } from 'express';
import { uploadPhoto, deletePhoto, getUserPhotos } from '../controllers/photoController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/upload', authMiddleware, upload.single('photo'), uploadPhoto);
router.delete('/:photoId', authMiddleware, deletePhoto);
router.get('/:userId', getUserPhotos);

export default router;