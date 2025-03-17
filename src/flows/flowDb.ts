import { addKeyword, EVENTS } from '@builderbot/bot';
import insertarReserva from './db'; // Ajusta la ruta según sea necesario

// Flujo para hacer una reserva
const flowHacerReserva = addKeyword(EVENTS.ACTION)
  .addAnswer(['¡Vamos a hacer una reserva! 📝', 'Empecemos con tu reserva. 🕒'], { sensitive: true })
  .addAction(async (ctx, { flowDynamic, state }) => {
    await flowDynamic("📅 Por favor, proporciona la fecha y hora de la reserva en el siguiente formato: '20 de junio a las 18:00'");
    await state.clear(); // Limpiar estado antes de empezar
  })
  .addAction({ capture: true }, async (ctx, { flowDynamic, state }) => {
    const fechaHora = ctx.body;
    await state.update({ fechaHora });
    await flowDynamic("👥 Perfecto, ¿cuántas personas serán?");
  })
  .addAction({ capture: true }, async (ctx, { flowDynamic, state, fallBack }) => {
    const numPersonas = Number(ctx.body);

    // Validar que la entrada es un número válido
    if (isNaN(numPersonas) || numPersonas <= 0) {
      await flowDynamic("🚫 Por favor, proporciona un número válido de personas.");
      return fallBack(); // Pedir al usuario que ingrese de nuevo el número de personas
    }

    await state.update({ numPersonas });
    await flowDynamic("🙋‍♂️ Gracias. ¿Podrías proporcionar tu nombre completo?");
  })
  .addAction({ capture: true }, async (ctx, { flowDynamic, state }) => {
    const nombre = ctx.body;
    await state.update({ nombre });
    await flowDynamic("📞 ¿Cuál es tu número de contacto?");
  })
  .addAction({ capture: true }, async (ctx, { flowDynamic, state, fallBack }) => {
    const contacto = ctx.body;

    // Validar que la entrada es un número de contacto válido
    if (!/^\d+$/.test(contacto)) {
      await flowDynamic("🚫 Por favor, proporciona un número de contacto válido.");
      return fallBack(); // Pedir al usuario que ingrese de nuevo el número de contacto
    }

    await state.update({ contacto });
    await flowDynamic("✍️ ¿Hay algún comentario adicional que desees añadir? (Si no, puedes escribir 'Sin comentarios')");
  })
  .addAction({ capture: true }, async (ctx, { flowDynamic, state }) => {
    const comentarios = ctx.body;
    await state.update({ comentarios });

    try {
      const reservaData = await state.getMyState();
      console.log('Datos de la reserva:', reservaData);

      await insertarReserva({
        reservationDate: reservaData.fechaHora,
        peopleCount: reservaData.numPersonas,
        fullName: reservaData.nombre,
        contactNumber: reservaData.contacto,
        comments: reservaData.comentarios
      });

      await flowDynamic("✅ ¡Gracias por proporcionar la información! Estamos procesando tu reserva.");
      await flowDynamic("💬 ¿Hay algo más en lo que pueda ayudarte?");
    } catch (error) {
      console.error('Error al insertar reserva en la base de datos:', error.message);
      await flowDynamic('⚠️ Ocurrió un error al procesar tu reserva. Por favor, intenta nuevamente más tarde.');
    } finally {
      await state.clear();
    }
  });

export default flowHacerReserva;
