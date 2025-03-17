import { addKeyword, EVENTS } from '@builderbot/bot';
import menuFlow from '~/flowmenu/menuFlow';
import flowContacto from './flowContacto';




const flowPagos = addKeyword(EVENTS.ACTION)
    .addAnswer(
        '**Métodos de Pago Disponibles:**\n' +
        '💳 - Bancolombia\n' +
        "887-3648-345\n" +
        "Armando Casas\n" +
        "Cuenta de ahorro\n\n" +
        '💸 - Nequi\n' +
        "300-002-0002\n" +
        "Armando Casas\n\n" +
        '💼 - Daviplata\n\n' +
        "300-002-0002\n" +
        "Armando Casas\n\n" +
        '1️⃣  Volver al Menú Anterior🍔',
        { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            if (!["1"].includes(ctx.body)) {
                return fallBack(
                    "Respuesta no válida, por favor selecciona una de las opciones."
                );
            }
            switch (ctx.body) {
                case "1":
                    return gotoFlow(menuFlow);
            }
        }
    );

export default flowPagos;
