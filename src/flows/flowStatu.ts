import { addKeyword } from '@builderbot/bot';
import menuFlow from '../flowmenu/menuFlow';  // Importando un flujo llamado `menuFlow`

const flowMenu = addKeyword('hi')
    .addAnswer(
        '1️⃣  Deseas hablar en este Chat con un Asesor\n' +
        '2️⃣  Volver al Menú Anterior🍔',
        { capture: true },
        async (ctx, { gotoFlow, fallBack, blacklist }) => {  // Se añade el parámetro `blacklist` para manejar la lista negra
            if (!["1", "2"].includes(ctx.body)) {
                return fallBack(
                    "Respuesta no válida, por favor selecciona una de las opciones."
                );
            }
            switch (ctx.body) {
                case "1":
                    // Añadir al remitente a la lista negra
                    blacklist.add(ctx.from);
                    // Programar la eliminación del remitente de la lista negra después de 30 segundos
                    setTimeout(() => {
                        blacklist.remove(ctx.from);
                        console.log(`Usuario ${ctx.from} eliminado de la lista negra después de 30 segundos.`);
                    }, 30000); // 30000 milisegundos = 30 segundos
                    break;
                case "2":
                    // Volver al menú anterior
                    return gotoFlow(menuFlow);
            }
        }
    );

export default flowMenu;
