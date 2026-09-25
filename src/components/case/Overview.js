// Overview: the description, lit up word by word as you scroll, beside a
// sticky column with the client, roles, team, timeline and stack.
import ScrollWords from "@/components/ui/ScrollWords";
import styles from "@/styles/Overview.module.css";

export default function Overview({ project }) {
  const facts = [
    project.client && { label: "Client", value: project.client },
    project.roles && { label: "My roles", value: project.roles },
  ].filter(Boolean);

  return (
    <section id="overview" className={styles.section}>
      <p className={styles.eyebrow}>(Overview)</p>
      <div className={styles.grid}>
        <ScrollWords
          paragraphs={project.description.map((text) => [{ text }])}
          className={styles.text}
        />

        <aside className={styles.aside}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <h3>{fact.label}</h3>
              <p>{fact.value}</p>
            </div>
          ))}

          {project.team?.length > 0 && (
            <div className={styles.fact}>
              <h3>Team</h3>
              <ul className={styles.team}>
                {project.team.map((member) => (
                  <li key={member.name}>
                    <span>{member.name}</span> <span className="accent">{member.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.timeline && (
            <div className={styles.fact}>
              <h3>Timeline</h3>
              <p>{project.timeline}</p>
            </div>
          )}

          {project.stack?.length > 0 && (
            <div className={styles.fact}>
              <h3>Tools &amp; stack</h3>
              <ul className={styles.stack}>
                {project.stack.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
