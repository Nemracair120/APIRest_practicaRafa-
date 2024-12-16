// Importar el módulo express
const express = require('express');
const app = express();

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Crear un puerto donde estará corriendo el servidor
const PORT = process.env.PORT || 3000;

// Estructura de datos (inicialmente en memoria)
let concesionarios = [
  {
    id: 1,
    nombre: "Concesionario A",
    direccion: "Calle Falsa 123",
    coches: [
      { id: 1, modelo: "Renault Clio", cv: 75, precio: 8000 },
      { id: 2, modelo: "Nissan Skyline R34", cv: 280, precio: 30000 },
    ],
  },
  {
    id: 2,
    nombre: "Concesionario B",
    direccion: "Avenida Siempre Viva 456",
    coches: [
      { id: 1, modelo: "Ford Fiesta", cv: 90, precio: 10000 },
      { id: 2, modelo: "Toyota Corolla", cv: 130, precio: 12000 },
    ],
  },
];


// Crear el servidor y escuchar en el puerto
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/concesionarios', (req, res) => {
    res.json(concesionarios);
  });


  app.post('/concesionarios', (req, res) => {
    const { nombre, direccion } = req.body;
    const nuevoConcesionario = {
      id: concesionarios.length + 1, // Generar un ID único
      nombre,
      direccion,
      coches: [] // Inicializamos el listado de coches vacío
    };
    concesionarios.push(nuevoConcesionario);
    res.status(201).json(nuevoConcesionario); // Enviar respuesta con el concesionario creado
  });

  
  app.get('/concesionarios/:id', (req, res) => {
    const { id } = req.params;
    const concesionario = concesionarios.find(c => c.id === parseInt(id));
  
    if (!concesionario) {
      return res.status(404).json({ error: 'Concesionario no encontrado' });
    }
    
    res.json(concesionario);
  });



  app.put('/concesionarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, direccion } = req.body;
    let concesionario = concesionarios.find(c => c.id === parseInt(id));
  
    if (!concesionario) {
      return res.status(404).json({ error: 'Concesionario no encontrado' });
    }
  
    // Actualizar los campos
    concesionario.nombre = nombre || concesionario.nombre;
    concesionario.direccion = direccion || concesionario.direccion;
  
    res.json(concesionario);
  });

  



  app.delete('/concesionarios/:id', (req, res) => {
    const { id } = req.params;
    const index = concesionarios.findIndex(c => c.id === parseInt(id));
  
    if (index === -1) {
      return res.status(404).json({ error: 'Concesionario no encontrado' });
    }
  
    // Eliminar concesionario
    concesionarios.splice(index, 1);
    res.status(204).send(); // Respuesta sin cuerpo
  });

  


  app.get('/concesionarios/:id/coches', (req, res) => {
    const { id } = req.params;
    const concesionario = concesionarios.find(c => c.id === parseInt(id));
  
    if (!concesionario) {
      return res.status(404).json({ error: 'Concesionario no encontrado' });
    }
  
    res.json(concesionario.coches);
  });

  


  app.post('/concesionarios/:id/coches', (req, res) => {
    const { id } = req.params;
    const { modelo, cv, precio } = req.body;
    const concesionario = concesionarios.find(c => c.id === parseInt(id));
  
    if (!concesionario) {
      return res.status(404).json({ error: 'Concesionario no encontrado' });
    }
  
    const nuevoCoche = { id: concesionario.coches.length + 1, modelo, cv, precio };
    concesionario.coches.push(nuevoCoche);
  
    res.status(201).json(nuevoCoche);
  });
  


  
  app.get('/concesionarios/:id/coches/:cocheId', (req, res) => {
    const { id, cocheId } = req.params;
    const concesionario = concesionarios.find(c => c.id === parseInt(id));
  
    if (!concesionario) {
      return res.status(404).json({ error: 'Concesionario no encontrado' });
    }
  
    const coche = concesionario.coches.find(c => c.id === parseInt(cocheId));
  
    if (!coche) {
      return res.status(404).json({ error: 'Coche no encontrado' });
    }
  
    res.json(coche);
  });

  
  app.put('/concesionarios/:id/coches/:cocheId', (req, res) => {
    const { id, cocheId } = req.params;
    const { modelo, cv, precio } = req.body;
    const concesionario = concesionarios.find(c => c.id === parseInt(id));
  
    if (!concesionario) {
      return res.status(404).json({ error: 'Concesionario no encontrado' });
    }
  
    const coche = concesionario.coches.find(c => c.id === parseInt(cocheId));
  
    if (!coche) {
      return res.status(404).json({ error: 'Coche no encontrado' });
    }
  
    coche.modelo = modelo || coche.modelo;
    coche.cv = cv || coche.cv;
    coche.precio = precio || coche.precio;
  
    res.json(coche);
  });
  


  app.delete('/concesionarios/:id/coches/:cocheId', (req, res) => {
    const { id, cocheId } = req.params;
    const concesionario = concesionarios.find(c => c.id === parseInt(id));
  
    if (!concesionario) {
      return res.status(404).json({ error: 'Concesionario no encontrado' });
    }
  
    const index = concesionario.coches.findIndex(c => c.id === parseInt(cocheId));
  
    if (index === -1) {
      return res.status(404).json({ error: 'Coche no encontrado' });
    }
  
    concesionario.coches.splice(index, 1);
    res.status(204).send(); // Respuesta sin cuerpo
  });
  
  




