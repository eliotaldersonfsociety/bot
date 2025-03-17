import { addKeyword } from '@builderbot/bot';

const flowCheckIf = addKeyword('uli')
    .addAction(async (ctx, { flowDynamic, blacklist }) => {
        const dataCheck = blacklist.checkIf(ctx.from)
        await flowDynamic(`Muted: ${dataCheck}`);

    });
export default flowCheckIf
