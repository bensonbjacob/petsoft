"use client";

import { logOut } from "@/actions/actions";
import { Button } from "./ui/button";

export default function SignOutBTN() {
  return (
    <Button onClick={async () => await logOut()}>Sign Out</Button>
  );
}
