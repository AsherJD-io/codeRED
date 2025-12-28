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
  "With a background in Agricultural and Environmental Engineering and hands-on experience in the energy sector and operations management, I aim to apply my data engineering skills and knowledge in the use of Python, TypeScript, JavaScript, C++ and many other stacks to building scalable data platforms, pipelines, and automated backend systems across these fields.",
  "I love me data-driven innovations and bring a strong, proven commitment to making a positive impact, shaped by my track record so far. My work focuses on designing reliable data pipelines, building backend services, and using modern cloud and container technologies to support scalable, delivering systems that are efficient having real-world applications.",
  "I’m open to a wide range of opportunities to learn, share ideas, and apply my skills across these fields. Reach out today—the world is&nbsp;&nbsp;<span class='highlight font-bold italic animate-pulse'>just a code away</span>&nbsp;&nbsp;from the next new innovation!"
];

const workExperiences: WorkExperience[] = [
  {
    company: "Banksome Group, Lagos, Nigeria",
    role: "Facility Executive Officer",
    startDate: "JAN 2023",
    endDate: "PRESENT",
    achievements: [
      "Acted as primary operational support to the Facility Manager, coordinating cross-functional teams and stepping in as acting Facility Manager when required, contributing to a ~20% reduction in facility-related downtime and improved service continuity.",
      "Oversaw day-to-day facility operations and maintenance, ensuring full safety and regulatory compliance, zero reportable safety incidents, and sustaining ~95% functional uptime across building systems.",
      "Implemented process and workflow improvements across facility operations, reducing bottlenecks by ~25% and increasing departmental productivity by ~30%, enabling faster turnaround of operational requests.",
      "Supported workforce well-being and workplace efficiency initiatives, contributing to a ~20% reduction in facility-related complaints and improved employee satisfaction across operational teams."
    ]
  },
  {
    company: "Caspian Pacific Group | Lagos, Nigeria",
    role: "Engineer & Technical Support",
    startDate: "AUG 2020",
    endDate: "DEC 2022",
    achievements: [
      "Served as technical support for Caspian Pacific Group and its subsidiaries, managing software, hardware, and web infrastructure across Nigeria, the UK, and the UAE while maintaining ~98% uptime for critical systems.",
      "Oversaw incident response and troubleshooting workflows, resolving ~90% of technical issues within 24 hours and ensuring business continuity across distributed teams.",
      "Produced and maintained technical documentation, reports, and drawings, sourcing accurate engineering data to support internal projects and external deliverables with ~95% documentation accuracy.",
      "Delivered creative and visual design solutions for internal and client-facing projects across the Group, acting as the primary design resource for multiple business units.",
      "Contributed to a smart metering deployment in Lekki (Alfa Bay), supporting system integration and validation that led to a ~30% improvement in energy service efficiency and a ~25% reduction in billing errors.",
      "Supported software automation and system integration initiatives for the tax and audit unit (RFR Consulting), improving audit workflow efficiency by ~20%."
    ]
  },
  {
    company: "Specogreeno Concerns Limited, Rivers, Nigeria",
    role: "Operations & Technical Engineer",
    startDate: "JUN 2019",
    endDate: "JUL 2020",
    achievements: [
      "Led maintenance strategy and fault resolution for a fleet of heavy-duty diesel generators, sustaining ~95% uptime through proactive diagnostics, preventive maintenance, and rapid incident response.",
      "Owned generator rental operations end-to-end, serving as the primary technical and commercial point of contact; managed ~20 rental contracts, ensuring regulatory compliance, accurate documentation, and high client satisfaction.",
      "Led the deployment, and operation of a ₦1M+ contract, 1000 KVA diesel power system supply to the Rivers State Government Cassava Processing Initiative in Afam, Oyigbo LGA, ensuring continuous power availability and enabling a ~20% increase in agricultural output.",
      "Applied advanced mechanical diagnostics (including cylinder head and valve seat pressure testing) to extend generator service life by an average of ~2 years, reducing capital and maintenance costs."
    ]
  },
  {
    company: "Kingslader Engineering Limited, Lagos, Nigeria",
    role: "Service Engineer Intern",
    startDate: "SEP 2017",
    endDate: "MAY 2018",
    achievements: [
      "Executed preventive and corrective maintenance on Caterpillar heavy-duty diesel generator sets, covering electrical systems, mechanical assemblies, and control components.",
      "Conducted scheduled weekly inspections and servicing, including fault diagnostics, component testing, lubrication, and operational readiness checks to ensure system reliability.",
      "Performed troubleshooting and repair support for electrical and mechanical faults, contributing to reduced downtime and improved generator performance under operational conditions.",
    ]
  }
];

const skills: Skill[] = [
  { title: "Languages", body: ["Python", "JavaScript", "TypeScript", "Go", "Arduino"] },
  { title: "Frameworks/Libraries", body: ["React", "Nodejs", "Nextjs", "GraphQL", "Flask"] },
  { title: "Storages/Databases", body: ["SQL", "MongoDB", "Neo4j", "Kafka"] },
  { title: "Tooling", body: ["Git", "Google Cloud Console", "Docker", "Kubernetes"] }
];

const educations: Education[] = [
  {
    title: "B.Sc Agricultural and Environmental Engineering, University of Ibadan, Oyo",
    endDate: "APR 2019",
    relevant: [
      "Algebra",
      "Elementary Computer Programming",
      "Fluid Mechanics",
      "Manufacturing Science I",
      "Computer Modelling of Agricultural Systems",
      "Environmental Engineering"
    ]
  }
];

const certifications: Certification[] = [
  { title: "Introduction to Data Engineering - IBM", date: "2024" },
  { title: "The Arduino Platform and C Programming - University of California, Irvine", date: "2023" },
  { title: "Problem Solving Using Computational Thinking - University of Michigan", date: "2022" }
];

const languages: Language[] = [
  { name: "English", level: "PROFICIENT" },
  { name: "Yoruba", level: "PROFICIENT" },
  { name: "German", level: "BEGINNER" }
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
  hobbies
};
