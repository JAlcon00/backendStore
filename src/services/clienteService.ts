import { ICliente, ClienteModel } from "../models/clienteModels";

export const crearCliente = async (cliente: Omit<ICliente, '_id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Promise<ICliente> => {
  return ClienteModel.crear(cliente);
};

export const obtenerClientes = async (): Promise<ICliente[]> => {
  return ClienteModel.obtenerTodos();
};

export const obtenerClientePorId = async (id: string): Promise<ICliente | null> => {
  return ClienteModel.obtenerPorId(id);
};

export const actualizarCliente = async (id: string, cliente: Partial<ICliente>): Promise<boolean> => {
  return ClienteModel.actualizar(id, cliente);
};

export const eliminarCliente = async (id: string): Promise<boolean> => {
  return ClienteModel.eliminar(id);
};

export const buscarClientesPorNombre = async (nombre: string): Promise<ICliente[]> => {
  return ClienteModel.buscarPorNombre(nombre);
};
