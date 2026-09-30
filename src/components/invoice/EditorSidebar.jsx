import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SenderForm } from "./forms/SenderForm";
import { ReceiverForm } from "./forms/ReceiverForm";
import { DetailsForm } from "./forms/DetailsForm";
import { LineItems } from "./forms/LineItems";
import { SignatureForm } from "./forms/SignatureForm";
import { DesignControls } from "./DesignControls";
import useInvoiceStore from "@/store/useInvoiceStore";
import { Label } from "@/components/ui/label";
import { FileText, Palette, Sparkles } from "lucide-react";

export function EditorSidebar({ mobileView }) {
  const { invoice, updateFooter, design } = useInvoiceStore();
  const colorMap = { "blue-600": "#7C3AED", "emerald-600": "#059669", "rose-600": "#e11d48", "amber-600": "#d97706", "slate-600": "#475569" };
  const accentHex = design.accentColor.startsWith("#") ? design.accentColor : colorMap[design.accentColor] || "#7C3AED";
  const sectionClass = "rounded-2xl border border-border/70 bg-card p-4 shadow-sm shadow-black/[0.02]";
  const headingClass = "mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground";

  return (
    <div className={`flex h-full flex-col ${mobileView ? "" : "bg-background"}`}>
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles size={17} /></div><div><p className="text-sm font-bold">Invoice editor</p><p className="text-[11px] text-muted-foreground">Build your next invoice</p></div></div>
        <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ color: accentHex, backgroundColor: `${accentHex}14` }}>DRAFT</span>
      </div>
      <Tabs defaultValue="content" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="border-b border-border/60 px-5 py-3"><TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-muted/60 p-1"><TabsTrigger value="content" className="rounded-lg text-xs"><FileText size={14} className="mr-2" /> Content</TabsTrigger><TabsTrigger value="design" className="rounded-lg text-xs"><Palette size={14} className="mr-2" /> Design</TabsTrigger></TabsList></div>
        <TabsContent value="content" className="mt-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 custom-scrollbar">
          <section className={sectionClass}><h3 className={headingClass}>Your business</h3><SenderForm /></section>
          <section className={sectionClass}><h3 className={headingClass}>Client</h3><ReceiverForm /></section>
          <section className={sectionClass}><h3 className={headingClass}>Invoice details</h3><DetailsForm /></section>
          <section className={sectionClass}><LineItems /></section>
          <section className={sectionClass}><SignatureForm /></section>
          <section className={sectionClass}><Label className={headingClass}>Footer note</Label><textarea className="mt-1 flex min-h-[88px] w-full resize-y rounded-xl border border-input bg-muted/20 px-3 py-2.5 text-sm shadow-sm transition placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30" value={invoice.footer} onChange={(e) => updateFooter(e.target.value)} placeholder="Add a thank you message or payment terms..." /></section>
        </TabsContent>
        <TabsContent value="design" className="mt-0 flex-1 overflow-y-auto px-5 py-5 custom-scrollbar"><DesignControls /></TabsContent>
      </Tabs>
    </div>
  );
}
