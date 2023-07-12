module.exports = {
    development: {
        username: 'postgres',
        password: 'dev123',
        database: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        dialect: 'postgres'
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres'
    }
}