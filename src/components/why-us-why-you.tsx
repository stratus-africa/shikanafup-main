export function WhyUsWhyYou() {
  const cards = [
    {
      id: 1,
      title: "Why Us",
      content: "We are a party that listens to its members and empowers its people. Together, we will transform Kenya into a nation where freedom has meaning, opportunity is within reach, and where every citizen must belong and have a voice.",
    },
    {
      id: 2,
      title: "Why You",
      content: "Every Kenyan is a partner in governance, and the benefits of economic prosperity belong to all. Together, we must protect the nation, safeguard its natural resources, strengthen our institutions, and preserve the hopes of future generations.",
    },
  ];

  return (
    <section className="bg-[#162443] px-5 py-24 sm:px-8 lg:py-32 text-white">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            Nothing<br />About Kenyans,<br />Without Kenyans!
          </h2>
          <p className="text-sm font-bold tracking-[0.16em] text-[#ecb23b] mt-6">A practical vision for Kenya.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group bg-[#162443] border-2 border-[#162443] rounded-2xl p-8 sm:p-10 transition-all duration-300 hover:bg-white hover:text-[#162443] hover:border-white hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
            >
              <h3 className="text-2xl sm:text-3xl font-black mb-6 transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-lg leading-8 text-white/80 group-hover:text-slate-600 transition-colors duration-300">
                {card.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
