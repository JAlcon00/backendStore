import { statsModel } from "../models/statsModels";

export const obtenerEstadisticasVentas = async () => {
  const estadisticas = await statsModel.obtenerEstadisticasVentas();
  // Asegurarse de que el frontend reciba un objeto con totalVentas
  // y opcionalmente el desglose si se quiere usar en el frontend.
  if (typeof estadisticas === 'number') {
    // Caso antiguo donde solo se devolvía el número
    return { totalVentas: estadisticas, desglosePedidos: [] };
  }
  // Caso nuevo donde se devuelve un objeto con totalVentas y desglosePedidos
  return estadisticas; 
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
