import chai, {expect} from 'chai';
// import { request } from 'express';
import { ICategoryDoc, ICategoryModel, ICategory } from '../src/interfaces/category.interface' 
import CategoryModel from '../src/db/models/category.model';
import {agent as request, SuperAgentTest} from 'supertest';
import app from '../src/app';

//@ts-ignore
import json from '../TestData.json';

// import express from 'express';
// const apptest = express();
// apptest.use(express.json());
// apptest.use('/category', categoryRouter);

describe( "Testing API", () => {

    let api: SuperAgentTest;

    before(async () => {
        // Runnin the app and adding data to test collection
        api = await request(app); 
        await CategoryModel.insertMany(json);
    });
    after(async () => {
        // Clearing data
        await CategoryModel.remove();
    });

    // Check if tree view is returned
    it('should GET /category/treeView', async() => {
        const res = await api.get('/category/treeView');
        // console.log(res.body);
        expect(res.body).not.to.be.empty;
    });

    // Try to add new entries
    it('should POST /category', async() => {
        const res = await api.post('/category').send({
            categoryId: 'Black Shirt',
            ancestors: ['Clothing', 'Men Clothing', 'Shirts'],
            price: 100
        });
        expect(res.status).to.equal(200);
    });
    it('should`t POST /category dublicate', async() => {
        const res = await api.post('/category').send({
            categoryId: 'Black Shirt',
            ancestors: ['Clothing', 'Men Clothing', 'Shirts'],
            price: 100
        });
        expect(res.status).to.equal(409);
    })
    it('should`t POST /category price already set', async() => {
        const res = await api.post('/category').send({
            categoryId: 'Adidas Shirt',
            ancestors: ['Clothing', 'Men Clothing', 'Shirts', 'Black Shirt'],
            price: 1200
        });
        expect(res.status).to.equal(400);
    })
    it('should`t POST /category does not exists', async() => {
        const res = await api.post('/category').send({
            categoryId: 'Shirts',
            ancestors: ['Clothing', 'Children Clothing']
        });
        expect(res.status).to.equal(404);
    })

    //Check if sales are calculated correctly
    it('should GET /sales of Underwear', async() => {
        const res = await api.get('/category/sales/Underwear');
        // console.log(res.body);
        expect(res.body.sales).to.equal(350);
    });
    it('should GET /sales of Jeans', async() => {
        const res = await api.get('/category/sales/Jeans');
        // console.log(res.body);
        expect(res.body.sales).to.equal(450);
    });
    it('should GET /sales of Women Clothing', async() => {
        const res = await api.get('/category/sales/Women Clothing');
        // console.log(res.body);
        expect(res.body.sales).to.equal(800);
    });
    it('should`t GET /sales does not exists', async() => {
        const res = await api.get('/category/sales/DoesNotExists');
        // console.log(res.body);
        expect(res.status).to.equal(404);
    });
    it('should`t GET /sales does not have sales', async() => {
        const res = await api.get('/category/sales/TShirts');
        // console.log(res.body);
        expect(res.body.sales).to.equal(0);
    });

});