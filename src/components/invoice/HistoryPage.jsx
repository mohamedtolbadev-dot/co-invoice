import React from "react";
import { ArrowUpRight, CalendarDays, FileClock, FileText, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useInvoiceStore from "@/store/useInvoiceStore";
import { calculateTotals, formatCurrency } from "@/lib/utils";
import { SignatureBlock } from "@/components/invoice/templates/SignatureBlock";

const formatDate = (date) => {
  if (!date) return "—";
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString();
};

function DetailField({ label, value }) {
  return <div><p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium">{value || "—"}</p></div>;
}

function InvoiceDetails({ entry, onClose }) {
  const { invoice, design } = entry;
  const { sender, receiver, details, lineItems = [], footer, signature } = invoice;
  const totals = calculateTotals(lineItems, details.taxRate);

  React.useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm md:p-8" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="history-detail-title" className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border/70 px-5 py-4 md:px-7">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Saved invoice</p><h2 id="history-detail-title" className="mt-1 text-xl font-bold">{details.number || "Untitled invoice"}</h2></div>
          <Button variant="ghost" size="icon" aria-label="Close details" className="rounded-xl" onClick={onClose}><X size={18} /></Button>
        </header>
        <div className="overflow-y-auto p-5 md:p-7">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card p-4"><h3 className="mb-4 text-sm font-semibold">From</h3>{sender.logo && <img src={sender.logo} alt="Business logo" className="mb-4 h-12 max-w-32 object-contain" />}<div className="space-y-3"><DetailField label="Business" value={sender.name} /><DetailField label="Address" value={sender.address} /><DetailField label="Email" value={sender.email} /><DetailField label="Phone" value={sender.phone} /></div></div>
            <div className="rounded-2xl border border-border/70 bg-card p-4"><h3 className="mb-4 text-sm font-semibold">Billed to</h3><div className="space-y-3"><DetailField label="Client" value={receiver.name} /><DetailField label="Address" value={receiver.address} /><DetailField label="Email" value={receiver.email} /><DetailField label="Phone" value={receiver.phone} /></div></div>
            <div className="rounded-2xl border border-border/70 bg-card p-4"><h3 className="mb-4 text-sm font-semibold">Invoice information</h3><div className="space-y-3"><DetailField label="Number" value={details.number} /><DetailField label="Issue date" value={formatDate(details.date)} /><DetailField label="Due date" value={formatDate(details.dueDate)} /><DetailField label="Currency" value={details.currency} /><DetailField label="Tax rate" value={`${details.taxRate || 0}%`} /></div></div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border/70">
            <div className="flex items-center justify-between bg-muted/40 px-4 py-3"><h3 className="text-sm font-semibold">Line items</h3><span className="text-xs text-muted-foreground">{lineItems.length} items</span></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead className="border-y border-border/70 text-left text-xs text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Description</th><th className="px-4 py-3 text-right font-medium">Qty</th><th className="px-4 py-3 text-right font-medium">Rate</th><th className="px-4 py-3 text-right font-medium">Amount</th></tr></thead><tbody>{lineItems.map((item) => <tr key={item.id} className="border-b border-border/50 last:border-0"><td className="px-4 py-3">{item.description || "—"}</td><td className="px-4 py-3 text-right">{item.quantity}</td><td className="px-4 py-3 text-right">{formatCurrency(Number(item.rate), details.currency)}</td><td className="px-4 py-3 text-right font-medium">{formatCurrency(Number(item.quantity) * Number(item.rate), details.currency)}</td></tr>)}</tbody></table></div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_280px]">
            <div className="rounded-2xl border border-border/70 bg-card p-4"><h3 className="mb-3 text-sm font-semibold">Note</h3><p className="whitespace-pre-wrap text-sm text-muted-foreground">{footer || "No note added."}</p><SignatureBlock signature={signature} /><div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground"><span>Template: {design.template} · Font: {design.fontStack}</span><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: design.accentColor }} />Accent color</span></div></div>
            <div className="space-y-2 rounded-2xl border border-border/70 bg-muted/30 p-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(totals.subtotal, details.currency)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(totals.taxAmount, details.currency)}</span></div><div className="mt-2 flex justify-between border-t border-border/70 pt-3 text-base font-bold"><span>Total</span><span className="text-primary">{formatCurrency(totals.total, details.currency)}</span></div></div>
          </div>
          <p className="mt-4 text-right text-xs text-muted-foreground">Saved {new Date(entry.createdAt).toLocaleString()}</p>
        </div>
      </section>
    </div>
  );
}

export function HistoryPage({ onOpenInvoice }) {
  const { history, deleteInvoiceFromHistory } = useInvoiceStore();
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState(null);
  const filteredHistory = history.filter((entry) => {
    const text = `${entry.invoice.details.number} ${entry.invoice.receiver.name} ${entry.invoice.sender.name}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex flex-col gap-4 border-b border-border/70 bg-background/80 px-5 py-5 backdrop-blur md:flex-row md:items-center md:justify-between md:px-9">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workspace / History</p><h1 className="mt-1 text-2xl font-bold tracking-tight">Saved invoices</h1><p className="mt-1 text-sm text-muted-foreground">Review and manage your saved invoice records.</p></div>
        <div className="flex w-full gap-2 md:w-auto"><div className="relative flex-1 md:w-72"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search number or client" className="pl-9" /></div><div className="flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-card px-3 text-sm"><FileClock size={16} className="text-primary" />{history.length}</div></div>
      </header>

      <div className="flex-1 overflow-y-auto bg-muted/20 p-5 md:p-9">
        {filteredHistory.length === 0 ? (
          <div className="mx-auto mt-10 flex max-w-lg flex-col items-center rounded-3xl border border-dashed border-border bg-background/80 px-6 py-14 text-center shadow-sm"><div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><FileText size={24} /></div><h2 className="text-lg font-semibold">{history.length ? "No matching invoices" : "Your history is empty"}</h2><p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{history.length ? "Try another invoice number or client name." : "Save an invoice from the editor and it will appear here with all of its details."}</p></div>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2 2xl:grid-cols-3">{filteredHistory.map((entry) => {
            const { invoice } = entry;
            const totals = calculateTotals(invoice.lineItems || [], invoice.details.taxRate);
            return <article key={entry.id} className="group rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.06]">
              <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><FileText size={19} /></div><div className="min-w-0"><h2 className="truncate font-bold">{invoice.details.number || "Untitled invoice"}</h2><p className="truncate text-xs text-muted-foreground">{invoice.receiver.name || "No client name"}</p></div></div><Button variant="ghost" size="icon" aria-label={`Delete ${invoice.details.number || "invoice"}`} className="h-9 w-9 shrink-0 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => deleteInvoiceFromHistory(entry.id)}><Trash2 size={16} /></Button></div>
              <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-muted/35 p-3"><div><p className="text-[11px] text-muted-foreground">Total</p><p className="mt-1 font-bold text-primary">{formatCurrency(totals.total, invoice.details.currency)}</p></div><div><p className="text-[11px] text-muted-foreground">Issue date</p><p className="mt-1 flex items-center gap-1.5 text-sm font-medium"><CalendarDays size={13} className="text-muted-foreground" />{formatDate(invoice.details.date)}</p></div></div>
              <div className="mt-4 flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{invoice.lineItems.length} line items · {invoice.details.taxRate || 0}% tax</span><div className="flex gap-2"><Button variant="outline" size="sm" className="rounded-lg" onClick={() => setSelected(entry)}>Details</Button><Button size="sm" className="rounded-lg" onClick={() => onOpenInvoice(entry.id)}>Open <ArrowUpRight size={14} className="ml-1" /></Button></div></div>
            </article>;
          })}</div>
        )}
      </div>
      {selected && <InvoiceDetails entry={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
