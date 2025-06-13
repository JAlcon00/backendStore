import { statsModel } from "../models/statsModels";

export const obtenerEstadisticasVentas = async () => {
  return statsModel.obtenerEstadisticasVentas();
};

export const obtenerArticulosMasVendidos = async () => {
  console.log('[statsService] Iniciando obtenerArticulosMasVendidos');
  try {
    const resultado = await statsModel.obtenerArticulosMasVendidos();
    console.log('[statsService] Resultado de statsModel.obtenerArticulosMasVendidos:', resultado);
    return resultado;
  } catch (error) {
    console.error('[statsService] Error en obtenerArticulosMasVendidos:', error);
    throw error; // Re-lanzar el error para que el controlador lo maneje
  }
};
