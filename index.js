const express = require('express')
const app = express()
const PORT = 5000;
const urlRoute = require('./routes/url')
const { connectToMongoDB } = require('./connect');
const MONGO_URI = "mongodb://127.0.0.1:27017/url-shortener";
const URL = require('./models/url');
app.use(express.json())

app.use("/url", urlRoute);
connectToMongoDB(MONGO_URI).then(()=>{console.log("DataBase Connected")}).catch((error)=> console.log(error));


app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId; // Corrected line
    const entry = await URL.findOneAndUpdate(
      { shortId: shortId }, // Specify the field and its value to find the document
      { $push: { visitHistory: { timestamp: Date.now() } } }, // Use $push to add a new element to the visitHistory array
      { new: true } // Set the `new` option to true to return the updated document
    );
  
    res.redirect(entry.redirectUrl);
  });

app.listen(PORT,()=>{
    console.log(`Server Listening on Port : ${PORT}`);

})