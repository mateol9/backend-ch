const socket = io();

let realTimeList = document.querySelector("#realTimeList");

socket.on("products", (products) => {
  let html = products
    .map(
      (product) => `
  <li style="margin-bottom: 20px; border: 2px solid black; padding: 10px; width: 300px; background-color: aquamarine; border-radius: 15px">
    <div>
      Producto: ${product.title}
    </div>
    <div>
      Precio: ${product.price}
    </div>
    <div>
      Stock: ${product.stock}
    </div>
    <div>
      Descripcion: ${product.description}
    </div>
  </li>
  `
    )
    .join("");
  realTimeList.innerHTML = html;
});
