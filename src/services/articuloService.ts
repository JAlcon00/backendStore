import { IArticulo, ArticuloModel } from "../models/articuloModels";

export const crearArticulo = async (articulo: Omit<IArticulo, "_id">): Promise<IArticulo> => {
  return ArticuloModel.crear(articulo);
};

export const obtenerArticulos = async (): Promise<IArticulo[]> => {
  return ArticuloModel.obtenerTodos();
};

export const obtenerArticuloById = async (id: string): Promise<IArticulo | null> => {
  return ArticuloModel.obtenerPorId(id);
};

export const actualizarArticulo = async (id: string, articulo: Partial<IArticulo>): Promise<boolean> => {
  return ArticuloModel.actualizar(id, articulo);
};

export const eliminarArticulo = async (id: string): Promise<boolean> => {
  return ArticuloModel.eliminar(id);
};

export const buscarArticulosPorCategoria = async (categoriaId: string): Promise<IArticulo[]> => {
  return ArticuloModel.buscarPorCategoria(categoriaId);
};

export const buscarArticulosPorNombre = async (nombre: string): Promise<IArticulo[]> => {
  return ArticuloModel.buscarPorNombre(nombre);
};

export const obtenerArticulosDestacados = async (): Promise<IArticulo[]> => {
  // Aquí puedes definir la lógica para obtener los destacados, por ejemplo, por un campo 'destacado: true'
  return ArticuloModel.obtenerDestacados();
};
