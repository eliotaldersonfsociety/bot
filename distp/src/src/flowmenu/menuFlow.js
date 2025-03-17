import { resolve } from 'path';
import { readFileSync } from 'fs';
import { addKeyword, EVENTS } from '@builderbot/bot';
import pidusage from 'pidusage';
const __dirname = resolve(import.meta.url.replace(/^file:\/\/\//, ''), '../');
const menuPath = resolve(__dirname, 'mensajes', 'menu.txt');
const menu = readFileSync(menuPath, 'utf8');
import flowMenuHamburguesas from './flowMenuHamburguesas';
import flowPdf from '../flows/flowPdf';
import flowHorario from '../flows/flowHorario';
import flowPagos from '../flows/flowPagos';
import flowUbicacion from '../flows/flowUbicacion';
import flowDb from '../flows/flowDb';
import flowCapturaNumero from '~/flows/flowCapturarNumero';
async function getSystemUsage() {
    const stats = await pidusage(process.pid);
    return {
        memory: stats.memory / 1024 / 1024,
        cpu: stats.cpu
    };
}
const menuFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(menu, { capture: true }, async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
    const systemUsage = await getSystemUsage();
    console.log(`Memory Usage (MB): ${systemUsage.memory}`);
    console.log(`CPU Usage (%): ${systemUsage.cpu}`);
    if (!["1", "2", "3", "4", "5", "6", "7", "0"].includes(ctx.body)) {
        return fallBack("Respuesta no válida, por favor selecciona una de las opciones.");
    }
    switch (ctx.body) {
        case "1":
            return gotoFlow(flowPdf);
        case "2":
            return gotoFlow(flowMenuHamburguesas);
        case "3":
            return gotoFlow(flowHorario);
        case "4":
            return gotoFlow(flowUbicacion);
        case "5":
            return gotoFlow(flowDb);
        case "6":
            return gotoFlow(flowPagos);
        case "7":
            return gotoFlow(flowCapturaNumero);
        case "0":
            return await flowDynamic("Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu*'");
    }
});
export default menuFlow;
