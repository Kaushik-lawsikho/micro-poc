const { DataSource } = require("typeorm");
const User = require("./entity/User");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",   // your pgAdmin username
  password: "baba", // your pgAdmin password
  database: "userdb",
  synchronize: true,
  dropSchema: true,
  entities: [User],
});

module.exports = AppDataSource;
