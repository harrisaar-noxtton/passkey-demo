import express from 'express';
import { handleRegisterStart, handleRegisterFinish } from './registerHandlers';
import { handleLoginStart, handleLoginFinish } from './loginHandlers';

const router = express.Router();

router.post('/register-start', handleRegisterStart);
router.post('/register-finish', handleRegisterFinish);
router.post('/login-start', handleLoginStart);
router.post('/login-finish', handleLoginFinish);

export default router;
