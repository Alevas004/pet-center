import Link from "next/link";

import { PiPawPrintFill } from "react-icons/pi";
import ProfileMenu from "./profile-menu";

export default function Header() {
  return (
    <header className="w-full bg-white">
      <div className="container h-16 md:h-20 px-4 md:px-6 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-4xl font-extrabold text-red-500 flex items-center"
          >
            PET<PiPawPrintFill className="font-normal text-amber-950" />CENTER 
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
