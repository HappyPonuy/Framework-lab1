export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production'; 
            JWT_VER: `${number}`;
            JWT_EXP: `${number}`;
            JWT_REFRESH_EXP: `${number}`;
            JWT_SECRET: string;
            JWT_REFRESH_SALT: string;
            DB_USER: string;
            DB_PASS: string;
        }
    }
}