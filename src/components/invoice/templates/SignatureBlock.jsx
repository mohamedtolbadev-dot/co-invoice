import React, { useEffect, useRef, useState } from "react";
import { MoveDown, MoveLeft, MoveRight, MoveUp } from "lucide-react";
import useInvoiceStore from "@/store/useInvoiceStore";

const DEFAULT_POSITION = { x: 76, y: 70 };

export function SignatureBlock({ signature, isDraggable = false }) {
  const { updateSignature } = useInvoiceStore();
  const blockRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const positionRef = useRef(signature?.position || DEFAULT_POSITION);
  const [position, setPosition] = useState(positionRef.current);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const nextPosition = signature?.position || DEFAULT_POSITION;
    positionRef.current = nextPosition;
    setPosition(nextPosition);
  }, [signature?.position?.x, signature?.position?.y]);

  if (!signature || (!signature.image && !signature.name && !signature.title)) return null;

  const moveToPoint = (clientX, clientY) => {
    const page = blockRef.current?.closest("[data-invoice-page]");
    if (!page || !blockRef.current) return positionRef.current;
    const pageBounds = page.getBoundingClientRect();
    const blockBounds = blockRef.current.getBoundingClientRect();
    const minX = (blockBounds.width / 2 / pageBounds.width) * 100;
    const minY = (blockBounds.height / 2 / pageBounds.height) * 100;
    const nextPosition = {
      x: Math.min(100 - minX, Math.max(minX, ((clientX - dragOffset.current.x - pageBounds.left) / pageBounds.width) * 100)),
      y: Math.min(100 - minY, Math.max(minY, ((clientY - dragOffset.current.y - pageBounds.top) / pageBounds.height) * 100)),
    };
    positionRef.current = nextPosition;
    setPosition(nextPosition);
    return nextPosition;
  };

  const startDrag = (event) => {
    if (!isDraggable || (event.button !== undefined && event.button !== 0)) return;
    event.preventDefault();
    event.stopPropagation();
    const bounds = blockRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: event.clientX - bounds.left - bounds.width / 2,
      y: event.clientY - bounds.top - bounds.height / 2,
    };
    blockRef.current.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const continueDrag = (event) => {
    if (!isDragging) return;
    event.preventDefault();
    moveToPoint(event.clientX, event.clientY);
  };

  const endDrag = (event) => {
    if (!isDragging) return;
    const nextPosition = moveToPoint(event.clientX, event.clientY);
    setIsDragging(false);
    updateSignature("position", nextPosition);
  };

  const cancelDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    updateSignature("position", positionRef.current);
  };

  const handleKeyDown = (event) => {
    if (!isDraggable || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const step = event.shiftKey ? 5 : 1;
    const bounds = blockRef.current.getBoundingClientRect();
    const page = blockRef.current.closest("[data-invoice-page]");
    if (!page) return;
    const pageBounds = page.getBoundingClientRect();
    const minX = (bounds.width / 2 / pageBounds.width) * 100;
    const minY = (bounds.height / 2 / pageBounds.height) * 100;
    const nextPosition = {
      x: Math.min(100 - minX, Math.max(minX, positionRef.current.x + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0))),
      y: Math.min(100 - minY, Math.max(minY, positionRef.current.y + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0))),
    };
    positionRef.current = nextPosition;
    setPosition(nextPosition);
    updateSignature("position", nextPosition);
  };

  const nudgePosition = (xStep, yStep, event) => {
    event.preventDefault();
    event.stopPropagation();
    const page = blockRef.current.closest("[data-invoice-page]");
    if (!page) return;
    const pageBounds = page.getBoundingClientRect();
    const blockBounds = blockRef.current.getBoundingClientRect();
    const minX = (blockBounds.width / 2 / pageBounds.width) * 100;
    const minY = (blockBounds.height / 2 / pageBounds.height) * 100;
    const nextPosition = {
      x: Math.min(100 - minX, Math.max(minX, positionRef.current.x + xStep)),
      y: Math.min(100 - minY, Math.max(minY, positionRef.current.y + yStep)),
    };
    positionRef.current = nextPosition;
    setPosition(nextPosition);
    updateSignature("position", nextPosition);
  };

  const stopControlPointer = (event) => event.stopPropagation();

  return (
    <div
      ref={blockRef}
      role={isDraggable ? "button" : undefined}
      tabIndex={isDraggable ? 0 : undefined}
      aria-label={isDraggable ? "Move electronic signature. Use arrow keys to adjust its position." : undefined}
      onPointerDown={startDrag}
      onPointerMove={continueDrag}
      onPointerUp={endDrag}
      onPointerCancel={cancelDrag}
      onKeyDown={handleKeyDown}
      className={`${isDraggable ? "group pointer-events-auto absolute z-20 w-64 -translate-x-1/2 -translate-y-1/2" : "relative ml-auto mt-4 w-64"} print:break-inside-avoid print:pointer-events-none ${isDraggable ? `cursor-grab touch-none select-none print:cursor-default ${isDragging ? "cursor-grabbing" : ""}` : "pointer-events-none"}`}
      style={isDraggable ? { left: `${position.x}%`, top: `${position.y}%` } : undefined}
    >
      {isDraggable && <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 print:hidden">Drag to move</span>}
      {isDraggable && <div className="absolute -top-10 right-0 flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-md md:hidden print:hidden" aria-label="Nudge signature position">
        <button type="button" aria-label="Move signature left" className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-violet-50 hover:text-primary" onPointerDown={stopControlPointer} onClick={(event) => nudgePosition(-2, 0, event)}><MoveLeft size={15} /></button>
        <button type="button" aria-label="Move signature up" className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-violet-50 hover:text-primary" onPointerDown={stopControlPointer} onClick={(event) => nudgePosition(0, -2, event)}><MoveUp size={15} /></button>
        <button type="button" aria-label="Move signature down" className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-violet-50 hover:text-primary" onPointerDown={stopControlPointer} onClick={(event) => nudgePosition(0, 2, event)}><MoveDown size={15} /></button>
        <button type="button" aria-label="Move signature right" className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-violet-50 hover:text-primary" onPointerDown={stopControlPointer} onClick={(event) => nudgePosition(2, 0, event)}><MoveRight size={15} /></button>
      </div>}
      <div className={`border-t border-gray-300 pt-2 text-right ${isDraggable ? "rounded-sm group-hover:outline group-hover:outline-1 group-hover:outline-dashed group-hover:outline-primary/60" : ""}`}>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Authorized signature</p>
        {signature.image && <img src={signature.image} alt={`Electronic signature${signature.name ? ` of ${signature.name}` : ""}`} className="ml-auto mt-1 h-14 max-w-full object-contain object-right" />}
        {signature.name && <p className="mt-1 text-sm font-semibold text-gray-800">{signature.name}</p>}
        {signature.title && <p className="text-xs text-gray-500">{signature.title}</p>}
      </div>
    </div>
  );
}
