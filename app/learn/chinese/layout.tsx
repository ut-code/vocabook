import { SectionLayout } from "../../components/SectionLayout";

export default function ChineseSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SectionLayout languageSlug="chinese">{children}</SectionLayout>;
}
