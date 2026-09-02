const pool = require("../database");


async function getAllContacts() {
  const result = await pool.query(
    `
      SELECT *
      FROM contactos
      ORDER BY id DESC
    `
  );

  return result.rows;
}


async function createContact(nombre, email) {
  const result = await pool.query(
    `
      INSERT INTO contactos (nombre, email)
      VALUES ($1, $2)
      RETURNING *
    `,
    [nombre, email]
  );

  return result.rows[0];
}


async function updateContact(id, nombre, email) {
  const result = await pool.query(
    `
      UPDATE contactos
      SET nombre = $1,
          email = $2
      WHERE id = $3
      RETURNING *
    `,
    [nombre, email, id]
  );

  return result.rows[0];
}


async function deleteContact(id) {
  const result = await pool.query(
    `
      DELETE FROM contactos
      WHERE id = $1
      RETURNING *
    `,
    [id]
  );

  return result.rows[0];
}


module.exports = {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact
};