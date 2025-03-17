import { resolve } from 'path';
import { readFileSync } from 'fs';
import { addKeyword, EVENTS } from '@builderbot/bot';
import { start, reset, stop } from '../flows/inactivityHandlers.js'; // Asegúrate de que estas funciones estén en un archivo llamado `inactivityHandlers.js`

const __dirname = resolve(import.meta.url.replace(/^file:\/\/\//, ''), '../');
const menuPath = resolve(__dirname, 'mensajes', 'menu.txt');
const menu = readFileSync(menuPath, 'utf8');

import flowMenuHamburguesas from './flowMenuHamburguesas.js';
import flowPdf from '../flows/flowPdf.js';
import flowHorario from '../flows/flowHorario.js';
import flowPagos from '../flows/flowPagos.js';
import flowUbicacion from '../flows/flowUbicacion.js';
import flowDb from '../flows/flowDb.js';
import flowCapturaNumero from '../flows/flowCapturarNumero.js';
import flowStatu from '../flows/flowStatu.js'
const menuFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(menu, { capture: true }, async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        console.log('Menu displayed to user:', ctx.from);

        // Iniciar o reiniciar el temporizador de inactividad cuando se muestra el menú
        reset(ctx, gotoFlow, 10000, menuFlow); // 20000 milisegundos = 20 segundos
        console.log('Inactivity timer reset for user:', ctx.from);

        if (!["1", "2", "3", "4", "5", "6", "7", "8", "0"].includes(ctx.body)) {
            console.log('Invalid response from user:', ctx.from, 'Response:', ctx.body);
            return fallBack("Respuesta no válida, por favor selecciona una de las opciones.");
        }

        // Detener el temporizador de inactividad cuando el usuario selecciona una opción
        stop(ctx);
        console.log('Inactivity timer stopped for user:', ctx.from);

        switch (ctx.body) {
            case "1":
                console.log('User selected option 1:', ctx.from);
                return gotoFlow(flowPdf);
            case "2":
                console.log('User selected option 2:', ctx.from);
                return gotoFlow(flowMenuHamburguesas);
            case "3":
                console.log('User selected option 3:', ctx.from);
                return gotoFlow(flowHorario);
            case "4":
                console.log('User selected option 4:', ctx.from);
                return gotoFlow(flowUbicacion);
            case "5":
                console.log('User selected option 5:', ctx.from);
                return gotoFlow(flowDb);
            case "6":
                console.log('User selected option 6:', ctx.from);
                return gotoFlow(flowPagos);
            case "7":
                console.log('User selected option 7:', ctx.from);
                return gotoFlow(flowCapturaNumero);
            case "8":
                console.log('User selected option 7:', ctx.from);
                return gotoFlow(flowStatu);
            case "0":
                console.log('User selected option 0:', ctx.from);
                return await flowDynamic("Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu*'");
        }
    });

export default menuFlow;
