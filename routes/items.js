const express = require('express');
const router = express.Router();
const Item = require('../database-models/item')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

//Setting up the uploader (for images requests)
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, global.publicFolder + '/img')
    },
    filename: function(req, file, callback){
        crypto.pseudoRandomBytes(16, function(err, raw){
            if (err) return callback(err);

            callback(null /*error*/,  raw.toString('hex') + path.extname(file.originalname));
        });
    }
})
const upload = multer({storage: storage}); 

router.get('/', (req, res, next) =>{
    //get items from database
    Item.find({}, function (err, result){
        let items = [];
        result.forEach(i => {
            items.push({
                id: i._id,
                name: i.name,
                img: i.img
            });
        })
        res.json({items: items}); 
    })
});

router.post('/add', upload.single('img'), (req, res, next) => {
    
    //input check
    if (!req.body.name || req.body.name == ''){
        res.json({
            success: false,
            err: "The name field is missing"
        });
        return;
    } 
    if (!req.file){
        //TODO later - enable to choose a default picture, not throw an error
        res.json({
            success: false,
            err: "The image field is missing"
        });
        return;
    }

    let newItem = new Item({
        name: req.body.name,
        img: '/img/' + req.file.filename
    });

    Item.addItem(newItem, (err, data) =>{
        if(err){
            res.json({
                success: false,
                err: err
            });
            console.log("Failed to add Item");
        } else {
            res.json({
                success: true,
                item: data
            });
            console.log("Added Item: ");
            console.log(data);
        }
    });
});

module.exports = router;