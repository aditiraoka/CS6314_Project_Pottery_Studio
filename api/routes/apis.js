var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
var ObjectId = require("mongodb").ObjectId;
const { app, db } = require('../server.js');
const { register, login, logout }=require("../controllers/auth.js") ;


// var CONNECTION_STRING = "mongodb+srv://root:root@bookstore.algdkrr.mongodb.net/?retryWrites=true&w=majority";
// var DATABASENAME = "BookStore";
var CONNECTION_STRING = "mongodb+srv://root:root@pottery-studio.edqxxug.mongodb.net/?retryWrites=true&w=majority";
var DATABASENAME = "studioDb";
var database;

const client = new MongoClient(CONNECTION_STRING);

client.connect()
    .then(() => {
        database = client.db(DATABASENAME);
        console.log("Mongo DB Connection Successful");
    })
    .catch(error => {
        console.error('Error connecting to MongoDB', error);
    });

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);


// GET all inventory with search and filter
router.get('/', function(req,res){
        res.redirect('/dashboard');
});

// Displaying Inventory
router.get('/dashboard', function(req, res) {
    try{
        console.log("DB Connected");
        database.collection("Inventory").find({}).toArray((err, result) => {  // Change 'error' to 'err'
            if (err) {
              
                console.error(err);
                return res.status(500);//.render('error', { error: err });
            }
            if (!result) {
                
                res.render('error', { error: "No items found" });
            }
            res.send(result);
        })
    }
    // Fetch all entries in inventory based on the constructed query
    catch(error){
        console.log("error:", error);
        res.send(error);
    }
});

// Get one product from inventory
router.get('/dashboard/:id', function(req, res) {
    try{
        database.collection("Inventory").find({ "_id" : ObjectId(req.params.id) }).toArray((err, result) => {  // Change 'error' to 'err'
            if (err) {
                console.error(err);
                return res.status(500);//.render('error', { error: err });
            }
            if (!result) {
                res.render('error', { error: "No items found" });
            }
            res.send(result);
        })
    }
    // Fetch all entries in inventory based on the constructed query
    catch(error){
        console.log("error:", error);
        res.send(error);
    }
});

// Update one product from inventory
router.put('/dashboard/:id', async (req, res) => {
    try {
        // Get the updated fields and the id
        const { name, description, type, count, price, imgPath, imgDescription } = req.body;

        console.log(req.params.id + ", " + name + ", update");
  
        // Attempt to update the selected product
        let productUpdate = database.collection("Inventory").updateOne({ "_id" : ObjectId(req.params.id) }, { $set: { 
            description: description, name: name, type: type, count: count, price: price,
            image: { path: imgPath, description: imgDescription } } });
        
        // If the attempt is successful, send the update
        console.log("All Updates Completed");
        res.send(productUpdate);
    
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
});

// Add a new game to the list whenever the gamelist has a requested post
router.post('/dashboard', async (req, res) => {
    try {
        // Get the new fields and create the new product object
        const { productId, name, description, type, count, price, imgPath, imgDescription } = req.body;
        const newProduct = {
            productId: productId,
            description: description,
            name: name,
            count: count,
            type: type,
            price: price,
            image:
            {
                path: imgPath,
                description: imgDescription
            }
        };
  
        // Attempt to insert the new product
        let productInsert = await database.collection("Inventory").insertOne(newProduct);

        // If the attempt is successful, send the insert
        console.log("Insert Completed");
        res.send(productInsert);
  
    } catch (err) {
        console.error('Error creating new product:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a game in the list whenever the document with the corresponding id has a requested delete
router.delete('/dashboard/:id', async (req, res) => {
    try {
        // Attempt to delete the selected product
        let productDelete = await database.collection("Inventory").remove({ _id: ObjectId(req.params.id) });
        
        // If the attempt is successful, send the delete
        console.log("Delete Completed");
        res.send(productDelete);
    
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Displaying A User
router.get('/api/users/:username', (req, res) => {
    try{
        //Make this for a logged in user
        //var usrEmail = "john.doe@example.com";
        const userName = req.params.username;
        //console.log("req.params:", req.params);
        
        database.collection("Users").find({username: userName}).toArray((err, result) => {  // Change 'error' to 'err'
            if (err) {
                console.error(err);
                return res.status(500);//.render('error', { error: err });
            }
            if (!result) {
                res.render('error', { error: "No items found" });
            }

            res.send(result[0]);
        })
    }
    // Fetch all entries in inventory based on the constructed query
    catch(error){
        console.log("error:", error);
        res.send(error);
    }
});

router.post('/api/users', async (req, res) => {
    const updatedUserData = req.body;
  
    try {
      const usersCollection = database.collection('Users');
  
      // Update the user data in MongoDB
      await usersCollection.updateOne({ _id: ObjectId(updatedUserData._id) }, { $set: updatedUserData.updatedValues });
      //console.log("Updated the data: ", updatedUserData);
      //res.sendStatus(200);
      //res.redirect('/api/users/')
      res.redirect(`/api/users/${updatedUserData.updatedValues.username}`);

    } catch (error) {

      console.error('Error updating user data:', error);
      res.status(500).send('Internal Server Error');

    } finally {
      console.log("Done!")
    }
  }); 

  router.get('/api/users/:username/cartInfo', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await database.collection("Users").findOne({ username: username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user.cartInfo || []);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update user's cart information
router.put('/api/users/:username/cart', async (req, res) => {
    try {
        const username = req.params.username;
        const cartInfo = req.body.cart; // Assuming cart info is sent in the body
        await database.collection("Users").updateOne({ username: username }, { $set: { cartInfo: cartInfo } });
        res.json({ message: "Cart updated successfully" });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Clear user's cart information
router.delete('/api/users/:username/cart', async (req, res) => {
    try {
        const username = req.params.username;
        await database.collection("Users").updateOne({ username: username }, { $set: { cartInfo: [] } });
        res.json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
