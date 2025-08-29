import { Resend } from 'resend';

// Inițializează Resend cu cheia API din Vercel Environment Variables
const resend = new Resend(process.env.RESEND_API_KEY);
// Adresa de email pe care vei primi mesajele
const TO_EMAIL = process.env.CONTACT_FORM_EMAIL; 

export default async function handler(req, res) {
    // Permite cereri CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Numele, email-ul și mesajul sunt obligatorii.' });
        }

        // Trimite email-ul
        await resend.emails.send({
            from: 'Website VOLTIXITY <onboarding@resend.dev>', // Trebuie să fie un domeniu verificat
            to: TO_EMAIL,
            subject: `Mesaj nou de la ${name} - Voltixity.ro`,
            html: `
                <p><strong>Nume:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefon:</strong> ${phone || 'Nespecificat'}</p>
                <hr>
                <p><strong>Mesaj:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        res.status(200).json({ success: true, message: 'Mesajul a fost trimis cu succes!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'A apărut o eroare la trimiterea mesajului.' });
    }
}
