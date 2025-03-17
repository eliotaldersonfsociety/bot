import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import QRPortalWeb from '@bot-whatsapp/xbladeyx5'

const PORT = process.env.PORT ?? 3009

import menuFlow from './flowmenu/menuFlow';
import flowHamburguesas from './flowmenu/flowMenuHamburguesas';
import flowPdf from './flows/flowPdf';
import flowHorario from './flows/flowHorario';
import flowPagos from './flows/flowPagos';
import flowHamburguesaclasica from './flows/flowHamburguesaclasica';
import flowHamburguesadePollo from './flows/flowHamburguesadePollo';
import flowHamburguesaPicante from './flows/flowHamburguesaPicante';
import flowHamburguesaVegana from './flows/flowHamburguesaVegana';
import flowHamburguesaBBQ from './flows/flowHamburguesaBBQ';
import flowUbicacion from './flows/flowUbicacion';
import flowCompra from './flows/flowCompra';
import flowDb from './flows/flowDb';
import flowCapturaNumero from './flows/flowCapturarNumero';
import flowContacto from "./flows/flowContacto"
import flowStatu from './flows/flowStatu';
import flowBroadcast from "./flows/flowBroadcast"

const usersBlocked = ["584122033721"]

const main = async () => {
    console.log(`Users Blocked: ${usersBlocked}`)
    const adapterFlow = createFlow([menuFlow, flowHamburguesas, flowHamburguesaclasica, flowPdf, flowHorario, flowCompra, flowDb, flowHamburguesaBBQ, flowHamburguesaPicante, flowHamburguesaVegana, flowHamburguesadePollo, flowUbicacion, flowPagos, flowCapturaNumero, flowContacto, flowStatu, flowBroadcast])
    
    const adapterProvider = createProvider(Provider, { usePairingCode: true, phoneNumber: "573219412929" })
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
    QRPortalWeb()

}

main()
