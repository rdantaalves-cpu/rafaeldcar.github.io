const { Sequelize } = require("sequelize");

const host = process.env.MYSQL_HOST || "localhost";
const hostsLocais = new Set(["localhost", "127.0.0.1", "::1"]);
const sslHabilitado = process.env.MYSQL_SSL === "true" || !hostsLocais.has(host);

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || "portfolio_escolar",
  process.env.MYSQL_USER || "root",
  process.env.MYSQL_PASSWORD || "",
  {
    host,
    port: Number(process.env.MYSQL_PORT || 3306),
    dialect: "mysql",
    logging: process.env.MYSQL_LOGGING === "true" ? console.log : false,
    dialectOptions: sslHabilitado
      ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } }
      : {},
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30_000,
      idle: 10_000,
    },
  },
);

module.exports = sequelize;
