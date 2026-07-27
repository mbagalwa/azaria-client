"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BottomSheet } from "@/components/app/bottom-sheet";
import { formatUsd } from "@/lib/format";
import { createOrderAction } from "@/app/app/actions";
import type { MenuDish } from "@/lib/orders";

type Mode = "delivery" | "pickup";

export function OrderComposer({
  date,
  dishes,
  deliveryFeeCents,
}: {
  date: string;
  dishes: MenuDish[];
  deliveryFeeCents: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart] = useState<Record<number, number>>({});
  const [mode, setMode] = useState<Mode>("delivery");
  const [time, setTime] = useState("12:00");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [note, setNote] = useState("");

  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [detail, setDetail] = useState<MenuDish | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const byId = useMemo(() => new Map(dishes.map((d) => [d.dishId, d])), [dishes]);
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const d of dishes) if (d.category) set.add(d.category);
    return [...set];
  }, [dishes]);

  const q = search.trim().toLowerCase();
  const filtered = dishes.filter((d) => {
    if (activeCat && d.category !== activeCat) return false;
    if (q && !d.name.toLowerCase().includes(q)) return false;
    return true;
  });

  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ dish: byId.get(Number(id))!, qty }))
    .filter((l) => l.dish && l.qty > 0);
  const itemsTotal = lines.reduce((s, l) => s + l.dish.priceCents * l.qty, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const fee = mode === "delivery" ? deliveryFeeCents : 0;
  const grandTotal = itemsTotal + fee;

  function setQty(id: number, qty: number) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  function submit() {
    setError(null);
    const items = lines.map((l) => ({ dishId: l.dish.dishId, quantity: l.qty }));
    if (items.length === 0) return setError("Ajoutez au moins un plat au panier.");
    if (!time) return setError("Choisissez une heure souhaitée.");
    if (mode === "delivery" && !address.trim()) {
      return setError("Indiquez le lieu de livraison.");
    }
    const payload = {
      deliveryDate: date,
      deliveryTime: time,
      mode,
      address: mode === "delivery" ? address.trim() : null,
      landmark: landmark.trim() || null,
      paymentMethod: "cash_on_delivery" as const,
      note: note.trim() || null,
      items,
    };
    startTransition(async () => {
      const res = await createOrderAction(payload);
      if (!res.ok) return setError(res.error);
      router.push(`/app/commandes/${res.id}`);
    });
  }

  if (dishes.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-ink/15 bg-surface px-6 py-14 text-center">
        <p className="text-ink-soft">
          Aucun plat n&apos;est programmé pour cette date.
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Choisissez une autre date ci-dessus.
        </p>
      </div>
    );
  }

  const cartBody = (
    <CartBody
      lines={lines}
      itemsTotal={itemsTotal}
      deliveryFee={fee}
      grandTotal={grandTotal}
      onQty={setQty}
      mode={mode}
      setMode={setMode}
      time={time}
      setTime={setTime}
      address={address}
      setAddress={setAddress}
      landmark={landmark}
      setLandmark={setLandmark}
      note={note}
      setNote={setNote}
      error={error}
      pending={pending}
      onSubmit={submit}
    />
  );

  return (
    <>
      {/* Recherche */}
      <div className="relative mb-4">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un plat…"
          className="w-full rounded-btn border border-ink/10 bg-surface py-3 pl-10 pr-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </div>

      {/* Catégories */}
      {categories.length > 0 && (
        <div className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">
          <Chip active={activeCat === null} onClick={() => setActiveCat(null)}>
            Tous
          </Chip>
          {categories.map((c) => (
            <Chip key={c} active={activeCat === c} onClick={() => setActiveCat(c)}>
              {c}
            </Chip>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* Menu */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {filtered.map((dish) => (
            <DishCard
              key={dish.dishId}
              dish={dish}
              qty={cart[dish.dishId] ?? 0}
              onOpen={() => setDetail(dish)}
              onQty={(qy) => setQty(dish.dishId, qy)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-ink-muted">
              Aucun plat ne correspond.
            </p>
          )}
        </div>

        {/* Panier desktop */}
        <aside className="hidden rounded-card border border-ink/10 bg-surface p-5 lg:sticky lg:top-24 lg:block">
          <h2 className="mb-3 font-display text-lg font-bold text-ink">
            Votre commande
          </h2>
          {cartBody}
        </aside>
      </div>

      {/* Barre panier flottante (mobile) */}
      {itemCount > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-40 flex items-center justify-between gap-3 rounded-btn bg-brand px-4 py-3.5 text-cream shadow-[0_15px_35px_-12px_rgba(255,77,0,0.6)] lg:hidden"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-6 items-center justify-center rounded-full bg-cream/25 text-xs font-bold">
              {itemCount}
            </span>
            Voir le panier
          </span>
          <span className="font-display font-bold">{formatUsd(grandTotal)}</span>
        </button>
      )}

      {/* Détail plat */}
      <BottomSheet open={!!detail} onClose={() => setDetail(null)}>
        {detail && (
          <DishDetail
            key={detail.dishId}
            dish={detail}
            qty={cart[detail.dishId] ?? 0}
            onConfirm={(qy) => {
              setQty(detail.dishId, qy);
              setDetail(null);
            }}
          />
        )}
      </BottomSheet>

      {/* Panier mobile */}
      <BottomSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        title="Votre commande"
      >
        {cartBody}
      </BottomSheet>
    </>
  );
}

/* --------------------------------- pièces -------------------------------- */

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-chip px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-ink text-cream"
          : "bg-surface text-ink-soft ring-1 ring-ink/10 hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

function DishCard({
  dish,
  qty,
  onOpen,
  onQty,
}: {
  dish: MenuDish;
  qty: number;
  onOpen: () => void;
  onQty: (qty: number) => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-ink/10 bg-surface">
      <button
        type="button"
        onClick={onOpen}
        className="relative aspect-square bg-cream-deep"
        aria-label={`Voir ${dish.name}`}
      >
        {dish.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-3xl">
            🍽️
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col p-3">
        <button onClick={onOpen} className="text-left">
          <h3 className="truncate font-display text-sm font-semibold text-ink">
            {dish.name}
          </h3>
        </button>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display font-bold text-brand">
            {formatUsd(dish.priceCents)}
          </span>
          {qty === 0 ? (
            <button
              type="button"
              onClick={() => onQty(1)}
              aria-label={`Ajouter ${dish.name}`}
              className="flex size-8 items-center justify-center rounded-full bg-ink text-lg leading-none text-cream transition-colors hover:bg-brand"
            >
              +
            </button>
          ) : (
            <MiniStepper qty={qty} onChange={onQty} />
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStepper({
  qty,
  onChange,
}: {
  qty: number;
  onChange: (qty: number) => void;
}) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-cream-deep px-1 py-0.5">
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        aria-label="Retirer"
        className="flex size-6 items-center justify-center rounded-full text-ink-soft hover:text-brand"
      >
        −
      </button>
      <span className="min-w-4 text-center text-sm font-bold text-ink">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label="Ajouter"
        className="flex size-6 items-center justify-center rounded-full text-ink-soft hover:text-brand"
      >
        +
      </button>
    </span>
  );
}

function DishDetail({
  dish,
  qty,
  onConfirm,
}: {
  dish: MenuDish;
  qty: number;
  onConfirm: (qty: number) => void;
}) {
  const [q, setQ] = useState(qty > 0 ? qty : 1);

  return (
    <div className="space-y-4">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-cream-deep">
        {dish.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dish.imageUrl} alt={dish.name} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-5xl">🍽️</span>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">{dish.name}</h2>
          {dish.category && (
            <span className="mt-1 inline-block rounded-chip bg-cream-deep px-2 py-0.5 text-xs font-medium text-ink-soft">
              {dish.category}
            </span>
          )}
        </div>
        <span className="shrink-0 font-display text-xl font-bold text-brand">
          {formatUsd(dish.priceCents)}
        </span>
      </div>

      {dish.description && (
        <p className="text-sm leading-relaxed text-ink-soft">{dish.description}</p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <span className="flex items-center gap-2 rounded-btn border border-ink/15 px-1 py-1">
          <button
            type="button"
            onClick={() => setQ((v) => Math.max(1, v - 1))}
            aria-label="Retirer"
            className="flex size-8 items-center justify-center rounded-btn text-lg text-ink-soft hover:text-brand"
          >
            −
          </button>
          <span className="min-w-6 text-center font-bold text-ink">{q}</span>
          <button
            type="button"
            onClick={() => setQ((v) => v + 1)}
            aria-label="Ajouter"
            className="flex size-8 items-center justify-center rounded-btn text-lg text-ink-soft hover:text-brand"
          >
            +
          </button>
        </span>
        <button
          type="button"
          onClick={() => onConfirm(q)}
          className="flex-1 rounded-btn bg-brand px-4 py-3 text-sm font-semibold text-cream transition-colors hover:bg-brand-dark"
        >
          {qty > 0 ? "Mettre à jour" : "Ajouter"} · {formatUsd(dish.priceCents * q)}
        </button>
      </div>
    </div>
  );
}

type CartBodyProps = {
  lines: { dish: MenuDish; qty: number }[];
  itemsTotal: number;
  deliveryFee: number;
  grandTotal: number;
  onQty: (id: number, qty: number) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  time: string;
  setTime: (t: string) => void;
  address: string;
  setAddress: (v: string) => void;
  landmark: string;
  setLandmark: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  error: string | null;
  pending: boolean;
  onSubmit: () => void;
};

function CartBody(p: CartBodyProps) {
  return (
    <div>
      {p.lines.length === 0 ? (
        <p className="text-sm text-ink-muted">Panier vide — ajoutez des plats.</p>
      ) : (
        <ul className="space-y-3">
          {p.lines.map((l) => (
            <li key={l.dish.dishId} className="flex items-center gap-3">
              <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-cream-deep">
                {l.dish.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.dish.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center">🍽️</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {l.dish.name}
                </p>
                <p className="text-xs text-ink-soft">
                  {formatUsd(l.dish.priceCents)}
                </p>
              </div>
              <MiniStepper qty={l.qty} onChange={(q) => p.onQty(l.dish.dishId, q)} />
            </li>
          ))}
        </ul>
      )}

      <div className="my-4 border-t border-ink/10" />

      <Segment
        label="Mode"
        value={p.mode}
        onChange={(v) => p.setMode(v as Mode)}
        options={[
          { value: "delivery", label: "Livraison" },
          { value: "pickup", label: "Retrait" },
        ]}
      />

      {p.mode === "delivery" && (
        <div className="mt-3 space-y-3">
          <TextField label="Lieu de livraison" value={p.address} onChange={p.setAddress} placeholder="Av. du Lac 12, Goma" />
          <TextField label="Point de repère" value={p.landmark} onChange={p.setLandmark} placeholder="Près de la station…" />
        </div>
      )}

      <div className="mt-3">
        <FieldLabel>Heure souhaitée</FieldLabel>
        <input
          type="time"
          value={p.time}
          onChange={(e) => p.setTime(e.target.value)}
          className="w-full rounded-btn border border-ink/15 bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </div>

      <div className="mt-3">
        <FieldLabel>Instructions particulières</FieldLabel>
        <textarea
          value={p.note}
          onChange={(e) => p.setNote(e.target.value)}
          rows={2}
          placeholder="Sans piment, sonner deux fois…"
          className="w-full resize-y rounded-btn border border-ink/15 bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </div>

      {/* Récapitulatif */}
      <div className="mt-4 space-y-1.5 border-t border-ink/10 pt-3 text-sm">
        <div className="flex justify-between text-ink-soft">
          <span>Sous-total</span>
          <span>{formatUsd(p.itemsTotal)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>Frais de livraison</span>
          <span>
            {p.mode === "pickup"
              ? "—"
              : p.deliveryFee > 0
                ? formatUsd(p.deliveryFee)
                : "Gratuit"}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 font-semibold text-ink">
          <span>Total à payer</span>
          <span className="font-display text-lg font-bold text-brand">
            {formatUsd(p.grandTotal)}
          </span>
        </div>
      </div>

      <p className="mt-2 rounded-btn bg-cream-deep px-3 py-2 text-xs text-ink-soft">
        💵 Paiement à la livraison
        {p.mode === "delivery" && p.deliveryFee > 0
          ? " — les frais de livraison sont inclus dans le total."
          : "."}
      </p>

      {p.error && (
        <p
          role="alert"
          className="mt-3 rounded-btn border border-brand/30 bg-brand-tint px-3 py-2 text-sm font-medium text-brand-dark"
        >
          {p.error}
        </p>
      )}

      <button
        type="button"
        onClick={p.onSubmit}
        disabled={p.pending || p.lines.length === 0}
        className="mt-4 w-full rounded-btn bg-brand px-4 py-3.5 text-[0.95rem] font-semibold text-cream transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {p.pending ? "Envoi…" : `Commander · ${formatUsd(p.grandTotal)}`}
      </button>
    </div>
  );
}

function Segment({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="grid grid-cols-2 gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-btn border px-3 py-2.5 text-sm font-medium transition-colors ${
              value === o.value
                ? "border-brand bg-brand-tint text-brand-dark"
                : "border-ink/15 text-ink-soft hover:bg-ink/5"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-btn border border-ink/15 bg-surface px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/15"
      />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
      {children}
    </span>
  );
}
