import nodemailer from 'nodemailer';
import config from '../../config';

const subscribeNewsletter = async (email: string) => {
    // ১. ট্রান্সপোর্টার তৈরি করুন
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // ২. ইমেইল কন্টেন্ট সাজান
    const mailOptions = {
        from: `"CineTube" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // অ্যাডমিনকে জানানো
        subject: 'New Newsletter Subscription',
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #4f46e5;">New CineTube Subscriber!</h2>
                <p>Great news! A new user has subscribed to the newsletter.</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                    <p><strong>Email:</strong> ${email}</p>
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 20px;">Time: ${new Date().toLocaleString()}</p>
            </div>
        `,
    };

    // ৩. ইউজারের জন্য ওয়েলকাম ইমেইল (অপশনাল কিন্তু ভালো প্র্যাকটিস)
    const welcomeMail = {
        from: `"CineTube" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to CineTube Newsletter!',
        html: `
            <div style="font-family: sans-serif; padding: 30px; text-align: center; background-color: #f9fafb;">
                <h1 style="color: #4f46e5;">Welcome to the CineTube Club! 🎬</h1>
                <p style="font-size: 16px; color: #374151;">Thanks for subscribing! You'll be the first to know about new releases, exclusive trailers, and premium content updates.</p>
                <div style="margin: 30px 0;">
                    <a href="http://localhost:3000" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Browsing</a>
                </div>
                <p style="font-size: 12px; color: #9ca3af;">If you didn't subscribe to this list, you can ignore this email.</p>
            </div>
        `,
    };

    // ৪. ইমেইল পাঠান
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(welcomeMail);

    return { message: 'Subscribed successfully' };
};

export const NewsletterService = {
    subscribeNewsletter,
};
