const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const authRoute = require('./routes/auth');
const userRoute  = require('./routes/user');
const movieRoute  = require('./routes/movie');
const listsRoute  = require('./routes/lists');
mongoose.connect(process.env.MONGO_DB_CONNECT,
{ useUnifiedTopology: true ,useNewUrlParser: true})
.then(()=>console.log('connection DB'))
.catch((err)=>console.log(err));
app.use(express.json());


app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/movie',movieRoute);
app.use('/api/lists',listsRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));