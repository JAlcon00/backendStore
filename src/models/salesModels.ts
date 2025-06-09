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
        // Calcular el total si no existe
        let total = pedido.total;
        if (typeof total !== 'number') {
            if (Array.isArray(pedido.detalles)) {
                total = pedido.detalles.reduce((acc, det) => {
                    if (typeof det.subtotal === 'number') return acc + det.subtotal;
                    if (typeof det.cantidad === 'number' && typeof det.precioUnitario === 'number') {
                        return acc + det.cantidad * det.precioUnitario;
                    }
                    return acc;
                }, 0);
            } else {
                total = 0;
            }
        }
        // Cambiar estado a 'completado' y actualizar fecha
        await pedidosCollection.updateOne(
            { _id: new ObjectId(pedidoId) },
            { $set: { estado: 'completado', fechaActualizacion: new Date() } }
        );
        // Insertar venta en la colección de ventas
        const venta = {
            pedidoId: pedido._id,
            usuario: pedido.usuario,
            total,
            fecha: new Date()
        };
        await salesCollection.insertOne(venta);
        return venta;
    }

    // Obtener ventas realizadas por usuario (todas sus ventas)
    static async getVentasRealizadas(usuarioId: string) {
        const salesCollection = await getSalesCollection();
        // Aseguramos que usuarioId sea string (por si viene como ObjectId)
        const query = { usuario: usuarioId };
        const ventas = await salesCollection.find(query).toArray();
        return ventas.map(venta => ({
            _id: venta._id?.toString?.() ?? venta._id,
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fecha,
            pedidoId: venta.pedidoId
        }));
    }

    // Obtener venta por pedido
    static async getVentasPorPedido(pedidoId: string) {
        const salesCollection = await getSalesCollection();
        // Aseguramos que pedidoId sea ObjectId
        let objId;
        try {
            objId = new ObjectId(pedidoId);
        } catch {
            throw new Error('ID de pedido inválido');
        }
        const venta = await salesCollection.findOne({ pedidoId: objId });
        if (!venta) throw new Error('Venta no encontrada');
        return {
            _id: venta._id?.toString?.() ?? venta._id,
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fecha,
            pedidoId: venta.pedidoId
        };
    }

    // Obtener ventas por usuario
    static async getVentasPorUsuario(usuarioId: string) {
        const salesCollection = await getSalesCollection();
        const query = { usuario: usuarioId };
        const ventas = await salesCollection.find(query).toArray();
        return ventas.map(venta => ({
            _id: venta._id?.toString?.() ?? venta._id,
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fecha,
            pedidoId: venta.pedidoId
        }));
    }

    // Obtener ventas por fecha (YYYY-MM-DD)
    static async getVentasPorFecha(fecha: string) {
        const salesCollection = await getSalesCollection();
        // Validar fecha y obtener rango del día
        const fechaInicio = new Date(fecha);
        if (isNaN(fechaInicio.getTime())) throw new Error('Fecha inválida');
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + 1);
        const ventas = await salesCollection.find({
            fecha: { $gte: fechaInicio, $lt: fechaFin }
        }).toArray();
        return ventas.map(venta => ({
            _id: venta._id?.toString?.() ?? venta._id,
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fecha,
            pedidoId: venta.pedidoId
        }));
    }

    // Obtener venta por pedido y usuario
    static async getVentasPorPedidoYUsuario(pedidoId: string, usuarioId: string) {
        const salesCollection = await getSalesCollection();
        let objId;
        try {
            objId = new ObjectId(pedidoId);
        } catch {
            throw new Error('ID de pedido inválido');
        }
        const venta = await salesCollection.findOne({ pedidoId: objId, usuario: usuarioId });
        if (!venta) throw new Error('Venta no encontrada');
        return {
            _id: venta._id?.toString?.() ?? venta._id,
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fecha,
            pedidoId: venta.pedidoId
        };
    }

    // Obtener todas las ventas
    static async getAllVentas() {
        const salesCollection = await getSalesCollection();
        const ventas = await salesCollection.find({}).toArray();
        return ventas.map(venta => ({
            _id: venta._id?.toString?.() ?? venta._id,
            usuario: venta.usuario,
            total: venta.total,
            fecha: venta.fecha,
            pedidoId: venta.pedidoId
        }));
    }

    // Eliminar venta por pedido
    static async borrarVentaPorPedido(pedidoId: string) {
        const salesCollection = await getSalesCollection();
        let objId;
        try {
            objId = new ObjectId(pedidoId);
        } catch {
            throw new Error('ID de pedido inválido');
        }
        const result = await salesCollection.deleteOne({ pedidoId: objId });
        return result.deletedCount > 0;
    }
}

