type JWTPayload = {
    user_id: string,
    user_name: string,
    user_role: string,
    ver: number,
    exp: number,
    iat: number,
    jti: string
};

export { JWTPayload };