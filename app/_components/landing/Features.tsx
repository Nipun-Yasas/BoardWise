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

export const Features = () => {
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
    <div className="pt-4 px-4 sm:px-6 md:px-12 lg:px-12 w-full max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-textPrimary dark:text-white mb-4">
          Why Choose BoardWise?
        </h2>
        <p className="text-xl text-textSecondary max-w-2xl mx-auto">
          Everything you need to find your perfect boarding place in one
          platform
        </p>
      </div>

      <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 relative z-10">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
};

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
        "flex flex-col lg:border-r py-10 relative group/feature border-borderPrimary",
        (index === 0 || index === 4) && "lg:border-l border-borderPrimary",
        index < 4 && "lg:border-b border-borderPrimary"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-hoverPrimary pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-hoverPrimary pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-textPrimary">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-slate-300 dark:bg-slate-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-textPrimary">
          {title}
        </span>
      </div>
      <p className="text-sm text-textSecondary max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
