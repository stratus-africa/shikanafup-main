import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const stages = [
  {
    type: "titles",
    content: "Discover • Freedom • Truth • Prosperity",
  },
  {
    type: "descriptions",
    items: [
      {
        title: "DISCOVER",
        description: "The awakening of our people to their shared identity, common destiny, and collective power.",
      },
      {
        title: "FREEDOM",
        description: "We are the force that will stand on the frontlines for Kenya; to protect our land and resources.",
      },
      {
        title: "TRUTH",
        description: "We commit to the spirit of truth, serve Kenyans fairly and guarantee equal opportunity for all.",
      },
      {
        title: "PROSPERITY",
        description: "Our true progress is measured by ensuring that growth reaches every corner of Kenya.",
      },
    ],
    currentIndex: 0,
  },
  {
    type: "closing",
    content: "Shikana Frontliners for Unity Party",
  },
];

export function DiscoverInterchange() {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentDescIndex, setCurrentDescIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!autoRotate) return;

    const timer = setTimeout(() => {
      if (currentStage === 1) {
        if (currentDescIndex < 3) {
          setCurrentDescIndex((prev) => prev + 1);
        } else {
          setCurrentStage(2);
          setCurrentDescIndex(0);
        }
      } else if (currentStage === 2) {
        setCurrentStage(0);
        setCurrentDescIndex(0);
      } else {
        setCurrentStage(1);
        setCurrentDescIndex(0);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentStage, currentDescIndex, autoRotate]);

  const handleNext = () => {
    setAutoRotate(false);
    if (currentStage === 1) {
      if (currentDescIndex < 3) {
        setCurrentDescIndex((prev) => prev + 1);
      } else {
        setCurrentStage(2);
        setCurrentDescIndex(0);
      }
    } else if (currentStage === 2) {
      setCurrentStage(0);
      setCurrentDescIndex(0);
    } else {
      setCurrentStage(1);
      setCurrentDescIndex(0);
    }
  };

  const handlePrev = () => {
    setAutoRotate(false);
    if (currentStage === 1) {
      if (currentDescIndex > 0) {
        setCurrentDescIndex((prev) => prev - 1);
      } else {
        setCurrentStage(0);
        setCurrentDescIndex(0);
      }
    } else if (currentStage === 2) {
      setCurrentStage(1);
      setCurrentDescIndex(3);
    } else {
      setCurrentStage(2);
      setCurrentDescIndex(0);
    }
  };

  const stage = stages[currentStage];
  const currentItem =
    stage.type === "descriptions" ? stage.items[currentDescIndex] : null;

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#162443] to-[#0f1929] shadow-2xl">
          {/* Content Area */}
          <div className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center justify-center px-6 sm:px-12 py-12 sm:py-20">
            <div className="max-w-3xl text-center text-white">
              {/* Stage 1: Titles */}
              {stage.type === "titles" && (
                <div className="animate-fadeIn">
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-relaxed">
                    {stage.content}
                  </p>
                  <p className="mt-6 text-white/70 text-lg">
                    The core values that guide our movement.
                  </p>
                </div>
              )}

              {/* Stage 2: Descriptions */}
              {stage.type === "descriptions" && currentItem && (
                <div className="animate-fadeIn">
                  <div className="mb-8">
                    <p className="inline-block bg-[#c9232b] px-6 py-3 rounded-full font-bold text-white mb-6">
                      {currentDescIndex + 1} of 4
                    </p>
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
                    {currentItem.title}
                  </h3>
                  <p className="text-xl sm:text-2xl leading-9 text-white/90">
                    {currentItem.description}
                  </p>
                </div>
              )}

              {/* Stage 3: Closing */}
              {stage.type === "closing" && (
                <div className="animate-fadeIn">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-relaxed">
                    {stage.content}
                  </h2>
                  <p className="mt-6 text-white/70 text-lg">
                    United for a transformational Kenya.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 px-6">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Stage Indicators */}
            <div className="flex gap-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAutoRotate(false);
                    setCurrentStage(index);
                    setCurrentDescIndex(0);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStage
                      ? "bg-white w-8"
                      : "bg-white/50 w-2 hover:bg-white/70"
                  }`}
                  aria-label={`Stage ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all hover:scale-110"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Stage Counter */}
          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-bold">
            Stage {currentStage + 1} of 3
          </div>
        </div>

        {/* Quick Navigation Tags */}
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          {["Discover", "Freedom", "Truth", "Prosperity", "Our Party"].map(
            (label, index) => (
              <button
                key={label}
                onClick={() => {
                  setAutoRotate(false);
                  if (index < 4) {
                    setCurrentStage(1);
                    setCurrentDescIndex(index);
                  } else {
                    setCurrentStage(2);
                    setCurrentDescIndex(0);
                  }
                }}
                className={`px-5 py-2 rounded-full font-bold transition-all ${
                  (currentStage === 1 && currentDescIndex === index) ||
                  (currentStage === 2 && index === 4)
                    ? "bg-[#c9232b] text-white scale-105"
                    : "bg-slate-200 text-[#162443] hover:bg-[#c9232b] hover:text-white"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
}
