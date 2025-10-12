import { cn } from "@/lib/utils";
import {
  IconSearch,
  IconShieldCheck,
  IconCurrencyDollar,
  IconPhoto,
  IconStar,
  IconCalendar,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Smart Search",
      description:
        "Find your ideal boarding place with intelligent filters for location, price, and amenities.",
      icon: <IconSearch />,
    },
    {
      title: "Verified Listings",
      description:
        "Every property is verified and approved by our team to ensure quality and safety.",
      icon: <IconShieldCheck />,
    },
    {
      title: "Transparent Pricing",
      description:
        "No hidden fees. Clear pricing information upfront so you can budget confidently.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Real Photos",
      description:
        "Browse authentic photos of properties to see exactly what you're getting.",
      icon: <IconPhoto />,
    },
    {
      title: "Student Reviews",
      description:
        "Read honest reviews from fellow students who have stayed at these places.",
      icon: <IconStar />,
    },
    {
      title: "Easy Booking",
      description:
        "Simple and secure booking process with instant confirmation.",
      icon: <IconCalendar />,
    },
    {
      title: "Location Based",
      description:
        "Find boarding places near your university campus with distance information.",
      icon: <IconMapPin />,
    },
    {
      title: "Community Driven",
      description:
        "Connect with other students and landlords in our trusted community.",
      icon: <IconUsers />,
    },
  ];

  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#060010]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why Choose BoardWise?
          </h2>
          <p className="text-xl text-slate-600 dark:text-violet-200 max-w-2xl mx-auto">
            Everything you need to find your perfect boarding place in one
            platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-slate-200 dark:border-violet-900/30",
        (index === 0 || index === 4) && "lg:border-l border-slate-200 dark:border-violet-900/30",
        index < 4 && "lg:border-b border-slate-200 dark:border-violet-900/30"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-blue-50 dark:from-violet-950/50 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-blue-50 dark:from-violet-950/50 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-slate-600 dark:text-violet-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-slate-300 dark:bg-violet-900 group-hover/feature:bg-blue-500 dark:group-hover/feature:bg-violet-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-slate-800 dark:text-violet-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-violet-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
