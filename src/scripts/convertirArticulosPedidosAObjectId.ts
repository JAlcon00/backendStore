// backend/src/scripts/convertirArticulosPedidosAObjectId.ts
import { getPedidosCollection } from '../config/db.config';
import { ObjectId } from 'mongodb';

async function main() {
  const pedidosCollection = await getPedidosCollection();
  const pedidos = await pedidosCollection.find({}).toArray();
  let actualizados = 0;

  for (const pedido of pedidos) {
    let modificado = false;
    if (Array.isArray(pedido.detalles)) {
      for (const detalle of pedido.detalles) {
        if (detalle.articulo && typeof detalle.articulo === 'string' && ObjectId.isValid(detalle.articulo)) {
          detalle.articulo = new ObjectId(detalle.articulo);
          modificado = true;
        }
      }
    }
    if (modificado) {
      await pedidosCollection.updateOne(
        { _id: pedido._id },
        { $set: { detalles: pedido.detalles } }
      );
      actualizados++;
    }
  }
  console.log(`Pedidos actualizados: ${actualizados}`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error al convertir artículos en pedidos:', err);
  process.exit(1);
});
