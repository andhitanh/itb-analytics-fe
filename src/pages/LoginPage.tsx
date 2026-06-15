import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoSidebar from '@/assets/images/logo-sidebar.png';
import chatbotImage from '@/assets/icons/chatbot-image.svg';
import chartImage from '@/assets/icons/chart-image.svg';

// ─── SSO Handler ──────────────────────────────────────────────────────────────
// Redirect ke Microsoft SSO ITB. URL dikonfigurasi via env variable.
function handleSSOLogin() {
  const ssoUrl = import.meta.env.VITE_SSO_URL ?? '/api/auth/sso/microsoft';
  window.location.href = ssoUrl;
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <div className="login-page relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#FCF8E3]">

      <div
        aria-hidden="true"
        className="
          pointer-events-none 
          absolute -right-40 -top-40 h-120 w-120
          rounded-full 
          bg-[#1570EF] 
          opacity-[0.3] 
          blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="
        pointer-events-none 
        absolute -bottom-40 -left-40 h-120 w-120
        rounded-full 
        bg-[#1570EF] 
        opacity-[0.3] 
        blur-[120px]"
      />

      <div
        role="main"
        className="
          relative z-10
          flex w-full max-w-[440px] flex-col gap-7
          rounded-[20px]
          border border-white/70
          bg-white/88
          px-12 py-11
          backdrop-blur-[24px]
          shadow-[44px_44px_65px_0_rgba(228,230,234,0.74),0_2px_8px_0_rgba(0,0,0,0.04)]
        "
      >
        <div className="flex justify-center">
          <img
            src={logoSidebar}
            alt="Logo ITB"
            className="h-16 w-auto"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-text-dark">
            Selamat Datang!
          </h1>

          <p className="m-0 text-sm text-text-mid">
            Masuk dengan Akun SSO ITB
          </p>
        </div>

        <Button
          onClick={handleSSOLogin}
          size="lg"
          className="
            h-12 w-full
            rounded-md
            bg-primary
            text-sm font-semibold tracking-[-0.01em]
            text-primary-foreground
            hover:bg-primary/90
          "
        >
          <div className="flex items-center justify-center gap-2">
            <span>ITB Account (SSO Login)</span>
            <ArrowRight className="h-4 w-4 opacity-70" />
          </div>
        </Button>

        <p className="m-0 text-center text-[13px] text-neutral">
          Ada Kendala?{' '}
          <a
            href="mailto:helpdesk@itb.ac.id"
            className="font-semibold text-primary hover:opacity-75"
          >
            Hubungi Admin
          </a>
        </p>
      </div>
    </div>
  );
}