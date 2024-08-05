require("express-async-errors");
require("dotenv/config");

const cors = require("cors");
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError.js");
const uploadConfig = require("./configs/upload");

const express = require('express');

const routes = require("./routes/index.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

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

const port = process.env.PORT || 3333;
app.listen(port, () => console.log('listening on port ' + port));