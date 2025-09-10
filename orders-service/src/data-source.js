const { DataSource } = require("typeorm");
const Order = require("./entity/Order");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",   // your pgAdmin username
  password: "your_db_password",
  database: "orderdb",
  synchronize: true,
  dropSchema: false,
  entities: [Order],
});

module.exports = AppDataSource;
