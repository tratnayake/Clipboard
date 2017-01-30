module.exports = {
	"JWT_secret": process.env.JWT_secret,
    "development": {
        "hostname": "db",
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "port": 5432
    }
};