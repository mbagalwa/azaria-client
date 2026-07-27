import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { BottomTabBar } from "@/components/app/bottom-tab-bar";
import { CustomerRealtime } from "@/components/app/customer-realtime";
import { ToastProvider } from "@/components/app/toast";
import { getCurrentCustomer } from "@/lib/auth";

/** Espace client protégé : redirige vers la connexion sans session valide. */
export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/app/connexion");

  return (
    <ToastProvider>
      <div className="flex min-h-dvh flex-col bg-cream">
        <AppHeader name={customer.fullName ?? customer.phone ?? "Mon compte"} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-6 pb-28 sm:py-8 lg:pb-8">
          {children}
        </main>
        <BottomTabBar />
        <CustomerRealtime userId={customer.id} />
      </div>
    </ToastProvider>
  );
}
