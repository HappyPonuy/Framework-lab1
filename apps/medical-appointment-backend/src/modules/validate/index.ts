import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import { AuthHandler } from "@modules/auth_handler";
import { JWTCheckResult } from "@custom_types/jwtcheckresult";
import { SchemaMismatchError } from "@errors/schemamismatch";
import { MissingAuthHeaderError } from "@errors/missingauthheader";
import { InvalidTokenError } from "@errors/invalidtoken";
import { ExpiredTokenError } from "@errors/expiredtoken";
import { UnauthorizedError } from "@errors/unauthorized";

export const validateBody = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) next(new SchemaMismatchError());

    req.body = parsed.data;
    next();
};

export const validateAuth =  () => (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) return next(new MissingAuthHeaderError());

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) return next(new MissingAuthHeaderError());

    const tokenValidationResult = AuthHandler.checkAccessToken(token);
    if (tokenValidationResult.result === JWTCheckResult.Invalid) {
        return next(new InvalidTokenError());
    } else if (tokenValidationResult.result === JWTCheckResult.Expired) {
        return next(new ExpiredTokenError());
    }

    req.user = tokenValidationResult.data!;
    next();
};

export const validateUserRole = (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new SchemaMismatchError());
    if (!allowedRoles.includes(req.user.user_role)) return next(new UnauthorizedError());
    next();
};