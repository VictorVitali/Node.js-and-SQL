require("express-async-errors");

const migrationsRun = require("./database/sqlite/migrations");

const express = require('express');

const routes = require("./routes/index.js");

const AppError = require("./utils/AppError.js");

const app = express();

app.use(express.json());

app.use(routes);

migrationsRun();

app.use((error , req, res, next) => {
    if (error instanceof AppError) {
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