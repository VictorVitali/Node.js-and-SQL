const { Router } = require("express");
const notesRoutes = Router();

const NotesController = require("../controllers/NotesControllers");
const notesController = new NotesController();

//function myMiddleware(req, res, next) {
//    const {isAdmin} = req.body;
//
//   if(!req.body.isAdmin) {
//        return res.json({ message: "user isnt a admin" });
//    };
//    next();
//}

notesRoutes.post("/:user_id", notesController.create);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);

module.exports = notesRoutes;