import { Router } from 'express';
import { signup, login, profile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', auth, profile);

export default router;