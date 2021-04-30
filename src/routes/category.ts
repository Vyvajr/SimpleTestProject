import express, { Request, Response } from 'express';
import CategoryService from '../services/category.service';


import CategoryModel from '../db/models/category.model';
import { SimpleResponse } from '../interfaces/simpleResponse.interface';

import { TreeNode } from '../interfaces/treenode.interface';

const router = express.Router();
const categoryService = new CategoryService(CategoryModel);

router.get('/treeView', async (req: Request, res: Response) => {
    const treeView: Array<TreeNode> = await categoryService.treeView();
    res.json(
        treeView
    )
});

router.post('/', async (req: Request, res: Response) => {
    const { categoryId, price } = req.body;
    const ancestors: Array<string> = req.body.ancestors;
    const resObj: SimpleResponse = await categoryService.add(categoryId, ancestors, price);
    res.status(resObj.status).json({ 
        message: resObj.message
    });
});

router.get('/sales/:categoryId', async (req: Request, res: Response)=> {
    const { categoryId } = req.params;
    const resObj: SimpleResponse = await categoryService.sales(categoryId);
    res.status(resObj.status).json({ 
        message: resObj.message,
        sales: resObj.sales
    });
   
});

export default router;