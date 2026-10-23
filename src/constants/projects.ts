/**
 * The real project catalogue.
 *
 * One source of truth for the homepage work rows and the dedicated
 * /projects route, so the two views can never drift apart. Every field here
 * is verifiable: the stack is what the project actually uses, the links are
 * real URLs, and `preview` points at a real capture of that project.
 *
 * No invented metrics, no placeholder claims, and no link is rendered for a
 * project that does not have one.
 */

import energyDssPreview from "../../public/previews/energy-dss-preview.png";
import ordacitiPreview from "../../public/previews/ordaciti-explorer.png";
import nycTaxiPreview from "../../public/previews/nyc-taxi-preview.png";
import tradingPreview from "../../public/previews/trading-preview.png";
import thesiePreview from "../../public/previews/thesie-preview.png";
import coderedPreview from "../../public/previews/codered-preview.png";

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  /** What the reader should take away from the engineering, not the pitch. */
  contribution: string;
  stack: string;
  status: string;
  year: string;
  role: string;
  github?: string;
  live?: string;
  /** Real capture of the project, used by the editorial work rows. */
  preview: string;
  /** Short label for the preview caption. */
  previewLabel: string;
};

export const PROJECT_LIST: ProjectType[] = [
  {
    id: "energy-dss",
    title: "Energy Decision Support System",
    description:
      "Electricity demand analytics for grid planning decisions. Ingestion, cleaning and modelling across a raw and clean layer, with orchestration and anomaly detection feeding the decision surface.",
    contribution:
      "Built the ingestion and modelling path end to end: raw landing, clean models, data quality checks, and a dashboard that turns the modelled layer into something a planner can read. Anomaly detection runs over the same models rather than beside them.",
    stack:
      "Python · SQL · PostgreSQL · BigQuery · dbt · PySpark · Kestra · Terraform · Docker",
    status: "Private",
    year: "2024",
    role: "Data engineering",
    preview: energyDssPreview,
    previewLabel: "System overview dashboard",
  },
  {
    id: "ordaciti",
    title: "ordaCiti",
    description:
      "Connects government procurement records across time and place. Normalises OCDS data, then surfaces duplication and inconsistency signals between projects and the locations they affect.",
    contribution:
      "Normalised the OCDS releases into one comparable shape, then wrote the signal layer that relates projects to each other and to the places they touch. The evidence is shown for human review rather than turned into a verdict.",
    stack: "Python · Next.js · TypeScript · OCDS",
    status: "Live",
    year: "2024",
    role: "Full stack",
    github: "https://github.com/AsherJD-io/ordaciti",
    live: "https://ordaciti.vercel.app",
    preview: ordacitiPreview,
    previewLabel: "Project explorer",
  },
  {
    id: "nyc-taxi",
    title: "NYC Taxi Data Platform",
    description:
      "Mobility trip data, ingested and modelled end to end. A streaming pipeline with an incremental batch layer, modelled for trip-level analytics.",
    contribution:
      "Ran the same trip data through a batch and a streaming path: orchestrated ingestion, incremental processing, and windowed stream queries, then modelled the result for trip-level analysis. The streaming jobs and the warehouse models are both part of the delivery.",
    stack:
      "Docker · Terraform · Kestra · BigQuery · dbt · Spark · Kafka · PyFlink",
    status: "In progress",
    year: "2024",
    role: "Data platform",
    github: "https://github.com/AsherJD-io/nyc-taxi-data-platform",
    preview: nycTaxiPreview,
    previewLabel: "Streaming job dashboard",
  },
  {
    id: "trading-analytics",
    title: "Trading Performance Analytics",
    description:
      "Trading performance as a behavioural and risk system. Positioning, drawdown and risk-adjusted measures computed on a modelled warehouse.",
    contribution:
      "Modelled trades and equity so positioning, drawdown and risk-adjusted measures are computed from one consistent grain, then surfaced them as a readable performance view rather than a raw table dump.",
    stack: "Python · dbt · BigQuery · Kestra · Streamlit · Docker",
    status: "Private",
    year: "2023",
    role: "Analytics engineering",
    preview: tradingPreview,
    previewLabel: "Performance analytics",
  },
  {
    id: "thesie",
    title: "Thesie",
    description:
      "Lending access and accountability for small businesses, in development. A FastAPI service over a migrated relational schema.",
    contribution:
      "Designed the service and data model for consent-led information sharing, then migrated the relational schema underneath it with Alembic. The public service is deployed and reports its own health.",
    stack: "Python · FastAPI · SQLAlchemy · PostgreSQL · Alembic",
    status: "In development",
    year: "2025",
    role: "Backend",
    live: "https://thesie.vercel.app",
    preview: thesiePreview,
    previewLabel: "Service landing",
  },
  {
    id: "codered",
    title: "codeRED",
    description:
      "This portfolio site, built around a code-inspired identity. React, TypeScript and SCSS, with a Substack feed integration.",
    contribution:
      "Built the site itself: the design system, the animated terminal hero, the editorial work rows, and the Substack feed integration that keeps the writing section in step with the publication.",
    stack: "React · TypeScript · SCSS · Vite",
    status: "Live",
    year: "2025",
    role: "Frontend",
    github: "https://github.com/AsherJD-io/codeRED",
    live: "https://codered-azure.vercel.app",
    preview: coderedPreview,
    previewLabel: "This site",
  },
];
