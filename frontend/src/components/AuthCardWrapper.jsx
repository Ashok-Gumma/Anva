import { motion } from "framer-motion";
import { Link } from "react-router";
import AnvaBrandLogo from "./AnvaBrandLogo";

/* ─────────────────────────────────────────────────────────────
   Clerk appearance — Apple minimal style
   Variables drive Clerk's own stylesheet tokens directly.
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
      colorPrimary: "#1d1d1f",
      colorBackground: "#ffffff",
      colorInputBackground: "#f5f5f7",
      colorInputText: "#1d1d1f",
      colorText: "#1d1d1f",
      colorTextSecondary: "#6e6e73",
      colorDanger: "#ff3b30",
      colorSuccess: "#30d158",
      borderRadius: "0.875rem",
      fontFamily: "Comfortaa, Plus Jakarta Sans, system-ui, sans-serif",
      fontSize: "0.9375rem",
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
      footerActionText: "!text-[0.85rem] !text-[#6e6e73]",
      footerActionLink:
        "!text-[#1d1d1f] !font-semibold hover:!underline !text-[0.85rem]",
      /* Social button — Apple style pill */
      socialButtonsBlockButton:
        "!bg-white !border !border-[#d2d2d7] !text-[#1d1d1f] !font-medium !text-[0.9rem] !rounded-xl !py-3 hover:!bg-[#f5f5f7] !transition-colors !cursor-pointer !shadow-none",
      socialButtonsBlockButtonText: "!font-medium",
      /* Divider */
      dividerLine: "!bg-[#d2d2d7]",
      dividerText:
        "!text-[0.7rem] !font-semibold !uppercase !tracking-widest !text-[#8e8e93]",
      /* Labels */
      formFieldLabel:
        "!text-[0.75rem] !font-semibold !text-[#6e6e73] !uppercase !tracking-wider",
      /* Inputs */
      formFieldInput:
        "!bg-[#f5f5f7] !border !border-[#d2d2d7] !rounded-xl !text-[0.9375rem] !text-[#1d1d1f] !py-3 !px-4 focus:!bg-white focus:!border-[#1d1d1f] focus:!ring-0 !transition-colors !placeholder-[#aeaeb2] !shadow-none",
      /* Primary CTA — solid black pill */
      formButtonPrimary:
        "!bg-[#1d1d1f] hover:!bg-[#333336] !text-white !font-semibold !text-[0.9rem] !rounded-xl !py-3.5 !shadow-none !transition-colors !cursor-pointer active:!scale-[0.99] !tracking-[0.01em]",
      /* Error */
      formFieldErrorText: "!text-[#ff3b30] !text-[0.78rem] !font-medium",
      /* OTP */
      otpCodeFieldInput:
        "!bg-[#f5f5f7] !border !border-[#d2d2d7] !rounded-xl !text-[#1d1d1f] !font-semibold focus:!border-[#1d1d1f] !transition-all",
      /* Identity preview */
      identityPreview:
        "!bg-[#f5f5f7] !border !border-[#d2d2d7] !rounded-xl",
      identityPreviewText: "!text-[#1d1d1f] !font-medium",
      identityPreviewEditButton:
        "!text-[#1d1d1f] !font-semibold hover:!underline",
      /* Alternative methods */
      alternativeMethodsBlockButton:
        "!bg-[#f5f5f7] !border !border-[#d2d2d7] !rounded-xl !text-[#1d1d1f] !font-medium hover:!bg-[#e8e8ed] !transition-colors !cursor-pointer",
      alert: "!rounded-xl",
      alertText: "!text-[0.875rem] !font-medium",
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   Apple-style Auth Page
──────────────────────────────────────────────────────────────── */
const AuthCardWrapper = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12"
      style={{ position: "relative", zIndex: 1, isolation: "isolate" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[400px] flex flex-col items-center"
      >
        {/* Brand logo — centered */}
        <Link
          to="/"
          className="mb-8 transition-opacity hover:opacity-60 active:scale-95"
        >
          <AnvaBrandLogo badgeSize="size-12" textSize="text-2xl" />
        </Link>

        {/* Heading */}
        {title && (
          <h1
            className="text-[1.85rem] font-normal text-[#1d1d1f] tracking-tight text-center leading-tight mb-2 font-serif"
            style={{ fontFamily: "'Young Serif', 'Lora', Georgia, serif" }}
          >
            {title}
          </h1>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p
            className="text-[0.9375rem] text-[#6e6e73] text-center leading-relaxed mb-8 max-w-[320px]"
            style={{ fontFamily: "Nunito, -apple-system, system-ui, sans-serif" }}
          >
            {subtitle}
          </p>
        )}

        {/* Clerk form — full width, no card chrome */}
        <div className="w-full" style={{ minWidth: 0 }}>
          {children}
        </div>

        {/* Legal */}
        <p
          className="mt-8 text-center text-[0.75rem] text-[#aeaeb2] leading-relaxed max-w-[300px]"
          style={{ fontFamily: "Nunito, -apple-system, system-ui, sans-serif" }}
        >
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-[#1d1d1f] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-[#1d1d1f] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
};

export default AuthCardWrapper;

/* Backwards-compat exports for other pages that import these */
export const IllustrationPanel = () => null;
export const AuthIllustrationPanel = () => null;
