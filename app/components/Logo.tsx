import Image from "next/image";
import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <Image
        src="/logo/logo.png"
        alt="RETROCUEVA"
        width={202}
        height={173}
        priority
        className="h-10 w-auto"
      />
      <span className="font-pixel text-xs text-ink sm:text-sm">
        RETRO<span className="text-neon">CUEVA</span>
      </span>
    </Link>
  );
}
