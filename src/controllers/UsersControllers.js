const { hash, compare } = require("bcryptjs");
const sqliteConnections = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UsersController {
    async create(req, res) {
        const { name, email, password } = req.body;

        const database = await sqliteConnections();
        const checkIfUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
        if (checkIfUserExists) {
            throw new AppError("User already exists");
        }

        const hashedPassword = await hash(password, 8);

        await database.run("INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
            [email, name, hashedPassword]);
        return res.status(201).json();


    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnections();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);
        if (!user) {
            throw new AppError("User invalid");
        }

        const userWithUpadatedEmail = await database.get
            ("SELECT * FROM users WHERE email = (?)", [email]);

        if (userWithUpadatedEmail && userWithUpadatedEmail.id !== user.id) {
            console.log(userWithUpadatedEmail.id);
            console.log(user.id);

            throw new AppError("Email already used");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;




        if (password && !old_password) {
            throw new AppError("Old password needed");
        }

        if (password && old_password) {
            const checkpassword = await compare(old_password, user.password);
            if (!checkpassword) {
                throw new AppError("Password invalid");
            }
            user.password = await hash(password, 8);
        }

        await database.run
            (`UPDATE users SET name = (?), email = (?), password = (?), updated_at = DATETIME('now') WHERE id = (?)`,
                [user.name, user.email, user.password, user_id]);

        return response.status(200).json();

    }

}

module.exports = UsersController;