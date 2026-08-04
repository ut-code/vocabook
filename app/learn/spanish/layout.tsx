import { SectionLayout } from "../../components/SectionLayout";

export default function SpanishSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectionLayout languageSlug="spanish">{children}</SectionLayout>;
}
