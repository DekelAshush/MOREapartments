"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { LOGO_HEADER_SRC } from "@/generated/logo";

function Logo() {
  return (
    <Link href="/" className="shrink-0">
      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white ring-2 ring-white/40 md:h-14 md:w-14">
        <Image
          src={LOGO_HEADER_SRC}
          alt="MORE Apartments"
          width={112}
          height={112}
          quality={100}
          className="h-full w-full object-cover object-center"
          sizes="(max-width: 768px) 32px, 56px"
          priority
        />
      </div>
    </Link>
  );
}

export default Logo;
