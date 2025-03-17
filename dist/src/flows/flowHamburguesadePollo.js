import { addKeyword, EVENTS } from '@builderbot/bot';
import flowMenuHamburguesas from '../flowmenu/flowMenuHamburguesas.js';
import flowCapturarNumero from './flowCapturarNumero.js';
const flowHamburguesaPollo = addKeyword(EVENTS.ACTION)
    .addAnswer("Espera unos segundos enviando el menú...")
    .addAction(async (ctx, { provider }) => {
    await provider.sendMedia(ctx.key.remoteJid, './assets/hamburguesadepollo.jpg', 'Hamburguesa de Pollo');
})
    .addAnswer('*Hamburguesa de Pollo - $5.99*\n' +
    'Ingredientes: Filete de pollo empanizado, lechuga, tomate, mayonesa.\n\n')
    .addAnswer('1️⃣  Deseas hacer una compra\n' +
    '2️⃣  Volver al Menú Anterior🍔', { capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    if (!["1", "2"].includes(ctx.body)) {
        return fallBack("Respuesta no válida, por favor selecciona una de las opciones.");
    }
    switch (ctx.body) {
        case "1":
            return gotoFlow(flowCapturarNumero);
        case "2":
            return gotoFlow(flowMenuHamburguesas);
    }
});
export default flowHamburguesaPollo;
