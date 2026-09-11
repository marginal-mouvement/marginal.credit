import { Separator } from "@marginal.credit/ui/separator.tsx";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  return (
    <div className="flex flex-col fixed top-0 left-0 right-0 z-20">
      <div className="flex gap-4 p-4 bg-background">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <Separator />
    </div>
  );
};
