import chai, {expect} from 'chai';
// import { request } from 'express';
import * as db from '../src/db/db';
import {agent as request} from 'supertest';
import app from '../src/app';
// import express from 'express';
// const apptest = express();
// apptest.use(express.json());
// apptest.use('/category', categoryRouter);

describe( "Testing API", () => {

    before((done) => {
        db.connect()
            .then(() => done())
            .catch((err) => done(err));
    });
    after((done) => {
        db.close()
            .then(() => done())
            .catch((err) => done(err));
    });

    it('Normal test', ()=>{
        expect(200).to.equal(200)
    })

    // it('should POST /category ', async ()=>{
    //     const res = await request(app) 
    //         .post('/category').send({
    //             "categoryId": "test",
    //             "ancestors": []
    //         });
    //     expect(res.status).to.equal(200);
    //     // res = await request(apptest) 
    //     //     .post('/category').send({
    //     //         "_id": "test",
    //     //         "ancestors": []
    //     //     });
    //     // expect(res.status).to.equal(409);
    // });
    // it('should GET /category all', async ()=>{
    //     const res = await request(app) 
    //         .get('/category/treeView');
    //     expect(res.body).not.to.be.empty;
    // });

    // it('should get /category:sales ', async ()=>{
    //     const res = await request(app) 
    //         .get('/category/test');
    //     expect(res.body.sales).to.equal(0);
    // });

});