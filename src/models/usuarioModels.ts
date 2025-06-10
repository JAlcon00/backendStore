import { ObjectId } from 'mongodb';
import { getUsuariosCollection } from '../config/db.config';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; 

// Interfaz para el modelo de Usuario
export interface IUsuario {
    _id?: ObjectId;
    nombre: string;
    password: string;
    rol: 'cliente' | 'admin' | 'superadmin';
}

export class UsuarioModel {
    // Crear un nuevo usuario
    static async crear(usuario: Omit<IUsuario, '_id'>): Promise<IUsuario> {
        console.log('[UsuarioModel] Conectando a la colección: Usuario');
        const collection = await getUsuariosCollection();
        // Verificar si el nombre ya existe
        const existeNombre = await collection.findOne({ nombre: usuario.nombre });
        if (existeNombre) {
            throw new Error('El nombre ya está registrado');
        }
        // Encriptar contraseña
        const hashPassword = await bcrypt.hash(usuario.password, SALT_ROUNDS);
        const nuevoUsuario = {
            nombre: usuario.nombre,
            password: hashPassword,
            rol: usuario.rol,
            activo: true // <-- Asegura que el usuario sea visible en la tabla
        };
        const resultado = await collection.insertOne(nuevoUsuario);
        return { ...nuevoUsuario, _id: resultado.insertedId } as IUsuario;
    }

    // Obtener todos los usuarios activos
    static async obtenerTodos(): Promise<IUsuario[]> {
        console.log('[UsuarioModel] Conectando a la colección: Usuario');
         const collection = await getUsuariosCollection();
         return collection.find<IUsuario>({ activo: true }).toArray();
     }

     // Obtener usuario por ID
     static async obtenerPorId(id: string): Promise<IUsuario | null> {
        console.log('[UsuarioModel] Conectando a la colección: Usuario');
         const collection = await getUsuariosCollection();
         try {
             const usuario = await collection.findOne({ _id: new ObjectId(id), activo: true });
             if (!usuario) return null;
             return usuario as IUsuario;
         } catch (error) {
             throw new Error('ID de usuario inválido');
         }
     }

     // Validar credenciales para login
     static async validarCredenciales(nombre: string, password: string): Promise<IUsuario | null> {
        // Se reutiliza getUsuariosCollection desde obtenerPorEmail
         const usuario = await this.obtenerPorId(nombre);
         if (!usuario) return null;

         const passwordValida = await bcrypt.compare(password, usuario.password);
         return passwordValida ? usuario : null;
     }

     // Actualizar usuario
     static async actualizar(id: string, usuario: Partial<IUsuario>): Promise<boolean> {
        console.log('[UsuarioModel] Conectando a la colección: Usuario');
         const collection = await getUsuariosCollection();
         
         // Si se actualiza el nombre, verificar que no exista
         if (usuario.nombre) {
             const existeNombre = await collection.findOne({
                 nombre: usuario.nombre,
                 _id: { $ne: new ObjectId(id) }
             });
             if (existeNombre) {
                 throw new Error('El nombre ya está registrado');
             }
         }
         
         // Si se actualiza la contraseña, encriptarla
         if (usuario.password) {
             usuario.password = await bcrypt.hash(usuario.password, SALT_ROUNDS);
         }

         const resultado = await collection.updateOne(
             { _id: new ObjectId(id) },
             { $set: usuario }
         );
         return resultado.modifiedCount > 0;
     }

     // Eliminar usuario (borrado lógico)
     static async eliminar(id: string): Promise<boolean> {
        console.log('[UsuarioModel] Conectando a la colección: Usuario');
         const collection = await getUsuariosCollection();
         const resultado = await collection.updateOne(
             { _id: new ObjectId(id) },
             { $set: { activo: false } }
         );
         return resultado.modifiedCount > 0;
     }

     // Cambiar contraseña
     static async cambiarPassword(id: string, nuevaPassword: string): Promise<boolean> {
        console.log('[UsuarioModel] Conectando a la colección: Usuario');
         const hashPassword = await bcrypt.hash(nuevaPassword, SALT_ROUNDS);
         return this.actualizar(id, { password: hashPassword });
     }

     // Buscar usuarios por rol
     static async buscarPorRol(rol: 'cliente' | 'admin'): Promise<IUsuario[]> {
        console.log('[UsuarioModel] Conectando a la colección: Usuario');
         const collection = await getUsuariosCollection();
         return collection.find<IUsuario>({ 
             rol, 
             activo: true 
         }).toArray();
     }

     // Buscar usuarios por nombre
     static async buscarPorNombre(nombre: string): Promise<IUsuario[]> {
        console.log('[UsuarioModel] Conectando a la colección: Usuario');
         const collection = await getUsuariosCollection();
         return collection.find<IUsuario>({
             nombre: { $regex: nombre, $options: 'i' },
             activo: true
         }).toArray();
     }

    static async Login(nombre: string, password: string): Promise<IUsuario | null> {
       console.log('[UsuarioModel] Conectando a la colección: Usuario');
        const collection = await getUsuariosCollection();
        const usuario = await collection.findOne({ nombre, activo: true });
        if (!usuario) return null;

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) return null;

        return usuario as IUsuario;
    }

    static async obtenerUsuariosActivos(): Promise<IUsuario[]> {
        console.log('[UsuarioModel] Conectando a la colección: Usuario');
        const collection = await getUsuariosCollection();
        return collection.find<IUsuario>({ activo: true }).toArray();
    }
    static async obtenerUsuariosInactivos(): Promise<IUsuario[]> {
        console.log('[UsuarioModel] Conectando a la colección: Usuario');
        const collection = await getUsuariosCollection();
        return collection.find<IUsuario>({ activo: false }).toArray();
    }
 }