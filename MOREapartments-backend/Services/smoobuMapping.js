import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mappingPath = path.join(__dirname, "../data/smoobu-apartments.json");

let cachedMapping = null;

function loadMapping() {
  if (!cachedMapping) {
    cachedMapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
  }
  return cachedMapping;
}

export function resolveSmoobuApartmentId(siteApartmentId) {
  const mapping = loadMapping();
  const smoobuId = mapping[siteApartmentId];
  if (!smoobuId || smoobuId <= 0) {
    return null;
  }
  return smoobuId;
}
