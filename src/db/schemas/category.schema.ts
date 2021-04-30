import { Schema } from 'mongoose';
import { ICategory, ICategoryDoc, ICategoryResult } from '../../interfaces/category.interface';

const CategorySchema: Schema<ICategoryDoc> = new Schema({
    categoryId: {
        type: String,
        required: true
    },
    parent: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false,

    },
    ancestors: {
        type: Array,
        of: String,
        required: true,
        index: true
    }
},
{ 
    versionKey: false // bad practice, but just for tests
}
);

// Requered in order to not allow to create identical sub-catagories for a category
CategorySchema.index({ categoryId: 1, parent: 1 }, { unique: true, sparse: true });

CategorySchema.statics.addCategory = async function(category: ICategory): Promise<ICategoryDoc> {
    // add sub-category
    return this.create(category);    
};
CategorySchema.statics.getSales = async function(categoryId: string, parent?: string): Promise<Array<ICategoryDoc>>{
    if(parent)
        return this.aggregate()
            .match({ $and: [ {ancestors: categoryId}, {ancestors: parent} ]});
    return this.aggregate()
            .match({ ancestors: categoryId, price: { $ne: null } });
    // OR
    /* return this.find({ ancestors: categoryId, price: { $ne: null } }) */
};

CategorySchema.statics.getChildren = async function(parent: string): Promise<Array<ICategoryResult>> {
    return this.aggregate()
            .match({ancestors: parent})
            .project({categoryId: 1, parent: 1, price: 1})
            .addFields({children: []});
}

export default CategorySchema;