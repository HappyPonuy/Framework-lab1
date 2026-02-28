import type { Request, Response, NextFunction } from "express";
import AuthService from "./service.js";
import { InvalidCredentialsError } from "@errors/invalidcredentials";
import { InvalidTokenError } from "@errors/invalidtoken";
import { MissingTokenError } from "@errors/missingtoken";

export default class AuthController {
    constructor(private service: AuthService) {}

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body.username || !req.body.password) throw new InvalidCredentialsError();
            const tokens = await this.service.login(
                req.body.username, 
                req.body.password,
                req.get("User-Agent"),
                req.ip
            );
            if (!tokens) throw new InvalidCredentialsError();
            res.status(200).json(tokens);
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body.token) throw new MissingTokenError();
            await this.service.logout(req.body.token);
            res.status(200).send();
        } catch (err) {
            next(err);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body.token) throw new MissingTokenError();
            const newToken = await this.service.refreshToken(req.body.token);
            if (!newToken) throw new InvalidTokenError();
            res.status(200).json({ token: newToken });
        } catch (err) {
            next(err);
        }
    }
};