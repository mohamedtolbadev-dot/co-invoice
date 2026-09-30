import React, { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EditorSidebar } from "@/components/invoice/EditorSidebar";
import { PreviewCanvas } from "@/components/invoice/PreviewCanvas";
import { HistoryPage } from "@/components/invoice/HistoryPage";
import { FilePlus2, History, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Printer, Save, Sparkles } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import useInvoiceStore from "@/store/useInvoiceStore";
import { Footer } from "@/components/Footer";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const [activePage, setActivePage] = React.useState("editor");
  const [saveMessage, setSaveMessage] = React.useState("");
  const contentRef = useRef(null);
  const { design, invoice, history, saveInvoiceToHistory, loadInvoiceFromHistory } = useInvoiceStore();

  const handlePrint = useReactToPrint({ contentRef, documentTitle: invoice.details.number || "Invoice" });
  const handleSaveInvoice = () => {
    saveInvoiceToHistory();
    setSaveMessage("Saved to history");
    window.setTimeout(() => setSaveMessage(""), 2500);
  };
  const openHistoryInvoice = (id) => {
    loadInvoiceFromHistory(id);
    setActivePage("editor");
  };

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", design.darkMode);
  }, [design.darkMode]);

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-4">
            <a href="/" className="font-bold tracking-tight text-primary">co-invoice<span className="text-foreground">.</span></a>
            <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="rounded-full" onClick={() => setActivePage(activePage === "history" ? "editor" : "history")}><History size={14} className="mr-1.5" />{activePage === "history" ? "Editor" : `History (${history.length})`}</Button>{activePage === "editor" && <Button size="sm" onClick={handleSaveInvoice} className="rounded-full"><Save size={14} className="mr-1.5" />Save</Button>}</div>
          </div>
        </header>
        {activePage === "history" ? <div className="min-h-[80vh] flex-1"><HistoryPage onOpenInvoice={openHistoryInvoice} /></div> : <Tabs defaultValue="edit" className="flex min-w-0 flex-1 flex-col"><TabsList className="grid h-11 w-full grid-cols-2 rounded-none border-b border-border/60 bg-transparent px-3"><TabsTrigger value="edit">Editor</TabsTrigger><TabsTrigger value="preview">Preview</TabsTrigger></TabsList><TabsContent value="edit" className="mt-0 min-w-0 flex-1 overflow-auto"><EditorSidebar mobileView /></TabsContent><TabsContent value="preview" className="relative mt-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-muted/40 pb-8"><div className="absolute right-4 top-4 z-40"><Button size="sm" onClick={handlePrint}><Printer size={14} className="mr-1.5" />PDF</Button></div><PreviewCanvas ref={contentRef} /></TabsContent></Tabs>}
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f5f6fa] text-foreground dark:bg-[#101116]">
      <header className="z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-border/70 bg-background/85 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Sparkles size={19} /></div><div><a href="/" className="text-[17px] font-bold tracking-tight">co-invoice<span className="text-primary">.</span></a><p className="text-[11px] text-muted-foreground">Invoice studio</p></div></div>
        <div className="flex items-center gap-2">
          {activePage === "editor" ? <><div className="mr-2 hidden items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{saveMessage || "Changes saved on this device"}</div><Button variant="outline" onClick={handleSaveInvoice} className="h-10 rounded-xl"><Save size={15} className="mr-2" />Save to history</Button><Button onClick={handlePrint} className="h-10 rounded-xl px-5 shadow-lg shadow-primary/20"><Printer size={16} className="mr-2" />Export invoice</Button></> : <Button onClick={() => setActivePage("editor")} className="h-10 rounded-xl"><FilePlus2 size={16} className="mr-2" />Back to editor</Button>}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="z-30 flex w-[76px] shrink-0 flex-col items-center border-r border-border/70 bg-background py-5">
          <div className="mb-7 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles size={18} /></div>
          <nav className="flex w-full flex-col items-center gap-2">
            <button title="Invoice editor" aria-label="Invoice editor" onClick={() => setActivePage("editor")} className={`flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-medium transition ${activePage === "editor" ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-muted"}`}><LayoutDashboard size={18} />Editor</button>
            <button title="History" aria-label="History" onClick={() => setActivePage("history")} className={`relative flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-medium transition ${activePage === "history" ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-muted"}`}><History size={18} />History{history.length > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-violet-100 px-1 text-[9px] font-bold text-violet-700">{history.length}</span>}</button>
          </nav>
        </aside>

        {activePage === "history" ? <main className="min-w-0 flex-1"><HistoryPage onOpenInvoice={openHistoryInvoice} /></main> : <div className="flex min-h-0 min-w-0 flex-1">
          <aside className={`${isSidebarOpen ? "w-[390px] xl:w-[430px]" : "w-0"} z-20 shrink-0 overflow-hidden border-r border-border/70 bg-background transition-[width] duration-300`}><div className="h-full w-[390px] xl:w-[430px]"><EditorSidebar /></div></aside>
          <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex h-[66px] shrink-0 items-center justify-between px-6 lg:px-10"><div className="flex items-center gap-3"><Button variant="outline" size="icon" aria-label="Toggle editor" className="h-9 w-9 rounded-xl bg-background shadow-sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}</Button><div><p className="text-sm font-semibold">Live preview</p><p className="text-[11px] text-muted-foreground">{invoice.signature?.image || invoice.signature?.name || invoice.signature?.title ? "Drag the signature to position it anywhere on the page" : "Add a signature in the editor, then drag it into place"}</p></div></div><div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex"><span className="rounded-lg border border-border bg-background px-2.5 py-1.5">A4</span><span>·</span><span>{design.template} template</span></div></div>
            <div className="min-h-0 flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100/70 via-slate-100 to-slate-200/70 p-5 dark:from-violet-950/20 dark:via-[#101116] dark:to-[#181921] md:p-8 lg:p-10"><div className="mx-auto flex min-h-full max-w-[1080px] justify-center rounded-[28px] border border-white/70 bg-white/35 p-4 shadow-inner backdrop-blur-sm dark:border-white/5 dark:bg-black/10 md:p-8 lg:p-10"><PreviewCanvas ref={contentRef} /></div></div>
          </main>
        </div>}
      </div>
    </div>
  );
}

export default App;
