import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleEmailAuth = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    let result;
    if (type === 'signup') {
      result = await supabase.auth.signUp({
        email,
        password,
      });
    } else {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    }

    setLoading(false);

    if (result.error) {
      setMessage({ type: 'error', text: result.error.message });
    } else {
      if (type === 'signup') {
        setMessage({ type: 'success', text: 'Successfully signed up! Redirecting...' });
        setTimeout(() => window.location.href = "/", 1000);
      } else {
        setMessage({ type: 'success', text: 'Successfully logged in! Redirecting...' });
        setTimeout(() => window.location.href = "/", 1000);
      }
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) setMessage({ type: 'error', text: error.message });
  };

  return (
    <main className="relative z-10 min-h-screen bg-transparent selection:bg-white/10 selection:text-white flex flex-col items-center justify-center p-6">
      <Link
        to="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-white/10 hover:border-white/20"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="w-full max-w-md animate-scale-in">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-8 sm:p-10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-white/10 hover:shadow-indigo-500/5 transition-all duration-500">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-center mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Welcome</h1>
          <p className="text-sm text-zinc-400 text-center mb-8">Sign in or create an account</p>
          
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
              {message.text}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={(e) => handleEmailAuth(e, 'login')}>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-indigo-500/30 focus:bg-white/10"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-indigo-500/30 focus:bg-white/10"
              />
            </div>
            
            <div className="flex gap-4 pt-2">
              <button 
                type="button"
                onClick={(e) => handleEmailAuth(e, 'signup')}
                disabled={loading}
                className="flex-1 bg-white/5 border border-white/10 text-foreground rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:bg-white/10 disabled:opacity-50 flex justify-center"
              >
                Sign Up
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-white text-black rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:bg-zinc-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] disabled:opacity-50 flex justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          
          <button 
            onClick={handleGoogleAuth}
            className="w-full mt-6 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:bg-white/10 flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </main>
  );
}
