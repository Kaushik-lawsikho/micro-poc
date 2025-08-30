const { DataSource } = require("typeorm");
const Order = require("./entity/Order");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",   // your pgAdmin username
  password: "baba",
  database: "orderdb",
  synchronize: true,
  dropSchema: true,
  entities: [Order],
});

module.exports = AppDataSource;
