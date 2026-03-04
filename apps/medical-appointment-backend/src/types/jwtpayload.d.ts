import type { UserRole } from "./userroles.js";

type JWTPayload = {
    user_id: string,
    user_name: string,
    user_role: UserRole,
    ver: number,
    exp: number,
    iat: number,
    jti: string
};

export { JWTPayload };