"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { OrderDialog } from "@/components/order-dialog";
import { dishOfDay, type DayDish } from "@/lib/menu-data";

type OrderContext = {
  /** Ouvre le modal sur un plat donné (le plat du jour par défaut). */
  openOrder: (dish?: DayDish) => void;
  /**
   * Commandes passées pendant la visite. C'est ce nombre que porte la
   * pastille de la barre de nav — masquée tant qu'il vaut zéro, plutôt
   * qu'un compteur décoratif qui ne correspondrait à rien.
   */
  placedCount: number;
  notifyPlaced: () => void;
};

const Ctx = createContext<OrderContext | null>(null);

export function useOrder(): OrderContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOrder doit être utilisé dans <OrderProvider>");
  return ctx;
}

/**
 * Un seul modal pour toute la page : la barre de nav comme le hero et les
 * cartes de la semaine l'ouvrent, sur le plat de leur choix.
 */
export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [dish, setDish] = useState<DayDish | null>(null);
  const [placedCount, setPlacedCount] = useState(0);

  const openOrder = useCallback((next?: DayDish) => {
    setDish(next ?? dishOfDay);
  }, []);

  const notifyPlaced = useCallback(() => setPlacedCount((c) => c + 1), []);

  const value = useMemo(
    () => ({ openOrder, placedCount, notifyPlaced }),
    [openOrder, placedCount, notifyPlaced],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {dish && <OrderDialog dish={dish} onClose={() => setDish(null)} />}
    </Ctx.Provider>
  );
}
