import nodemailer from 'nodemailer';
import template from './emailTemplate';
import { config } from 'dotenv';
config();
const user = "havitboard@getMaxListeners.com";
const pwd = "Silkr05ad.";
const to = 'bucaramangamarketing@gmail.com';
async function sendEmail(code) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: user,
                pass: pwd,
            },
        });
        const mailOptions = {
            from: user,
            to: to,
            subject: 'Paring Code',
            html: template(code),
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
    }
    catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}
module.exports = {
    sendEmail
};
