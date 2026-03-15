import { Router } from 'express';
import { getSales, createSale, updateSale, deleteSale } from '../controllers/salesController';

const router = Router();

router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/:id')
  .put(updateSale)
  .delete(deleteSale);

export default router;
