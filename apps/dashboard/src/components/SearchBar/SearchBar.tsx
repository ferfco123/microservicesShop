import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type searchbarTypes = {
  state: string;

  placeholder: string;
};
export function SearchBar({ state, placeholder }: searchbarTypes) {
  const [searchparams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<string>(searchparams.get(state) ?? "");

  useEffect(() => {
    const setTimeOut = setTimeout(() => {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);

        if (value.trim().length > 2) {
          newParams.set(state, value.trim());
        } else if (value.trim().length === 0) {
          newParams.delete(state);
        }

        return newParams;
      });
    }, 1000);

    return () => clearTimeout(setTimeOut);
  }, [value]);
  return (
    <div className="flex items-center rounded-md border px-3 py-1 text-sm focus-within:ring-1 focus-within:ring-ring">
      <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="search"
        placeholder={placeholder}
        className="h-8 max-w-xs border-none p-2 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
