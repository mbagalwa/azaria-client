"use client";

import { useState } from "react";
import { contactSection, site } from "@/lib/site";

/**
 * Formulaire de contact sans backend : à l'envoi, il ouvre WhatsApp
 * avec un message pré-rempli. C'est une vraie action (pas un faux
 * bouton) et ça reste cohérent avec le canal de contact retenu.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState<string>(contactSection.topics[0]);
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = [
      `Bonjour Azaria,`,
      name ? `Je suis ${name}.` : null,
      `Sujet : ${topic}.`,
      message ? `\n${message}` : null,
    ]
      .filter(Boolean)
      .join(" ");

    const href = `https://wa.me/${site.contact.whatsappDigits}?text=${encodeURIComponent(body)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-card border border-ink/10 bg-surface p-6 sm:p-8"
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-semibold text-ink"
          >
            Votre nom
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. Nadine"
            className="mt-2 w-full rounded-btn border border-ink/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-brand focus:bg-surface"
          />
        </div>

        <div>
          <label
            htmlFor="contact-topic"
            className="block text-sm font-semibold text-ink"
          >
            Sujet
          </label>
          <select
            id="contact-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-2 w-full rounded-btn border border-ink/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-surface"
          >
            {contactSection.topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-semibold text-ink"
          >
            Votre message
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Dites-nous tout…"
            className="mt-2 w-full resize-none rounded-btn border border-ink/15 bg-cream/40 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-brand focus:bg-surface"
          />
        </div>
      </div>

      <button
        type="submit"
        className="group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-btn bg-ink py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
      >
        Envoyer sur WhatsApp
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="text-amber transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>

      <p className="mt-3 text-center text-xs text-ink-muted">
        Le message s&apos;ouvre dans WhatsApp - vous validez avant l&apos;envoi.
      </p>
    </form>
  );
}
