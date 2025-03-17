// flowPararBot.js

import { addKeyword } from '@builderbot/bot';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
import { numberClean } from './utils.js'; // Asegúrate de importar numberClean correctamente desde utils.js

const ADMIN_NUMBER = "+573219414421";

const blacklist = new Set(); // Usamos un Set para almacenar los números en la lista negra

// Funciones para gestionar la lista negra en memoria
function checkIfNumberIsBlacklisted(phoneNumber) {
    return blacklist.has(phoneNumber);
}

function addNumberToBlacklist(phoneNumber) {
    blacklist.add(phoneNumber);
    console.log(`Número ${phoneNumber} añadido a la lista negra.`);
}

function removeNumberFromBlacklist(phoneNumber) {
    blacklist.delete(phoneNumber);
    console.log(`Número ${phoneNumber} eliminado de la lista negra.`);
}

// Flujo para gestionar la lista negra
export const blackListFlow = addKeyword('mute')
    .addAction(async (ctx, { flowDynamic }) => {
        console.log("Keyword 'mute' activated."); // Mensaje para verificar activación de la keyword

        if (ctx.from === ADMIN_NUMBER) {
            console.log(`Admin ${ADMIN_NUMBER} triggered the action.`); // Verificar si el administrador activa la acción

            // Extraer el número de teléfono del mensaje utilizando numberClean
            const toMute = numberClean(ctx.body);

            // Verificar si se ha proporcionado un número de teléfono válido
            if (toMute) {
                const isBlacklisted = checkIfNumberIsBlacklisted(toMute);
                if (!isBlacklisted) {
                    addNumberToBlacklist(toMute);
                    console.log(`Número ${toMute} añadido a la lista negra.`); // Confirmar añadido a la lista negra
                    await flowDynamic(`❌ ${toMute} muted`);
                } else {
                    removeNumberFromBlacklist(toMute);
                    console.log(`Número ${toMute} eliminado de la lista negra.`); // Confirmar eliminación de la lista negra
                    await flowDynamic(`🆗 ${toMute} unmuted`);
                }
            } else {
                console.log("No se proporcionó un número de teléfono válido."); // Manejar caso donde no se proporciona un número válido
                await flowDynamic(`No se proporcionó un número de teléfono válido.`);
            }
        } else {
            console.log(`Unauthorized access attempt by ${ctx.from}.`); // Registro de intento de acceso no autorizado
        }
    });

// Función para detener el bot
export function stopBot() {
    console.log("Bot stopped.");
    // Lógica para detener el bot
}

// Función para reiniciar el bot
export function restartBot() {
    console.log("Bot restarted.");
    // Lógica para reiniciar el bot
}
