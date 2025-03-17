import { EVENTS, addKeyword } from '@builderbot/bot';
import menuFlow from '../flowmenu/menuFlow'; // Importa menuFlow al principio del archivo

// Variable global para almacenar el ID del grupo creado por el usuario
let userGroupId: string | null = null;
let isFirstTime = true; // Variable para controlar si es la primera vez que se inicia el flujo

// Función para retrasar la ejecución de una promesa
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const flowCompra = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { provider, gotoFlow }) => {
        const userId = ctx.from;

        // Verificar si el usuario ya tiene un grupo creado
        if (userGroupId) {
            // Si ya tiene un grupo creado, enviar mensaje correspondiente
            if (!isFirstTime) {
                flowCompra.addAnswer('El usuario ya tiene un grupo creado.');
            }
            isFirstTime = false; // Ya no es la primera vez que se inicia el flujo
            console.log('El usuario ya tiene un grupo creado.');
            flowCompra.addAnswer('El usuario ya tiene un grupo creado.');

            // Retrasar el gotoFlow por 10 segundos
            await delay(10000);
            return gotoFlow(menuFlow);
        } else {
            // Crear el grupo y guardar la información
            const refProvider = await provider.getInstance();
            const name = ctx.pushName;
            const group = await refProvider.groupCreate(`Pedido de ${name}`, [
                `${ctx.from}@s.whatsapp.net`,
                `573016384023@s.whatsapp.net`
            ]);

            // Guardar el ID del grupo creado en la variable global
            userGroupId = group.id;

            // Enviar mensaje al usuario
            await refProvider.sendMessage(`${ctx.from}@s.whatsapp.net`, {
                text: `*${name}*, te hemos agregado con nuestro chef 👨‍🍳 para que le expliques mejor el pedido. Revisa tus chats, se creó un grupo. \n\nGracias👋🏻`
            });

            console.log('Grupo creado y redirigiendo al flujo de bienvenida...');

            // Retrasar el gotoFlow por 10 segundos
            await delay(10000);
            return gotoFlow(menuFlow);
        }
    });

// Añadir mensaje inicial solo una vez
flowCompra.addAnswer('Estamos desviando tu conversación a un grupo con nuestro chef 👨‍🍳');

export default flowCompra;
