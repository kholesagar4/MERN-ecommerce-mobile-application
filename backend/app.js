const express = require('express');
const app = express();
const authJwt = require('./helpers/jwt');
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require("dotenv/config");
const API = process.env.API_URL;
const errorHandler =require('./helpers/error-handler');
app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads',express.static(__dirname+'/public/uploads'))
app.use(errorHandler)

const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");


//Routes
app.use(`${API}/categories`, categoriesRoutes);
app.use(`${API}/products`, productsRoutes);
app.use(`${API}/users`, usersRoutes);
app.use(`${API}/orders`, ordersRoutes);

mongoose.connect(process.env.CONNECTION_STRING, {  useFindAndModify: false,useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.DBName }).then(() => {
    console.log('Database connection is ready...');
}).catch((err) => {
    console.log(err);
})
//Development
// app.listen(3000, () => {
//     console.log(API);
//     console.log("server running on 3000 port");
// })

//Production 
var server= app.listen(process.env.PORT||3000,function(){
    var port =server.address().port;
    console.log("Express is working on port "+port);
})
