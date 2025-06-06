// backend/src/models/salesModels.ts
import { getPedidosCollection, getSalesCollection } from '../config/db.config';
import { ObjectId } from 'mongodb';

export class SalesModel {
    // Obtener ventas de los últimos 7 días
    static async obtenerVentasUltimos7Dias() {
        const salesCollection = await getSalesCollection();
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 7);
        const ventas = await salesCollection.aggregate([
            {
                $match: {
                    fecha: { $gte: fechaLimite }
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
            { $sort: { date: 1 } }
        ]).toArray();
        return ventas;
    }

    // Obtener resumen de ventas mensual
    static async obtenerResumenVentasMensual() {
        const salesCollection = await getSalesCollection();
        const fechaInicio = new Date();
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
        const resumen = await salesCollection.aggregate([
            {
                $match: {
                    fecha: { $gte: fechaInicio }
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

    // Crear una venta desde un pedido (marcar como completado y guardar en ventas)
    static async crearVentaDesdePedido(pedidoId: string) {
        const pedidosCollection = await getPedidosCollection();
        const salesCollection = await getSalesCollection();
        // Buscar el pedido
        const pedido = await pedidosCollection.findOne({ _id: new ObjectId(pedidoId), activo: true });
        if (!pedido) throw new Error('Pedido no encontrado');
        // Cambiar estado a 'completado' y actualizar fecha
        await pedidosCollection.updateOne(
            { _id: new ObjectId(pedidoId) },
            { $set: { estado: 'completado', fechaActualizacion: new Date() } }
        );
        // Insertar venta en la colección de ventas
        const venta = {
            pedidoId: pedido._id,
            usuario: pedido.usuario,
            total: pedido.total,
            fecha: new Date()
        };
        await salesCollection.insertOne(venta);
        return venta;
    }

    // Obtener ventas realizadas por usuario (todas sus ventas)
    static async getVentasRealizadas(usuarioId: string) {
        const salesCollection = await getSalesCollection();
        const ventas = await salesCollection.find({ usuario: usuarioId }).toArray();
        return ventas.map(venta => ({
            _id: venta._id.toString(),
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fecha,
            pedidoId: venta.pedidoId
        }));
    }

    // Obtener venta por pedido
    static async getVentasPorPedido(pedidoId: string) {
        const salesCollection = await getSalesCollection();
        const venta = await salesCollection.findOne({ pedidoId: new ObjectId(pedidoId) });
        if (!venta) throw new Error('Venta no encontrada');
        return {
            _id: venta._id.toString(),
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fecha,
            pedidoId: venta.pedidoId
        };
    }

    // Obtener ventas por usuario
    static async getVentasPorUsuario(usuarioId: string) {
        const salesCollection = await getSalesCollection();
        const ventas = await salesCollection.find({ usuario: usuarioId }).toArray();
        return ventas.map(venta => ({
            _id: venta._id.toString(),
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fecha,
            pedidoId: venta.pedidoId
        }));
    }

    // Obtener ventas por fecha (YYYY-MM-DD)
    static async getVentasPorFecha(fecha: string) {
        const salesCollection = await getSalesCollection();
        const fechaInicio = new Date(fecha);
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + 1);
        const ventas = await salesCollection.find({
            fecha: { $gte: fechaInicio, $lt: fechaFin }
        }).toArray();
        return ventas.map(venta => ({
            _id: venta._id.toString(),
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fecha,
            pedidoId: venta.pedidoId
        }));
    }

    // Obtener venta por pedido y usuario
    static async getVentasPorPedidoYUsuario(pedidoId: string, usuarioId: string) {
        const salesCollection = await getSalesCollection();
        const venta = await salesCollection.findOne({ pedidoId: new ObjectId(pedidoId), usuario: usuarioId });
        if (!venta) throw new Error('Venta no encontrada');
        return {
            _id: venta._id.toString(),
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fecha,
            pedidoId: venta.pedidoId
        };
    }
}

