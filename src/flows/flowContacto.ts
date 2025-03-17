// Importación de módulos y dependencias necesarias
import mysql from 'mysql2';
import { addKeyword, EVENTS, BotContext } from '@builderbot/bot';
import menuFlow from '~/flowmenu/menuFlow';

// Configuración de la conexión a la base de datos MySQL
const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'whatsapp_bot_db'
});

// Conectar a la base de datos
dbConnection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    return;
  }
  console.log('Conexión establecida con la base de datos MySQL.');
});

// Definición del flujo principal para capturar automáticamente nombre y número de teléfono
const flowContacto = addKeyword(EVENTS.WELCOME)
  .addAction(async (ctx: BotContext, { state, flowDynamic, gotoFlow }) => {
    try {
      const nombre = ctx.pushName;
      const phoneNumber = ctx.from;

      // Actualizar el estado con los datos capturados
      await state.update({ nombre, phoneNumber });

      // Insertar los datos en la base de datos si el número de teléfono no existe
      await insertarDatosEnBaseDeDatos(nombre, phoneNumber);

      // Mensaje de confirmación para el usuario
      await flowDynamic(`¡Hola *${ctx.pushName}*! Bienvenido a *Hamburguesas Vidal*. 🍔 \nSoy tu asistente virtual y estoy aquí para ayudarte, presiona cualquier letra para ver el *Menu*.`);

      // Limpiar el estado al finalizar el flujo
      await state.clear();

      // Redirigir al usuario al flujo 'menuFlow'
      return gotoFlow(menuFlow);
    } catch (error) {
      console.error('Error al capturar o guardar datos:', error);
      await flowDynamic('Ocurrió un error al guardar tus datos. Por favor, intenta nuevamente más tarde.');
    }
  });

// Función para insertar datos en la base de datos MySQL si el número no existe
async function insertarDatosEnBaseDeDatos(nombre: string, phoneNumber: string) {
  const sqlSelect = 'SELECT COUNT(*) AS count FROM usuarios WHERE telefono = ?';
  const sqlInsert = 'INSERT INTO usuarios (nombre, telefono) VALUES (?, ?)';
  const valuesSelect = [phoneNumber];
  const valuesInsert = [nombre, phoneNumber];

  try {
    // Consultar si el número de teléfono ya existe
    const [rows] = await dbConnection.promise().execute(sqlSelect, valuesSelect);
    const count = rows[0].count;

    if (count === 0) {
      // Si el número no existe, insertar los datos
      await dbConnection.promise().execute(sqlInsert, valuesInsert);
      console.log('Datos insertados en la base de datos MySQL:', { nombre, phoneNumber });
    } else {
      console.log(`El número de teléfono ${phoneNumber} ya existe en la base de datos. No se guardaron los datos.`);
    }
  } catch (error) {
    throw new Error(`Error al insertar o verificar datos en la base de datos: ${error.message}`);
  }
}

export default flowContacto;
