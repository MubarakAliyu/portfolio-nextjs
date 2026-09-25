// Sokoto local time as { hours, minutes, label: "14:32" }, refreshed every
// 30s. Null on the server (and the first client render), so it never mismatches.
import { useMemo, useSyncExternalStore } from "react";
import { site } from "@/data/site";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timezone,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const subscribe = (tick) => {
  const id = setInterval(tick, 30000);
  return () => clearInterval(id);
};
const getTime = () => formatter.format(Date.now());
const getServerTime = () => null;

export default function useSokotoTime() {
  const label = useSyncExternalStore(subscribe, getTime, getServerTime);
  return useMemo(() => {
    if (!label) return null;
    const [hours, minutes] = label.split(":").map(Number);
    return { hours, minutes, label };
  }, [label]);
}
