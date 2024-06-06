const { Router } = require("express");
const usersRoutes = Router();

const UsersController = require("../controllers/UsersControllers");
const usersController = new UsersController();

//function myMiddleware(req, res, next) {
//    const {isAdmin} = req.body;
//
//   if(!req.body.isAdmin) {
//        return res.json({ message: "user isnt a admin" });
//    };
//    next();
//}

usersRoutes.post("/" ,usersController.create);
usersRoutes.put("/:id", usersController.update);

module.exports = usersRoutes;