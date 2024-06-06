const { hash } = require("bcryptjs");
const sqliteConnections = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UsersController {
    async create(req, res) {
        const { name , email , password } = req.body;

        const database = await sqliteConnections();
        const checkIfUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
        if(checkIfUserExists) {
            throw new AppError("User already exists")
        }

        const hashedPassword = await hash(password, 8);

        await database.run("INSERT INTO users (email, name, password) VALUES (?, ?, ?)", 
        [email, name, hashedPassword]);

        return res.status(201).json();


    }

    async update(req, res) {
        const { name , email, password, old_password } = req.body;
        const { id } = req.params;

        const database = await sqliteConnections();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);
        if (!user){
            throw new AppError("User invalid");
        }

        const userWithUpadatedEmail = await database.get
        ("SELECT * FROM users WHERE email = (?)",[email]);

        if (userWithUpadatedEmail && userWithUpadatedEmail.id !== user.id){
            throw new AppError("Email already used");
        }

        user.name = name;
        user.email = email;

        await database.run
        (`UPDATE users SET name = (?), email = (?), updated_at = (?) WHERE id = (?)`,
        [user.name, user.email, new Date(), id]);


        if(password && !old_password){
            throw new AppError("Old password needed");
        }
        
        const oldpassword = await database.get("SELECT * FROM users WHERE id = (?)", [id]);
        if(old_password != oldpassword.password){
            throw new AppError("Password invalid");
        }

        await database.run
        (`UPDATE users SET password = (?), updated_at = (?) WHERE id = (?)`,
        [password, new Date(), id]);


        return res.status(200).json();

    }

}

module.exports = UsersController;