import { ICategoria, CategoriaModel } from "../models/categoriaModels";

export const crearCategoria = async (categoria: Omit<ICategoria, "_id">): Promise<ICategoria> => {
  return CategoriaModel.crear(categoria);
};

export const obtenerCategorias = async (): Promise<ICategoria[]> => {
  return CategoriaModel.obtenerTodas();
};

export const obtenerCategoriaById = async (id: string): Promise<ICategoria | null> => {
  return CategoriaModel.obtenerPorId(id);
};

export const actualizarCategoria = async (id: string, categoria: Partial<ICategoria>): Promise<ICategoria | null> => {
  return CategoriaModel.actualizar(id, categoria);
};

export const eliminarCategoria = async (id: string): Promise<boolean> => {
  return CategoriaModel.eliminar(id);
};

export const buscarCategoriasPorNombre = async (nombre: string): Promise<ICategoria[]> => {
  return CategoriaModel.buscarPorNombre(nombre);
};
