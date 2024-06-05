const AppError = require("../utils/AppError");

class UsersController {
    create(req, res) {
        const { name , email , password } = req.body;

        if (!name) {
            throw new AppError("NOME OBRIGATORIO");
        }

        res.status(201).json( {password, name, email });
}

}
module.exports = UsersController;