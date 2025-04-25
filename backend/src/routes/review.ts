import { Router } from 'express';
import {
  addReview,
  getReviewsByRestaurant,
  checkReviewExists
} from '../controller/reviewController';

const router = Router();

router.post('/addreview', addReview);
router.get('/restaurant/:id', getReviewsByRestaurant);
router.get('/check', checkReviewExists);