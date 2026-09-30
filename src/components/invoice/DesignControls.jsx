import React from "react";
import useInvoiceStore from "@/store/useInvoiceStore";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectGroup,
} from "@/components/ui/select";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { FONTS } from "@/lib/fontConfig";

const COLORS = [
  { name: "Violet", value: "#7C3AED", hex: "#7C3AED" },
  { name: "Emerald", value: "emerald-600", hex: "#059669" },
  { name: "Rose", value: "rose-600", hex: "#e11d48" },
  { name: "Amber", value: "amber-600", hex: "#d97706" },
  { name: "Slate", value: "slate-600", hex: "#475569" },
];

export function DesignControls() {
  const { design, setDesignProperty } = useInvoiceStore();
  const colorMap = {
    "blue-600": "#7C3AED",
    "emerald-600": "#059669",
    "rose-600": "#e11d48",
    "amber-600": "#d97706",
    "slate-600": "#475569",
  };
  const accentHex = design.accentColor.startsWith("#")
    ? design.accentColor
    : colorMap[design.accentColor] || "#7C3AED";
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-background to-background p-4 shadow-sm">
        <h3 className="mb-1 text-sm font-semibold">Make it yours</h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          If you find Co-Invoice useful, consider starring the repository on
          GitHub. It helps the project grow and reach more developers.
        </p>

        <div className="mt-3">
          <a
            href="https://github.com/mraxays/co-invoice"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-semibold items-center gap-2 text-xs px-3 py-1.5 rounded-md border transition-colors hover:bg-background/40"
            style={{ color: accentHex, borderColor: accentHex }}
          >
            <Github />
            Star on GitHub
          </a>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div><Label className="text-sm font-semibold">Appearance</Label><p className="mt-1 text-xs text-muted-foreground">Choose the editor theme.</p></div>
        <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/30 p-3">
          <div className="flex-1 text-sm font-medium">Dark mode</div>
          <button
            onClick={() => setDesignProperty("darkMode", !design.darkMode)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              design.darkMode ? "bg-primary" : "bg-input"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                design.darkMode ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div><Label className="text-sm font-semibold">Brand color</Label><p className="mt-1 text-xs text-muted-foreground">Set the color used across your invoice.</p></div>
        <div className="flex flex-wrap items-center gap-3">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setDesignProperty("accentColor", color.value)}
              className={cn(
                "h-9 w-9 rounded-xl border-2 transition-all hover:scale-110",
                design.accentColor === color.value
                  ? "border-foreground scale-110"
                  : "border-transparent opacity-80 hover:opacity-100 hover:scale-105"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}

          {/* Custom Color Picker */}
          <div className="relative">
            <input
              type="color"
              value={
                design.accentColor.startsWith("#")
                  ? design.accentColor
                  : "#7C3AED"
              }
              onChange={(e) => setDesignProperty("accentColor", e.target.value)}
              className="w-8 h-8 rounded-sm border-gray-300 cursor-pointer"
              title="Custom Color"
            />
            <div className="absolute -bottom-5 left-0 text-[10px] text-gray-400 whitespace-nowrap">
              Custom
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div><Label className="text-sm font-semibold">Typography</Label><p className="mt-1 text-xs text-muted-foreground">Pick a typeface for your document.</p></div>
        <Select
          value={design.fontStack}
          onValueChange={(v) => setDesignProperty("fontStack", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="opacity-60 uppercase tracking-widest">Serif Fonts</SelectLabel>
              {FONTS.serif.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel className="opacity-60 uppercase tracking-widest">Sans Serif Fonts</SelectLabel>
              {FONTS.sans.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel className="opacity-60 uppercase tracking-widest">Monospace Fonts</SelectLabel>
              {FONTS.mono.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div><Label className="text-sm font-semibold">Invoice template</Label><p className="mt-1 text-xs text-muted-foreground">Choose a layout that fits your brand.</p></div>

        <div className="bg-background/50 ">
          <Tabs
            value={design.template}
            onValueChange={(v) => setDesignProperty("template", v)}
          >
            <TabsList className="grid w-full grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1 sm:grid-cols-4">
              <TabsTrigger value="modern">Modern</TabsTrigger>
              <TabsTrigger value="classic">Classic</TabsTrigger>
              <TabsTrigger value="bold">Bold</TabsTrigger>
              <TabsTrigger value="minimal">Minimal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
