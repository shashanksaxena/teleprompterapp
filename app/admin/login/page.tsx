import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
    title: "Admin login",
    robots: {
        index: false,
        follow: false,
        noarchive: true
    }
};

export default function AdminLoginPage() {
    return (
        <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center px-4 py-10">
            <section className="glass-panel w-full rounded-[18px] p-6 md:p-8">
                <p className="section-kicker">Private area</p>
                <h1 className="mt-2 text-2xl font-semibold">Admin dashboard login</h1>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                    This area is restricted to the site administrator.
                </p>
                <AdminLoginForm />
            </section>
        </main>
    );
}
