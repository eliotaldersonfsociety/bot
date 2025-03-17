import mysql from 'mysql2/promise';
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'whatsapp_bot_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
async function insertarReserva(data) {
    const { reservationDate, peopleCount, fullName, contactNumber, comments } = data;
    const query = 'INSERT INTO reservas (fecha_hora, num_personas, nombre, contacto, comentarios) VALUES (?, ?, ?, ?, ?)';
    const values = [reservationDate, peopleCount, fullName, contactNumber, comments];
    try {
        const result = await pool.query(query, values);
        console.log('Reserva insertada correctamente:', result);
        return result;
    }
    catch (error) {
        console.error('Error al insertar reserva:', error);
        throw error;
    }
}
export default insertarReserva;
