import { resolve } from 'path';
import { readFileSync } from 'fs';
import { addKeyword, EVENTS } from '@builderbot/bot';
const __dirname = resolve(import.meta.url.replace(/^file:\/\/\//, ''), '../');
const menuPath = resolve(__dirname, 'mensajes', 'menuhamburguesas.txt');
const menu = readFileSync(menuPath, 'utf8');
import flowHamburguesaclasica from '../flows/flowHamburguesaclasica.js';
import flowHamburguesaBBQ from '../flows/flowHamburguesaBBQ.js';
import flowHamburguesadePollo from '../flows/flowHamburguesadePollo.js';
import flowHamburguesaVegana from '../flows/flowHamburguesaVegana.js';
import flowHamburguesaPicante from '../flows/flowHamburguesaPicante.js';
import menuFlow from './menuFlow.js'
const flowMenuHamburguesas = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic }) => {
    try {
        console.log(`¡Hola *${ctx.pushName}*! Bienvenido a *Hamburguesas Vidal*. 🍔 \nTe voy a mostrar todo lo que tenemos para ti.`);
    }
    catch (error) {
        console.error("Error en addAction:", error);
    }
})
    .addAnswer(menu, { capture: true }, async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
    try {
        const options = ["1", "2", "3", "4", "5", "0"];
        if (!options.includes(ctx.body)) {
            return fallBack("Respuesta no válida, por favor selecciona una de las opciones.");
        }
        switch (ctx.body) {
            case "1":
                return gotoFlow(flowHamburguesaclasica);
            case "2":
                return gotoFlow(flowHamburguesaBBQ);
            case "3":
                return gotoFlow(flowHamburguesadePollo);
            case "4":
                return gotoFlow(flowHamburguesaVegana);
            case "5":
                return gotoFlow(flowHamburguesaPicante);
            case "0":
                return gotoFlow(menuFlow);
        }
    }
    catch (error) {
        console.error('Error en el manejo del flujo:', error);
        throw error;
    }
});
export default flowMenuHamburguesas;
