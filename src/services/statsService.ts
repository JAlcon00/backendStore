import { statsModel } from "../models/statsModels";

export const obtenerEstadisticasVentas = async () => {
  return statsModel.obtenerEstadisticasVentas();
};

export const obtenerArticulosMasVendidos = async () => {
  return statsModel.obtenerArticulosMasVendidos();
};
