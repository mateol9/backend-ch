import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/productsDB.router.js";
import cartsRouter from "./routes/cartsDB.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./dao/ProductManagerDB.js";
import mongoose from "mongoose";
import { Server } from "socket.io";

const pm = new ProductManager();
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
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

serverSockets.on("connection", async (socket) => {
  console.log(`Se han conectado, socket id ${socket.id}`);
  let products = await pm.getProducts();
  socket.emit("products", products.payload);
});

const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mateol9:LQv8S7LuNHfo96Wo@cluster0.l0igvqy.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce"
    );
    console.log("Conexion correcta");
  } catch (error) {
    console.log(error);
  }
};

connect();

serverSockets.on("error", (error) => console.log(error));
