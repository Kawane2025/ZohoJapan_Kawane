import { GAS_URL } from "./config";
const useProxy = import.meta.env?.DEV;
const eventsURL = useProxy ? "/api/events" : `${GAS_URL}?action=events`;
const registerURL = useProxy ? "/api/register" : `${GAS_URL}?action=register`;
async function handle(res) {
  const txt = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${txt}`);
  try {
    return JSON.parse(txt);
  } catch {
    throw new Error("Bad JSON: " + txt);
  }
}
export async function getEvents() {
  const res = await fetch(eventsURL);
  return handle(res);
}
export async function createRegistration(data) {
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) {
    form.append(k, Array.isArray(v) ? JSON.stringify(v) : String(v ?? ""));
  }
  const res = await fetch(registerURL, { method: "POST", body: form });
  return handle(res);
}
