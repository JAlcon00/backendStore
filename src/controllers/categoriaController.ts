import { Request, Response, NextFunction } from "express";
import * as categoriaService from "../services/categoriaService";
import { ObjectId } from 'mongodb';

// Crear una nueva categoría
export const crearCategoria = async (req: Request, res: Response) => {
  try {
    const categoria = await categoriaService.crearCategoria(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la categoría", error });
  }
};

// Obtener todas las categorías
export const obtenerCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await categoriaService.obtenerCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las categorías", error });
  }
};

// Obtener una categoría por ID
export const obtenerCategoriaById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoria = await categoriaService.obtenerCategoriaById(req.params.id);
    res.status(200).json(categoria);
  } catch (error) {
    next(error);
  }
};

// Actualizar una categoría por ID
export const actualizarCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validar que el ID es válido
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const categoriaActualizada = await categoriaService.actualizarCategoria(id, req.body);

    if (categoriaActualizada) {
      res.status(200).json(categoriaActualizada);
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar una categoría por ID
export const eliminarCategoria = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await categoriaService.eliminarCategoria(req.params.id);
    res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};
