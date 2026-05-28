import { properties, type Apartment, type Property } from "./properties";

export function getPropertyById(propertyId: string): Property | undefined {
  return properties.find((property) => property.id === propertyId);
}

export function getApartmentById(apartmentId: string): Apartment | undefined {
  for (const property of properties) {
    const apartment = property.apartments.find((unit) => unit.id === apartmentId);
    if (apartment) {
      return apartment;
    }
  }
  return undefined;
}

export function getApartmentContext(
  propertyId: string,
  apartmentId: string,
): { property: Property; apartment: Apartment } | undefined {
  const property = getPropertyById(propertyId);
  if (!property) {
    return undefined;
  }

  const apartment = property.apartments.find((unit) => unit.id === apartmentId);
  if (!apartment) {
    return undefined;
  }

  return { property, apartment };
}

export function getAllApartmentParams() {
  return properties.flatMap((property) =>
    property.apartments.map((apartment) => ({
      propertyId: property.id,
      apartmentId: apartment.id,
    })),
  );
}
