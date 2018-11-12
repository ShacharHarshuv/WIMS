const mongoose = require('mongoose');
const config = require('../config/database');

//Item Schema
const ItemSchema = mongoose.Schema({
    name: String,
    img: String
})

//Export the model
const Item = module.exports = mongoose.model('Item', ItemSchema);

//database functions
module.exports.getItemById = function(id, callback){
    Item.findById(id, callback);
}
module.exports.addItem = function(newItem, callback){
    newItem.save(callback); 
}