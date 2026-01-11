'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
    { q: "Is BookWorm really free?", a: "Yes! BookWorm is completely free to use. We believe reading tools should be accessible to everyone." },
    { q: "Can I import my library from other apps?", a: "Currently, we are working on an import feature. Stay tuned for updates!" },
    { q: "How are recommendations calculated?", a: "We analyze the genres of books you've rated highly and suggest similar titles from our extensive database." },
    { q: "Is there a mobile app?", a: "BookWorm is a fully responsive web application that works great on any mobile device browser." },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-muted/40 backdrop-blur">
       <div className="w-11/12 max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Got questions? We've got answers.</p>
           </div>
           <div className="bg-card rounded-3xl border shadow-sm p-2">
             <Accordion type="single" collapsible className="w-full">
                 {FAQS.map((faq, i) => (
                     <AccordionItem value={`item-${i}`} key={i} className="px-6 border-b last:border-0 hover:bg-muted/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                         <AccordionTrigger className="text-lg font-medium hover:text-primary hover:no-underline py-6">{faq.q}</AccordionTrigger>
                         <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                             {faq.a}
                         </AccordionContent>
                     </AccordionItem>
                 ))}
             </Accordion>
           </div>
        </div>
     </section>
  );
}
