import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import { getUsuariosCollection, getCategoriasCollection, connectDB, closeDB } from '../config/db.config';

const SALT_ROUNDS = 12;

async function seed() {
  await connectDB();

  // Usuario admin
  const adminEmail = 'admin@admin.com';
  const adminPassword = 'admin123';
  const usuarios = await getUsuariosCollection();
  const existeAdmin = await usuarios.findOne({ email: adminEmail });
  if (!existeAdmin) {
    const hash = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    await usuarios.insertOne({
      nombre: 'Administrador',
      email: adminEmail,
      password: hash,
      direccion: 'Oficina',
      telefono: '0000000000',
      rol: 'admin',
      fechaCreacion: new Date(),
      activo: true
    });
    console.log('✅ Usuario admin creado');
  } else {
    console.log('ℹ️  Usuario admin ya existe');
  }

  // Categorías de ejemplo
  const categorias = await getCategoriasCollection();
  const count = await categorias.countDocuments();
  if (count === 0) {
    await categorias.insertMany([
      { nombre: 'Electrónica', descripcion: 'Dispositivos y gadgets', activo: true, fechaCreacion: new Date() },
      { nombre: 'Ropa', descripcion: 'Moda y vestimenta', activo: true, fechaCreacion: new Date() },
      { nombre: 'Hogar', descripcion: 'Artículos para el hogar', activo: true, fechaCreacion: new Date() }
    ]);
    console.log('✅ Categorías de ejemplo insertadas');
  } else {
    console.log('ℹ️  Ya existen categorías');
  }

  await closeDB();
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
