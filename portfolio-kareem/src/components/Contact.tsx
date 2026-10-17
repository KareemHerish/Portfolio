import { useState } from "react";
import { Check, Copy, Linkedin, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import SectionTitle from "./SectionTitle";

/* ------------------------------------------------------------------ */
/*  Contact details                                                    */
/* ------------------------------------------------------------------ */
const EMAIL = "kareemherish@gmail.com";
const PHONE_INTL = "201150549890";
const PHONE_SHOWN = "+20 115 054 9890";
const LINKEDIN = "https://www.linkedin.com/in/kareem-herish";
const LOCATION = "Benha, Egypt";

const CHANNELS = [
  { key: "email", label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, Icon: Mail, copy: EMAIL, external: false },
  { key: "phone", label: "WhatsApp & Phone", value: PHONE_SHOWN, href: `https://wa.me/${PHONE_INTL}`, Icon: MessageCircle, copy: `+${PHONE_INTL}`, external: true },
  { key: "linkedin", label: "LinkedIn", value: "Karim Abdelaziz", href: LINKEDIN, Icon: Linkedin, copy: LINKEDIN, external: true },
];

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const Contact = () => {
  const ref = useReveal<HTMLElement>();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const subject = `Portfolio message from ${name.trim() || "Visitor"}`;
  const bodyToSend = `${message.trim() || "Hi Kareem,\n\nI would like to get in touch with you."}${
    name.trim() ? `\n\nBest regards,\n${name.trim()}` : ""
  }`;

  const mailHref = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyToSend)}`;

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const rowBase =
    "flex items-center gap-4 rounded-xl border border-border bg-card/60 p-4 transition-colors";
  const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <section id="contact" ref={ref} className="py-24 relative z-10 bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionTitle title="Contact" />
        <p className="-mt-4 mb-10 max-w-xl text-muted-foreground">
          Let's make it happen.
        </p>

        <div className="reveal grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:items-stretch">
          {/* Channels */}
          <div className="space-y-3">
              {CHANNELS.map(({ key, label, value, href, Icon, copy: toCopy, external }) => (
                <div key={key} className={`${rowBase} hover:border-primary/50`}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`flex min-w-0 flex-1 items-center gap-4 rounded-lg ${focusRing}`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-muted-foreground">{label}</span>
                      <span className="block truncate text-sm font-medium text-foreground hover:text-primary transition-colors">
                        {value}
                      </span>
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copy(key, toCopy)}
                    aria-label={`Copy ${label}`}
                    title={copied === key ? "Copied" : "Copy"}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary ${focusRing}`}
                  >
                    {copied === key ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}

              {/* Location */}
              <div className={rowBase}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-muted-foreground">Location</span>
                  <span className="block text-sm font-medium text-foreground">{LOCATION}</span>
                </span>
              </div>
              <span className="sr-only" role="status">
                {copied ? "Copied to clipboard" : ""}
              </span>
            </div>

          {/* Composer - Perfectly aligned with left channels from top to bottom */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-5 md:p-6 h-full flex flex-col justify-between">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative h-full flex flex-col justify-between gap-3">
              <div>
                <label htmlFor="contact-name" className="sr-only">
                  Name
                </label>
                <input
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  autoComplete="name"
                  className={`w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground ${focusRing}`}
                />
              </div>

              <div className="flex-1 flex flex-col min-h-0 py-0.5">
                <label htmlFor="contact-message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message"
                  rows={3}
                  className={`block w-full flex-1 resize-none rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground ${focusRing}`}
                />
              </div>

              <div>
                <a
                  href={mailHref}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 ${focusRing}`}
                >
                  <Send className="h-4 w-4" />
                  Send email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;