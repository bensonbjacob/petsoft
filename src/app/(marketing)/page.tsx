import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-[#5DC9A8] min-h-screen flex flex-col xl:flex-row items-center justify-center gap-10">
      <Image
        src="https://bytegrad.com/course-assets/react-nextjs/petsoft-preview.png"
        alt="Preview of PetSoft"
        width={519}
        height={472}
      />

      <div>
        <Logo />
        <h1 className="text-5xl font-semibold my-6 max-w-[500px]">
          Manage with your{" "}
          <span className="font-extrabold">pet daycare</span> with
          ease
        </h1>
        <p className="text-2xl font-medium max-w-[600px]">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Dolores debitis enim ea ullam architecto unde quo.
        </p>
        <div className="mt-10 space-x-3">
          <Button>Get Started</Button>
          <Button variant="secondary">Log in</Button>
        </div>
      </div>
    </main>
  );
}
