import { addKeyword, EVENTS } from '@builderbot/bot';
import flowMenuHamburguesas from '../flowmenu/flowMenuHamburguesas';
import flowCapturarnumero from './flowCapturarNumero';

const flowHamburguesaVegana = addKeyword(EVENTS.ACTION)
    .addAnswer("Espera unos segundos enviando el menú...")
    .addAction(
        async (ctx, { provider, fallBack }) => {
            try {
                await provider.sendMedia(ctx.key.remoteJid, './assets/hamburguesavegana.jpg', 'Hamburguesa Vegana');
            } catch (error) {
                console.error('Error enviando media:', error);
                return fallBack("Lo siento, hubo un problema al enviar el menú. Por favor intenta nuevamente.");
            }
        }
    )
    .addAnswer('*Hamburguesa Vegana - $6.99*\n' +
               'Ingredientes: Hamburguesa de lentejas y vegetales frescos, aguacate, lechuga, tomate.\n\n')
    .addAnswer(
        '1️⃣  Deseas hacer una compra\n' +
        '2️⃣  Volver al Menú Anterior🍔',
        { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            try {
                if (!["1", "2"].includes(ctx.body)) {
                    return fallBack(
                        "Respuesta no válida, por favor selecciona una de las opciones."
                    );
                }
                switch (ctx.body) {
                    case "1":
                        // Using require directly to avoid circular dependency issue
                        return gotoFlow(flowCapturarnumero);
                    case "2":
                        // Using require directly to avoid circular dependency issue
                        return gotoFlow(flowMenuHamburguesas);
                }
            } catch (error) {
                console.error('Error en el callback de captura:', error);
                return fallBack("Lo siento, ocurrió un error inesperado. Por favor intenta nuevamente.");
            }
        }
    );

export default flowHamburguesaVegana;
