import { motion } from "framer-motion";
import { Link } from "react-router";

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
      /* Show the sign-in ↔ sign-up switch */
      footerAction: "!pt-4 !pb-0 !bg-transparent !border-none !text-center",
      footerActionText: "!text-xs !text-slate-500 !font-medium",
      footerActionLink:
        "!text-indigo-600 !font-bold hover:!underline !text-xs",
      /* Social button — clean light rounded box */
      socialButtonsBlockButton:
        "!bg-[#f8fafc] !border !border-[#e2e8f0] !text-slate-800 !font-medium !text-sm !rounded-xl !py-3 hover:!bg-[#f1f5f9] !transition-colors !cursor-pointer !shadow-sm",
      socialButtonsBlockButtonText: "!font-medium !text-slate-800",
      /* Divider */
      dividerLine: "!bg-[#e5e7eb]",
      dividerText:
        "!text-[11px] !font-bold !uppercase !tracking-wider !text-slate-400",
      /* Labels */
      formFieldLabel:
        "!text-xs !font-semibold !text-slate-700 !mb-1.5",
      /* Inputs */
      formFieldInput:
        "!bg-[#f1f3f5] !border !border-transparent !rounded-xl !text-sm !text-slate-900 !py-3 !px-4 focus:!bg-white focus:!border-indigo-500 focus:!ring-0 !transition-all !placeholder-slate-400 !shadow-none !font-medium",
      /* Primary CTA — vibrant indigo */
      formButtonPrimary:
        "!bg-[#4f46e5] hover:!bg-[#4338ca] !text-white !font-semibold !text-sm !rounded-xl !py-3.5 !shadow-md !shadow-indigo-500/20 !transition-all !cursor-pointer active:!scale-[0.99]",
      /* Error */
      formFieldErrorText: "!text-red-500 !text-xs !font-semibold",
      /* OTP */
      otpCodeFieldInput:
        "!bg-[#f1f3f5] !border !border-slate-200 !rounded-xl !text-slate-900 !font-semibold focus:!border-indigo-500 !transition-all",
      /* Identity preview */
      identityPreview:
        "!bg-[#f1f3f5] !border !border-slate-200 !rounded-xl",
      identityPreviewText: "!text-slate-800 !font-medium",
      identityPreviewEditButton:
        "!text-indigo-600 !font-semibold hover:!underline",
      /* Alternative methods */
      alternativeMethodsBlockButton:
        "!bg-[#f1f3f5] !border !border-slate-200 !rounded-xl !text-slate-800 !font-medium hover:!bg-slate-200 !transition-colors !cursor-pointer",
      alert: "!rounded-xl",
      alertText: "!text-xs !font-medium",
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   Split Card Auth Page Layout
──────────────────────────────────────────────────────────────── */
const AuthCardWrapper = ({
  children,
  title,
  subtitle,
  illustrationTitle = "Connect with language friends worldwide",
  illustrationDesc = "Practice conversations, make friends, and elevate your linguistics natively.",
  illustrationImage = "/i.png",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4 sm:p-6 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-4xl lg:max-w-[960px] bg-white rounded-[28px] border border-[#e5e7eb] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        {/* LEFT PANE - FORM */}
        <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-between">
          <div>
            {/* Top Brand Logo */}
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center select-none group">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
                  An<span className="font-curly font-bold ml-0.5 text-indigo-600">va</span>
                </span>
              </Link>
            </div>

            {/* Heading & Subtitle */}
            <div className="mb-6">
              {title && (
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1.5">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-slate-500 font-medium">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form Slot */}
            <div className="w-full" style={{ minWidth: 0 }}>
              {children}
            </div>
          </div>

          {/* Legal */}
          <div className="text-center pt-6">
            <p className="text-xs text-slate-400 leading-relaxed max-w-[320px] mx-auto">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-slate-700 font-semibold hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-slate-700 font-semibold hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* RIGHT PANE - ILLUSTRATION & PITCH */}
        <div className="hidden lg:flex p-3 sm:p-4">
          <div className="w-full h-full rounded-[24px] bg-[#eef1f6] flex flex-col items-center justify-center p-8 sm:p-10 text-center relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-full max-w-[320px] aspect-square flex items-center justify-center mb-6 rounded-2xl overflow-hidden"
            >
              <img
                src={illustrationImage}
                alt={illustrationTitle}
                className="w-full h-full object-contain rounded-2xl drop-shadow-sm"
              />
            </motion.div>

            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              {illustrationTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[280px]">
              {illustrationDesc}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCardWrapper;

/* Backwards-compat exports */
export const IllustrationPanel = () => null;
export const AuthIllustrationPanel = () => null;
