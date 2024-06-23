
const express = require('express');
const addressRoutes = express.Router();

addressRoutes.post(
    "/addEmitter",
    (() => {
        return async (req, res, next) => {
            try {
                const collection = req.db.collection('emitter');
                const doc = req.body;
                await collection.insertOne(doc);
                res.send("Emitter Added sucessfully");
            }
            catch (e) {
                res.status(500).send("INTERNAL SERVER ERROR");
            }
        }
    })()
)

addressRoutes.post(
    "/addReciever",
    (() => {
        return async (req, res, next) => {
            try {
                const collection = req.db.collection('reciever');
                const doc = req.body;
                await collection.insertOne(doc);
                res.send("Reciever Added sucessfully");
            }
            catch (e) {
                res.status(500).send("INTERNAL SERVER ERROR");
            }
        }
    })()
)

addressRoutes.get("/receiverEmitterList",(()=>{
    return async(req,res,next) => {
        try{
            const collection = req.db.collection("emitter");
            const receiverAddress = req.query.address;
            console.log(receiverAddress);
                // Correct the query object to use $ne
                const data = await collection.find({ receiverAddress: { $ne: receiverAddress } }).toArray();
            console.log(data);
            res.send(data);
        }
        catch(e){
            console.log(e);
            res.status(500).send("INTERNAL_SERVER_ERROR");
        }
    }
})())


addressRoutes.post("/subscribe",(()=>{
    return async(req,res,next) =>{
        try{
            const collection = req.db.collection("emitter");
            const receiverAddress = req.body.receiverAddress;
            const emitterAddress = req.body.emitterAddress;
            const data = await collection.findOne({emitterAddress:emitterAddress});
            if(!data){
                res.status(400).send("No such emitter found");
            }
            else{
                await collection.updateOne({emitterAddress:emitterAddress},{$push:{receiverAddress:receiverAddress}});
                res.send("Updated Succsfully");
            }
        }
        catch(e){
            res.status(500).send("INTERNAL_SERVER_ERROR");
        }
    }
})())

module.exports = {addressRoutes};


