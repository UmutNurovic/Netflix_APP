const router = require('express').Router();
const User = require('../models/User');
const verify= require('../verifeToken');
const CryptoJS = require("crypto-js");
// HATAAA VARRRRR
//UPDATE
router.put("/:id", verify, async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
              ).toString();
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                  $set: req.body,
                },
                { new: true }
              );
              res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("You can update only your account")
    }
});
//DELETE
router.delete("/:id", verify, async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        
        try {
            const updatedUser = await User.findByIdAndDelete(req.params.id);
              res.status(200).json("user has been deleted....");
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("You can delete only your account")
    }
});
//GET
router.get("/find/:id", verify, async (req, res) => {
    
        
        try {
            const getdUser = await User.findById(req.params.id);
              res.status(200).json(getdUser);
        } catch (error) {
            res.status(500).json(error)
        }
    
});
router.get("/find/:id", verify, async (req, res) => {
    
        
    try {
        const getdUser = await User.findById(req.params.id);
          res.status(200).json(getdUser);
    } catch (error) {
        res.status(500).json(error)
    }

});
//GET ALL
router.get("/", verify, async (req, res) => {
    const query = req.query.new;
    if(req.user.isAdmin){
        try {
            const users = query ? await User.find().sort({_id:1}).limit(10) : await User.find();
              res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("You are not allowed to see all users !")
    }
});
//GET USER STATS
 
router.get("/stats",async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear()-1);

    const monthsArray = [
        "January",
        "Fabruary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    try {
        const data = await User.aggregate([
            {
                $project:{
                 month:{$month:"$createdAt"}   
                }
            },{
            $group:{
                _id:"$month",
                total:{$sum: 1}
            }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error)   
    }
    
});
module.exports = router;