import { addKeyword, EVENTS } from '@builderbot/bot';
import menuFlow from '../flowmenu/menuFlow';
import flowCompra from './flowCompra';

const flowPdf = addKeyword(EVENTS.ACTION)
    .addAnswer('Espera unos segundos, te estoy enviando el menú') // Ejemplo de delay de 2000 milisegundos (2 segundos)
    .addAction(
        async (ctx, { provider }) => {
            await provider.sendFile(ctx.key.remoteJid, './dist/src/menu.pdf');
        }
    )
    .addAnswer(
        'Menu enviado revisalo te gustara algo...' // Ejemplo de delay de 1000 milisegundos (1 segundo)
    )
    .addAnswer(
        '1️⃣  Deseas hacer una compra\n' +
        '2️⃣  Volver al Menú Anterior🍔', 
        { capture: true}, // Ejemplo de delay de 1500 milisegundos (1.5 segundos)
        async (ctx, { gotoFlow, fallBack }) => {
            if (!["1", "2"].includes(ctx.body)) {
                return fallBack(
                    "Respuesta no válida, por favor selecciona una de las opciones."
                );
            }
            switch (ctx.body) {
                case "1":
                    // Using require directly to avoid circular dependency issue
                    return gotoFlow(flowCompra);
                case "2":
                    // Using require directly to avoid circular dependency issue
                    return gotoFlow(menuFlow);
            }
        }
    );

export default flowPdf;
