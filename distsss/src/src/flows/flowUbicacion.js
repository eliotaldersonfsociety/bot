import { addKeyword, EVENTS } from '@builderbot/bot';
const flowUbicacion = addKeyword(EVENTS.ACTION)
    .addAnswer('Te enviaré nuestra ubicación.')
    .addAction(async (ctx, { provider }) => {
    const refProvider = await provider.getInstance();
    await refProvider.sendMessage(`${ctx.from}@s.whatsapp.net`, {
        location: {
            latitude: -34.603722,
            longitude: -58.381592,
            name: 'Nuestra Ubicación',
            address: 'Buenos Aires, Argentina'
        }
    });
    console.log('Ubicación enviada al usuario.');
})
    .addAction(async (ctx, { flowDynamic }) => {
    try {
        await flowDynamic(`¡Bueno *${ctx.pushName}*! me despido si necesitas algo más me escribes bye. 👋🏻`);
    }
    catch (error) {
        console.error("Error en addAction:", error);
    }
});
export default flowUbicacion;
