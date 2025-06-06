// backend/src/models/salesModels.ts
import { getPedidosCollection } from '../config/db.config';
import { ObjectId } from 'mongodb';

export class SalesModel {
    // Obtener ventas de los últimos 7 días
    static async obtenerVentasUltimos7Dias() {
        console.log('[SalesModel] Conectando a la colección: Pedido');
        const pedidosCollection = await getPedidosCollection();
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 7);

        const ventas = await pedidosCollection.aggregate([
            {
                $match: {
                    fecha: { $gte: fechaLimite },
                    estado: 'completado'
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$fecha' } },
                    amount: { $sum: '$total' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    amount: 1,
                    count: 1
                }
            },
            {
                $sort: { date: 1 }
            }
        ]).toArray();

        return ventas;
    }

    // Obtener resumen de ventas mensual
    static async obtenerResumenVentasMensual() {
        console.log('[SalesModel] Conectando a la colección: Pedido');
        const pedidosCollection = await getPedidosCollection();
        const fechaInicio = new Date();
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);

        const resumen = await pedidosCollection.aggregate([
            {
                $match: {
                    fecha: { $gte: fechaInicio },
                    estado: 'completado'
                }
            },
            {
                $group: {
                    _id: null,
                    totalVentas: { $sum: '$total' },
                    cantidadPedidos: { $sum: 1 },
                    promedioVenta: { $avg: '$total' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalVentas: 1,
                    cantidadPedidos: 1,
                    promedioVenta: { $round: ['$promedioVenta', 2] }
                }
            }
        ]).toArray();

        return resumen[0] || {
            totalVentas: 0,
            cantidadPedidos: 0,
            promedioVenta: 0
        };
    }

    // Crear una venta desde un pedido (marcar como completado y devolver info de venta)
    static async crearVentaDesdePedido(pedidoId: string) {
        const collection = await getPedidosCollection();
        // Buscar el pedido
        const pedido = await collection.findOne({ _id: new ObjectId(pedidoId), activo: true });
        if (!pedido) throw new Error('Pedido no encontrado');
        // Cambiar estado a 'completado' y actualizar fecha
        await collection.updateOne(
            { _id: new ObjectId(pedidoId) },
            { $set: { estado: 'completado', fechaActualizacion: new Date() } }
        );
        // Devolver la info de la venta (puedes personalizar esto)
        return {
            pedidoId: pedido._id,
            usuario: pedido.usuario,
            total: pedido.total,
            fecha: new Date(),
        };
    }

    static async getVentasRealizadas(pedidoIds: string[]) {
        const collection = await getPedidosCollection();
        const ventas = await collection.find({
            _id: { $in: pedidoIds.map(id => new ObjectId(id)) },
            estado: 'completado'
        }).toArray();
        return ventas.map(venta => ({
            _id: venta._id.toString(),
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fechaCreacion
        }));
    }
}