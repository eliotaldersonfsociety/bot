import { addKeyword, EVENTS } from '@builderbot/bot';
import flowMenuHamburguesas from '../flowmenu/flowMenuHamburguesas';
import flowCapturarNumero from './flowCapturarNumero';
const flowHamburguesaPicante = addKeyword(EVENTS.ACTION)
    .addAnswer("Espera unos segundos enviando el menú...")
    .addAction(async (ctx, { provider }) => {
    await provider.sendMedia(ctx.key.remoteJid, './assets/hamburguesapicante.jpg', 'Hamburguesa Picante');
})
    .addAnswer('*Hamburguesa Picante - $5.50*\n' +
    'Ingredientes: Carne de res picante, queso, jalapeños, lechuga, salsa picante.\n\n')
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
export default flowHamburguesaPicante;
