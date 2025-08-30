const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    product: {
      type: "varchar",
    },
    amount: {
      type: "int",
    },
    userId: {
      type: "int",
    }
  },
});
