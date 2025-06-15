import { connectDB, closeDB } from '../config/db.config';
import { UsuarioModel } from '../models/usuarioModels';
import { ClienteModel } from '../models/clienteModels';
import bcrypt from 'bcrypt';

/**
 * Script de pruebas para validar registro y login con encriptación bcrypt
 * Ejecutar con: ts-node src/scripts/testAuth.ts
 */

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const log = (message: string, color: string = colors.reset) => {
    console.log(`${color}${message}${colors.reset}`);
};

const testUsuarios = async () => {
    log('\n=== PRUEBAS DE USUARIOS ===', colors.cyan);
    
    try {
        // 1. Crear usuario de prueba
        log('\n1. Creando usuario de prueba...', colors.yellow);
        const testUser = {
            nombre: 'testuser_' + Date.now(),
            password: 'password123',
            rol: 'admin' as const,
            email: `testuser_${Date.now()}@example.com` // Agregar email único
        };
        
        const nuevoUsuario = await UsuarioModel.crear(testUser);
        log(`✅ Usuario creado: ${nuevoUsuario.nombre}`, colors.green);
        
        // 2. Verificar que la contraseña está encriptada
        log('\n2. Verificando encriptación...', colors.yellow);
        log(`📝 Contraseña original: ${testUser.password}`, colors.blue);
        log(`🔒 Contraseña encriptada: ${nuevoUsuario.password}`, colors.blue);
        
        const isEncrypted = nuevoUsuario.password !== testUser.password;
        log(`${isEncrypted ? '✅' : '❌'} Contraseña ${isEncrypted ? 'SÍ' : 'NO'} está encriptada`, 
            isEncrypted ? colors.green : colors.red);
        
        // 3. Verificar que bcrypt puede validar la contraseña
        log('\n3. Validando contraseña con bcrypt...', colors.yellow);
        const isValidBcrypt = await bcrypt.compare(testUser.password, nuevoUsuario.password);
        log(`${isValidBcrypt ? '✅' : '❌'} bcrypt.compare: ${isValidBcrypt ? 'VÁLIDA' : 'INVÁLIDA'}`, 
            isValidBcrypt ? colors.green : colors.red);
        
        // 4. Probar login con contraseña correcta
        log('\n4. Probando login con contraseña correcta...', colors.yellow);
        const loginCorrecto = await UsuarioModel.Login(testUser.nombre, testUser.password);
        log(`${loginCorrecto ? '✅' : '❌'} Login correcto: ${loginCorrecto ? 'EXITOSO' : 'FALLÓ'}`, 
            loginCorrecto ? colors.green : colors.red);
        
        if (loginCorrecto) {
            log(`👤 Usuario logueado: ${loginCorrecto.nombre} (${loginCorrecto.rol})`, colors.blue);
        }
        
        // 5. Probar login con contraseña incorrecta
        log('\n5. Probando login con contraseña incorrecta...', colors.yellow);
        const loginIncorrecto = await UsuarioModel.Login(testUser.nombre, 'contraseña_incorrecta');
        log(`${!loginIncorrecto ? '✅' : '❌'} Login incorrecto: ${!loginIncorrecto ? 'RECHAZADO CORRECTAMENTE' : 'ACEPTADO INCORRECTAMENTE'}`, 
            !loginIncorrecto ? colors.green : colors.red);
        
        // 6. Limpiar - eliminar usuario de prueba
        log('\n6. Limpiando usuario de prueba...', colors.yellow);
        if (nuevoUsuario._id) {
            await UsuarioModel.eliminar(nuevoUsuario._id.toString());
            log('🗑️ Usuario de prueba eliminado', colors.green);
        }
        
    } catch (error) {
        log(`❌ Error en pruebas de usuarios: ${error}`, colors.red);
        console.error(error);
    }
};

const testClientes = async () => {
    log('\n=== PRUEBAS DE CLIENTES ===', colors.cyan);
    
    try {
        // 1. Registrar cliente de prueba
        log('\n1. Registrando cliente de prueba...', colors.yellow);
        const testCliente = {
            nombre: 'TestCliente',
            apellido: 'Prueba',
            email: `test_${Date.now()}@example.com`,
            password: 'password123',
            telefono: '1234567890',
            direccion: 'Calle Test 123',
            rfc: 'TEST123456'
        };
        
        const nuevoCliente = await ClienteModel.registrar(testCliente);
        log(`✅ Cliente registrado: ${nuevoCliente.nombre} ${nuevoCliente.apellido}`, colors.green);
        
        // 2. Verificar que la contraseña está encriptada
        log('\n2. Verificando encriptación...', colors.yellow);
        log(`📝 Contraseña original: ${testCliente.password}`, colors.blue);
        log(`🔒 Contraseña encriptada: ${nuevoCliente.password}`, colors.blue);
        
        const isEncrypted = nuevoCliente.password !== testCliente.password;
        log(`${isEncrypted ? '✅' : '❌'} Contraseña ${isEncrypted ? 'SÍ' : 'NO'} está encriptada`, 
            isEncrypted ? colors.green : colors.red);
        
        // 3. Verificar que bcrypt puede validar la contraseña
        log('\n3. Validando contraseña con bcrypt...', colors.yellow);
        if (nuevoCliente.password) {
            const isValidBcrypt = await bcrypt.compare(testCliente.password, nuevoCliente.password);
            log(`${isValidBcrypt ? '✅' : '❌'} bcrypt.compare: ${isValidBcrypt ? 'VÁLIDA' : 'INVÁLIDA'}`, 
                isValidBcrypt ? colors.green : colors.red);
        } else {
            log('❌ No se pudo obtener la contraseña encriptada', colors.red);
        }
        
        // 4. Probar login con credenciales correctas
        log('\n4. Probando login con credenciales correctas...', colors.yellow);
        const loginCorrecto = await ClienteModel.login(testCliente.email, testCliente.password);
        log(`${loginCorrecto ? '✅' : '❌'} Login correcto: ${loginCorrecto ? 'EXITOSO' : 'FALLÓ'}`, 
            loginCorrecto ? colors.green : colors.red);
        
        if (loginCorrecto) {
            log(`👤 Cliente logueado: ${loginCorrecto.nombre} ${loginCorrecto.apellido} (${loginCorrecto.email})`, colors.blue);
        }
        
        // 5. Probar login con contraseña incorrecta
        log('\n5. Probando login con contraseña incorrecta...', colors.yellow);
        const loginIncorrecto = await ClienteModel.login(testCliente.email, 'contraseña_incorrecta');
        log(`${!loginIncorrecto ? '✅' : '❌'} Login incorrecto: ${!loginIncorrecto ? 'RECHAZADO CORRECTAMENTE' : 'ACEPTADO INCORRECTAMENTE'}`, 
            !loginIncorrecto ? colors.green : colors.red);
        
        // 6. Probar login con email inexistente
        log('\n6. Probando login con email inexistente...', colors.yellow);
        const loginEmailInexistente = await ClienteModel.login('email_inexistente@test.com', testCliente.password);
        log(`${!loginEmailInexistente ? '✅' : '❌'} Email inexistente: ${!loginEmailInexistente ? 'RECHAZADO CORRECTAMENTE' : 'ACEPTADO INCORRECTAMENTE'}`, 
            !loginEmailInexistente ? colors.green : colors.red);
        
        // 7. Probar registro con email duplicado
        log('\n7. Probando registro con email duplicado...', colors.yellow);
        try {
            await ClienteModel.registrar(testCliente);
            log('❌ Registro duplicado: ACEPTADO INCORRECTAMENTE', colors.red);
        } catch (error) {
            const errorMessage = (error as Error).message;
            const isDuplicateError = errorMessage.includes('ya está registrado');
            log(`${isDuplicateError ? '✅' : '❌'} Registro duplicado: ${isDuplicateError ? 'RECHAZADO CORRECTAMENTE' : 'ERROR INESPERADO'}`, 
                isDuplicateError ? colors.green : colors.red);
            if (!isDuplicateError) {
                log(`Error: ${errorMessage}`, colors.red);
            }
        }
        
        // 8. Limpiar - eliminar cliente de prueba
        log('\n8. Limpiando cliente de prueba...', colors.yellow);
        if (nuevoCliente._id) {
            await ClienteModel.eliminar(nuevoCliente._id.toString());
            log('🗑️ Cliente de prueba eliminado', colors.green);
        }
        
    } catch (error) {
        log(`❌ Error en pruebas de clientes: ${error}`, colors.red);
        console.error(error);
    }
};

const testHashComparison = async () => {
    log('\n=== PRUEBAS DE BCRYPT DIRECTO ===', colors.cyan);
    
    try {
        const password = 'test123';
        const saltRounds = 10;
        
        // 1. Generar hash
        log('\n1. Generando hash con bcrypt...', colors.yellow);
        const hash1 = await bcrypt.hash(password, saltRounds);
        const hash2 = await bcrypt.hash(password, saltRounds);
        
        log(`📝 Contraseña: ${password}`, colors.blue);
        log(`🔒 Hash 1: ${hash1}`, colors.blue);
        log(`🔒 Hash 2: ${hash2}`, colors.blue);
        
        // 2. Verificar que los hashes son diferentes (salts únicos)
        const hashesAreDifferent = hash1 !== hash2;
        log(`${hashesAreDifferent ? '✅' : '❌'} Hashes únicos: ${hashesAreDifferent ? 'SÍ' : 'NO'}`, 
            hashesAreDifferent ? colors.green : colors.red);
        
        // 3. Verificar que ambos hashes validan la misma contraseña
        const valid1 = await bcrypt.compare(password, hash1);
        const valid2 = await bcrypt.compare(password, hash2);
        
        log(`${valid1 ? '✅' : '❌'} Hash 1 válido: ${valid1}`, valid1 ? colors.green : colors.red);
        log(`${valid2 ? '✅' : '❌'} Hash 2 válido: ${valid2}`, valid2 ? colors.green : colors.red);
        
        // 4. Verificar que contraseña incorrecta falla
        const invalid = await bcrypt.compare('contraseña_incorrecta', hash1);
        log(`${!invalid ? '✅' : '❌'} Contraseña incorrecta rechazada: ${!invalid}`, 
            !invalid ? colors.green : colors.red);
        
    } catch (error) {
        log(`❌ Error en pruebas de bcrypt: ${error}`, colors.red);
        console.error(error);
    }
};

const runAllTests = async () => {
    log('🧪 INICIANDO PRUEBAS DE AUTENTICACIÓN Y ENCRIPTACIÓN', colors.bright);
    log('======================================================', colors.bright);
    
    try {
        // Conectar a la base de datos
        log('\n📡 Conectando a la base de datos...', colors.yellow);
        await connectDB();
        log('✅ Conectado a la base de datos', colors.green);
        
        // Ejecutar todas las pruebas
        await testHashComparison();
        await testUsuarios();
        await testClientes();
        
        log('\n🎉 TODAS LAS PRUEBAS COMPLETADAS', colors.green);
        log('================================', colors.green);
        
    } catch (error) {
        log(`❌ Error general: ${error}`, colors.red);
        console.error(error);
    } finally {
        // Cerrar conexión a la base de datos
        log('\n📡 Cerrando conexión a la base de datos...', colors.yellow);
        await closeDB();
        log('✅ Conexión cerrada', colors.green);
        process.exit(0);
    }
};

// Ejecutar pruebas solo si este archivo se ejecuta directamente
if (require.main === module) {
    runAllTests().catch(console.error);
}

export { runAllTests, testUsuarios, testClientes, testHashComparison };
