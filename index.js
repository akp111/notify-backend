const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const serverless = require("serverless-http");
const {addressRoutes} = require('./routes/addressRoutes');
const {notifyRoutes} = require('./routes/notifyRoutes');

const app = express();
const DB_URI = process.env.DB_URI;
const DB_NAME = 'Notify'; 

let DB_GLOBAL_READ = null;

const corsOpts = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
    credentials: true
};

app.use(express.json());
app.use(cors(corsOpts));

const get_db = async () => {
    if (DB_GLOBAL_READ) {
        return DB_GLOBAL_READ;
    } else {
        try {
            const client = await MongoClient.connect(DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            DB_GLOBAL_READ = await client.db(DB_NAME);
            console.log("DB connected");
            return DB_GLOBAL_READ;
        } catch (e) {
            console.error('Failed to connect to database:', e);
            throw e;
        }
    }
};

app.use(async (req, res, next) => {
    try {
        const db = await get_db();
        req.db = db;
        next();
    } catch (e) {
        console.error('Failed to connect to database:', e);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/about', (req, res) => {
    res.send('About route 🎉 ')
  })
app.use('/', addressRoutes);
app.use('/notify', notifyRoutes);

// if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    app.listen(3000, () => {
        console.log("[server] listening on port 3000");
    });


module.exports = app;
    // get_db();
    // module.exports = { app, get_db };
// } else {
//     module.exports.handler = serverless(app);
// }
