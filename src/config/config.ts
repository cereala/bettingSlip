export const config = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 8989,
    URL: process.env.BASE_URL || 'http://localhost:5432',
    POSTGRESQL_URI: 'postgres://postgres:admin@localhost:5432/bettingslip',
    JWT_SECRET: "thisisasecret"
} 

export const dbConfig = {
    database: 'bettingslip',
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432
}

