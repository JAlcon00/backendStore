import { ObjectId } from "mongodb";
import { getClienteCollection } from '../config/db.config';

// Interfaz para el modelo de Cliente
export interface ICliente {
    _id?: ObjectId;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    rfc?: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    activo: boolean;
}

export class ClienteModel {
    // Crear un nuevo cliente
    static async crear(cliente: Omit<ICliente, '_id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Promise<ICliente> {
        console.log('[ClienteModel] Conectando a la colección: Cliente');
        const collection = await getClienteCollection();
        
        // Verificar si el email ya existe
        const existeEmail = await collection.findOne({ email: cliente.email, activo: true });
        if (existeEmail) {
            throw new Error('El email ya está registrado');
        }

        const nuevoCliente = {
            ...cliente,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date(),
            activo: true
        };
        
        const resultado = await collection.insertOne(nuevoCliente);
        return { ...nuevoCliente, _id: resultado.insertedId } as ICliente;
    }

    // Obtener todos los clientes activos
    static async obtenerTodos(): Promise<ICliente[]> {
        console.log('[ClienteModel] Conectando a la colección: Cliente');
        const collection = await getClienteCollection();
        return collection.find<ICliente>({ activo: true }).toArray();
    }

    // Obtener cliente por ID
    static async obtenerPorId(id: string): Promise<ICliente | null> {
        console.log('[ClienteModel] Conectando a la colección: Cliente');
        const collection = await getClienteCollection();
        try {
            return collection.findOne({ 
                _id: new ObjectId(id), 
                activo: true 
            }) as Promise<ICliente | null>;
        } catch (error) {
            throw new Error('ID de cliente inválido');
        }
    }

    // Actualizar cliente
    static async actualizar(id: string, cliente: Partial<ICliente>): Promise<boolean> {
        console.log('[ClienteModel] Conectando a la colección: Cliente');
        const collection = await getClienteCollection();
        
        // Si se actualiza el email, verificar que no exista
        if (cliente.email) {
            const existeEmail = await collection.findOne({
                email: cliente.email,
                _id: { $ne: new ObjectId(id) },
                activo: true
            });
            if (existeEmail) {
                throw new Error('El email ya está registrado');
            }
        }

        const actualizacion = {
            ...cliente,
            fechaActualizacion: new Date()
        };

        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: actualizacion }
        );
        return resultado.modifiedCount > 0;
    }

    // Eliminar cliente (borrado lógico)
    static async eliminar(id: string): Promise<boolean> {
        console.log('[ClienteModel] Conectando a la colección: Cliente');
        const collection = await getClienteCollection();
        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    activo: false,
                    fechaActualizacion: new Date()
                } 
            }
        );
        return resultado.modifiedCount > 0;
    }

    // Buscar clientes por nombre
    static async buscarPorNombre(nombre: string): Promise<ICliente[]> {
        console.log('[ClienteModel] Conectando a la colección: Cliente');
        const collection = await getClienteCollection();
        return collection.find<ICliente>({
            nombre: { $regex: nombre, $options: 'i' },
            activo: true
        }).toArray();
    }

    // Obtener cliente por email
    static async obtenerPorEmail(email: string): Promise<ICliente | null> {
        console.log('[ClienteModel] Conectando a la colección: Cliente');
        const collection = await getClienteCollection();
        return collection.findOne({ 
            email, 
            activo: true 
        }) as Promise<ICliente | null>;
    }
}