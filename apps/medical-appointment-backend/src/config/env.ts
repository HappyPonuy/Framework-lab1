const toInt = (key: string, val: string) => {
    const n = parseInt(val, 10);
    if (isNaN(n)) throw new Error(`Env variable ${key} must be of type 'number', got: '${val}'`);
    return n;
};

export const env = {
    NODE_ENV:           process.env.NODE_ENV,
    JWT_VER:            toInt('JWT_VER', process.env.JWT_VER),
    JWT_EXP:            toInt('JWT_EXP', process.env.JWT_EXP),
    JWT_REFRESH_EXP:    toInt('JWT_REFRESH_EXP', process.env.JWT_REFRESH_EXP),
    JWT_SECRET:         process.env.JWT_SECRET,
    JWT_REFRESH_SALT:   process.env.JWT_REFRESH_SALT,
    DB_USER:            process.env.DB_USER,
    DB_PASS:            process.env.DB_PASS,
} as const;