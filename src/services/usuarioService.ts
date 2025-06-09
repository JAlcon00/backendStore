import { IUsuario, UsuarioModel } from "../models/usuarioModels";

export const crearUsuario = async (usuario: Omit<IUsuario, '_id' | 'fechaCreacion' | 'activo'>): Promise<IUsuario> => {
  return UsuarioModel.crear(usuario);
};

export const obtenerUsuarios = async (): Promise<IUsuario[]> => {
  return UsuarioModel.obtenerTodos();
};

export const obtenerUsuariobyId = async (id: string): Promise<IUsuario | null> => {
  return UsuarioModel.obtenerPorId(id);
};

export const actualizarUsuario = async (id: string, usuario: Partial<IUsuario>): Promise<boolean> => {
  return UsuarioModel.actualizar(id, usuario);
};

export const eliminarUsuario = async (id: string): Promise<boolean> => {
  return UsuarioModel.eliminar(id);
};

export const loginUsuario = async (nombre: string, password: string): Promise<IUsuario | null> => {
  return UsuarioModel.Login(nombre, password);
};

export const cambiarPassword = async (id: string, nuevaPassword: string): Promise<boolean> => {
  return UsuarioModel.cambiarPassword(id, nuevaPassword);
};

export const buscarUsuariosPorRol = async (rol: 'cliente' | 'admin'): Promise<IUsuario[]> => {
  return UsuarioModel.buscarPorRol(rol);
};

export const buscarUsuariosPorNombre = async (nombre: string): Promise<IUsuario[]> => {
  return UsuarioModel.buscarPorNombre(nombre);
};

export const obtenerUsuariosActivos = async (): Promise<IUsuario[]> => {
  return UsuarioModel.obtenerUsuariosActivos();
};

export const obtenerUsuariosInactivos = async (): Promise<IUsuario[]> => {
  return UsuarioModel.obtenerUsuariosInactivos();
};
