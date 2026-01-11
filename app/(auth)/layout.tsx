export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-zinc-900 text-white p-12 relative overflow-hidden">
         {/* Decorative background or pattern could go here */}
         <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-5xl font-serif font-bold mb-6 italic tracking-tight">BookWorm</h1>
            <p className="text-xl text-zinc-300 max-w-md">"A room without books is like a body without a soul."</p>
            <p className="mt-2 text-zinc-400 text-sm">— Marcus Tullius Cicero</p>
         </div>
         <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-zinc-900/20" />
      </div>
      <div className="flex items-center justify-center py-12 px-6 lg:px-12 bg-background">
        {children}
      </div>
    </div>
  );
}
