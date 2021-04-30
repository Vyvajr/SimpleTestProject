import mongoose from 'mongoose';
import CategorySchema from '../schemas/category.schema';
import { ICategoryDoc, ICategoryModel } from '../../interfaces/category.interface';

export default mongoose.model<ICategoryDoc, ICategoryModel>('category', CategorySchema);