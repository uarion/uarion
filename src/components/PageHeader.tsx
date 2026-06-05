type PageHeaderProps = {
  title: string;
  description: string;
  badge?: string;
};

export default function PageHeader({
  title,
  description,
  badge,
}: PageHeaderProps) {
  return (
    <header className="mb-10">
      {badge && (
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
          {badge}
        </p>
      )}
      <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
      <p className="text-body mt-3 max-w-3xl">
        {description}
      </p>
    </header>
  );
}
