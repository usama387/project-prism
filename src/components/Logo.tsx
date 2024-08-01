import { AudioLines } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <div>
      <Link href="/" className="flex items-center gap-2">
        <AudioLines className="stroke h-11 w-11 stroke-amber-500 stroke-[1.5]" />
        <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl leading-tight tracking-tighter text-transparent">
          Project Prism
        </p>
      </Link>
    </div>
  );
};

export default Logo;
