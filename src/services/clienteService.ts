import { ICliente, ClienteModel } from "../models/clienteModels";

export const crearCliente = async (cliente: Omit<ICliente, '_id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Promise<ICliente> => {
  console.log('[clienteService] crearCliente body:', cliente);
  return ClienteModel.crear(cliente);
};

export const obtenerClientes = async (): Promise<ICliente[]> => {
  const clientes = await ClienteModel.obtenerTodos();
  console.log('[clienteService] obtenerClientes:', clientes.length, 'clientes encontrados');
  return clientes;
};

export const obtenerClientePorId = async (id: string): Promise<ICliente | null> => {
  console.log('[clienteService] obtenerClientePorId:', id);
  return ClienteModel.obtenerPorId(id);
};

export const actualizarCliente = async (id: string, cliente: Partial<ICliente>): Promise<boolean> => {
  console.log('[clienteService] actualizarCliente', id, cliente);
  return ClienteModel.actualizar(id, cliente);
};

export const eliminarCliente = async (id: string): Promise<boolean> => {
  console.log('[clienteService] eliminarCliente', id);
  return ClienteModel.eliminar(id);
};

export const buscarClientesPorNombre = async (nombre: string): Promise<ICliente[]> => {
  console.log('[clienteService] buscarClientesPorNombre', nombre);
  return ClienteModel.buscarPorNombre(nombre);
};
