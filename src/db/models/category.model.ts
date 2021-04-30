import mongoose from 'mongoose';
import CategorySchema from '../schemas/category.schema';
import { ICategoryDoc, ICategoryModel } from '../../interfaces/category.interface';

const TEST_COLLECTION = 'test';
const WORK_COLLECTION = 'category'

export default mongoose.model<ICategoryDoc, ICategoryModel>(
    process.env.NODE_ENV?.includes(TEST_COLLECTION)? TEST_COLLECTION : WORK_COLLECTION, 
    CategorySchema,
    process.env.NODE_ENV?.includes(TEST_COLLECTION)? TEST_COLLECTION : WORK_COLLECTION, 
);