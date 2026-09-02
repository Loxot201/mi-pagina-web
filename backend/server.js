const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();

app.use(cors());
app.use(express.json());


// -------------------------
// VALIDACIONES
// -------------------------

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// -------------------------
// PRUEBA DEL BACKEND
// -------------------------

app.get("/", (req, res) => {
  res.send("Mi backend está funcionando 😎");
});


// -------------------------
// OBTENER CONTACTOS
// GET /contactos
// -------------------------

app.get("/contactos", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM contactos ORDER BY id DESC"
    );

    res.json(resultado.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error obteniendo contactos"
    });
  }
});


// -------------------------
// CREAR CONTACTO
// POST /contactos
// -------------------------

app.post("/contactos", async (req, res) => {
  try {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        mensaje: "Nombre y correo son obligatorios"
      });
    }

    if (!emailValido(email)) {
      return res.status(400).json({
        mensaje: "El correo no es válido"
      });
    }

    const resultado = await pool.query(
      `
        INSERT INTO contactos (nombre, email)
        VALUES ($1, $2)
        RETURNING *
      `,
      [
        nombre.trim(),
        email.trim()
      ]
    );

    res.status(201).json({
      mensaje: "Contacto guardado correctamente",
      contacto: resultado.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error guardando contacto"
    });
  }
});


// -------------------------
// ACTUALIZAR CONTACTO
// PUT /contactos/:id
// -------------------------

app.put("/contactos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        mensaje: "Nombre y correo son obligatorios"
      });
    }

    if (!emailValido(email)) {
      return res.status(400).json({
        mensaje: "El correo no es válido"
      });
    }

    const resultado = await pool.query(
      `
        UPDATE contactos
        SET nombre = $1,
            email = $2
        WHERE id = $3
        RETURNING *
      `,
      [
        nombre.trim(),
        email.trim(),
        id
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Contacto no encontrado"
      });
    }

    res.json({
      mensaje: "Contacto actualizado correctamente",
      contacto: resultado.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error actualizando contacto"
    });
  }
});


// -------------------------
// ELIMINAR CONTACTO
// DELETE /contactos/:id
// -------------------------

app.delete("/contactos/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const resultado = await pool.query(
      `
        DELETE FROM contactos
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Contacto no encontrado"
      });
    }

    res.json({
      mensaje: "Contacto eliminado correctamente"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error eliminando contacto"
    });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en http://localhost:${PORT}`
  );
});