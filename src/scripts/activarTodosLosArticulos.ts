// backend/src/scripts/activarTodosLosArticulos.ts
import { getArticulosCollection } from '../config/db.config';

async function main() {
  const articulosCollection = await getArticulosCollection();
  const result = await articulosCollection.updateMany(
    { $or: [ { activo: { $exists: false } }, { activo: { $ne: true } } ] },
    { $set: { activo: true } }
  );
  console.log(`Artículos actualizados: ${result.modifiedCount}`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error al actualizar artículos:', err);
  process.exit(1);
});
