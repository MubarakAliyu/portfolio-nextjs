// SectionTitle: SkyBoxed heading that reveals line by line and always ends
// with a red period, e.g. "Work." or "One practice, / eleven tools."
import { Fragment } from "react";
import clsx from "clsx";
import RevealText from "./RevealText";
import styles from "@/styles/SectionTitle.module.css";

export default function SectionTitle({ as = "h2", children, lines, period = true, size = "title", className, play }) {
  const all = lines ?? [children];
  const last = all.length - 1;
  const withPeriod = all.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i === last && period && <span className="accent">.</span>}
    </Fragment>
  ));

  return <RevealText as={as} lines={withPeriod} className={clsx(styles.title, styles[size], className)} play={play} />;
}
