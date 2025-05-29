import { IPedido, PedidoModel } from "../models/pedidoModels";

export const crearPedido = async (pedido: Omit<IPedido, '_id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Promise<IPedido> => {
  return PedidoModel.crear(pedido);
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
