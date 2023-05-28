import Router from "express";
import UserController from "./UserController.js";

const router = new Router()

router.post('/user', UserController.create)
router.get('/user', UserController.getAll)
router.delete('/user/:user_id', UserController.delUser)


export default router;