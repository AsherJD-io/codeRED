export type WorkExperience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
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
  date: string;
};

export type Language = {
  name: string;
  level: string;
};

export type Resume = {
  name: string;
  bio: string[];
  workExperiences: WorkExperience[];
  skills: Skill[];
  educations: Education[];
  certifications: Certification[];
  languages: Language[];
  hobbies: string[];
};

const name = "Delebayo Fadejin";

const bio = [
  "With a background in Agricultural and Environmental Engineering and hands-on experience across energy systems and operational environments, I work at the intersection of physical systems and data platforms. I apply data engineering practices using Python, TypeScript, JavaScript, C++, and related tooling to design scalable data pipelines, automated backend systems, and analytics-ready platforms that support real-world decision-making.",
  "I love me data-driven innovations and bring a strong, proven commitment to making a positive impact, shaped by experience working with infrastructure, field operations, and production environments. My focus is on designing reliable data pipelines, building backend services, and applying modern cloud and container technologies to systems with real-world applications.",
  "I’m open to opportunities that allow me to learn, collaborate, and apply data engineering across agriculture, energy, and sustainability-focused systems. Reach out today—the world is&nbsp;&nbsp;<span class='highlight font-bold italic animate-pulse'>just a code away</span>&nbsp;&nbsp;from the next meaningful innovation!",
];

const workExperiences: WorkExperience[] = [
  {
    company: "Banksome Group, Lagos, Nigeria",
    role: "Facility Executive Officer",
    startDate: "JAN 2023",
    endDate: "PRESENT",
    achievements: [
      "Supported facility operations and cross-functional teams, stepping in as acting Facility Manager when required and contributing to improved service continuity across building systems.",
      "Monitored performance of critical infrastructure to ensure regulatory compliance, zero reportable safety incidents, and consistently high operational uptime.",
      "Analyzed workflow bottlenecks and service turnaround data, improving response times and operational efficiency across facility operations.",
      "Implemented structured issue tracking and feedback analysis, reducing recurring facility-related complaints and improving workplace experience.",
    ],
  },
  {
    company: "Caspian Pacific Group | Lagos, Nigeria",
    role: "Engineer & Technical Support",
    startDate: "AUG 2020",
    endDate: "DEC 2022",
    achievements: [
      "Provided technical and infrastructure support across subsidiaries in Nigeria, the UK, and the UAE, maintaining high availability of business-critical systems.",
      "Led incident response workflows, improving visibility into recurring system and operational issues.",
      "Produced and maintained technical documentation, engineering reports, and drawings by sourcing and validating project data.",
      "Supported smart metering deployment in Lekki (Alfa Bay), assisting with system integration and validation that improved energy service reliability and reduced billing discrepancies.",
      "Assisted software automation and system integration initiatives for the tax and audit unit (RFR Consulting), streamlining audit workflows.",
    ],
  },
  {
    company: "Specogreeno Concerns Limited, Rivers, Nigeria",
    role: "Operations & Technical Engineer",
    startDate: "JUN 2019",
    endDate: "JUL 2020",
    achievements: [
      "Maintained and monitored heavy-duty diesel generator fleets, sustaining reliable power availability through preventive maintenance, diagnostics, and rapid fault resolution.",
      "Managed generator rental operations end-to-end, overseeing approximately 20 rental contracts, including documentation, compliance, and client coordination.",
      "Coordinated procurement of generator spare parts from authorized dealers, including Jubaili Bros Engineering Ltd (Trans Amadi, Port Harcourt), ensuring timely availability of critical components.",
      "Led deployment and operation of a ₦1M+ contract supplying a 1000 KVA diesel power system to the Rivers State Government Cassava Processing Initiative (Afam, Oyigbo LGA).",
      "Extended generator service life through advanced mechanical diagnostics, reducing long-term maintenance costs.",
    ],
  },
  {
    company: "Kingslader Engineering Limited, Lagos, Nigeria",
    role: "Service Engineer Intern",
    startDate: "SEP 2017",
    endDate: "MAY 2018",
    achievements: [
      "Executed preventive and corrective maintenance on Caterpillar heavy-duty diesel generator sets across electrical, mechanical, and control subsystems.",
      "Performed scheduled inspections, diagnostics, and servicing for selected companies including UAC Foods, Ojota, Epoxy Oilserv Nigeria Ltd, Apapa and Sandtex, Ewekoro to ensure operational readiness under load conditions.",
      "Supported spare-parts sourcing and logistics by liaising with Mantrac Nigeria (Oregun, Lagos) for Caterpillar generator components.",
    ],
  },
];

const skills: Skill[] = [
  {
    title: "Languages",
    body: ["Python", "JavaScript", "TypeScript", "Go"],
  },
  {
    title: "Data & Backend",
    body: ["SQL", "MongoDB", "Neo4j", "REST APIs", "GraphQL"],
  },
  {
    title: "Frameworks & Tools",
    body: ["Node.js", "React", "Next.js", "Docker", "Git"],
  },
  {
    title: "Cloud & Systems",
    body: ["Google Cloud Platform", "Kubernetes", "Linux"],
  },
  {
    title: "Embedded & Data Acquisition",
    body: ["Raspberry Pi", "Arduino"],
  },
];

const educations: Education[] = [
  {
    title:
      "B.Sc Agricultural and Environmental Engineering, University of Ibadan, Oyo",
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
  { title: "Introduction to Data Engineering – IBM", date: "2024" },
  {
    title:
      "The Arduino Platform and C Programming – University of California, Irvine",
    date: "2023",
  },
  {
    title:
      "Problem Solving Using Computational Thinking – University of Michigan",
    date: "2022",
  },
];

const languages: Language[] = [
  { name: "English", level: "PROFICIENT" },
  { name: "Yoruba", level: "PROFICIENT" },
  { name: "German", level: "BEGINNER" },
];

const hobbies = ["Reading biographies", "Swimming", "Football", "Traveling"];

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
