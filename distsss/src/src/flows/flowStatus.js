import { addKeyword } from '@builderbot/bot';
import menuFlow from '~/flowmenu/menuFlow';
const flowMenu = addKeyword('hi')
    .addAnswer('1️⃣  Deseas hablar en este Chat con un Asesor\n' +
    '2️⃣  Volver al Menú Anterior🍔', { capture: true }, async (ctx, { gotoFlow, fallBack, blacklist }) => {
    if (!["1", "2"].includes(ctx.body)) {
        return fallBack("Respuesta no válida, por favor selecciona una de las opciones.");
    }
    switch (ctx.body) {
        case "1":
            blacklist.add(ctx.from);
            await sendMessageAndWait(ctx, blacklist);
            break;
        case "2":
            return gotoFlow(menuFlow);
    }
});
async function sendMessageAndWait(ctx, blacklist) {
    await ctx.replyWithMarkdown(`En estos momentos el bot se ha detenido por 30 segundos ⏳ para que puedas hablar con un agente que te atenderá.`);
    setTimeout(async () => {
        blacklist.remove(ctx.from);
        console.log(`Usuario ${ctx.from} eliminado de la lista negra después de 30 segundos.`);
        try {
            await ctx.replyWithMarkdown(`¡El bot se ha reactivado! Puedes continuar.`);
        }
        catch (error) {
            console.error('Error al enviar mensaje de reactivación:', error);
        }
    }, 30000);
}
export default flowMenu;
