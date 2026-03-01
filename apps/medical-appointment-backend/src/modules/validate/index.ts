import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import { SchemaMismatchError } from "@errors/schemamismatch";

export const validateBody = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) next(new SchemaMismatchError());

    req.body = parsed.data;
    next();
};