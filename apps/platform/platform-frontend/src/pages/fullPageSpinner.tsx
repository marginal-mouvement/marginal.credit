import { Spinner } from "@marginal.credit/ui/spinner.tsx";

export const FullPageSpinner = () => {
  return (
    <div className="min-h-svh w-full flex items-center justify-center">
      <Spinner />
    </div>
  );
};
