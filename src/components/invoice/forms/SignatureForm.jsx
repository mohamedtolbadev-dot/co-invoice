import React, { useCallback, useEffect, useRef } from "react";
import { Eraser, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useInvoiceStore from "@/store/useInvoiceStore";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 240;

export function SignatureForm() {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const { invoice, updateSignature } = useInvoiceStore();
  const signature = invoice.signature || { image: "", name: "", title: "" };

  const redrawSavedSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!signature.image) return;

    const image = new Image();
    image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = signature.image;
  }, [signature.image]);

  useEffect(() => {
    redrawSavedSignature();
  }, [redrawSavedSignature]);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
      y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
    };
  };

  const startDrawing = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = getPoint(event);
    canvas.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    context.beginPath();
    context.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
    context.fillStyle = "#111827";
    context.fill();
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const continueDrawing = (event) => {
    if (!drawingRef.current) return;
    const context = canvasRef.current.getContext("2d");
    const point = getPoint(event);
    context.lineWidth = 5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#111827";
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    updateSignature("image", canvasRef.current.toDataURL("image/png"));
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    updateSignature("image", "");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div><h3 className="text-sm font-semibold">Electronic signature</h3><p className="mt-1 text-xs text-muted-foreground">Draw with your mouse, stylus, or finger.</p></div>
        <PenLine size={17} className="mt-0.5 text-primary" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          aria-label="Draw your electronic signature here"
          className="block aspect-[15/4] w-full touch-none cursor-crosshair"
          onPointerDown={startDrawing}
          onPointerMove={continueDrawing}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          style={{ touchAction: "none" }}
        />
        <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 text-[11px] text-slate-400"><span>Draw signature above</span><Button type="button" variant="ghost" size="sm" className="h-7 rounded-lg px-2 text-xs" onClick={clearSignature}><Eraser size={13} className="mr-1.5" />Clear</Button></div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="signature-name">Signer name</Label><Input id="signature-name" value={signature.name} onChange={(event) => updateSignature("name", event.target.value)} placeholder="Full name" /></div>
        <div className="space-y-2"><Label htmlFor="signature-title">Title (optional)</Label><Input id="signature-title" value={signature.title} onChange={(event) => updateSignature("title", event.target.value)} placeholder="e.g. Director" /></div>
      </div>
    </div>
  );
}
