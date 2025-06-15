import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { UsuarioModel, IUsuario } from '../models/usuarioModels';
import { ClienteModel, ICliente } from '../models/clienteModels';

// Estrategia para usuarios administradores
passport.use('usuario-local', new LocalStrategy(
  {
    usernameField: 'nombre',
    passwordField: 'password'
  },
  async (nombre: string, password: string, done) => {
    try {
      const usuario = await UsuarioModel.Login(nombre, password);
      if (usuario) {
        return done(null, usuario);
      } else {
        return done(null, false, { message: 'Credenciales inválidas' });
      }
    } catch (error) {
      return done(error);
    }
  }
));

// Estrategia para clientes
passport.use('cliente-local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email: string, password: string, done) => {
    try {
      // Primero buscamos el cliente por email
      const cliente = await ClienteModel.obtenerPorEmail(email);
      if (!cliente) {
        return done(null, false, { message: 'Email no encontrado' });
      }

      // Verificamos la contraseña si el cliente tiene una
      if (cliente.password) {
        const passwordValida = await bcrypt.compare(password, cliente.password);
        if (passwordValida) {
          return done(null, cliente);
        }
      }
      
      return done(null, false, { message: 'Contraseña incorrecta' });
    } catch (error) {
      return done(error);
    }
  }
));

// Serializar usuario para la sesión
passport.serializeUser((user: any, done) => {
  if (user.rol) {
    // Es un usuario administrador
    done(null, { id: user._id.toString(), type: 'usuario' });
  } else {
    // Es un cliente
    done(null, { id: user._id.toString(), type: 'cliente' });
  }
});

// Deserializar usuario desde la sesión
passport.deserializeUser(async (data: any, done) => {
  try {
    if (data.type === 'usuario') {
      const usuario = await UsuarioModel.obtenerPorId(data.id);
      done(null, usuario);
    } else {
      const cliente = await ClienteModel.obtenerPorId(data.id);
      done(null, cliente);
    }
  } catch (error) {
    done(error);
  }
});

export default passport;
