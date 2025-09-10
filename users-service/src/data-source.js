const { DataSource } = require("typeorm");
const User = require("./entity/User");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",   // your pgAdmin username
  password: "your_db_password", // your pgAdmin password
  database: "userdb",
  synchronize: true,
  dropSchema: false, // Don't drop schema on restart
  entities: [User],
});

module.exports = AppDataSource;
