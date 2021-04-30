import{ Document,  Model } from 'mongoose';

export interface ICategory {
    categoryId: String,
    parent: String | null,
    price?: Number,
    ancestors: Array<string>, 
}

export interface ICategoryDoc extends  ICategory, Document {
    // id: String,
    // parent: String | null,
    // price?: Number,
    // ancestors: Array<string>, 

    // methods
    // getParent(): string
}
export interface ICategoryModel extends Model<ICategoryDoc> {
    // here we decalre statics
    // methods
    addCategory(category: ICategory): Promise<ICategoryDoc>,
    getSales(id: string, parent?:string): Promise<Array<ICategoryDoc>>,
    getChildren(parent: string): Promise<Array<ICategoryResult>>,
}

export interface ICategoryResult {
    categoryId: String,
    parent: String | null,
    price?: Number,
    children: Array<any>
}