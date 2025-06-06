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
  return SalesModel.getVentasRealizadas([usuarioId]);
}
