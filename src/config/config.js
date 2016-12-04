module.exports = {
    "development": {
        "hostname": "db",
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "port": 5432
    }
}