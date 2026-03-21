import { Router } from 'express';
import { getExploreStudios, getStudioDetailsAuthFree } from './studio.controller';

const router = Router();

// This entire router is OPEN (No Token needed) as it serves the Customer Discovery layer

// UC-07: Search & Explore Studios
router.get('/', getExploreStudios);

// UC-08, UC-09: View specific Studio Profile and Portfolio details
router.get('/:id', getStudioDetailsAuthFree);

export default router;
