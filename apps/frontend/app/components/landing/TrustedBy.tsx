const companies = [
  { name: "Google", className: "font-semibold tracking-tight" },
  { name: "Microsoft", className: "font-semibold" },
  { name: "amazon", className: "font-semibold" },
  { name: "airbnb", className: "font-semibold" },
  { name: "HubSpot", className: "font-bold" },
  { name: "shopify", className: "font-semibold" },
  { name: "ORACLE", className: "font-bold tracking-widest" },
];

export function TrustedBy() {
  return (
    <section className="border-y border-line py-12">
      <p className="text-center text-sm text-gray-500">
        Trusted by leading companies
      </p>
      <div className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-6">
        {companies.map((company) => (
          <span
            key={company.name}
            className={`text-lg text-gray-500 ${company.className}`}
          >
            {company.name}
          </span>
        ))}
      </div>
    </section>
  );
}