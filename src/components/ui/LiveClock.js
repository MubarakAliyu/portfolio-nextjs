// LiveClock: "HH:MM:SS Sokoto", ticking every second in Africa/Lagos time.
// The server renders a placeholder; the real time only appears on the client.
import { useSyncExternalStore } from "react";
import clsx from "clsx";
import { site } from "@/data/site";
import styles from "@/styles/LiveClock.module.css";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timezone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const subscribe = (tick) => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
};
const getTime = () => formatter.format(Date.now());
const getServerTime = () => null;

// `as="span"` when the clock sits inside another paragraph.
export default function LiveClock({ className, as: Tag = "p" }) {
  const time = useSyncExternalStore(subscribe, getTime, getServerTime);

  return (
    <Tag className={clsx(styles.clock, className)}>
      <time suppressHydrationWarning>{time ?? "--:--:--"}</time> <span>{site.clockLabel}</span>
    </Tag>
  );
}
