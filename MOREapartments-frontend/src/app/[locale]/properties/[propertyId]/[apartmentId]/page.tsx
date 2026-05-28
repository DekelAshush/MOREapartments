import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import ApartmentDetail from "@/_components/properties/ApartmentDetail";
import {
  getAllApartmentParams,
  getApartmentContext,
} from "@/data/property-utils";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{
    locale: string;
    propertyId: string;
    apartmentId: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllApartmentParams().map(({ propertyId, apartmentId }) => ({
      locale,
      propertyId,
      apartmentId,
    })),
  );
}

export default async function ApartmentDetailPage({ params }: Props) {
  const { locale, propertyId, apartmentId } = await params;
  setRequestLocale(locale);

  const context = getApartmentContext(propertyId, apartmentId);
  if (!context) {
    notFound();
  }

  return (
    <ApartmentDetail
      property={context.property}
      apartment={context.apartment}
    />
  );
}
