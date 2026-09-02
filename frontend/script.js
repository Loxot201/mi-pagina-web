const form = document.querySelector("#contactForm");

const nombreInput = document.querySelector("#nombre");
const emailInput = document.querySelector("#email");

const respuesta = document.querySelector("#respuesta");

const listaContactos =
  document.querySelector("#listaContactos");

const buscarInput =
  document.querySelector("#buscar");

const submitButton =
  document.querySelector("#submitButton");

const cancelButton =
  document.querySelector("#cancelButton");


let contactos = [];

let contactoEditandoId = null;


// --------------------------------
// CARGAR CONTACTOS
// --------------------------------

async function cargarContactos() {
  try {
    const response = await fetch(
      "http://localhost:3000/contactos"
    );

    if (!response.ok) {
      throw new Error("No se pudieron cargar");
    }

    contactos = await response.json();

    mostrarContactos(contactos);

  } catch (error) {
    console.error(error);

    listaContactos.textContent =
      "No se pudieron cargar los contactos";
  }
}


// --------------------------------
// MOSTRAR CONTACTOS
// --------------------------------

function mostrarContactos(lista) {

  listaContactos.innerHTML = "";

  if (lista.length === 0) {
    listaContactos.textContent =
      "No hay contactos registrados";

    return;
  }

  lista.forEach((contacto) => {

    const card = document.createElement("div");

    card.className = "contacto-card";


    const info = document.createElement("div");


    const nombre = document.createElement("h3");

    nombre.textContent = contacto.nombre;


    const email = document.createElement("p");

    email.textContent = contacto.email;


    info.appendChild(nombre);
    info.appendChild(email);


    const acciones = document.createElement("div");

    acciones.className = "contacto-actions";


    const editarButton =
      document.createElement("button");

    editarButton.textContent = "Editar";

    editarButton.dataset.action = "editar";

    editarButton.dataset.id = contacto.id;


    const eliminarButton =
      document.createElement("button");

    eliminarButton.textContent = "Eliminar";

    eliminarButton.dataset.action = "eliminar";

    eliminarButton.dataset.id = contacto.id;


    acciones.appendChild(editarButton);
    acciones.appendChild(eliminarButton);


    card.appendChild(info);
    card.appendChild(acciones);


    listaContactos.appendChild(card);
  });
}


// --------------------------------
// CREAR / ACTUALIZAR CONTACTO
// --------------------------------

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const nombre = nombreInput.value.trim();

    const email = emailInput.value.trim();


    if (!nombre || !email) {
      respuesta.textContent =
        "Completa todos los campos";

      return;
    }


    try {

      let url =
        "http://localhost:3000/contactos";

      let method = "POST";


      if (contactoEditandoId !== null) {

        url += `/${contactoEditandoId}`;

        method = "PUT";
      }


      const response = await fetch(
        url,
        {
          method: method,

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            nombre,
            email
          })
        }
      );


      const resultado =
        await response.json();


      respuesta.textContent =
        resultado.mensaje;


      if (!response.ok) {
        return;
      }


      cancelarEdicion();

      await cargarContactos();


    } catch (error) {

      console.error(error);

      respuesta.textContent =
        "No se pudo conectar con el servidor";
    }
  }
);


// --------------------------------
// EDITAR / ELIMINAR
// --------------------------------

listaContactos.addEventListener(
  "click",
  async (event) => {

    const button =
      event.target.closest("button");


    if (!button) {
      return;
    }


    const id =
      Number(button.dataset.id);

    const action =
      button.dataset.action;


    // EDITAR

    if (action === "editar") {

      const contacto =
        contactos.find(
          (contacto) =>
            contacto.id === id
        );


      if (!contacto) {
        return;
      }


      contactoEditandoId = id;


      nombreInput.value =
        contacto.nombre;

      emailInput.value =
        contacto.email;


      submitButton.textContent =
        "Actualizar";

      cancelButton.hidden = false;


      form.scrollIntoView({
        behavior: "smooth"
      });

    }


    // ELIMINAR

    if (action === "eliminar") {

      const confirmado =
        confirm(
          "¿Seguro que quieres eliminar este contacto?"
        );


      if (!confirmado) {
        return;
      }


      try {

        const response = await fetch(
          `http://localhost:3000/contactos/${id}`,
          {
            method: "DELETE"
          }
        );


        const resultado =
          await response.json();


        respuesta.textContent =
          resultado.mensaje;


        if (response.ok) {

          await cargarContactos();

        }


      } catch (error) {

        console.error(error);

        respuesta.textContent =
          "Error eliminando contacto";
      }
    }
  }
);


// --------------------------------
// CANCELAR EDICIÓN
// --------------------------------

function cancelarEdicion() {

  contactoEditandoId = null;

  form.reset();

  submitButton.textContent =
    "Guardar";

  cancelButton.hidden = true;
}


cancelButton.addEventListener(
  "click",
  cancelarEdicion
);


// --------------------------------
// BUSCADOR
// --------------------------------

buscarInput.addEventListener(
  "input",
  () => {

    const texto =
      buscarInput.value
        .toLowerCase()
        .trim();


    const filtrados =
      contactos.filter(
        (contacto) => {

          return (
            contacto.nombre
              .toLowerCase()
              .includes(texto)

            ||

            contacto.email
              .toLowerCase()
              .includes(texto)
          );
        }
      );


    mostrarContactos(filtrados);
  }
);


// --------------------------------
// INICIALIZACIÓN
// --------------------------------

cargarContactos();