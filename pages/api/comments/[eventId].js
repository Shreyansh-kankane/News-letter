import { connectDB,getAllDocuments,insertDocuments } from "../../../helpers/db-util";
async function handler(req,res){
    const eventId = req.query.eventId;

    if(req.method === 'POST'){
        //add server-side-validation
        const {email,name,text} = req.body;
        if(!email || !email.includes('@') || 
            !name || name.trim()==='' || 
            !text || text.trim()===''){
            res.status(422).json({message:'Invalid input'});
            return;
        }
        const newComment = {
            email,
            name,
            text,
            eventId
        }
        let client;

        try{
            client = await connectDB();
        }catch(error){
            res.status(500).json({message: 'Connecting to db failed'})
            return;
        }

        let result;
        try{
            result = await insertDocuments(client,'comments',newComment);
            newComment.id = result.insertedId;
            res.status(201).json({message:'Added comment',comment: newComment});
        } catch(error){
            res.status(500).json({message: 'inserting document to db failed'});
        }
        client.close();
        return;
    }

    else if(req.method === 'GET'){
        let client;
        try{
            client = await connectDB();
        }catch(error){
            res.status(500).json({message: 'Connecting to db failed'})
            return;
        }

        let documents;
        try{
            documents = await getAllDocuments(client,'comments');
            res.status(200).json({comments:documents});
        }catch(error){
            res.status(500).json({message: 'fetching documents from db failed'});
        }
        client.close();
        return;
    }
}

export default handler;