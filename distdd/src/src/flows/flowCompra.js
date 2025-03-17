import { EVENTS, addKeyword } from '@builderbot/bot';
import menuFlow from '../flowmenu/menuFlow';
let userGroupId = null;
let isFirstTime = true;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const flowCompra = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { provider, gotoFlow }) => {
    const userId = ctx.from;
    if (userGroupId) {
        if (!isFirstTime) {
            flowCompra.addAnswer('El usuario ya tiene un grupo creado.');
        }
        isFirstTime = false;
        console.log('El usuario ya tiene un grupo creado.');
        flowCompra.addAnswer('El usuario ya tiene un grupo creado.');
        await delay(10000);
        return gotoFlow(menuFlow);
    }
    else {
        const refProvider = await provider.getInstance();
        const name = ctx.pushName;
        const group = await refProvider.groupCreate(`Pedido de ${name}`, [
            `${ctx.from}@s.whatsapp.net`,
            `573016384023@s.whatsapp.net`
        ]);
        userGroupId = group.id;
        await refProvider.sendMessage(`${ctx.from}@s.whatsapp.net`, {
            text: `*${name}*, te hemos agregado con nuestro chef 👨‍🍳 para que le expliques mejor el pedido. Revisa tus chats, se creó un grupo. \n\nGracias👋🏻`
        });
        console.log('Grupo creado y redirigiendo al flujo de bienvenida...');
        await delay(10000);
        return gotoFlow(menuFlow);
    }
});
flowCompra.addAnswer('Estamos desviando tu conversación a un grupo con nuestro chef 👨‍🍳');
export default flowCompra;
