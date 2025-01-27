// Importamos las dependencias necesarias
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");


// URI de conexión a MongoDB
const uri = "mongodb+srv://mariarodriguezloz03:A5jdbeXpnva3XW9L@cluster0.colzk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// Creamos una instancia de Express
const app = express();


// Configuramos Swagger para la documentación de la API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Middleware para parsear JSON
app.use(express.json());


// Configuramos Helmet para mejorar la seguridad
app.use(helmet());
app.use(
  helmet({
    hidePoweredBy: true, // Oculta el encabezado X-Powered-By
    frameguard: { action: "deny" }, // Previene que la página sea embebida en un iframe
  })
);


// Puerto en el que se ejecutará el servidor
const port = process.env.PORT || 8080;


// Creamos una instancia de MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


let db, concesionariosCollection;


// Función asíncrona para conectar a la base de datos
async function run() {
  try {
    await client.connect();
    db = client.db("concesionariosDB"); // Seleccionamos la base de datos
    concesionariosCollection = db.collection("concesionarios"); // Seleccionamos la colección


    console.log("Conectado a MongoDB!");
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
  }
}
run().catch(console.dir);


// Rutas de la API


// Obtener todos los concesionarios
app.get("/concesionarios", async (req, res) => {
  try {
    const concesionarios = await concesionariosCollection.find().toArray();
    res.json(concesionarios);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los concesionarios", error: err });
  }
});


// Crear un nuevo concesionario
app.post("/concesionarios", async (req, res) => {
  try {
    const nuevoConcesionario = req.body;
    const result = await concesionariosCollection.insertOne(nuevoConcesionario);
    res.json({ message: "Concesionario creado", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: "Error al crear el concesionario", error: err });
  }
});


// Obtener un concesionario por ID
app.get("/concesionarios/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const concesionario = await concesionariosCollection.findOne({ _id: id });
    if (concesionario) {
      res.json(concesionario);
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el concesionario", error: err });
  }
});


// Actualizar un concesionario por ID
app.put("/concesionarios/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const actualizacion = req.body;
    const result = await concesionariosCollection.updateOne(
      { _id: id },
      { $set: actualizacion }
    );
    if (result.matchedCount > 0) {
      res.json({ message: "Concesionario actualizado" });
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el concesionario", error: err });
  }
});


// Borrar un concesionario por ID
app.delete("/concesionarios/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await concesionariosCollection.deleteOne({ _id: id });
    if (result.deletedCount > 0) {
      res.json({ message: "Concesionario eliminado" });
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar el concesionario", error: err });
  }
});


// Obtener los coches de un concesionario
app.get("/concesionarios/:id/coches", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const concesionario = await concesionariosCollection.findOne({ _id: id });
    if (concesionario) {
      res.json(concesionario.coches || []);
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los coches", error: err });
  }
});


// Añadir un coche a un concesionario
app.post("/concesionarios/:id/coches", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const coche = req.body;
    const result = await concesionariosCollection.updateOne(
      { _id: id },
      { $push: { coches: coche } }
    );
    if (result.matchedCount > 0) {
      res.json({ message: "Coche añadido" });
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al añadir el coche", error: err });
  }
});


// Obtiene el coche cuyo índice sea cocheIndex, del concesionario pasado por id
app.get("/concesionarios/:id/coches/:cocheIndex", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id); // ID del concesionario
    const cocheIndex = parseInt(req.params.cocheIndex); // Índice del coche (convertido a entero)
   
    // Buscar el concesionario por su _id
    const concesionario = await concesionariosCollection.findOne({ _id: id });


    if (concesionario && concesionario.coches[cocheIndex] !== undefined) {
      const coche = concesionario.coches[cocheIndex];
      res.json(coche); // Retornar el coche encontrado
    } else {
      res.status(404).json({ message: "Coche no encontrado en el índice especificado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el coche", error: err });
  }
});


// Actualiza el coche cuyo índice sea cocheIndex, del concesionario pasado por id
app.put("/concesionarios/:id/coches/:cocheIndex", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id); // ID del concesionario
    const cocheIndex = parseInt(req.params.cocheIndex); // Índice del coche (convertido a entero)
    const datosActualizados = req.body; // Datos para actualizar el coche


    // Buscar el concesionario por su _id
    const concesionario = await concesionariosCollection.findOne({ _id: id });


    if (concesionario && concesionario.coches[cocheIndex]) {
      // Actualizar el coche en el índice especificado
      concesionario.coches[cocheIndex] = { ...datosActualizados };
     
      // Actualizar el concesionario en la base de datos
      const result = await concesionariosCollection.updateOne(
        { _id: id },
        { $set: { coches: concesionario.coches } } // Actualizamos el array de coches completo
      );


      if (result.modifiedCount > 0) {
        res.json({ message: "Coche actualizado correctamente" });
      } else {
        res.json({ message: "No se realizaron cambios en el coche" });
      }
    } else {
      res.status(404).json({ message: "Coche no encontrado en el índice especificado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el coche", error: err });
  }
});


// Borra el coche cuyo índice sea cocheIndex, del concesionario pasado por id
app.delete("/concesionarios/:id/coches/:cocheIndex", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id); // ID del concesionario
    const cocheIndex = parseInt(req.params.cocheIndex); // Índice del coche (convertido a entero)


    // Buscar el concesionario por su _id
    const concesionario = await concesionariosCollection.findOne({ _id: id });


    if (concesionario && concesionario.coches[cocheIndex]) {
      // Eliminar el coche del arreglo usando su índice
      concesionario.coches.splice(cocheIndex, 1);


      // Actualizar el concesionario en la base de datos
      const result = await concesionariosCollection.updateOne(
        { _id: id },
        { $set: { coches: concesionario.coches } } // Actualizamos el array de coches completo
      );


      if (result.modifiedCount > 0) {
        res.json({ message: "Coche eliminado correctamente" });
      } else {
        res.json({ message: "El coche no existía en el concesionario" });
      }
    } else {
      res.status(404).json({ message: "Coche no encontrado en el índice especificado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar el coche", error: err });
  }
});


// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});
