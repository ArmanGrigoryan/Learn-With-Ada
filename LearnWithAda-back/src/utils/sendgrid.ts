import sgMail, { ClientResponse } from '@sendgrid/mail';
import { NextFunction } from 'express';
sgMail.setApiKey(process.env.SENDGRID_KEY);

export async function sendEmail(
    userMail: string,
    subject: string,
    message: string,
    next: NextFunction,
): Promise<ClientResponse | void> {
    try {
        const res = await sgMail.send({
            to: userMail,
            from: process.env.SENDGRID_MAIL,
            subject: subject,
            text: message,
        });
        return res[0];
    } catch (err) {
        return next(err);
    }
}
