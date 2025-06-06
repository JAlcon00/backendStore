import { SalesModel } from "../models/salesModels";

export const obtenerVentasUltimos7Dias = async () => {
  return SalesModel.obtenerVentasUltimos7Dias();
};

export const obtenerResumenVentasMensual = async () => {
  return SalesModel.obtenerResumenVentasMensual();
};

export const crearVentaDesdePedido = async (pedidoId: string) => {
  return SalesModel.crearVentaDesdePedido(pedidoId);
};

export const  getVentasRealizadas = async (usuarioId: string) => {
  return SalesModel.getVentasRealizadas(usuarioId);
}
export const getVentasPorPedido = async (pedidoId: string) => {
  return SalesModel.getVentasPorPedido(pedidoId);
};
export const getVentasPorUsuario = async (usuarioId: string) => {
  return SalesModel.getVentasPorUsuario(usuarioId);
};
export const getVentasPorFecha = async (fecha: string) => {
  return SalesModel.getVentasPorFecha(fecha);
};
export const getVentasPorPedidoYUsuario = async (pedidoId: string, usuarioId: string) => {
  return SalesModel.getVentasPorPedidoYUsuario(pedidoId, usuarioId);
};
