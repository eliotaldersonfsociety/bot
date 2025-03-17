import { EVENTS, addKeyword } from '@builderbot/bot';

// Object to store timers for each user
const timers = {};

// Function to start the inactivity timer for a user
const start = (ctx, gotoFlow, ms, flow) => {
    timers[ctx.from] = setTimeout(() => {
        console.log(`User timeout: ${ctx.from}`);
        gotoFlow(flow).then(() => {
            console.log('Inactivity flow triggered');
            // Aquí puedes hacer cualquier otra acción adicional después de redirigir al flujo de inactividad
        });
    }, ms);
}

// Function to reset the inactivity timer for a user
const reset = (ctx, gotoFlow, ms, flow) => {
    stop(ctx);
    if (timers[ctx.from]) {
        console.log(`Reset countdown for user: ${ctx.from}`);
        clearTimeout(timers[ctx.from]);
    }
    start(ctx, gotoFlow, ms, flow);
}

// Function to stop the inactivity timer for a user
const stop = (ctx) => {
    if (timers[ctx.from]) {
        console.log(`Stopped timer for user: ${ctx.from}`);
        clearTimeout(timers[ctx.from]);
    }
}

export {
    start,
    reset,
    stop,
}
