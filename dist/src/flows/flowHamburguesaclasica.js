import { addKeyword, EVENTS } from '@builderbot/bot';
import flowMenuHamburguesas from '../flowmenu/flowMenuHamburguesas.js';
import flowCapturarNumero from './flowCapturarNumero.js';
const flowHamburguesaclasica = addKeyword(EVENTS.ACTION)
    .addAnswer("Espera unos segundos enviando el menú..")
    .addAction(async (ctx, { provider }) => {
    await provider.sendMedia(ctx.key.remoteJid, './assets/hamburguesaclasica.jpg', 'Hamburguesa Clasica');
})
    .addAnswer('*Hamburguesa Clásica - $5.99*\n' +
    'Ingredientes: Carne de res, lechuga, tomate, cebolla, queso cheddar, salsa especial.\n\n')
    .addAnswer('1️⃣  Deseas hacer una compra\n' +
    '2️⃣  Volver al Menú Anterior🍔', { capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    try {
        const options = ["1", "2"];
        if (!options.includes(ctx.body)) {
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
export default flowHamburguesaclasica;
