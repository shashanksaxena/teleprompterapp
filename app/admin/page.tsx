import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import { AdminDataExplorer } from "@/components/admin-data-explorer";
import type { AdminLead, AdminPayment, AdminScript, AdminUser } from "@/components/admin-data-explorer";
import { getTeleprompterCollection } from "@/lib/mongodb";

export const metadata: Metadata = {
    title: "Admin dashboard",
    robots: {
        index: false,
        follow: false,
        noarchive: true
    }
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
        redirect("/admin/login");
    }

    let registeredUsers = 0;
    let activeUsers = 0;
    let premiumUsers = 0;
    let savedScripts = 0;
    let databaseError = false;
    let users: AdminUser[] = [];
    let scripts: AdminScript[] = [];
    let payments: AdminPayment[] = [];
    let leads: AdminLead[] = [];
    let notificationConsents: Array<{ id: string; decision: string; promptType: string; source: string; email: string | null; name: string | null; createdAt: string; userId: string | null }> = [];

    try {
        const collection = await getTeleprompterCollection();
        const activeSince = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        const [userCount, activeUserCount, premiumUserCount, scriptCount, userRecords, scriptRecords, paymentRecords, leadRecords, notificationConsentsRecords] = await Promise.all([
            collection.countDocuments({ kind: "user" }),
            collection.countDocuments({ kind: "user", lastSeenAt: { $gte: activeSince } }),
            collection.countDocuments({ kind: "user", "plan.isPremium": true }),
            collection.countDocuments({ kind: "script" }),
            collection.find({ kind: "user" }).sort({ updatedAt: -1 }).limit(100).toArray(),
            collection.find({ kind: "script" }).sort({ updatedAt: -1 }).limit(100).toArray(),
            collection.find({ kind: "payment_intent" }).sort({ createdAt: -1 }).limit(100).toArray(),
            collection.find({ kind: "contact_lead" }).sort({ createdAt: -1 }).limit(100).toArray(),
            collection.find({ kind: "notification_consent" }).sort({ createdAt: -1 }).limit(100).toArray()
        ]);
        registeredUsers = userCount;
        activeUsers = activeUserCount;
        premiumUsers = premiumUserCount;
        savedScripts = scriptCount;

        const userEmailById = new Map(userRecords.map((user) => [String(user._id), String(user.email ?? "Unknown user")]));
        users = userRecords.map((user) => ({
            id: String(user._id),
            name: String(user.name ?? "Creator"),
            email: String(user.email ?? "Unknown"),
            image: typeof user.image === "string" ? user.image : null,
            createdAt: String(user.createdAt ?? ""),
            updatedAt: String(user.updatedAt ?? ""),
            lastSeenAt: typeof user.lastSeenAt === "string" ? user.lastSeenAt : null,
            planName: String(user.plan?.name ?? "Free"),
            isPremium: Boolean(user.plan?.isPremium)
        }));
        scripts = scriptRecords.map((script) => ({
            id: String(script.id ?? script._id),
            title: String(script.title ?? "Untitled script"),
            content: String(script.content ?? ""),
            ownerId: String(script.ownerId ?? ""),
            ownerEmail: userEmailById.get(String(script.ownerId ?? "")) ?? "Unknown user",
            createdAt: String(script.createdAt ?? ""),
            updatedAt: String(script.updatedAt ?? "")
        }));
        payments = paymentRecords.map((payment) => ({
            id: String(payment.intentId ?? payment._id),
            email: String(payment.email ?? "Unknown user"),
            provider: String(payment.provider ?? "UPI"),
            status: String(payment.status ?? "unknown"),
            amountInr: Number(payment.amountInr ?? 0),
            createdAt: String(payment.createdAt ?? ""),
            verifiedAt: typeof payment.verifiedAt === "string" ? payment.verifiedAt : null,
            activatedAt: typeof payment.activatedAt === "string" ? payment.activatedAt : null,
            nextBillingAt: typeof payment.nextBillingAt === "string" ? payment.nextBillingAt : null,
            providerPaymentId: typeof payment.providerPaymentId === "string" ? payment.providerPaymentId : null,
            providerSubscriptionId: typeof payment.providerSubscriptionId === "string" ? payment.providerSubscriptionId : null
        }));
        leads = leadRecords.map((lead) => ({
            id: String(lead.id ?? lead._id),
            name: String(lead.name ?? "Unknown"),
            email: String(lead.email ?? "Unknown"),
            phone: typeof lead.phone === "string" ? lead.phone : null,
            subject: String(lead.subject ?? "General enquiry"),
            message: String(lead.message ?? ""),
            createdAt: String(lead.createdAt ?? ""),
            status: String(lead.status ?? "new")
        }));
        notificationConsents = notificationConsentsRecords.map((consent) => ({
            id: String(consent.id ?? consent._id),
            decision: String(consent.decision ?? "dismissed"),
            promptType: String(consent.promptType ?? "browser_notification"),
            source: String(consent.source ?? "landing_page"),
            email: typeof consent.email === "string" ? consent.email : null,
            name: typeof consent.name === "string" ? consent.name : null,
            createdAt: String(consent.createdAt ?? ""),
            userId: typeof consent.userId === "string" ? consent.userId : null
        }));
    } catch (error) {
        databaseError = true;
        console.error("Admin dashboard database unavailable.", error);
    }

    return (
        <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
            <header className="glass-panel rounded-[18px] p-5 md:p-7">
                <p className="section-kicker">Private administration</p>
                <h1 className="mt-2 text-3xl font-semibold">Website dashboard</h1>
                <p className="mt-2 text-sm text-[var(--text-soft)]">Operational metrics from the connected application database.</p>
            </header>

            {databaseError ? (
                <section className="mt-5 rounded-[18px] border border-amber-500/30 bg-amber-500/10 p-5 text-amber-900 dark:text-amber-100">
                    <p className="section-kicker">Database setup required</p>
                    <h2 className="mt-2 text-lg font-semibold">Dashboard is connected, but MongoDB is not configured.</h2>
                    <p className="mt-2 text-sm leading-6">
                        Add a valid <code>MONGODB_URI</code> to <code>.env.local</code>, restart the development server, and
                        reload this page to see live user and website statistics.
                    </p>
                </section>
            ) : null}

            <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    ["Registered users", registeredUsers],
                    ["Active in 15 min", activeUsers],
                    ["Premium users", premiumUsers],
                    ["Saved scripts", savedScripts]
                ].map(([label, value]) => (
                    <div key={label} className="glass-panel rounded-[16px] p-5">
                        <p className="section-kicker">{label}</p>
                        <p className="mt-3 text-3xl font-semibold">{value}</p>
                    </div>
                ))}
            </section>

            <section className="glass-panel mt-5 rounded-[18px] p-5 md:p-6">
                <p className="section-kicker">Status</p>
                <h2 className="mt-2 text-lg font-semibold">Presence definition</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                    Active users are authenticated users whose browser checked in within the last 15 minutes. This is an activity
                    estimate, not a list of open browser tabs.
                </p>
            </section>

            {!databaseError ? <AdminDataExplorer users={users} scripts={scripts} payments={payments} leads={leads} notificationConsents={notificationConsents} /> : null}
        </main>
    );
}
