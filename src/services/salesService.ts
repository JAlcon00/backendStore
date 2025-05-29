import { SalesModel } from "../models/salesModels";

export const obtenerVentasUltimos7Dias = async () => {
  return SalesModel.obtenerVentasUltimos7Dias();
};

export const obtenerResumenVentasMensual = async () => {
  return SalesModel.obtenerResumenVentasMensual();
};
