import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BookNowPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return null;
}
