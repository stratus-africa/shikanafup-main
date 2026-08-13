import { Link } from "@/lib/next-shims";
import { ArrowRight } from "lucide-react";

export function GenerationalTransformation() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=800&h=600&fit=crop"
              alt="Young diverse people working together for Kenya's future"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <div className="mb-8">
              <p className="text-sm font-bold tracking-[0.16em] text-[#c9232b] mb-4">
                A GENERATIONAL TRANSFORMATION!
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-[#162443] leading-tight mb-6">
                The spirit of revolution<br />that will shape Kenya's tomorrow..
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-slate-700 space-y-6 mb-8">
              <p className="leading-8">
                History remembers generations for the future they create, not the challenges they inherit. Kenya's youthful, connected, and entrepreneurial population, together with the wisdom and experience of older generations, presents a unique opportunity for structural transformation, national renewal, and shared progress.
              </p>

              <p className="leading-8">
                Every young person, every woman, every man, every worker, every entrepreneur, every farmer, every student, every professional, and every elder has a role in building the Kenya we all deserve. SHIKANA calls on 12 million young people and all Kenyans across All 47 counties to register and vote in the 2027 General Elections.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shared-ui/register"
                className="inline-flex items-center justify-center gap-2 bg-[#c9232b] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#a9161d] transition-colors"
              >
                Register Now <ArrowRight size={18} />
              </Link>
              <Link
                href="/shared-ui/vote"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#c9232b] text-[#c9232b] px-8 py-4 rounded-lg font-bold hover:bg-[#c9232b] hover:text-white transition-colors"
              >
                Learn More <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
