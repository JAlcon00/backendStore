import { Request, Response, NextFunction } from "express";
import * as articuloService from "../services/articuloService";

// Crear un nuevo artículo
export const crearArticulo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articulo = await articuloService.crearArticulo(req.body);
    res.status(201).json(articulo);
  } catch (error) {
    return next(error);
  }
};

// Obtener todos los artículos
export const obtenerArticulos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articulos = await articuloService.obtenerArticulos();
    res.status(200).json(articulos);
  } catch (error) {
    next(error);
  }
};

export const obtenerArticuloById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articuloId = req.params.id;
    console.log(`[articuloController] Buscando artículo con ID: ${articuloId}`);
    const articulo = await articuloService.obtenerArticuloById(articuloId);
    if (articulo) {
      console.log(`[articuloController] ✓ Artículo encontrado: ${articuloId} - Nombre: "${articulo.nombre}"`);
      res.status(200).json(articulo);
    } else {
      console.log(`[articuloController] ✗ Artículo NO encontrado: ${articuloId}`);
      res.status(404).json({ message: `Artículo con ID ${articuloId} no encontrado` });
    }
  } catch (error) {
    console.error(`[articuloController] Error al buscar artículo con ID ${req.params.id}:`, error);
    next(error);
  }
}
// Actualizar un artículo por ID
export const actualizarArticulo = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    const actualizado = await articuloService.actualizarArticulo(req.params.id, req.body);
    res.status(200).json(actualizado);
  } catch (error) {
    next(error);
  }
}
// Eliminar un artículo por ID
export const eliminarArticulo = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    await articuloService.eliminarArticulo(req.params.id);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

// Buscar artículos por categoría
export const buscarArticulosPorCategoria = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articulos = await articuloService.buscarArticulosPorCategoria(
      req.params.categoriaId
    );
    res.status(200).json(articulos);
  } catch (error) {
    next(error);
  }
};

// Buscar artículos por nombre
export const buscarArticulosPorNombre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articulos = await articuloService.buscarArticulosPorNombre(
      req.query.nombre as string
    );
    res.status(200).json(articulos);
  } catch (error) {
    next(error);
  }
};

// Obtener artículos destacados
export const obtenerArticulosDestacados = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articulos = await articuloService.obtenerArticulosDestacados();
    res.status(200).json(articulos);
  } catch (error) {
    next(error);
  }
};
