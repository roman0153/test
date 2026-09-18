"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { projectCategories, type Project, type ProjectCategory } from "@/lib/content";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<ProjectCategory>("Všetky");
  const filtered = category === "Všetky" ? projects : projects.filter((project) => project.category === category);

  return (
    <div>
      <div className="project-filter-bar">
        <div className="project-filters" role="group" aria-label="Filtrovať projekty podľa typu">
          {projectCategories.map((item) => (
            <button key={item} className={category === item ? "is-active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>
              {item}<sup>{item === "Všetky" ? projects.length : projects.filter((project) => project.category === item).length}</sup>
            </button>
          ))}
        </div>
        <p className="filter-count" role="status">Zobrazené: {filtered.length} / {projects.length}</p>
      </div>
      <div className="projects-grid">
        {filtered.map((project, index) => (
          <Link href={`/realizacie/${project.slug}`} key={project.slug} className="project-card" data-reveal="up" data-reveal-delay={index % 2}>
            <div className="project-card-image image-wrap"><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 42vw" className="cover-image" /><span className="project-type">{project.category}</span><span className="project-open"><ArrowIcon /></span></div>
            <div className="project-card-description"><h2>{project.title}</h2><p>{project.location}<span>·</span>{project.year}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}