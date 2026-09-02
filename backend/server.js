const express = require("express");
const cors = require("cors");

const contactRoutes =
  require("./routes/contactRoutes");


const app = express();


app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Mi backend está funcionando 😎");
});


app.use("/contactos", contactRoutes);


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en http://localhost:${PORT}`
  );
});