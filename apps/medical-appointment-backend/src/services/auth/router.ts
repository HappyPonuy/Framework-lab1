import { Router } from "express";
import AuthDatabase from "./database.js";
import AuthRepository from "./repository.js";
import AuthService from "./service.js";
import AuthController from "./controller.js";

const router = Router();
const repo = new AuthRepository(AuthDatabase);
const service = new AuthService(repo);
const controller = new AuthController(service);

router.post("/login", controller.login.bind(controller));
router.post("/logout", controller.logout.bind(controller));
router.post("/refresh", controller.refresh.bind(controller));

export default router;