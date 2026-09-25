// /api/projects: the project list as JSON (slug, title, tags, status, links).
import { projects } from "@/data/projects";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const list = projects.map(({ slug, title, year, tags, status, links }) => ({
    slug,
    title,
    year,
    tags,
    status,
    links: status === "confidential" ? {} : links,
  }));
  return res.status(200).json({ count: list.length, projects: list });
}
