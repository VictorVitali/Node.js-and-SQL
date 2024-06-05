require("express-async-errors");

const database = require("./database/sqlite");

const express = require('express');

const routes = require("./routes/index.js");

const AppError = require("./utils/AppError.js");

const app = express();

app.use(express.json());

app.use(routes);

database();

app.use((error , req, res, next) => {
    if (error instanceof AppError) {
        console.log("entrei aqui");
        return res.status(error.statusCode).json({ 
            status: "error",
            errormsg: error.message
        }); }

        console.error(error);
        
    return res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
})


const port = 3333;
app.listen(port, () => console.log('listening on port ' + port));