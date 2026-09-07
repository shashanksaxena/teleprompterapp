"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPending(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const result = await signIn("admin-credentials", {
            username: String(formData.get("username") ?? ""),
            password: String(formData.get("password") ?? ""),
            redirect: false
        });

        if (result?.error) {
            setError("Invalid admin credentials.");
            setPending(false);
            return;
        }

        router.replace("/admin");
        router.refresh();
    };

    return (
        <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
                Username
                <input name="username" required autoComplete="username" className="control-input mt-2 w-full" />
            </label>
            <label className="block text-sm font-medium">
                Password
                <input name="password" required type="password" autoComplete="current-password" className="control-input mt-2 w-full" />
            </label>
            {error ? <p className="text-sm text-rose-500">{error}</p> : null}
            <button type="submit" disabled={pending} className="cta-primary w-full disabled:opacity-60">
                {pending ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
}
