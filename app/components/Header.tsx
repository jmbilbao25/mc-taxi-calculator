interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="bg-blue-600 text-white text-center py-6 rounded-t-xl">
      <h1 className="text-2xl font-bold">🚖 {title}</h1>
      <p className="text-blue-100 mt-1">{subtitle}</p>
    </div>
  );
}

