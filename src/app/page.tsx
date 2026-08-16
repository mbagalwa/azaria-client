import { Hero } from "@/components/hero";
import { OrderProvider } from "@/components/order-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WeekMenu } from "@/components/week-menu";

export default function Home() {
  return (
    <OrderProvider>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <WeekMenu />
      </main>
      <SiteFooter />
    </OrderProvider>
  );
}
