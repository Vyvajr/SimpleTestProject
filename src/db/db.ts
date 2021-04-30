import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
const DB_URI = 'mongodb://localhost/zenitech';

mongoose.Schema.Types.String.checkRequired(v => v != null);
export function connect(): Promise<null> {

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV?.includes('test')) {
        const mockgoose = new Mockgoose(mongoose);
        mockgoose.prepareStorage()
            .then(() => {
                mongoose.connect(
                    DB_URI, 
                    {
                        useNewUrlParser: true,
                        useCreateIndex: true,
                        autoIndex: true,
                    }, 
                    ()=>{
                        console.log("mocking MongoDB !!!");
                        resolve(null);
                    }
                );
            })
        } else {
            mongoose.connect(
                DB_URI, 
                {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    autoIndex: true,
                }, 
                ()=>{
                    console.log("connected to MongoDB !!!");
                    resolve(null);
                }
            );
        }
    });
}

export function close() {
    return mongoose.disconnect();
}