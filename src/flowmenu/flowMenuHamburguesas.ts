import { resolve } from 'path';
import { readFileSync } from 'fs';
import { addKeyword, EVENTS } from '@builderbot/bot';

const __dirname = resolve(import.meta.url.replace(/^file:\/\/\//, ''), '../'); // Obtener el directorio padre

const menuPath = resolve(__dirname, 'mensajes', 'menuhamburguesas.txt'); // Construir la ruta correcta

const menu = readFileSync(menuPath, 'utf8');

// Importación de flujo de conversación
import flowHamburguesaclasica from '../flows/flowHamburguesaclasica';
import flowHamburguesaBBQ from '../flows/flowHamburguesaBBQ';
import flowHamburguesadePollo from '../flows/flowHamburguesadePollo';
import flowHamburguesaVegana from '../flows/flowHamburguesaVegana';
import flowHamburguesaPicante from '../flows/flowHamburguesaPicante';


// Definición del flujo principal de hamburguesas
const flowMenuHamburguesas = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic }) => {
        try {
            console.log(`¡Hola *${ctx.pushName}*! Bienvenido a *Hamburguesas Vidal*. 🍔 \nTe voy a mostrar todo lo que tenemos para ti.`);
        } catch (error) {
            console.error("Error en addAction:", error);
        }
    })
    .addAnswer(
        menu,
        { capture: true },
        async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
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
                        return await flowDynamic(
                            "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu*'"
                        );
                }
            } catch (error) {
                console.error('Error en el manejo del flujo:', error);
                throw error; // Lanza el error nuevamente para manejarlo más arriba si es necesario
            }
        }
    );

export default flowMenuHamburguesas;