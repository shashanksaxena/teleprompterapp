"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CreditCard, FileText, MessageSquare, UserRound } from "lucide-react";

export type AdminUser = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    lastSeenAt: string | null;
    planName: string;
    isPremium: boolean;
};

export type AdminScript = {
    id: string;
    title: string;
    content: string;
    ownerId: string;
    ownerEmail: string;
    createdAt: string;
    updatedAt: string;
};

export type AdminPayment = {
    id: string;
    email: string;
    provider: string;
    status: string;
    amountInr: number;
    createdAt: string;
    verifiedAt: string | null;
    activatedAt: string | null;
    nextBillingAt: string | null;
    providerPaymentId: string | null;
    providerSubscriptionId: string | null;
};

export type AdminLead = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    createdAt: string;
    status: string;
};

type AdminDataExplorerProps = {
    users: AdminUser[];
    scripts: AdminScript[];
    payments: AdminPayment[];
    leads: AdminLead[];
};

function formatDate(value: string | null) {
    if (!value) {
        return "Never";
    }

    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

export function AdminDataExplorer({ users, scripts, payments, leads }: AdminDataExplorerProps) {
    const [openUserId, setOpenUserId] = useState<string | null>(null);
    const [openScriptId, setOpenScriptId] = useState<string | null>(null);
    const [activePanel, setActivePanel] = useState<"users" | "scripts" | "payments" | "leads">("users");

    const panels = [
        ["users", "Accounts", UserRound],
        ["scripts", "Scripts", FileText],
        ["payments", "Payments", CreditCard],
        ["leads", "Contact leads", MessageSquare]
    ] as const;

    return (
        <div className="mt-5">
            <nav className="glass-panel flex flex-wrap gap-2 rounded-[18px] p-2" aria-label="Admin data panels">
                {panels.map(([panel, label, Icon]) => (
                    <button
                        key={panel}
                        type="button"
                        onClick={() => setActivePanel(panel)}
                        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${activePanel === panel ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "text-[var(--text-soft)] hover:bg-[var(--accent-soft)] hover:text-[var(--text)]"}`}
                        aria-selected={activePanel === panel}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </button>
                ))}
            </nav>

            <div className="mt-5">
                <section className={`glass-panel rounded-[18px] p-5 md:p-6 ${activePanel === "users" ? "" : "hidden"}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="section-kicker">Accounts</p>
                            <h2 className="mt-2 text-xl font-semibold">Registered users</h2>
                        </div>
                        <UserRound className="h-5 w-5 text-[var(--accent)]" />
                    </div>

                    <div className="mt-4 space-y-2">
                        {users.length ? (
                            users.map((user) => {
                                const isOpen = openUserId === user.id;
                                return (
                                    <div key={user.id} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-strong)]">
                                        <button
                                            type="button"
                                            onClick={() => setOpenUserId(isOpen ? null : user.id)}
                                            className="flex w-full items-center justify-between gap-3 p-3 text-left"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="min-w-0">
                                                <strong className="block truncate text-sm">{user.name}</strong>
                                                <span className="block truncate text-xs text-[var(--text-soft)]">{user.email}</span>
                                            </span>
                                            {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                                        </button>
                                        {isOpen ? (
                                            <div className="grid gap-2 border-t border-[var(--border)] p-3 text-sm text-[var(--text-soft)] sm:grid-cols-2">
                                                <p><strong className="text-[var(--text)]">Email:</strong> {user.email}</p>
                                                <p><strong className="text-[var(--text)]">Plan:</strong> {user.planName}{user.isPremium ? " (premium)" : ""}</p>
                                                <p><strong className="text-[var(--text)]">Registered:</strong> {formatDate(user.createdAt)}</p>
                                                <p><strong className="text-[var(--text)]">Updated:</strong> {formatDate(user.updatedAt)}</p>
                                                <p className="sm:col-span-2"><strong className="text-[var(--text)]">Last active:</strong> {formatDate(user.lastSeenAt)}</p>
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="py-4 text-sm text-[var(--text-soft)]">No registered users found.</p>
                        )}
                    </div>
                </section>

                <section className={`glass-panel rounded-[18px] p-5 md:p-6 ${activePanel === "scripts" ? "" : "hidden"}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="section-kicker">Content</p>
                            <h2 className="mt-2 text-xl font-semibold">Saved scripts</h2>
                        </div>
                        <FileText className="h-5 w-5 text-[var(--accent)]" />
                    </div>

                    <div className="mt-4 space-y-2">
                        {scripts.length ? (
                            scripts.map((script) => {
                                const isOpen = openScriptId === script.id;
                                return (
                                    <div key={script.id} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-strong)]">
                                        <button
                                            type="button"
                                            onClick={() => setOpenScriptId(isOpen ? null : script.id)}
                                            className="flex w-full items-center justify-between gap-3 p-3 text-left"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="min-w-0">
                                                <strong className="block truncate text-sm">{script.title}</strong>
                                                <span className="block truncate text-xs text-[var(--text-soft)]">{script.ownerEmail}</span>
                                            </span>
                                            {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                                        </button>
                                        {isOpen ? (
                                            <div className="border-t border-[var(--border)] p-3">
                                                <div className="grid gap-2 text-sm text-[var(--text-soft)] sm:grid-cols-2">
                                                    <p><strong className="text-[var(--text)]">Owner:</strong> {script.ownerEmail}</p>
                                                    <p><strong className="text-[var(--text)]">Characters:</strong> {script.content.length}</p>
                                                    <p><strong className="text-[var(--text)]">Created:</strong> {formatDate(script.createdAt)}</p>
                                                    <p><strong className="text-[var(--text)]">Updated:</strong> {formatDate(script.updatedAt)}</p>
                                                </div>
                                                <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-[10px] border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-xs leading-5 text-[var(--text-soft)]">
                                                    {script.content}
                                                </pre>
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="py-4 text-sm text-[var(--text-soft)]">No saved scripts found.</p>
                        )}
                    </div>
                </section>

                <section className={`glass-panel rounded-[18px] p-5 md:p-6 ${activePanel === "payments" ? "" : "hidden"}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="section-kicker">Billing</p>
                            <h2 className="mt-2 text-xl font-semibold">Payments and subscriptions</h2>
                        </div>
                        <CreditCard className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div className="mt-4 space-y-2">
                        {payments.length ? payments.map((payment) => (
                            <details key={payment.id} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-strong)] p-3">
                                <summary className="cursor-pointer list-none text-sm font-semibold">
                                    <span className="mr-3 inline-block rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs uppercase text-[var(--accent)]">{payment.status}</span>
                                    {payment.email} · ₹{payment.amountInr} · {payment.provider}
                                </summary>
                                <div className="mt-3 grid gap-2 border-t border-[var(--border)] pt-3 text-sm text-[var(--text-soft)] sm:grid-cols-2 lg:grid-cols-3">
                                    <p><strong className="text-[var(--text)]">Payment done:</strong> {formatDate(payment.verifiedAt || payment.createdAt)}</p>
                                    <p><strong className="text-[var(--text)]">Activated:</strong> {formatDate(payment.activatedAt)}</p>
                                    <p><strong className="text-[var(--text)]">Active till:</strong> {formatDate(payment.nextBillingAt)}</p>
                                    <p><strong className="text-[var(--text)]">Created:</strong> {formatDate(payment.createdAt)}</p>
                                    <p><strong className="text-[var(--text)]">Payment ID:</strong> {payment.providerPaymentId || "Pending"}</p>
                                    <p><strong className="text-[var(--text)]">Subscription ID:</strong> {payment.providerSubscriptionId || "Pending"}</p>
                                </div>
                            </details>
                        )) : <p className="py-4 text-sm text-[var(--text-soft)]">No payment records found.</p>}
                    </div>
                </section>

                <section className={`glass-panel rounded-[18px] p-5 md:p-6 ${activePanel === "leads" ? "" : "hidden"}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="section-kicker">Sales pipeline</p>
                            <h2 className="mt-2 text-xl font-semibold">Contact leads</h2>
                        </div>
                        <MessageSquare className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div className="mt-4 space-y-2">
                        {leads.length ? leads.map((lead) => (
                            <details key={lead.id} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-strong)] p-3">
                                <summary className="cursor-pointer list-none text-sm font-semibold">{lead.name} · {lead.email} · {lead.subject}</summary>
                                <div className="mt-3 border-t border-[var(--border)] pt-3 text-sm text-[var(--text-soft)]">
                                    <p>{lead.message}</p>
                                    <p className="mt-2"><strong className="text-[var(--text)]">Phone:</strong> {lead.phone || "Not provided"}</p>
                                    <p className="mt-2 text-xs">{formatDate(lead.createdAt)} · {lead.status}</p>
                                </div>
                            </details>
                        )) : <p className="py-4 text-sm text-[var(--text-soft)]">No contact leads found.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
}
