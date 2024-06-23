const express = require('express');
const notifyRoutes = express.Router();

notifyRoutes.post(
    "/sendNotification",
    (() => {
        return async (req, res, next) => {
            try {
                const collection = await req.db.collection('notification');
                const doc = req.body;
                await collection.insertOne(doc);
                res.send("Notification Added sucessfully");
            }
            catch (e) {
                res.status(500).send("INTERNAL SERVER ERROR");
            }
        }
    })()
)


notifyRoutes.get("/inbox",(()=>{
    return async(req,res,next) => {
        try{
            const collection = await req.db.collection("notification");
            const requestAddress = req.query.address;
            console.log(requestAddress);
            const data = await collection.find({"receiverAddress":new RegExp(requestAddress,'i')}).toArray();
            console.log(data);
            res.send(data);

        }
        catch(e){
            console.log(e);
            res.status(500).send("INTERNAL SERVER ERROR");
        }
    }
})())
module.exports = {notifyRoutes}