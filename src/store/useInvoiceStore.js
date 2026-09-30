import { create } from "zustand";
import { persist } from "zustand/middleware";

const useInvoiceStore = create(
  persist(
    (set) => ({
      invoice: {
        sender: {
          name: "Company Name",
          address: "123 Business Street, City, State 12345",
          email: "hello@company.com",
          phone: "+1 (555) 000-0000",
          logo: null,
        },
        receiver: {
          name: "Client Name",
          address: "456 Client Avenue, City, State 67890",
          email: "client@example.com",
          phone: "+1 (555) 999-9999",
        },
        details: {
          number: "INV-001",
          date: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          currency: "$",
          taxRate: 0,
        },
        lineItems: [
          {
            id: "1",
            description: "Web Design Service",
            quantity: 1,
            rate: 1500,
            tax: 0,
          },
          {
            id: "2",
            description: "Hosting Setup",
            quantity: 1,
            rate: 200,
            tax: 0,
          },
        ],
        footer: "Thank you for your business! Payment is due within 7 days.",
        signature: { image: "", name: "", title: "", position: { x: 76, y: 70 } },
      },
      design: {
        accentColor: "#7C3AED",
        fontStack: "droid-arabic-kufi",
        template: "modern", // modern, classic, bold, minimal
        darkMode: false,
      },
      history: [],

      saveInvoiceToHistory: () =>
        set((state) => {
          const snapshot = JSON.parse(JSON.stringify({ invoice: state.invoice, design: state.design }));
          const entry = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...snapshot,
          };
          return { history: [entry, ...state.history] };
        }),

      loadInvoiceFromHistory: (id) =>
        set((state) => {
          const entry = state.history.find((item) => item.id === id);
          return entry ? { invoice: entry.invoice, design: entry.design } : {};
        }),

      deleteInvoiceFromHistory: (id) =>
        set((state) => ({ history: state.history.filter((item) => item.id !== id) })),

      // Actions
      updateSender: (field, value) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            sender: { ...state.invoice.sender, [field]: value },
          },
        })),

      updateReceiver: (field, value) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            receiver: { ...state.invoice.receiver, [field]: value },
          },
        })),

      updateDetails: (field, value) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            details: { ...state.invoice.details, [field]: value },
          },
        })),

      addLineItem: () =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            lineItems: [
              ...state.invoice.lineItems,
              {
                id: crypto.randomUUID(),
                description: "",
                quantity: 1,
                rate: 0,
                tax: 0,
              },
            ],
          },
        })),

      removeLineItem: (id) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            lineItems: state.invoice.lineItems.filter((item) => item.id !== id),
          },
        })),

      updateLineItem: (id, field, value) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            lineItems: state.invoice.lineItems.map((item) =>
              item.id === id ? { ...item, [field]: value } : item
            ),
          },
        })),

      updateFooter: (value) =>
        set((state) => ({
          invoice: { ...state.invoice, footer: value },
        })),

      updateSignature: (field, value) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            signature: {
              ...(state.invoice.signature || { image: "", name: "", title: "", position: { x: 76, y: 70 } }),
              [field]: value,
            },
          },
        })),

      setDesignProperty: (property, value) =>
        set((state) => ({
          design: { ...state.design, [property]: value },
        })),

      resetInvoice: () =>
        set({
          invoice: {
            sender: { name: "", address: "", email: "", phone: "", logo: null },
            receiver: { name: "", address: "", email: "", phone: "" },
            details: {
              number: "INV-001",
              date: new Date().toISOString().split("T")[0],
              dueDate: "",
              currency: "$",
            },
            lineItems: [
              {
                id: crypto.randomUUID(),
                description: "",
                quantity: 1,
                rate: 0,
                tax: 0,
              },
            ],
            footer: "",
            signature: { image: "", name: "", title: "", position: { x: 76, y: 70 } },
          },
        }),
    }),
    {
      name: "invoice-storage", // local storage key
      merge: (persistedState, currentState) => {
        const persistedDesign = persistedState?.design || {};
        const persistedInvoice = persistedState?.invoice || {};
        const savedSignature = persistedInvoice.signature;
        const signature =
          savedSignature?.position?.x === 76 && savedSignature.position?.y === 84
            ? { ...savedSignature, position: { x: 76, y: 70 } }
            : savedSignature || currentState.invoice.signature;
        return {
          ...currentState,
          ...persistedState,
          invoice: {
            ...currentState.invoice,
            ...persistedInvoice,
            signature,
          },
          design: {
            ...currentState.design,
            ...persistedDesign,
            fontStack:
              ["inter", "montserrat"].includes(persistedDesign.fontStack)
                ? "droid-arabic-kufi"
                : persistedDesign.fontStack || currentState.design.fontStack,
          },
        };
      },
    }
  )
);

export default useInvoiceStore;
