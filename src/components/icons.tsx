
import type { SVGProps } from "react";
import { Gavel } from "lucide-react";

export function LegalMindLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m14 13-7.5 7.5" />
      <path d="m18.5 8.5-7 7" />
      <path d="m12 19 1.5-1.5" />
      <path d="m6 13 1.5-1.5" />
      <path d="M16 16a2 2 0 0 0 3-3V6a2 2 0 0 0-2-2h-3c-1.1 0-2 .9-2 2v3a2 2 0 0 0 2 2h3Z" />
      <path d="M10 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    </svg>
  )
}
