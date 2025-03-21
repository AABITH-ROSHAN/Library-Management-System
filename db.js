const mongodb=require('mongodb');
const mongoClient=mongodb.MongoClient;
const ObjectID = mongodb.ObjectId;

let database;

async function getDatabase(){
    const client=await mongoClient.connect('mongodb://127.0.0.1:27017');
    database=client.db('library');

    if(!database){
        console.log("Database Not connected");
    }
    return database;
}

module.exports={
    getDatabase,ObjectID
}
