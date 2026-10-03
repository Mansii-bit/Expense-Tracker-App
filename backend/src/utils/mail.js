import { BrevoClient } from "@getbrevo/brevo";

export const sendMail = async (email, subject, template) => {
    try {
        const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
        await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: process.env.SENDER_NAME || "Expense Tracker",
                email: process.env.SENDER_EMAIL,
            },
            to: [{ email }],
            subject: subject,
            htmlContent: template,
        });

        return true;
    } catch (err) {
        console.log("MAIL ERROR:", err);
        return false;
    }
};