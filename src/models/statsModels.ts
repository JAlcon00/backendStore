// backend/src/models/StatsModels.ts

import { getPedidosCollection, getArticulosCollection } from '../config/db.config';

export class statsModel {
  // Obtener estadísticas de ventas
  static async obtenerEstadisticasVentas() {
    console.log('[statsModel] Conectando a la colección: Pedido');
    const pedidosCollection = await getPedidosCollection();
    const ventas = await pedidosCollection.aggregate([
      { $match: { estado: 'completado' } },
      { $group: { _id: null, totalVentas: { $sum: '$total' } } }
    ]).toArray();
    return ventas[0]?.totalVentas || 0;
  }

  // Obtener artículos más vendidos
  static async obtenerArticulosMasVendidos() {
    console.log('[statsModel] Conectando a la colección: Pedido');
    const pedidosCollection = await getPedidosCollection();
    const articulosMasVendidos = await pedidosCollection.aggregate([
      { $unwind: '$articulos' },
      { $group: { _id: '$articulos.articuloId', totalVendidos: { $sum: '$articulos.cantidad' } } },
      { $sort: { totalVendidos: -1 } },
      { $limit: 5 }
    ]).toArray();
    return articulosMasVendidos;
  }
}