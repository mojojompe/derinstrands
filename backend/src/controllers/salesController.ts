import { Request, Response } from 'express';
import Sale from '../models/Sale';
import Product from '../models/Product';

export const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Error fetching sales', error: String(error) });
  }
};

export const createSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const sale = new Sale(req.body);
    
    // Deduct inventory
    if (sale.items && sale.items.length > 0) {
      for (const item of sale.items) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { quantity: -item.quantity }
          });
        }
      }
    }

    const savedSale = await sale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(400).json({ message: 'Error creating sale', details: error });
  }
};

export const updateSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const oldSale = await Sale.findById(id);
    if (!oldSale) {
       res.status(404).json({ message: 'Sale not found' });
       return;
    }

    const updateData = req.body;
    if (updateData.items) {
      const allPaid = updateData.items.every((item: any) => item.paymentStatus === 'paid');
      updateData.paymentStatus = allPaid ? 'paid' : 'pending';
      
      // Revert old inventory
      for (const item of oldSale.items) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { quantity: item.quantity }
          });
        }
      }
      
      // Deduct new inventory
      for (const item of updateData.items) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { quantity: -item.quantity }
          });
        }
      }
    }

    const updatedSale = await Sale.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    res.json(updatedSale);
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(400).json({ message: 'Error updating sale', error });
  }
};

export const deleteSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const oldSale = await Sale.findById(id);
    if (!oldSale) {
      res.status(404).json({ message: 'Sale not found' });
      return;
    }

    // Revert inventory
    if (oldSale.items && oldSale.items.length > 0) {
      for (const item of oldSale.items) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { quantity: item.quantity }
          });
        }
      }
    }

    await Sale.findByIdAndDelete(id);
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ message: 'Error deleting sale', error });
  }
};
