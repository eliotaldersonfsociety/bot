import { addKeyword, EVENTS, BotContext } from '@builderbot/bot';
import { MemoryDB as Database } from '@builderbot/bot';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';

// Función para enviar un contacto con los parámetros específicos
async function enviarContacto(provider: Provider, remoteJid: string, name: string, fullPhoneNumber: string) {
  try {
    await provider.sendContact(remoteJid, name, fullPhoneNumber);
    console.log(`Contacto enviado a ${name} (${fullPhoneNumber})`);
  } catch (error) {
    console.error('Error al enviar el contacto:', error);
    throw error; // Puedes manejar el error aquí o relanzarlo para manejarlo en otro lugar
  }
}

const flowCapturarNumero = addKeyword<Provider, Database>(EVENTS.ACTION)
  .addAction(async (ctx: BotContext, { flowDynamic, provider }) => {
    try {
      const baileysProvider = await provider.getInstance();

      // Capturar el número de teléfono del remitente
      const remitente = ctx.from;
      const name = ctx.pushName || 'Cliente'; // Nombre del contacto, o un valor por defecto
      const fullPhoneNumber = `+${remitente}`; // Número completo con el prefijo '+'
      const agente = '573219412929'; // Número de WhatsApp del agente sin el sufijo '@s.whatsapp.net'

      const message = `📞 Por favor llamar o mensajear al cliente que está esperando para un pedido`;

      // Utilizar la operación para enviar el contacto al agente con el nombre correcto
      await enviarContacto(provider, `${agente}@s.whatsapp.net`, name, fullPhoneNumber);

      // Enviar un mensaje adicional al agente
      await baileysProvider.sendMessage(`${agente}@s.whatsapp.net`, { text: message });
      console.log('Mensaje enviado exitosamente al agente.');

      // Mensaje adicional al usuario después de enviar el mensaje al agente
      if (flowDynamic && typeof flowDynamic === 'function') {
        await flowDynamic('¡Gracias! Un agente se pondrá en contacto contigo en breve. 📲');
      } else {
        console.error('Error: flowDynamic no está definido correctamente o no es una función.');
      }

    } catch (error) {
      console.error('Error al enviar el mensaje al número de teléfono del remitente:', error);
    }
  })
  .addAnswer(
    '',
    { capture: false },
    async (ctx, { provider, flowDynamic }) => {
      console.log('Entrando en addAnswer...');
      try {
        await provider.vendor.chatModify(
          {
            addChatLabel: {
              // Etiquetas de chat, asegúrate de que los IDs son correctos
              labelId: '2' // Cambia el ID según tus necesidades
            }
          }, ctx.key.remoteJid
        );
        console.log('Chat etiquetado correctamente.');
        await flowDynamic(``);
      } catch (error) {
        console.error('Error etiquetando el chat:', error);
      }
    }
  );

export default flowCapturarNumero;
