import { addKeyword } from '@builderbot/bot';
import menuFlow from '../flowmenu/menuFlow.js';
const flowMenu = addKeyword('hi')
    .addAnswer('1️⃣  Deseas hablar en este Chat con un Asesor\n' +
    '2️⃣  Volver al Menú Anterior🍔', { capture: true }, async (ctx, { gotoFlow, fallBack, blacklist }) => {
    if (!["1", "2"].includes(ctx.body)) {
        return fallBack("Respuesta no válida, por favor selecciona una de las opciones.");
    }
    switch (ctx.body) {
        case "1":
            blacklist.add(ctx.from);
            setTimeout(() => {
                blacklist.remove(ctx.from);
                console.log(`Usuario ${ctx.from} eliminado de la lista negra después de 30 segundos.`);
            }, 30000);
            break;
        case "2":
            return gotoFlow(menuFlow);
    }
});
export default flowMenu;
