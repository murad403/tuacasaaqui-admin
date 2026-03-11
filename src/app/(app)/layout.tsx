import AppWrapper from "@/components/wrapper/AppWrapper";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppWrapper>{children}</AppWrapper>;
}
