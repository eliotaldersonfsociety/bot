import { addKeyword, EVENTS } from '@builderbot/bot';
const flowHorario = addKeyword(EVENTS.ACTION)
    .addAnswer('🕒 **Horario de Atención** 🕒\n' +
    '🍔 Martes a Viernes:\n' +
    '   - Mañanas: 11:00 AM - 3:00 PM\n' +
    '   - Tardes: 5:00 PM - 10:00 PM\n\n' +
    '🍔 Sábados y Domingos:\n' +
    '   - Todo el día: 12:00 PM - 10:00 PM\n\n' +
    '🚫 Cerrado los lunes.\n\n' +
    '1️⃣  Deseas hacer una compra\n' +
    '2️⃣  Volver al Menú Anterior🍔');
export default flowHorario;
