const mongoose = require("mongoose");

module.exports = () => {
    try{
        mongoose.connect(process.env.DB);
        console.log('connected to database succesfully')
    } catch (error){    
        console.log(error);
        console.log('could not be connected to the database');
    }
}