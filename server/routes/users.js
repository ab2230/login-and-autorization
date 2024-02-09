const router = require("express").Router();
const { User, validate} = require("../models/user");
const bcrypt = require("bcrypt");
const inappropriateWords = ['word1', 'word2', 'word3', 'word4','word5'];
router.post("/",async (req,res) => {
    try{
        const username = req.body.username; // Assuming the username is sent in the request body

        // Check if the username contains any inappropriate words
        const containsInappropriateWord = inappropriateWords.some(word => username.includes(word));
        // If any inappropriate word is found, reject the request
        if (containsInappropriateWord) {
            return res.status(409).send({message: "User not allowed"})
        }
        const { error } = validate({email:req.body.email,password:req.body.password});
        if (error) {
            return res.status(400).send({message:error.details[0].message})
        }
        const user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(409).send({message: "User with given email already exist"})
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({userName: req.body.username,email:req.body.email, password: hashPassword}).save();
        res.status(201).send({message: "User created successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Internal server error"})
    }
})

module.exports = router;