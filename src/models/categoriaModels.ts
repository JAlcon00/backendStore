import { ObjectId } from 'mongodb';
import { getCategoriasCollection } from '../config/db.config';

// Interfaz para el modelo de Categoría
export interface ICategoria {
    _id?: ObjectId;
    nombre: string;
    descripcion: string;
    imagenUrl?: string;
    fechaCreacion: Date;
    activo: boolean;
}

export class CategoriaModel {
    // Crear una nueva categoría
    static async crear(categoria: Omit<ICategoria, '_id'>): Promise<ICategoria> {
        console.log('[CategoriaModel] Conectando a la colección: Categoria');
        const collection = await getCategoriasCollection();
        const resultado = await collection.insertOne({
            ...categoria,
            fechaCreacion: new Date(),
            activo: true
        });
        return { ...categoria, _id: resultado.insertedId } as ICategoria;
    }

    // Obtener todas las categorías
    static async obtenerTodas(): Promise<ICategoria[]> {
        console.log('[CategoriaModel] Conectando a la colección: Categoria');
        const collection = await getCategoriasCollection();
        return (await collection.find({ activo: true }).toArray()) as ICategoria[];
    }

    // Obtener categoría por ID
    static async obtenerPorId(id: string): Promise<ICategoria | null> {
        console.log('[CategoriaModel] Conectando a la colección: Categoria');
        const collection = await getCategoriasCollection();
        const categoria = await collection.findOne({ _id: new ObjectId(id), activo: true });
        if (!categoria) return null;
        return {
            _id: categoria._id,
            nombre: categoria.nombre,
            descripcion: categoria.descripcion,
            imagenUrl: categoria.imagenUrl,
            fechaCreacion: categoria.fechaCreacion,
            activo: categoria.activo
        } as ICategoria;
    }

    // Actualizar categoría
    static async actualizar(id: string, categoria: Partial<ICategoria>): Promise<ICategoria | null> {
        console.log('[CategoriaModel] Conectando a la colección: Categoria');
        const collection = await getCategoriasCollection();
        const resultado = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: categoria },
            { returnDocument: 'after' }
        );
    
        // Verificar que 'resultado' y 'resultado.value' no sean null
        if (resultado && resultado.value) {
            return resultado.value as ICategoria;
        } else {
            return null;
        }
    }

    // Eliminar categoría (borrado lógico)
    static async eliminar(id: string): Promise<boolean> {
        console.log('[CategoriaModel] Conectando a la colección: Categoria');
        const collection = await getCategoriasCollection();
        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { activo: false } }
        );
        return resultado.modifiedCount > 0;
    }

    // Buscar categorías por nombre
    static async buscarPorNombre(nombre: string): Promise<ICategoria[]> {
        console.log('[CategoriaModel] Conectando a la colección: Categoria');
        const collection = await getCategoriasCollection();
        return (await collection.find({
            nombre: { $regex: nombre, $options: 'i' },
            activo: true
        }).toArray()) as ICategoria[];
    }
}