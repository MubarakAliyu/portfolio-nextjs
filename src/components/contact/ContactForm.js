// ContactForm: underline inputs with floating labels (each keystroke ticks),
// topic and budget pills, an auto-growing message with a counter, and a submit
// button that morphs into a spinner, draws a check mark and bursts into red
// squares on success. Invalid fields shake. ?subject= pre-fills the message.
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useSpring } from "framer-motion";
import clsx from "clsx";
import { site } from "@/data/site";
import { ease } from "@/lib/motion";
import { useSound } from "@/lib/sound/SoundProvider";
import FilterPills from "@/components/ui/FilterPills";
import styles from "@/styles/ContactForm.module.css";

export const TOPICS = ["Product design", "Website / Web app", "Branding", "Teaching / Talk", "Something else"];
export const BUDGETS = ["<$1k", "$1–5k", "$5–15k", "$15k+", "Not sure"];
export const MAX_MESSAGE = 1000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SHAKE = { x: [0, -8, 8, -6, 6, 0] };

function validate(values, topic) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please tell me your name.";
  if (!values.email.trim()) errors.email = "I need an email to reply to.";
  else if (!EMAIL.test(values.email.trim())) errors.email = "That email doesn't look quite right.";
  if (!topic) errors.topic = "Pick what this is about.";
  if (values.message.trim().length < 10) errors.message = "A little more detail, please (10+ characters).";
  return errors;
}

function ErrorText({ id, message }) {
  return (
    <span className={styles.errorMask}>
      <AnimatePresence>
        {message && (
          <motion.span
            id={id}
            key={message}
            className={styles.error}
            role="alert"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease }}
          >
            {message}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function Field({ id, label, value, error, shake, textarea, onChange, onBlur, onKeyDown, type = "text", ...rest }) {
  const box = useRef(null);
  useEffect(() => {
    if (shake && box.current) animate(box.current, SHAKE, { duration: 0.4 });
  }, [shake]);

  const Input = textarea ? "textarea" : "input";
  return (
    <div ref={box} className={clsx(styles.field, value && styles.filled, error && styles.invalid)}>
      <Input
        id={id}
        name={id}
        type={textarea ? undefined : type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={styles.input}
        rows={textarea ? 3 : undefined}
        placeholder=" "
        {...rest}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <span className={styles.line} aria-hidden="true" />
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

function makeBurst() {
  return Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.4;
    const speed = 160 + Math.random() * 180;
    return { id: i, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 120, size: 5 + Math.random() * 5, spin: Math.random() * 360 };
  });
}

export default function ContactForm({ subject = "" }) {
  const { play } = useSound();
  const presetTopic = subject ? (TOPICS.find((t) => t.toLowerCase() === subject.toLowerCase()) ?? "Something else") : null;
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: subject ? `Hi Mubarak, I'd like to know more about ${subject}…` : "",
    company: "", // honeypot: people never see it, bots fill it in
  });
  const [topic, setTopic] = useState(presetTopic);
  const [budget, setBudget] = useState(null);
  const [errors, setErrors] = useState({});
  const [shakes, setShakes] = useState({});
  const [status, setStatus] = useState("idle"); // idle → sending → success | error
  const [done, setDone] = useState(false);
  const [burst, setBurst] = useState([]);
  const button = useRef(null);
  const topicBox = useRef(null);
  const bx = useSpring(0, { stiffness: 250, damping: 18 });
  const by = useSpring(0, { stiffness: 250, damping: 18 });

  const set = (key) => (e) => {
    const value = key === "message" ? e.target.value.slice(0, MAX_MESSAGE) : e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    if (key === "message") {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const flag = (fieldErrors) => {
    setErrors((err) => ({ ...err, ...fieldErrors }));
    setShakes((s) => {
      const next = { ...s };
      Object.keys(fieldErrors).forEach((k) => {
        if (fieldErrors[k]) next[k] = (s[k] ?? 0) + 1;
      });
      return next;
    });
    if (fieldErrors.topic && topicBox.current) animate(topicBox.current, SHAKE, { duration: 0.4 });
    if (Object.values(fieldErrors).some(Boolean)) play("error");
  };

  const blur = (e) => {
    const key = e.target.name;
    const message = validate(values, topic)[key];
    if (message) flag({ [key]: message });
  };

  const typing = (e) => {
    if (e.key.length === 1 || e.key === "Backspace") play("type");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(values, topic);
    if (Object.keys(found).length) {
      flag(found);
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setStatus("sending");
    try {
      const [res] = await Promise.all([
        fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, topic, budget }),
        }),
        new Promise((r) => setTimeout(r, 900)), // let the spinner be seen
      ]);
      const data = await res.json().catch(() => ({}));
      if (res.status === 400 && data.errors) {
        setStatus("idle");
        flag(data.errors);
        return;
      }
      if (!res.ok || !data.ok) throw new Error("Request failed");
      setStatus("success");
      setBurst(makeBurst());
      play("success");
      setTimeout(() => setDone(true), 1400);
    } catch {
      setStatus("error");
      play("error");
      if (button.current) animate(button.current, SHAKE, { duration: 0.4 });
    }
  };

  const reset = () => {
    setValues({ name: "", email: "", message: "", company: "" });
    setTopic(null);
    setBudget(null);
    setErrors({});
    setBurst([]);
    setStatus("idle");
    setDone(false);
  };

  const round = status === "sending" || status === "success";
  const left = MAX_MESSAGE - values.message.length;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <motion.div
          key="thanks"
          className={styles.thanks}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          role="status"
        >
          <p className={styles.thanksTitle}>
            Thank you, {values.name.trim().split(" ")[0]}
            <span className={styles.square} aria-hidden="true" />
          </p>
          <p className={styles.thanksText}>I&apos;ll reply within 24–48 hours.</p>
          <button type="button" className={styles.again} onClick={reset}>
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          className={styles.form}
          onSubmit={submit}
          noValidate
          exit={{ opacity: 0, y: -24, transition: { duration: 0.4 } }}
          aria-label="Contact form"
        >
          <div className={styles.pair}>
            <Field id="name" label="Your name" value={values.name} error={errors.name} shake={shakes.name} onChange={set("name")} onBlur={blur} onKeyDown={typing} autoComplete="name" maxLength={100} />
            <Field id="email" label="Email" type="email" value={values.email} error={errors.email} shake={shakes.email} onChange={set("email")} onBlur={blur} onKeyDown={typing} autoComplete="email" maxLength={200} />
          </div>

          <fieldset className={styles.group} ref={topicBox}>
            <legend className={styles.legend}>What&apos;s this about?</legend>
            <FilterPills
              id="topic"
              label="What's this about?"
              options={TOPICS}
              value={topic}
              onChange={(t) => {
                setTopic(t);
                setErrors((err) => ({ ...err, topic: undefined }));
              }}
            />
            <ErrorText id="topic-error" message={errors.topic} />
          </fieldset>

          <fieldset className={styles.group}>
            <legend className={styles.legend}>
              Budget <span>(optional)</span>
            </legend>
            <FilterPills id="budget" label="Budget" options={BUDGETS} value={budget} onChange={(b) => setBudget((cur) => (cur === b ? null : b))} />
          </fieldset>

          <div className={styles.messageWrap}>
            <Field id="message" label="Message" textarea value={values.message} error={errors.message} shake={shakes.message} onChange={set("message")} onBlur={blur} onKeyDown={typing} />
            <span className={clsx(styles.counter, left < 100 && styles.counterWarn)} aria-live="polite">
              {values.message.length} / {MAX_MESSAGE}
            </span>
          </div>

          <div className={styles.honeypot} aria-hidden="true">
            <label>
              Company
              <input name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
            </label>
          </div>

          <div className={styles.actions}>
            <motion.button
              ref={button}
              layout
              type="submit"
              className={clsx(styles.submit, round && styles.round)}
              style={{ x: bx, y: by }}
              disabled={status === "sending"}
              aria-busy={status === "sending"}
              aria-label={status === "sending" ? "Sending" : status === "success" ? "Sent" : "Send message"}
              onMouseMove={(e) => {
                if (round) return;
                const r = e.currentTarget.getBoundingClientRect();
                bx.set(((e.clientX - r.left) / r.width - 0.5) * 16);
                by.set(((e.clientY - r.top) / r.height - 0.5) * 16);
              }}
              onMouseLeave={() => {
                bx.set(0);
                by.set(0);
              }}
              transition={{ layout: { duration: 0.45, ease } }}
              data-sound="none"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === "sending" ? (
                  <motion.svg key="spin" className={styles.spinner} viewBox="0 0 24 24" initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: 360 }} exit={{ opacity: 0 }} transition={{ rotate: { duration: 0.9, repeat: Infinity, ease: "linear" } }}>
                    <motion.circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 0.7 }} transition={{ duration: 0.6 }} />
                  </motion.svg>
                ) : status === "success" ? (
                  <motion.svg key="check" className={styles.spinner} viewBox="0 0 24 24" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                    <motion.path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, ease }} />
                  </motion.svg>
                ) : (
                  <motion.span key="label" className={styles.submitLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    Send message <span aria-hidden="true">→</span>
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Red squares fly out and fall (a CSS keyframe path with gravity baked in). */}
              {burst.map((p) => (
                <span
                  key={p.id}
                  className={styles.particle}
                  style={{
                    width: p.size,
                    height: p.size,
                    "--x1": `${p.vx * 0.45}px`,
                    "--y1": `${p.vy * 0.45 + 90}px`,
                    "--x2": `${p.vx * 0.9}px`,
                    "--y2": `${p.vy * 0.9 + 365}px`,
                    "--spin": `${p.spin}deg`,
                  }}
                  aria-hidden="true"
                />
              ))}
            </motion.button>

            <AnimatePresence>
              {status === "error" && (
                <motion.p className={styles.fallback} role="alert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  Something went wrong. Email me directly at <a href={`mailto:${site.email}`}>{site.email}</a>.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
