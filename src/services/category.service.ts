import { ICategory, ICategoryDoc, ICategoryModel, ICategoryResult } from '../interfaces/category.interface'; 
import { TreeNode } from '../interfaces/treenode.interface';
import { SimpleResponse } from '../interfaces/simpleResponse.interface';

export default class CategoryService {

    private categoryModel: ICategoryModel;

    constructor(categoryModel: ICategoryModel) {
        this.categoryModel = categoryModel;
    }

    public async add(categoryId: string, ancestors: Array<string>, price?: Number): Promise<SimpleResponse>{ 
        let parent: string = '';
        
        if(ancestors && ancestors.length > 0) {
            const position: number = ancestors.length -1;
            parent =  ancestors[position];
            // get parent category
            // console.log(ancestors.filter((value,index) => index !== position));
            const parentDoc: ICategoryDoc | null = await this.categoryModel.findOne({ 
                ancestors: ancestors.filter((value,index) => index !== position),
                categoryId: parent
            });

            if(!parentDoc)  
                return {
                    status: 404,
                    message: "Not found!!!"
                };
            // if parent category has price return
            if(parentDoc && parentDoc.price) 
                return {
                    status: 400,
                    message: "Price is set to parent!!!"
                };
        }
        
        // set ancestors
        //const ancestors: Array<string> = parentDoc? [...parentDoc.ancestors, parent]: [parent];
        let category: ICategory = {
            categoryId: categoryId,
            //parent: parent === ''? ancestors[0]: parent,
            parent: parent,
            ancestors: ancestors
        }
        if(price) category.price = price;

        // add category
        try{
            await this.categoryModel.create( category );
        } catch(err) {
            // return error msg
            return {
                status: 409,
                message: err.message
            }
        }

        return {
            message: "saved",
            status: 200
        };
    }

    public async sales(categoryId: string, parent?: string): Promise<SimpleResponse> {
        // can be more categories with the same name
        const categories: Array<ICategoryDoc> = await this.categoryModel.find({ categoryId: categoryId });
        // check if exists
        if(categories.length === 0) 
            return {
                status: 404,
                message: 'No categories with the categoryId ' + categoryId + ' were found'
            };   
        let sales: number = 0;
        /* I do not actually know if this is required, 
        if the child whould have price this would pick the sales of parent */
        // if(doc.price && doc.parent) {
        //     categoryId = <string> doc.parent;
        // }
        //try{
        
        for(let category of categories) {
            const categoryList: Array<ICategoryDoc> = await this.categoryModel.getSales(<string>category.categoryId, <string>category.parent); 
            categoryList.forEach( (sub)=>{
                if(sub.price) sales +=  <number> sub.price; // this is not required, but too lazy to create a new interface
            });
        }
        
        if(sales === 0) {
            for(let category of categories){
                if(category.price) sales += <number>category.price;
            }
        }
        
            // const categoryList: Array<ICategoryDoc> = await this.categoryModel.getSales(categoryId);
            // if(!categoryList || categoryList.length === 0)
            //     return {
            //         status: 404,
            //         message: 'Category not found or does not have any sales made through sub-categories'
            //     };
            // categoryList.forEach( (cat)=>{
            //     if(cat.price) sales +=  <number> cat.price;
            // });
        // } catch(err) {
        //     return {
        //         message: err.message,
        //         status: 400
        //     };
        // }
        
        return {
            message: 'Total sales made: in category: ' + categoryId,
            status: 200,
            sales: sales
        };
    }

    public async treeView(): Promise<Array<TreeNode>> {
        let tree: Array<TreeNode> = [];

        // get parent categories
        const allParents: Array<ICategoryDoc> = await this.categoryModel.find({ ancestors: [] });
        const parentsList: Array<string> = allParents.map( (value) => value.categoryId.toString() );

        // loop through all parent categories
        for( let parent of parentsList ) {
            // get all perant sub-categories
            let items: Array<ICategoryResult> = await this.categoryModel.getChildren(parent);
            // add parent node
            items.unshift({
                categoryId : parent,
                parent: null,
                children: []
            });
            // convert to tree view and push to array
            tree.push(this.listToTree(items)[0]);
        }
  
        return tree;
    }


    private listToTree(list: Array<ICategoryResult>) {
        let map: TreeNode = {};
        let node: ICategoryResult;
        let roots: Array<TreeNode> = []
        let i: number;
        
        for (i = 0; i < list.length; i += 1) {
            map[<string> list[i].categoryId] = i; // initialize the map
        }
        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.parent) {
                // adds children to the parent node
                list[map[<string> node.parent]].children.push(this.getTreeNode(node));
                // console.log(list);
            } else {
                // push parent node, creates a reference to the list
                roots.push({
                    categoryId: node.categoryId,
                    children: node.children
                });
            }
        }
        return roots;
    }

    // format tree node to be more readable
    private getTreeNode(node: ICategoryResult): TreeNode {
        if(node.price)
            return {
                categoryId: node.categoryId,
                price: node.price
            }
        else
            return {
                categoryId: node.categoryId,
                children: node.children,
            }
    }
}