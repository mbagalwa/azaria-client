import { DishOfDay, DishOfDayFallback } from "@/components/dish-of-day";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WeekProgram } from "@/components/week-program";
import { getOrderingWindow, getWeekMenu } from "@/lib/orders";

export default async function Home() {
  // Un seul chargement pour les deux sections (plat du jour + semaine).
  const [menuRes, windowRes] = await Promise.all([
    getWeekMenu(),
    getOrderingWindow(),
  ]);

  const menu = menuRes.ok ? menuRes.data : null;
  const win = windowRes.ok ? windowRes.data : null;
  const days = menu?.days ?? [];

  // Plat mis en avant : le premier jour encore commandable. Après le
  // cut-off, c'est donc naturellement celui du lendemain.
  const earliest = win?.earliest ?? days[0]?.date ?? "";
  const featured = days.find((d) => d.dish && d.date >= earliest) ?? null;

  return (
    <>
      <SiteHeader />

      <main className="flex-1 pt-5">
        {/* Le plat du jour EST le hero : s'il manque (API indisponible,
            semaine vide), un repli garde un haut de page digne. */}
        {featured?.dish ? (
          <DishOfDay
            date={featured.date}
            dish={featured.dish}
            deliveryFeeCents={
              menu?.deliveryFeeCents ?? win?.deliveryFeeCents ?? 0
            }
            isToday={featured.date === win?.today}
            cutoff={win?.cutoff ?? menu?.orderCutoff ?? "09:00"}
          />
        ) : (
          <DishOfDayFallback />
        )}

        {/* Les plats de la semaine : c'est de là que le visiteur commande. */}
        <WeekProgram menu={menu} menuOk={menuRes.ok} win={win} />
      </main>

      <SiteFooter />
    </>
  );
}
