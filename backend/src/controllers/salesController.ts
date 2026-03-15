import { Request, Response } from 'express';
import Sale from '../models/Sale';

export const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales' });
  }
};

export const createSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const sale = new Sale(req.body);
    const savedSale = await sale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: 'Error creating sale', error });
  }
};

export const updateSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const updateData = req.body;
    if (updateData.items) {
      const allPaid = updateData.items.every((item: any) => item.paymentStatus === 'paid');
      updateData.paymentStatus = allPaid ? 'paid' : 'pending';
    }

    const updatedSale = await Sale.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedSale) {
       res.status(404).json({ message: 'Sale not found' });
       return;
    }
    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ message: 'Error updating sale', error });
  }
};

export const deleteSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedSale = await Sale.findByIdAndDelete(id);
    if (!deletedSale) {
      res.status(404).json({ message: 'Sale not found' });
      return;
    }
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sale', error });
  }
};
