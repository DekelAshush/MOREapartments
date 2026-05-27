import smoobuApartments from "./smoobu-apartments.json";

export function hasSmoobuMapping(apartmentId: string): boolean {
  const smoobuId = smoobuApartments[apartmentId as keyof typeof smoobuApartments];
  return typeof smoobuId === "number" && smoobuId > 0;
}
