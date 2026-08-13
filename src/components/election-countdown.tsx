import { useState, useEffect } from "react";

interface TimeRemaining {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function ElectionCountdown() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      // IEBC Election Date: August 9, 2027
      const electionDate = new Date("2027-08-09T00:00:00Z").getTime();
      const now = new Date().getTime();
      const difference = electionDate - now;

      if (difference > 0) {
        const seconds = Math.floor((difference / 1000) % 60);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        
        const totalMonths = Math.floor(days / 30.44);
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        const weeks = Math.floor(days / 7);
        const remainingDays = days % 7;

        setTimeRemaining({
          years,
          months,
          weeks,
          days: remainingDays,
          hours,
          minutes,
          seconds,
        });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  const CountdownBox = ({
    number,
    label,
  }: {
    number: number;
    label: string;
  }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-[#c9232b] to-[#a9161d] rounded-xl p-6 sm:p-8 min-w-[80px] sm:min-w-[120px]">
        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white text-center">
          {String(number).padStart(2, "0")}
        </p>
      </div>
      <p className="mt-3 font-bold text-[#162443] text-sm sm:text-base text-center">{label}</p>
    </div>
  );

  return (
    <section className="bg-[#f1f0eb] px-5 py-16 sm:py-24 md:py-32">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-bold tracking-[0.16em] text-[#c9232b] mb-4">OFFICIAL IEBC TIMELINE</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#162443] mb-4">
            Days to the 2027 General Election
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real-time countdown to Kenya's next historic moment. Every vote matters. Every voice counts.
          </p>
        </div>

        {/* Countdown Grid */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <CountdownBox number={timeRemaining.years} label="Years" />
            <CountdownBox number={timeRemaining.months} label="Months" />
            <CountdownBox number={timeRemaining.weeks} label="Weeks" />
            <CountdownBox number={timeRemaining.days} label="Days" />
          </div>

          {/* Additional Details */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-[#162443]">
                  {String(timeRemaining.hours).padStart(2, "0")}
                </p>
                <p className="text-sm font-bold text-slate-600 mt-2">Hours</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-[#162443]">
                  {String(timeRemaining.minutes).padStart(2, "0")}
                </p>
                <p className="text-sm font-bold text-slate-600 mt-2">Minutes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-[#162443]">
                  {String(timeRemaining.seconds).padStart(2, "0")}
                </p>
                <p className="text-sm font-bold text-slate-600 mt-2">Seconds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-gradient-to-r from-[#162443] to-[#0f1929] text-white rounded-2xl p-8 sm:p-12 text-center">
          <p className="text-lg sm:text-xl font-bold mb-4">
            Registration and voting deadlines approaching
          </p>
          <p className="text-white/80">
            Visit the IEBC website for the official 2027 General Election timeline and ensure you are registered to vote.
          </p>
          <a
            href="https://www.iebc.or.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-[#c9232b] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#a9161d] transition-colors"
          >
            Visit IEBC Website →
          </a>
        </div>
      </div>
    </section>
  );
}
