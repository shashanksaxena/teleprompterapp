"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Mail, MessageSquare, Phone, Send, UserRound } from "lucide-react";

export function ContactForm() {
    const { data: session } = useSession();
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

    useEffect(() => {
        setForm((current) => ({
            ...current,
            name: current.name || session?.user?.name || "",
            email: current.email || session?.user?.email || ""
        }));
    }, [session?.user?.email, session?.user?.name]);

    const updateField = (field: keyof typeof form, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setState("sending");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            setState(response.ok ? "sent" : "error");
            if (response.ok) {
                setForm((current) => ({ ...current, subject: "", message: "" }));
            }
        } catch {
            setState("error");
        }
    };

    return (
        <section className="glass-panel overflow-hidden rounded-[18px] p-5 md:p-7">
            <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
                <div>
                    <p className="section-kicker">Send a message</p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight">Let&apos;s make your next recording better.</h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
                        Share a question, product idea, support request, or partnership opportunity. We&apos;ll get back to you using the details below.
                    </p>
                    <div className="mt-5 space-y-3 text-sm text-[var(--text-soft)]">
                        <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[var(--accent)]" /> Email replies from the product team</p>
                        <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[var(--accent)]" /> Phone number optional</p>
                    </div>
                </div>
                <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                    {(["name", "email", "phone", "subject"] as const).map((field) => (
                        <label key={field} className={field === "subject" ? "sm:col-span-2" : ""}>
                            <span className="mb-1.5 block text-sm font-medium capitalize">{field === "phone" ? "Contact number" : field}</span>
                            <div className="relative">
                                {field === "name" ? <UserRound className="absolute left-3 top-3 h-4 w-4 text-[var(--text-soft)]" /> : null}
                                {field === "email" ? <Mail className="absolute left-3 top-3 h-4 w-4 text-[var(--text-soft)]" /> : null}
                                {field === "phone" ? <Phone className="absolute left-3 top-3 h-4 w-4 text-[var(--text-soft)]" /> : null}
                                <input
                                    required={field !== "phone"}
                                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                                    inputMode={field === "phone" ? "tel" : undefined}
                                    value={form[field]}
                                    onChange={(event) => updateField(field, event.target.value)}
                                    className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface-strong)] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                                />
                            </div>
                        </label>
                    ))}
                    <label className="sm:col-span-2">
                        <span className="mb-1.5 block text-sm font-medium">Message</span>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-[var(--text-soft)]" />
                            <textarea
                                required
                                minLength={10}
                                value={form.message}
                                onChange={(event) => updateField("message", event.target.value)}
                                className="min-h-32 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2.5 pl-10 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                            />
                        </div>
                    </label>
                    <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
                        <button type="submit" disabled={state === "sending"} className="cta-primary inline-flex items-center disabled:opacity-60">
                            <Send className="h-4 w-4" />
                            {state === "sending" ? "Sending..." : "Send message"}
                        </button>
                        {state === "sent" ? <p className="text-sm text-emerald-600">Thanks. Your message has been received.</p> : null}
                        {state === "error" ? <p className="text-sm text-rose-600">We could not send that message. Please try again.</p> : null}
                    </div>
                </form>
            </div>
        </section>
    );
}