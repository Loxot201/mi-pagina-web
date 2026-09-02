const contactService = require("../services/contactService");


function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


async function getContacts(req, res) {
  try {
    const contacts =
      await contactService.getAllContacts();

    res.json(contacts);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error obteniendo contactos"
    });
  }
}


async function createContact(req, res) {
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


    const contact =
      await contactService.createContact(
        nombre.trim(),
        email.trim()
      );


    res.status(201).json({
      mensaje: "Contacto guardado correctamente",
      contacto: contact
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error guardando contacto"
    });
  }
}


async function updateContact(req, res) {
  try {
    const id = Number(req.params.id);

    const { nombre, email } = req.body;


    if (!Number.isInteger(id)) {
      return res.status(400).json({
        mensaje: "ID inválido"
      });
    }


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


    const contact =
      await contactService.updateContact(
        id,
        nombre.trim(),
        email.trim()
      );


    if (!contact) {
      return res.status(404).json({
        mensaje: "Contacto no encontrado"
      });
    }


    res.json({
      mensaje: "Contacto actualizado correctamente",
      contacto: contact
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error actualizando contacto"
    });
  }
}


async function deleteContact(req, res) {
  try {
    const id = Number(req.params.id);


    if (!Number.isInteger(id)) {
      return res.status(400).json({
        mensaje: "ID inválido"
      });
    }


    const contact =
      await contactService.deleteContact(id);


    if (!contact) {
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
}


module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact
};