import { MongoClient } from "mongodb";

export async function connectDB(){
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017/next-js')
    return client;
}

export async function insertDocuments(client,collection,document){
    const db = client.db();
    const res =  await db.collection(collection).insertOne(document);
    return res;
}

export async function getAllDocuments(client,collection){
    const db = client.db();
    const res = await db.collection(collection).find().sort({_id:-1}).toArray();
    return res;
}