import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/productsDB.router.js";
import cartsRouter from "./routes/cartsDB.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import ProductManager from "./dao/ProductManagerDB.js";
import mongoose from "mongoose";
import session from "express-session";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import { messagesModel } from "./dao/models/messages.model.js";

const pm = new ProductManager();
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "secretWord",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://mateol9:LQv8S7LuNHfo96Wo@cluster0.l0igvqy.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce",
      ttl: 60,
    }),
  })
);

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
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

const serverHttp = app.listen(PORT, () => {
  console.log(`Aplicacion iniciada en http"//localhost:${PORT}`);
});

const serverSockets = new Server(serverHttp);

serverSockets.on("connection", async (socket) => {
  console.log(`Se han conectado, socket id ${socket.id}`);
  let products = await pm.getProducts();
  socket.emit("products", products.payload);

  socket.on("message", async (message) => {
    await messagesModel.create(message);

    serverSockets.emit("newMessage", message);
  });
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
