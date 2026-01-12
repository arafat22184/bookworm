import { FadeIn } from "@/components/ui/motion";

function StepItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <FadeIn className="flex gap-8 group">
      <div className="font-serif text-6xl font-bold text-primary/20 group-hover:text-primary transition-colors duration-500">
        {number}
      </div>
      <div className="space-y-3 pt-3">
        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-lg">{text}</p>
      </div>
    </FadeIn>
  );
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-12 md:py-16 bg-card border-y relative"
    >
      <div className="w-11/12 max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-6xl text-center font-serif font-bold leading-tight mb-8">
          Your journey from
          <span className="text-muted-foreground opacity-50">
            &quot;What next?&quot;
          </span>{" "}
          to
          <span className="text-primary decoration-wavy underline decoration-secondary">
            &quot;I loved it!&quot;
          </span>
        </h2>
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/2 space-y-16">
            <div className="sticky top-32">
              <div className="aspect-square rounded-3xl bg-muted relative overflow-hidden shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/empty-state.png"
                  alt="App Preview"
                  className="w-full h-full object-cover rounded-xl scale-110 hover:scale-100 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 space-y-24 pt-10">
            <StepItem
              number="01"
              title="Create your Profile"
              text="Sign up in seconds. Select your favorite genres to jumpstart our recommendation engine. We support everything from Sci-Fi to Romance."
            />
            <StepItem
              number="02"
              title="Build your Library"
              text="Search for books or scan barcodes (coming soon). Add them to your shelves. Mark them as Read, Currently Reading, or Want to Read."
            />
            <StepItem
              number="03"
              title="Track & Discover"
              text="Log your daily progress. Update page counts. When you finish, rate and review to unlock even better recommendations for your next adventure."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
