import mysql from 'mysql2';
import { addKeyword, EVENTS } from '@builderbot/bot';
import menuFlow from '~/flowmenu/menuFlow';
const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'whatsapp_bot_db'
});
dbConnection.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        return;
    }
    console.log('Conexión establecida con la base de datos MySQL.');
});
const flowContacto = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, { state, flowDynamic, gotoFlow }) => {
    try {
        const nombre = ctx.pushName;
        const phoneNumber = ctx.from;
        await state.update({ nombre, phoneNumber });
        await insertarDatosEnBaseDeDatos(nombre, phoneNumber);
        await flowDynamic(`¡Hola *${ctx.pushName}*! Bienvenido a *Hamburguesas Vidal*. 🍔 \nSoy tu asistente virtual y estoy aquí para ayudarte, presiona cualquier letra para ver el *Menu*.`);
        await state.clear();
        return gotoFlow(menuFlow);
    }
    catch (error) {
        console.error('Error al capturar o guardar datos:', error);
        await flowDynamic('Ocurrió un error al guardar tus datos. Por favor, intenta nuevamente más tarde.');
    }
});
async function insertarDatosEnBaseDeDatos(nombre, phoneNumber) {
    const sqlSelect = 'SELECT COUNT(*) AS count FROM usuarios WHERE telefono = ?';
    const sqlInsert = 'INSERT INTO usuarios (nombre, telefono) VALUES (?, ?)';
    const valuesSelect = [phoneNumber];
    const valuesInsert = [nombre, phoneNumber];
    try {
        const [rows] = await dbConnection.promise().execute(sqlSelect, valuesSelect);
        const count = rows[0].count;
        if (count === 0) {
            await dbConnection.promise().execute(sqlInsert, valuesInsert);
            console.log('Datos insertados en la base de datos MySQL:', { nombre, phoneNumber });
        }
        else {
            console.log(`El número de teléfono ${phoneNumber} ya existe en la base de datos. No se guardaron los datos.`);
        }
    }
    catch (error) {
        throw new Error(`Error al insertar o verificar datos en la base de datos: ${error.message}`);
    }
}
export default flowContacto;
