"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { User } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileMenu() {
  const { user } = useAuth();

  if (!user)
    return (
      <Link href="/login">
        <Button className="bg-amber-800 hover:bg-amber-900">Login</Button>
      </Link>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-full bg-amber-800 hover:bg-amber-600">
          <User className=" w-10 h-10 text-white" />
          <span className="sr-only">Profile menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile">My Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/pets">My Pets</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/appointment">Book Appointment</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
