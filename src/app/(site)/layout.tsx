import { Shell } from "@/components/shell";
import { Masthead } from "@/components/masthead";
import { Footer } from "@/components/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Masthead />
      {children}
      <Footer />
    </Shell>
  );
}
