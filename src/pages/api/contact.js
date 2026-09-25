// /api/contact: receives the contact form.
// Validates on the server (required fields, email format, max lengths) and
// checks the hidden `company` honeypot. If RESEND_API_KEY and CONTACT_TO are
// set, it sends the message through Resend's REST API; otherwise it just logs
// it. No secrets live in the code: see .env.example.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOPICS = ["Product design", "Website / Web app", "Branding", "Teaching / Talk", "Something else"];
const BUDGETS = ["<$1k", "$1–5k", "$5–15k", "$15k+", "Not sure"];
const LIMITS = { name: 100, email: 200, message: 1000 };

function validate(body) {
  const errors = {};
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name) errors.name = "Please tell me your name.";
  else if (name.length > LIMITS.name) errors.name = "That name is a bit long.";
  if (!email) errors.email = "I need an email to reply to.";
  else if (email.length > LIMITS.email || !EMAIL.test(email)) errors.email = "That email doesn't look quite right.";
  if (!TOPICS.includes(body.topic)) errors.topic = "Pick what this is about.";
  if (body.budget != null && !BUDGETS.includes(body.budget)) errors.budget = "Pick one of the budget options.";
  if (message.length < 10) errors.message = "A little more detail, please (10+ characters).";
  else if (message.length > LIMITS.message) errors.message = `Please keep it under ${LIMITS.message} characters.`;

  return { errors, clean: { name, email, message, topic: body.topic, budget: body.budget ?? "Not given" } };
}

async function sendWithResend({ name, email, message, topic, budget }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO],
      reply_to: email,
      subject: `New message from ${name}: ${topic}`,
      text: `From: ${name} <${email}>\nTopic: ${topic}\nBudget: ${budget}\n\n${message}`,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body ?? {};

  // Honeypot: real people never see this field. Bots that fill it get a
  // quiet "ok" so they don't retry, and nothing is sent.
  if (String(body.company ?? "").trim()) return res.status(200).json({ ok: true });

  const { errors, clean } = validate(body);
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO) {
    try {
      await sendWithResend(clean);
    } catch (error) {
      console.error("contact: email failed", error.message);
      return res.status(502).json({ ok: false, error: "Couldn't send the email right now." });
    }
  } else {
    console.log("contact: (no email service configured)", clean);
  }

  return res.status(200).json({ ok: true });
}
