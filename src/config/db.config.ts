import { MongoClient, Db, Collection, Document } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const {
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_NAME,
  collection_Users,
  collection_Products,
  collection_Orders,
  collection_Categories,
  collection_Cliente,
  collection_Stats,
  collection_Sales
} = process.env;

// Permitir múltiples conexiones a diferentes bases si es necesario
const clients: Record<string, MongoClient> = {};
const dbs: Record<string, Db> = {};

export async function connectDB(dbName: string = DB_NAME!): Promise<Db> {
  if (!clients[dbName] || !dbs[dbName]) {
    const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    clients[dbName] = client;
    dbs[dbName] = db;
    console.log(`[DB] Conectado a ${dbName}`);
  }
  return dbs[dbName];
}

export async function getCollection<T extends Document = Document>(name: string, dbName: string = DB_NAME!): Promise<Collection<T>> {
  const database = await connectDB(dbName);
  return database.collection<T>(name);
}

// Accesos directos a colecciones en la base principal
export const getUsuariosCollection = async () => {
  const col = await getCollection(collection_Users!);
  console.log('[DB] Colección conectada:', collection_Users);
  return col;
};
export const getArticulosCollection = async () => {
  const col = await getCollection(collection_Products!);
  console.log('[DB] Colección conectada:', collection_Products);
  return col;
};
export const getPedidosCollection = async () => {
  const col = await getCollection(collection_Orders!);
  console.log('[DB] Colección conectada:', collection_Orders);
  return col;
};
export const getCategoriasCollection = async () => {
  const col = await getCollection(collection_Categories!);
  console.log('[DB] Colección conectada:', collection_Categories);
  return col;
};
export const getClienteCollection = async () => {
  const col = await getCollection(collection_Cliente!);
  console.log('[DB] Colección conectada:', collection_Cliente);
  return col;
};
export const getStatsCollection = async () => {
  const col = await getCollection(collection_Stats!);
  console.log('[DB] Colección conectada:', collection_Stats);
  return col;
};
export const getSalesCollection = async () => {
  const col = await getCollection(collection_Sales!);
  console.log('[DB] Colección conectada:', collection_Sales);
  return col;
};

export async function closeDB(dbName: string = DB_NAME!) {
  if (clients[dbName]) {
    await clients[dbName].close();
    delete clients[dbName];
    delete dbs[dbName];
    console.log(`[DB] Conexión cerrada para ${dbName}`);
  }
}
