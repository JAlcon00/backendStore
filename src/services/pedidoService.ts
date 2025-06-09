import { IPedido, PedidoModel } from "../models/pedidoModels";
import { ArticuloModel } from "../models/articuloModels";

export const crearPedido = async (pedido: Omit<IPedido, '_id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Promise<IPedido> => {
  // 1. Crear el pedido
  const nuevoPedido = await PedidoModel.crear(pedido);
  // 2. Restar stock de cada artículo
  if (Array.isArray((pedido as any).articulos || (pedido as any).detalles)) {
    const detalles = ((pedido as any).articulos || (pedido as any).detalles) as Array<{ articulo: string | any, cantidad: number }>;
    for (const det of detalles) {
      const articuloId = typeof det.articulo === 'string' ? det.articulo : det.articulo.toString();
      // Obtener el artículo actual
      const articulo = await ArticuloModel.obtenerPorId(articuloId);
      if (articulo) {
        const nuevoStock = Math.max(0, (articulo.stock || 0) - Math.abs(det.cantidad));
        await ArticuloModel.actualizar(articuloId, { stock: nuevoStock });
      }
    }
  }
  return nuevoPedido;
};

export const obtenerPedidos = async (): Promise<IPedido[]> => {
  return PedidoModel.obtenerTodos();
};

export const obtenerPedidoById = async (id: string): Promise<IPedido | null> => {
  return PedidoModel.obtenerPorId(id);
};

export const obtenerPedidosPorUsuario = async (usuarioId: string): Promise<IPedido[]> => {
  return PedidoModel.obtenerPorUsuario(usuarioId);
};

export const actualizarEstadoPedido = async (id: string, estado: IPedido['estado']): Promise<boolean> => {
  return PedidoModel.actualizarEstado(id, estado);
};

export const cancelarPedido = async (id: string): Promise<boolean> => {
  return PedidoModel.cancelar(id);
};

export const actualizarPedido = async (id: string, pedido: Partial<IPedido>): Promise<boolean> => {
  return PedidoModel.actualizar(id, pedido);
};

export const eliminarPedido = async (id: string): Promise<boolean> => {
  return PedidoModel.eliminar(id);
};

export const getPedidoPorCliente = async (clienteId: string): Promise<IPedido[]> => {
  return PedidoModel.obtenerPorCliente(clienteId);
};

export const getPedidoPorArticulo = async (articuloId: string): Promise<IPedido[]> => {
  return PedidoModel.obtenerPorArticulo(articuloId);
};
