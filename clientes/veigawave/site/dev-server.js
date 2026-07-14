// Servidor local só pra desenvolvimento/teste — não é usado em produção.
// Em produção a Vercel serve os HTMLs estáticos e as functions de /api
// automaticamente, sem esse arquivo.
require("dotenv").config();
const express = require("express");
const trackOrder = require("./api/rastrear-pedido");
const favoritos = require("./api/favoritos");
const carrinho = require("./api/carrinho");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/rastrear-pedido", (req, res) => trackOrder(req, res));
app.all("/api/favoritos", (req, res) => favoritos(req, res));
app.all("/api/carrinho", (req, res) => carrinho(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dev server rodando em http://localhost:${PORT}`));
