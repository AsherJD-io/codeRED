export type WorkExperience = {
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  achievements: string[];
};

export type Skill = {
  title: string;
  body: string[];
};

export type Education = {
  title: string;
  startDate?: string;
  endDate: string;
  relevant: string[];
};

export type Certification = {
  title: string;
  issuer: string;
  date: string;
  url?: string;
  credentialId?: string;
};

export type Language = {
  name: string;
  level: string;
};

export type BioSegment =
  | { kind: "text"; text: string }
  | { kind: "highlight"; text: string };

export type Bio = {
  /** Plain text, rendered as-is. */
  text?: string;
  /** Rich text: plain runs interleaved with the highlighted phrase. */
  segments?: BioSegment[];
};

export type Resume = {
  name: string;
  bio: Bio[];
  workExperiences: WorkExperience[];
  skills: Skill[];
  educations: Education[];
  certifications: Certification[];
  languages: Language[];
  hobbies: string[];
};

const name = "Delebayo Asher";

/**
 * The bio. The third paragraph carries the original highlighted phrase as a
 * structured run rather than an HTML string, so every surface renders it as
 * markup and no surface can leak a literal `<span>` into the text.
 */
const bio: Bio[] = [
  {
    text: "My background combines Agricultural and Environmental Engineering with six years in energy and infrastructure work, including diesel power systems, smart metering, field operations, and facility management. I now work across data engineering and software product development, building pipelines and analytical layers, orchestrated data workflows, backend APIs, and systems that make operational and public data useful.",
  },
  {
    text: "My projects span energy, mobility, public procurement, finance, and agricultural technology, alongside work in cloud-native systems and embedded data acquisition. I approach each project from the actual operational problem, not from a preferred framework.",
  },
  {
    segments: [
      {
        kind: "text",
        text: "I’m open to opportunities to apply data engineering across agriculture, energy and sustainability. Reach out today. The world is",
      },
      { kind: "highlight", text: "just a code away" },
      {
        kind: "text",
        text: "from the next meaningful innovation!",
      },
    ],
  },
];

const workExperiences: WorkExperience[] = [
  {
    company: "TrailDa, Lagos, Nigeria",
    role: "Founder",
    startDate: "SEP 2025",
    current: true,
    achievements: [
      "Founded TrailDa and lead product direction and technical development for an operational intelligence platform aimed at agricultural production networks.",
      "Designed the platform data architecture, not yet built: ingestion of operational records, quality checks, analytics and forecasting, with model-assisted interpretation as the last layer rather than the first.",
      "Worked through the operational problems the platform is meant to solve with people who run production networks, and wrote those up as requirements for a pilot.",
    ],
  },
  {
    company: "Banksome Group, Lagos, Nigeria",
    role: "Facility Executive Officer",
    startDate: "2023",
    achievements: [
      "Ran day-to-day facility operations across building systems, stepping in as acting Facility Manager when required.",
      "Kept critical infrastructure within regulatory compliance and maintained uptime, with no reportable safety incidents.",
      "Worked through workflow bottlenecks and service turnaround data to bring response times down.",
      "Set up structured issue tracking and feedback analysis, which cut repeat facility complaints.",
    ],
  },
  {
    company: "Caspian Pacific Group | Lagos, Nigeria",
    role: "Engineer & Technical Support",
    startDate: "AUG 2020",
    endDate: "DEC 2022",
    achievements: [
      "Supported infrastructure across subsidiaries in Nigeria, the UK and the UAE, keeping business-critical systems available.",
      "Ran incident response, which made recurring system and operational issues easier to see and act on.",
      "Wrote and maintained technical documentation, engineering reports and drawings, validating project data at source.",
      "Worked on the smart metering deployment in Lekki (Alfa Bay), including integration and validation.",
      "Assisted software automation and system integration for the group’s tax and audit arm, RFR Professionals International Group.",
    ],
  },
  {
    company: "Specogreeno Concerns Limited, Rivers, Nigeria",
    role: "Operations & Technical Engineer",
    startDate: "JUN 2019",
    endDate: "JUL 2020",
    achievements: [
      "Maintained heavy-duty diesel generator fleets through preventive maintenance, diagnostics and fault resolution.",
      "Managed generator rental operations end to end across roughly 20 contracts, including documentation, compliance and client coordination.",
      "Coordinated spare-parts procurement from authorised dealers, including Jubaili Bros Engineering Ltd (Trans Amadi, Port Harcourt).",
      "Ran a ₦1M+ contract supplying a 1000 KVA diesel power system to the Rivers State Government Cassava Processing Initiative (Afam, Oyigbo LGA).",
      "Extended generator service life through mechanical diagnostics, overhaul and cylinder head pressure testing.",
    ],
  },
  {
    company: "Kingslader Engineering Limited, Lagos, Nigeria",
    role: "Service Engineer Intern",
    startDate: "DEC 2016",
    endDate: "MAR 2018",
    achievements: [
      "Carried out preventive and corrective maintenance on Caterpillar diesel generator sets across electrical, mechanical and control subsystems.",
      "Ran scheduled inspections, diagnostics and servicing for UAC Foods (Ojota), Epoxy Oilserv Nigeria Ltd (Apapa) and Sandtex (Ewekoro).",
      "Supported spare-parts sourcing and logistics with Mantrac Nigeria (Oregun, Lagos).",
    ],
  },
];

const skills: Skill[] = [
  {
    title: "Data Engineering",
    body: ["Python", "SQL", "ETL/ELT", "Data modelling", "Data quality"],
  },
  {
    title: "Warehousing & Analytics",
    body: ["PostgreSQL", "BigQuery", "dbt", "Parquet"],
  },
  {
    title: "Streaming & Orchestration",
    body: ["Kafka", "Redpanda", "PyFlink", "Kestra"],
  },
  {
    title: "Cloud & Platform Engineering",
    body: ["Docker", "Docker Compose", "Terraform", "Kubernetes", "Linux/Bash"],
  },
  {
    title: "Backend & Application Engineering",
    body: ["REST APIs", "TypeScript", "JavaScript", "React"],
  },
  {
    title: "Embedded & Data Acquisition",
    body: ["Arduino", "C programming", "IoT", "Data acquisition"],
  },
];

const educations: Education[] = [
  {
    title:
      "B.Sc Agricultural and Environmental Engineering, University of Ibadan, Oyo",
    startDate: "JUN 2014",
    endDate: "APR 2019",
    relevant: [
      "Elementary Computer Programming",
      "Fluid Mechanics",
      "Computer Modelling of Agricultural Systems",
      "Environmental Engineering",
    ],
  },
];

const certifications: Certification[] = [
  {
    title: "Kubernetes and Cloud Native Associate (KCNA)",
    issuer: "The Linux Foundation",
    date: "2026",
    credentialId: "LF-9zd26st59h",
  },
  {
    title: "Data Engineering Zoomcamp",
    issuer: "DataTalksClub",
    date: "2026",
  },
  {
    title: "The Arduino Platform and C Programming",
    issuer: "University of California, Irvine",
    date: "2023",
    url: "https://www.coursera.org/account/accomplishments/certificate/KNCZU2FZTEFW",
  },
  {
    title: "Problem Solving Using Computational Thinking",
    issuer: "University of Michigan",
    date: "JAN 2022",
    credentialId: "MY6KMUGES4BJ",
    url: "https://www.coursera.org/account/accomplishments/certificate/MY6KMUGES4BJ",
  },
];

const languages: Language[] = [
  { name: "English", level: "PROFICIENT" },
  { name: "Yoruba", level: "PROFICIENT" },
  { name: "German", level: "BEGINNER" },
];

const hobbies = [
  "Reading biographies",
  "Swimming",
  "Football",
  "Traveling",
  "Distance running",
];

export const resume: Resume = {
  name,
  bio,
  workExperiences,
  skills,
  educations,
  certifications,
  languages,
  hobbies,
};
