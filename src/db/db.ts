import mongoose from 'mongoose';
const MONGO_CONNECTION_STRING_LOCAL = 'mongodb://localhost/';
const MONGO_CONNECTION_STRING_DOCKER='mongodb://mongo-db:27017/';
const DEFAULT_DB= 'zenitech';

mongoose.Schema.Types.String.checkRequired(v => v != null);
export function connect(): Promise<null> {

    return new Promise((resolve, reject) => {
        // if (process.env.NODE_ENV?.includes('test')) {
        // const mockgoose = new Mockgoose(mongoose);
        // mockgoose.prepareStorage()
        //     .then(() => {
        //         mongoose.connect(
        //             DB_URI, 
        //             {
        //                 useUnifiedTopology: true,
        //                 useNewUrlParser: true,
        //                 useCreateIndex: true,
        //                 autoIndex: true,
        //             }, 
        //             ()=>{
        //                 console.log("mocking MongoDB !!!");
        //                 resolve(null);
        //             }
        //         );
        //     })
        // } 
        //else {
        const uri = process.env.NODE_ENV?.includes('docker')? MONGO_CONNECTION_STRING_DOCKER + DEFAULT_DB : MONGO_CONNECTION_STRING_LOCAL + DEFAULT_DB;
        mongoose.connect(
            uri, 
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
                autoIndex: true,
            }, 
            ()=>{
                console.log("connected to MongoDB !!!");
                resolve(null);
            }
        );
        //}
    });
}

export function close() {
    return mongoose.disconnect();
}