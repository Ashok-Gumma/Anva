/* ─────────────────────────────────────────────────────────────
   Clerk appearance — Modern SaaS indigo & clean card style
──────────────────────────────────────────────────────────────── */
export function buildClerkAppearance() {
  return {
    layout: {
      socialButtonsVariant: "blockButton",
      socialButtonsPlacement: "top",
      logoPlacement: "none",
      shimmer: false,
    },
    variables: {
      colorPrimary: "#4f46e5",
      colorBackground: "#ffffff",
      colorInputBackground: "#f1f3f5",
      colorInputText: "#0f172a",
      colorText: "#0f172a",
      colorTextSecondary: "#64748b",
      colorDanger: "#ef4444",
      colorSuccess: "#10b981",
      borderRadius: "0.75rem",
      fontFamily: "Nunito, Plus Jakarta Sans, system-ui, sans-serif",
      fontSize: "0.875rem",
      fontWeight: { normal: 400, medium: 500, bold: 600 },
      spacingUnit: "1rem",
    },
    elements: {
      rootBox: "!w-full",
      cardBox: "!w-full !shadow-none !border-none !bg-white !rounded-none",
      card: "!bg-white !shadow-none !border-none !p-0 !w-full",
      header: "!hidden",
      headerTitle: "!hidden",
      headerSubtitle: "!hidden",
      footer: "!hidden",
      footerPages: "!hidden",
      footerAction: "!pt-4 !pb-0 !bg-transparent !border-none !text-center",
      footerActionText: "!text-xs !text-slate-500 !font-medium",
      footerActionLink: "!text-indigo-600 !font-bold hover:!underline !text-xs",
      socialButtonsBlockButton:
        "!bg-[#f8fafc] !border !border-[#e2e8f0] !text-slate-800 !font-medium !text-sm !rounded-xl !py-3 hover:!bg-[#f1f5f9] !transition-colors !cursor-pointer !shadow-sm",
      socialButtonsBlockButtonText: "!font-medium !text-slate-800",
      dividerLine: "!bg-[#e5e7eb]",
      dividerText: "!text-[11px] !font-bold !uppercase !tracking-wider !text-slate-400",
      formFieldLabel: "!text-xs !font-semibold !text-slate-700 !mb-1.5",
      formFieldInput:
        "!bg-[#f1f3f5] !border !border-transparent !rounded-xl !text-sm !text-slate-900 !py-3 !px-4 focus:!bg-white focus:!border-indigo-500 focus:!ring-0 !transition-all !placeholder-slate-400 !shadow-none !font-medium",
      formButtonPrimary:
        "!bg-[#4f46e5] hover:!bg-[#4338ca] !text-white !font-semibold !text-sm !rounded-xl !py-3.5 !shadow-md !shadow-indigo-500/20 !transition-all !cursor-pointer active:!scale-[0.99]",
      formFieldErrorText: "!text-red-500 !text-xs !font-semibold",
      otpCodeFieldInput:
        "!bg-[#f1f3f5] !border !border-slate-200 !rounded-xl !text-slate-900 !font-semibold focus:!border-indigo-500 !transition-all",
      identityPreview: "!bg-[#f1f3f5] !border !border-slate-200 !rounded-xl",
      identityPreviewText: "!text-slate-800 !font-medium",
      identityPreviewEditButton: "!text-indigo-600 !font-semibold hover:!underline",
      alternativeMethodsBlockButton:
        "!bg-[#f1f3f5] !border !border-slate-200 !rounded-xl !text-slate-800 !font-medium hover:!bg-slate-200 !transition-colors !cursor-pointer",
      alert: "!rounded-xl",
      alertText: "!text-xs !font-medium",
    },
  };
}
