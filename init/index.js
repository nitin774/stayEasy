const mongoose = require('mongoose');
const initData = require('./data.js');
const listing = require('../models/listing');

async function main() { 
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

main().then(()=>{
    console.log('connection to db');
}).catch((err)=>{
    console.log(err);
});

const initDB = async () =>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({initData, ...obj, owner: '68b028fcdbd44b2284da6b95'}));
    await listing.insertMany(initData.data);
    console.log('data was inserted');
}

initDB();