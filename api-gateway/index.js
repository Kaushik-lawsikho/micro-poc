const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Proxy routes
app.use("/users", createProxyMiddleware({
  target: "http://localhost:4001",
  changeOrigin: true
}));

app.use("/orders", createProxyMiddleware({
  target: "http://localhost:4002",
  changeOrigin: true
}));

app.listen(4000, () => {
  console.log("API Gateway running on http://localhost:4000");
});
