import mysql from 'mysql';
import { addKeyword, BotContext } from '@builderbot/bot';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

// Configuración de conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'whatsapp_bot_db'
});

// Función para conectar a MySQL
function conectarMySQL() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error('Error al conectar con MySQL:', err);
        reject(err);
      } else {
        console.log('Conexión establecida con MySQL.');
        resolve();
      }
    });
  });
}

// Función para obtener números de teléfono de agentes desde MySQL
async function obtenerNumerosDeTelefonoDesdeDB() {
  return new Promise<string[]>((resolve, reject) => {
    connection.query('SELECT telefono FROM usuarios', (error, results) => {
      if (error) {
        console.error('Error al obtener números de teléfono desde MySQL:', error);
        reject(error);
      } else {
        const telefonos = results.map((result: any) => result.telefono);
        console.log('Números de teléfono obtenidos desde MySQL:', telefonos);
        resolve(telefonos);
      }
    });
  });
}

// Función para enviar un mensaje a un número de WhatsApp con manejo de reintentos
async function enviarMensajeConReintentos(provider: Provider, remoteJid: string, message: string, intentos = 3) {
  try {
    console.log(`Intentando enviar mensaje a ${remoteJid}: ${message}`);
    await provider.sendMessage(remoteJid, { text: message });
    console.log(`Mensaje enviado exitosamente a ${remoteJid}: ${message}`);
    const delay = Math.floor(Math.random() * (120000 - 10000 + 1)) + 10000; // Entre 10 segundos y 2 minutos
    await new Promise(resolve => setTimeout(resolve, delay));
  } catch (error) {
    console.error(`Error al enviar el mensaje a ${remoteJid}:`, error);
    if (intentos > 0) {
      console.log(`Reintentando (${intentos} intentos restantes)...`);
      await enviarMensajeConReintentos(provider, remoteJid, message, intentos - 1);
    } else {
      console.error('No se pudo enviar el mensaje después de varios intentos.');
      throw error;
    }
  }
}

// Función para agregar emoticones aleatorios al mensaje
function agregarEmoticones(mensaje: string): string {
  const emoticones = ['😊', '😄', '🥳', '🎉', '👍', '❤️', '🚀', '💡', '🌟'];
  const cantidadEmoticones = Math.floor(Math.random() * 5) + 1; // Entre 1 y 5 emoticones
  let mensajeConEmoticones = mensaje;

  for (let i = 0; i < cantidadEmoticones; i++) {
    const emoticonAleatorio = emoticones[Math.floor(Math.random() * emoticones.length)];
    mensajeConEmoticones += ` ${emoticonAleatorio}`;
  }

  return mensajeConEmoticones;
}

// Flujo capturar número
const flowBroadcast = addKeyword('broadcast')
  .addAnswer('📲 ¿Qué mensaje deseas enviar a tus clientes?', { capture: true }, async (ctx: BotContext, { flowDynamic, provider }) => {      
    try {
      const mensajeCapturado = ctx.body; // Capturar el mensaje del contexto
      console.log('Mensaje capturado:', mensajeCapturado);

      await conectarMySQL(); // Conectar a MySQL
      console.log('Conexión establecida con MySQL.');

      const baileysProvider = await provider.getInstance();
      const telefonos = await obtenerNumerosDeTelefonoDesdeDB(); // Obtener números de teléfono desde MySQL
      console.log('Números de teléfono obtenidos:', telefonos);

      // Enviar el mensaje capturado a cada número de teléfono
      for (const telefono of telefonos) {
        const mensajeConEmoticones = agregarEmoticones(mensajeCapturado); // Generar mensaje con emoticones para cada usuario
        const fullPhoneNumber = `${telefono}@s.whatsapp.net`;
        await enviarMensajeConReintentos(baileysProvider, fullPhoneNumber, mensajeConEmoticones);
      }

      connection.end(); // Cerrar conexión a MySQL
      console.log('Flujo capturar número completado.');

      // Enviar un mensaje de confirmación al usuario
      await flowDynamic(`Mensaje enviado a ${telefonos.length} agentes.`);
      
    } catch (error) {
      console.error('Error en el flujo capturar número:', error);
    }
  });

export default flowBroadcast;
