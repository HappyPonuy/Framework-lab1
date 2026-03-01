import { Router } from "express";
import { validateBody } from "@modules/validate";
import AuthDatabase from "./database.js";
import AuthRepository from "./repository.js";
import AuthService from "./service.js";
import AuthController from "./controller.js";

import { LoginRequestSchema } from "@contracts/auth/login.js";
import { LogoutRequestSchema } from "@contracts/auth/logout.js";
import { RefreshRequestSchema } from "@contracts/auth/refresh.js";

const router = Router();
const repo = new AuthRepository(AuthDatabase);
const service = new AuthService(repo);
const controller = new AuthController(service);

router.post("/login", validateBody(LoginRequestSchema), controller.login.bind(controller));
router.post("/logout", validateBody(LogoutRequestSchema), controller.logout.bind(controller));
router.post("/refresh", validateBody(RefreshRequestSchema), controller.refresh.bind(controller));

export default router;