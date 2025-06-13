// backend/src/scripts/listarPedidosCompletados.ts
import { getPedidosCollection, getArticulosCollection } from '../config/db.config';
import { ObjectId } from 'mongodb';

async function main() {
  const pedidosCollection = await getPedidosCollection();
  const articulosCollection = await getArticulosCollection();

  // Buscar pedidos completados
  const pedidos = await pedidosCollection.find({ estado: 'completado' }).toArray();
  console.log(`Pedidos completados encontrados: ${pedidos.length}`);

  for (const pedido of pedidos) {
    console.log(`\nPedido _id: ${pedido._id}`);
    if (!pedido.detalles || pedido.detalles.length === 0) {
      console.log('  Sin detalles de artículos.');
      continue;
    }
    for (const detalle of pedido.detalles) {
      const articuloId = detalle.articulo;
      let articulo = null;
      try {
        articulo = await articulosCollection.findOne({ _id: new ObjectId(articuloId) });
      } catch (e) {
        // Si el id ya es ObjectId, ignora el error
        articulo = await articulosCollection.findOne({ _id: articuloId });
      }
      if (articulo) {
        console.log(`  Artículo referenciado: ${articuloId} | Nombre: ${articulo.nombre}`);
      } else {
        console.log(`  Artículo referenciado: ${articuloId} | NO EXISTE en colección Articulo`);
      }
    }
  }
  process.exit(0);
}

main().catch(err => {
  console.error('Error al listar pedidos completados:', err);
  process.exit(1);
});
