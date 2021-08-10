const router = require('express').Router();
const Movie = require('../models/Movie');
const verify= require('../verifeToken');


//Create
router.post("/", verify, async (req, res) => {
    if(req.user.isAdmin){
       const newMovie = new Movie(req.body)
       try {
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
       } catch (error) {
           
        res.status(500).json(error)
       }
    }
    else{
        res.status(403).json("You are not allowed")
    }
});
// UPDATE
router.put("/:id", verify, async (req, res) => {
    if(req.user.isAdmin){
       
       try {
        const updateMovie = await Movie.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).json(updateMovie);
       } catch (error) {
           
        res.status(500).json(error)
       }
    }
    else{
        res.status(403).json("You are not allowed")
    }
});
//DELETE
router.delete("/:id", verify, async (req, res) => {
    if(req.user.isAdmin){
       
       try {
        await Movie.findByIdAndRemove(req.params.id)
        res.status(200).json("The movie hass been deleted...");
       } catch (error) {
           
        res.status(500).json(error)
       }
    }
    else{
        res.status(403).json("You are not allowed")
    }
});

//GET
router.get("/:id", verify, async (req, res) => {
    
       
       try {
        const movie = await Movie.findById(req.params.id)
        res.status(200).json(movie);
       } catch (error) {
           
        res.status(500).json(error)
       }
   
});

//GET RANDOM
router.get("/random", verify, async (req, res) => {
    const type = req.query.type;
    let movie;
       
    try {
    if(type ==="series"){
        movie = await Movie.aggregate([
            {$match:{isSeries:false}},
            {$sample:{size:1}},
        ]);
    }
    res.status(200).json(movie);
    } catch (error) {
        
     res.status(500).json(error)
    }

});
module.exports = router;