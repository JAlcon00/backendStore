// backend/src/models/StatsModels.ts

import { getPedidosCollection, getArticulosCollection } from '../config/db.config';

export class statsModel {
  // Obtener estadísticas de ventas
  static async obtenerEstadisticasVentas() {
    console.log('[statsModel] Conectando a la colección: Pedido para obtenerEstadisticasVentas');
    const pedidosCollection = await getPedidosCollection();
    const resultadoAgregacion = await pedidosCollection.aggregate([
      { $match: { estado: 'completado' } },
      {
        $addFields: {
          totalPedido: {
            $multiply: [
              {
                $sum: {
                  $map: {
                    input: '$detalles',
                    as: 'detalle',
                    in: { $multiply: ['$$detalle.cantidad', '$$detalle.precioUnitario'] }
                  }
                }
              },
              100  // Multiplicar por 100 para convertir correctamente a pesos
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalGeneralVentas: { $sum: '$totalPedido' },
          pedidosConsiderados: { $push: { pedidoId: '$_id', totalPedido: '$totalPedido', fecha: '$fechaCreacion' } }
        }
      },
      {
        $project: {
          _id: 0,
          totalGeneralVentas: 1,
          pedidosConsiderados: 1
        }
      }
    ]).toArray();

    if (resultadoAgregacion.length > 0) {
      console.log('[statsModel] Desglose de pedidos para ingresos totales:', JSON.stringify(resultadoAgregacion[0].pedidosConsiderados, null, 2));
      return {
        totalVentas: resultadoAgregacion[0].totalGeneralVentas || 0,
        desglosePedidos: resultadoAgregacion[0].pedidosConsiderados || []
      };
    }
    return { totalVentas: 0, desglosePedidos: [] };
  }

  // Obtener artículos más vendidos
  static async obtenerArticulosMasVendidos() {
    console.log('[statsModel] Iniciando obtenerArticulosMasVendidos');
    const pedidosCollection = await getPedidosCollection();
    const articulosCollection = await getArticulosCollection();
    const articulosCollectionName = articulosCollection.collectionName;
    console.log('[statsModel] Colección de pedidos obtenida para articulosMasVendidos. Colección de artículos:', articulosCollectionName);

    // Pipeline: incluye nombre y cantidad directamente
    const pipeline = [
      { $match: { estado: 'completado' } },
      { $unwind: '$detalles' },
      {
        $lookup: {
          from: articulosCollectionName,
          let: { articuloId: '$detalles.articulo' },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ['$_id', '$$articuloId'] },
              { $eq: ['$activo', true] }
            ] } } },
            { $project: { nombre: 1 } }
          ],
          as: 'articuloInfo'
        }
      },
      { $match: { 'articuloInfo.0': { $exists: true } } },
      { $group: {
          _id: '$detalles.articulo',
          nombre: { $first: { $arrayElemAt: ['$articuloInfo.nombre', 0] } },
          totalVendidos: { $sum: '$detalles.cantidad' }
        }
      },
      { $sort: { totalVendidos: -1 } },
      { $limit: 5 }
    ];

    console.log('[statsModel] Pipeline ejecutado:', JSON.stringify(pipeline, null, 2));
    const articulosMasVendidos = await pedidosCollection.aggregate(pipeline).toArray();
    console.log('[statsModel] Resultado de agregación para articulosMasVendidos (con nombre):', articulosMasVendidos);
    return articulosMasVendidos;
  }
}