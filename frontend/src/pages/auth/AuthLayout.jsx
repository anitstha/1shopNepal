import { Link } from "react-router-dom";
import { BadgeCheck, ShieldCheck, Truck } from "lucide-react";
import { headerData } from "../../data/headerData";

const highlights = [
  { icon: Truck, label: "Fast delivery all across Nepal" },
  { icon: ShieldCheck, label: "Secure payments & buyer protection" },
  { icon: BadgeCheck, label: "100% authentic products" },
];

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Brand Panel */}
      <aside className="relative hidden w-[44%] flex-col justify-between bg-neutral-950 p-10 text-white lg:flex xl:p-14">
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <img src={headerData.logo} alt={headerData.logoAlt} className="h-9 w-auto" />
          <span className="text-lg font-semibold tracking-tight">1ShopNepal</span>
        </Link>

        <div className="relative z-10">
          <h2 className="max-w-md text-3xl font-semibold leading-snug tracking-tight xl:text-4xl">
            Everything you need, delivered across Nepal.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
            Join thousands of happy customers shopping electronics, fashion,
            groceries and more — all in one place.
          </p>

          <ul className="mt-10 space-y-4">
            {highlights.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-sm text-neutral-300">
                <item.icon className="h-4 w-4 shrink-0 text-neutral-500" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-neutral-500">
          © {new Date().getFullYear()} 1ShopNepal. All rights reserved.
        </p>
      </aside>

      {/* Form Panel */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="text-xl font-semibold tracking-tight text-neutral-950 lg:hidden">
            1Shop<span className="text-neutral-500">Nepal</span>
          </Link>

          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl lg:mt-0">
            {title}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
