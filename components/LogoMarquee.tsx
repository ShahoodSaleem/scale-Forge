const LogoPlaceholder = ({ name }: { name: string }) => (
  <div className="flex items-center gap-2 grayscale opacity-40 hover:opacity-100 transition-opacity">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
      <rect width="24" height="24" rx="4" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 6L18 12L12 18L6 12L12 6Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
    <span className="text-sm text-white font-medium tracking-tight uppercase">{name}</span>
  </div>
);

const LogoMarquee = () => {
  const logos = ["Vercel", "Stripe", "Supabase", "Linear", "Framer", "GitLab"];

  return (
    <div className="relative py-24 z-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between gap-8 py-10 border-t border-white/5">
          {logos.map((logo) => (
            <LogoPlaceholder key={logo} name={logo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
