import mysql from 'mysql';
import { addKeyword } from '@builderbot/bot';
const connection = mysql.createConnection({
    host: 'host.docker.internal',
    user: 'root',
    password: '',
    database: 'whatsapp_bot_db'
});
function conectarMySQL() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                console.error('Error al conectar con MySQL:', err);
                reject(err);
            }
            else {
                console.log('Conexión establecida con MySQL.');
                resolve();
            }
        });
    });
}
async function obtenerNumerosDeTelefonoDesdeDB() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT telefono FROM usuarios', (error, results) => {
            if (error) {
                console.error('Error al obtener números de teléfono desde MySQL:', error);
                reject(error);
            }
            else {
                const telefonos = results.map((result) => result.telefono);
                console.log('Números de teléfono obtenidos desde MySQL:', telefonos);
                resolve(telefonos);
            }
        });
    });
}
async function enviarMensajeConReintentos(provider, remoteJid, message, intentos = 3) {
    try {
        console.log(`Intentando enviar mensaje a ${remoteJid}: ${message}`);
        await provider.sendMessage(remoteJid, { text: message });
        console.log(`Mensaje enviado exitosamente a ${remoteJid}: ${message}`);
        const delay = Math.floor(Math.random() * (120000 - 10000 + 1)) + 10000;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    catch (error) {
        console.error(`Error al enviar el mensaje a ${remoteJid}:`, error);
        if (intentos > 0) {
            console.log(`Reintentando (${intentos} intentos restantes)...`);
            await enviarMensajeConReintentos(provider, remoteJid, message, intentos - 1);
        }
        else {
            console.error('No se pudo enviar el mensaje después de varios intentos.');
            throw error;
        }
    }
}
function agregarEmoticones(mensaje) {
    const emoticones = ['😊', '😄', '🥳', '🎉', '👍', '❤️', '🚀', '💡', '🌟'];
    const cantidadEmoticones = Math.floor(Math.random() * 5) + 1;
    let mensajeConEmoticones = mensaje;
    for (let i = 0; i < cantidadEmoticones; i++) {
        const emoticonAleatorio = emoticones[Math.floor(Math.random() * emoticones.length)];
        mensajeConEmoticones += ` ${emoticonAleatorio}`;
    }
    return mensajeConEmoticones;
}
const flowBroadcast = addKeyword('broadcast')
    .addAnswer('📲 ¿Qué mensaje deseas enviar a tus clientes?', { capture: true }, async (ctx, { flowDynamic, provider }) => {
    try {
        const mensajeCapturado = ctx.body;
        console.log('Mensaje capturado:', mensajeCapturado);
        await conectarMySQL();
        console.log('Conexión establecida con MySQL.');
        const baileysProvider = await provider.getInstance();
        const telefonos = await obtenerNumerosDeTelefonoDesdeDB();
        console.log('Números de teléfono obtenidos:', telefonos);
        for (const telefono of telefonos) {
            const mensajeConEmoticones = agregarEmoticones(mensajeCapturado);
            const fullPhoneNumber = `${telefono}@s.whatsapp.net`;
            await enviarMensajeConReintentos(baileysProvider, fullPhoneNumber, mensajeConEmoticones);
        }
        connection.end();
        console.log('Flujo capturar número completado.');
        await flowDynamic(`Mensaje enviado a ${telefonos.length} agentes.`);
    }
    catch (error) {
        console.error('Error en el flujo capturar número:', error);
    }
});
export default flowBroadcast;
