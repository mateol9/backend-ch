const express = require("express");
const handlebars = require("express-handlebars");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router");
const ProductManager = require("./managers/ProductManager");
const Server = require("socket.io").Server;

const pm = new ProductManager("./src/files/products.json");
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use(express.static("./src/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const serverHttp = app.listen(PORT, () => {
  console.log(`Aplicacion iniciada en http"//localhost:${PORT}`);
});

const serverSockets = new Server(serverHttp);

serverSockets.on("connection", (socket) => {
  console.log(`Se han conectado, socket id ${socket.id}`);
  let products = pm.getProducts();
  socket.emit("products", products);
});
