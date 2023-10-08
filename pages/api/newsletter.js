import { connectDB,insertDocuments } from "../../helpers/db-util";

async function handler(req,res){

    if(req.method==='POST'){
        const userEmail = req.body.email
        if(!userEmail || !userEmail.includes('@')){
            res.status(422).json({message: 'Invalid email address'});
            return;
        }

        let client;
        try{
            client = await connectDB();
        }catch(error){
            res.status(500).json({message: 'Connecting to db failed'})
            return;
        }

        try{
            await insertDocuments(client,'emails',{email:userEmail});
            res.status(201).json({message:'signed up'})
        }catch(error){
            res.status(500).json({message: 'inserting document to db failed'});
        }
        client.close();
        return;
    }
}
export default handler;