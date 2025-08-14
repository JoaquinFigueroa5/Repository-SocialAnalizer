import { Router } from 'express';
import {analyzeSocial} from './osint.controller.js';

const router = Router();

router.post('/social-analyzer', analyzeSocial);

export default router;