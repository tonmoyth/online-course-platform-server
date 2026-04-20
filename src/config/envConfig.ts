
interface IEnvReturnType {
    PORT: string;
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    JWT_SECRET_KEY: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET_KEY: string;
    JWT_REFRESH_EXPIRES_IN: string;

}

const envConfig = (): IEnvReturnType => {
    const envName = [
        "PORT",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL",
        "DATABASE_HOST",
        "DATABASE_USER",
        "DATABASE_PASSWORD",
        "DATABASE_NAME",
        "JWT_SECRET_KEY",
        "JWT_EXPIRES_IN",
        "JWT_REFRESH_SECRET_KEY",
        "JWT_REFRESH_EXPIRES_IN",

    ];

    envName.forEach((element) => {
        if (!process.env[element]) {
            throw new Error(`Missing environment variable: ${element}`);
        }
    });

    return {
        PORT: process.env.PORT!,
        DATABASE_URL: process.env.DATABASE_URL!,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
        DATABASE_HOST: process.env.DATABASE_HOST!,
        DATABASE_USER: process.env.DATABASE_USER!,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD!,
        DATABASE_NAME: process.env.DATABASE_NAME!,
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
        JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY!,
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN!,
    };
};

export const envVeriables = envConfig();