const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendMessage = async (req, res) => {
  const { name, email, service, message } = req.body;
  const msg = await ContactMessage.create({ name, email, service, message });
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Enquiry from ${name} — Spotted Point Media`,
      html: `<h3>New Contact Message</h3><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Service:</b> ${service || 'N/A'}</p><p><b>Message:</b><br/>${message}</p>`,
    });
  } catch (e) { console.log('Mail error:', e.message); }
  res.status(201).json({ message: 'Message received', id: msg._id });
};

const getMessages = async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
};

const markRead = async (req, res) => {
  await ContactMessage.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: 'Marked as read' });
};

module.exports = { sendMessage, getMessages, markRead };