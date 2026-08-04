import { SectionLayout } from "../../components/SectionLayout";

export default function FrenchSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectionLayout languageSlug="french">{children}</SectionLayout>;
}
