"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Transmit } from "@adonisjs/transmit-client";
import { useToast } from "@/components/app/toast";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/order-status";

type CustomerOrderEvent = {
  id: number;
  code?: string;
  status?: string;
  paymentStatus?: string;
};

/**
 * Écoute le canal SSE `orders/user/:id`. À chaque changement de statut d'une
 * de ses commandes : un toast cliquable (→ suivi de la commande) + rafraîchit
 * la page (liste / détail) en direct.
 */
export function CustomerRealtime({ userId }: { userId: number }) {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return;

    const transmit = new Transmit({ baseUrl });
    const subscription = transmit.subscription(`orders/user/${userId}`);
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;

    subscription
      .create()
      .then(() => {
        subscription.onMessage((data: CustomerOrderEvent) => {
          const label = data?.status
            ? (ORDER_STATUS_LABEL[data.status] ?? data.status)
            : data?.paymentStatus
              ? (PAYMENT_STATUS_LABEL[data.paymentStatus] ?? data.paymentStatus)
              : null;
          if (label) {
            toast({
              title: data?.paymentStatus
                ? "Paiement 🔔"
                : "Mise à jour de commande 🔔",
              message: `${data.code ?? "Votre commande"} · ${label}`,
              href: `/app/commandes/${data.id}`,
            });
          }
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (!stopped) router.refresh();
          }, 300);
        });
      })
      .catch(() => {});

    return () => {
      stopped = true;
      clearTimeout(timer);
      subscription.delete().catch(() => {});
      transmit.close();
    };
  }, [router, toast, userId]);

  return null;
}
