import Image from "next/image";
import logo from "@/assets/logo/logo2.png";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md sm:max-w-lg bg-white rounded-xl border border-gray-200 shadow-xs p-6 sm:p-10">
      <div className="flex flex-col items-center mb-4">
        <Image
          src={logo}
          alt="TuacasaAqui"
          width={250}
          height={250}
        />
        {/* <h1 className="text-3xl md:text-4xl font-semibold text-heading">
          TuacasaAqui
        </h1> */}
      </div>
      {children}
    </div>
  );
}
