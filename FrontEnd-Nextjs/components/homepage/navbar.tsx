import Link from "next/link";

import logo from "@/public/image.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Image src={logo} width={40} height={40} alt="logo" />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size="sm" variant="outline" asChild>
            <Link href="auth/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="auth/register">Get started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
