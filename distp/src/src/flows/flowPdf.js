import { addKeyword, EVENTS } from '@builderbot/bot';
import menuFlow from '~/flowmenu/menuFlow';
import flowCompra from './flowCompra';
const flowPdf = addKeyword(EVENTS.ACTION)
    .addAnswer('Espera unos segundos, te estoy enviando el menú')
    .addAction(async (ctx, { provider, flowDynamic }) => {
    await provider.sendFile(ctx.key.remoteJid, './src/menu.pdf');
})
    .addAnswer('Menu enviado revisalo te gustara algo...')
    .addAnswer('1️⃣  Deseas hacer una compra\n' +
    '2️⃣  Volver al Menú Anterior🍔', { capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    if (!["1", "2"].includes(ctx.body)) {
        return fallBack("Respuesta no válida, por favor selecciona una de las opciones.");
    }
    switch (ctx.body) {
        case "1":
            return gotoFlow(flowCompra);
        case "2":
            return gotoFlow(menuFlow);
    }
});
export default flowPdf;
