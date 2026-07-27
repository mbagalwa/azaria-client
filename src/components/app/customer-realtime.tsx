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
 * Écoute le canal SSE `orders/code/:code` sur la page de suivi. Le canal est
 * indexé par le CODE de commande — le secret que le client détient via son lien
 * — et non par un id séquentiel énumérable.
 *
 * À chaque changement : un toast + rafraîchissement de la page en direct.
 */
export function CustomerRealtime({ code }: { code: string }) {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return;

    const transmit = new Transmit({ baseUrl });
    const subscription = transmit.subscription(`orders/code/${code}`);
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
              href: `/commande/${data.code ?? code}`,
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
  }, [router, toast, code]);

  return null;
}
