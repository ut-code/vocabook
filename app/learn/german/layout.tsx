import { SectionLayout } from "../../components/SectionLayout";

export default function GermanSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectionLayout languageSlug="german">{children}</SectionLayout>;
}
