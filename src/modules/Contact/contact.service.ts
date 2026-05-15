import nodemailer from 'nodemailer';
import config from '../../config';

const sendContactEmail = async (payload: {
    fullName: string;
    email: string;
    subject: string;
    message: string;
}) => {
    const { fullName, email, subject, message } = payload;

    // ডিবাগিং এর জন্য ক্রেডেনশিয়াল চেক (টার্মিনালে দেখবেন)
    console.log('Email User:', process.env.EMAIL_USER ? 'Found' : 'Missing');
    console.log('Email Pass:', process.env.EMAIL_PASS ? 'Found' : 'Missing');

    // ১. ট্রান্সপোর্টার তৈরি করুন (Explicit Config)
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Gmail এর জন্য এটি বেশি সহজ এবং কার্যকর
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // ২. ইমেইল কন্টেন্ট সাজান
    const mailOptions = {
        from: `"CineTube Contact" <${process.env.EMAIL_USER}>`, 
        replyTo: email, 
        to: process.env.EMAIL_USER, // এখানে সরাসরি এনভায়রনমেন্ট ভেরিয়েবল ব্যবহার করা হলো
        subject: `CineTube Contact: ${subject}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background-color: #f4f7f6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">New Contact Inquiry</h2>
                    </div>
                    <div style="padding: 40px;">
                        <div style="margin-bottom: 25px;">
                            <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">From</p>
                            <p style="margin: 5px 0 0; font-size: 18px; font-weight: 700; color: #111827;">${fullName} (${email})</p>
                        </div>
                        <div style="margin-bottom: 25px;">
                            <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Subject</p>
                            <p style="margin: 5px 0 0; font-size: 16px; color: #374151;">${subject}</p>
                        </div>
                        <div style="background: #f9fafb; padding: 25px; border-radius: 12px; border-left: 4px solid #4f46e5;">
                            <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Message</p>
                            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4b5563;">${message}</p>
                        </div>
                    </div>
                    <div style="background: #fdfdfd; padding: 20px; border-top: 1px solid #eee; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">This inquiry was generated via CineTube Contact Form.</p>
                    </div>
                </div>
            </div>
        `,
    };

    try {
        console.log('Attempting to send email...');
        // verify connection configuration
        await transporter.verify();
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error: any) {
        console.error('CRITICAL Nodemailer Error:', error.message);
        // এরর মেসেজটি থ্রো করছি যাতে কন্ট্রোলার এটি ক্যাচ করতে পারে
        throw new Error(`Nodemailer Failed: ${error.message}`);
    }
};

export const ContactService = {
    sendContactEmail,
};
