import { addKeyword, EVENTS } from '@builderbot/bot';
import flowMenuHamburguesas from '../flowmenu/flowMenuHamburguesas.js';
import flowCapturarNumero from './flowCapturarNumero.js';
const flowHamburguesaBBQ = addKeyword(EVENTS.ACTION)
    .addAnswer("Espera unos segundos enviando el menú...")
    .addAction(async (ctx, { provider }) => {
    await provider.sendMedia(ctx.key.remoteJid, './assets/hamburguesabbq.jpg', 'Hamburguesa BBQ');
})
    .addAnswer('*Hamburguesa BBQ - $6.49*\n' +
    'Ingredientes: Carne de res, queso, cebolla caramelizada, lechuga, salsa BBQ.\n\n')
    .addAnswer('1️⃣  Deseas hacer una compra\n' +
    '2️⃣  Volver al Menú Anterior🍔', { capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    try {
        if (!["1", "2"].includes(ctx.body)) {
            return fallBack("Respuesta no válida, por favor selecciona una de las opciones.");
        }
        switch (ctx.body) {
            case "1":
                return gotoFlow(flowCapturarNumero);
            case "2":
                return gotoFlow(flowMenuHamburguesas);
        }
    }
    catch (error) {
        console.error('Error en el manejo del flujo:', error);
        throw error;
    }
});
export default flowHamburguesaBBQ;
