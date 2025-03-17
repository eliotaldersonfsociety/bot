import { addKeyword, EVENTS } from '@builderbot/bot';
async function enviarContacto(provider, remoteJid, name, fullPhoneNumber) {
    try {
        await provider.sendContact(remoteJid, name, fullPhoneNumber);
        console.log(`Contacto enviado a ${name} (${fullPhoneNumber})`);
    }
    catch (error) {
        console.error('Error al enviar el contacto:', error);
        throw error;
    }
}
const flowCapturarNumero = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic, provider }) => {
    try {
        const baileysProvider = await provider.getInstance();
        const remitente = ctx.from;
        const name = ctx.pushName || 'Cliente';
        const fullPhoneNumber = `+${remitente}`;
        const agente = '573219412929@s.whatsapp.net';
        const message = `📞 Por favor llamar o mensajear al cliente que está esperando para un pedido`;
        await enviarContacto(provider, agente, fullPhoneNumber, name);
        await baileysProvider.sendMessage(`${agente}@s.whatsapp.net`, { text: message });
        console.log('Mensaje enviado exitosamente al número de teléfono del remitente.');
        if (flowDynamic && typeof flowDynamic === 'function') {
            await flowDynamic('¡Gracias! Un agente se pondrá en contacto contigo en breve. 📲');
        }
        else {
            console.error('Error: flowDynamic no está definido correctamente o no es una función.');
        }
    }
    catch (error) {
        console.error('Error al enviar el mensaje al número de teléfono del remitente:', error);
    }
})
    .addAnswer('', { capture: false }, async (ctx, { provider, flowDynamic }) => {
    console.log('Entrando en addAnswer...');
    try {
        await provider.vendor.chatModify({
            addChatLabel: {
                labelId: '2'
            }
        }, ctx.key.remoteJid);
        console.log('Chat labeled as URGENT CALL');
        await flowDynamic(``);
    }
    catch (error) {
        console.error('Error labeling chat:', error);
    }
});
export default flowCapturarNumero;
