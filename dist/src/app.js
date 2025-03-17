import { createBot, createProvider, createFlow } from '@builderbot/bot';
import { MemoryDB as Database } from '@builderbot/bot';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
const PORT = process.env.PORT || 3008;
import menuFlow from './flowmenu/menuFlow.js';
import flowHamburguesas from './flowmenu/flowMenuHamburguesas.js';
import flowPdf from './flows/flowPdf.js';
import flowHorario from './flows/flowHorario.js';
import flowPagos from './flows/flowPagos.js';
import flowHamburguesaclasica from './flows/flowHamburguesaclasica.js';
import flowHamburguesadePollo from './flows/flowHamburguesadePollo.js';
import flowHamburguesaPicante from './flows/flowHamburguesaPicante.js';
import flowHamburguesaVegana from './flows/flowHamburguesaVegana.js';
import flowHamburguesaBBQ from './flows/flowHamburguesaBBQ.js';
import flowUbicacion from './flows/flowUbicacion.js';
import flowDb from './flows/flowDb.js';
import flowCapturaNumero from './flows/flowCapturarNumero.js';
import flowContacto from "./flows/flowContacto.js";
import flowStatu from './flows/flowStatu.js';
import flowBroadcast from "./flows/flowBroadcast.js";
const usersBlocked = ["0"];
const main = async () => {
    console.log(`Users Blocked: ${usersBlocked}`);
    const adapterFlow = createFlow([menuFlow, flowHamburguesas, flowHamburguesaclasica, flowPdf, flowHorario, flowDb, flowHamburguesaBBQ, flowHamburguesaPicante, flowHamburguesaVegana, flowHamburguesadePollo, flowUbicacion, flowPagos, flowCapturaNumero, flowContacto, flowStatu, flowBroadcast]);
    const adapterProvider = createProvider(Provider, { usePairingCode: true, phoneNumber: "573219412929" });
    const adapterDB = new Database();
    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
    adapterProvider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
        const { number, message, urlMedia } = req.body;
        await bot.sendMessage(number, message, { media: urlMedia ?? null });
        return res.end('sended');
    }));
    adapterProvider.server.post('/v1/register', handleCtx(async (bot, req, res) => {
        const { number, name } = req.body;
        await bot.dispatch('REGISTER_FLOW', { from: number, name });
        return res.end('trigger');
    }));
    adapterProvider.server.post('/v1/samples', handleCtx(async (bot, req, res) => {
        const { number, name } = req.body;
        await bot.dispatch('SAMPLES', { from: number, name });
        return res.end('trigger');
    }));
    adapterProvider.server.post('/v1/blacklist', handleCtx(async (bot, req, res) => {
        const { number, intent } = req.body;
        if (intent === 'remove')
            bot.blacklist.remove(number);
        if (intent === 'add')
            bot.blacklist.add(number);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'ok', number, intent }));
    }));
    httpServer(+PORT);
};
main();
