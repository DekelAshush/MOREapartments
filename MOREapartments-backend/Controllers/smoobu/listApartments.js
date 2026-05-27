import { listApartments } from "../../Services/smoobuClient.js";

export async function listSmoobuApartments(req, res) {
  try {
    const data = await listApartments();
    return res.json(data);
  } catch (error) {
    console.error("Smoobu list apartments failed:", error);
    return res.status(error.status || 500).json({
      error: error.message || "Failed to list Smoobu apartments",
    });
  }
}
