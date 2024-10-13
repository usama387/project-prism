import { Loader2 } from "lucide-react";

const loading = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-24 space-y-4">
      <Loader2 className="animate-spin text-emerald-400 h-16 w-16 stroke-[4]" />
      <p className="text-emerald-600 font-semibold text-lg animate-pulse">
        Please hold...
      </p>
    </div>
  );
};

export default loading;
