export type Listing = {
  id: string;
  title: string;
  org: string;
  location: string;
  region: string;
  description: string;
  image: string;
  category: "activity" | "camp" | "internship";
  badge: string;
  footer: string;
  deadline?: string;
};

export const extracurriculars: Listing[] = [
  {
    id: "a1",
    title: "Robotics League — Regional Build Season",
    org: "STEM Forward Alliance",
    location: "Austin, TX",
    region: "Southwest",
    description:
      "Design and compete with a FIRST-style robot. Mentors from local tech companies; no prior experience required.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08f96634?auto=format&fit=crop&w=800&q=80",
    category: "activity",
    badge: "Competition",
    footer: "Grades 9–12 · Weekly meets",
    deadline: "Sign-ups close Sep 15",
  },
  {
    id: "a2",
    title: "Youth Orchestra — Chamber Ensembles",
    org: "Metro Arts Conservatory",
    location: "Chicago, IL",
    region: "Midwest",
    description:
      "Small-group coaching with conservatory faculty. Auditions are supportive and focus on growth, not perfection.",
    image:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80",
    category: "activity",
    badge: "Music",
    footer: "All instruments welcome",
  },
  {
    id: "a3",
    title: "Environmental Action Club & Field Labs",
    org: "Coastal Futures Project",
    location: "Portland, OR",
    region: "Pacific",
    description:
      "Water-quality sampling, habitat restoration weekends, and a student-led climate policy forum each semester.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    category: "activity",
    badge: "Service",
    footer: "Outdoor days monthly",
  },
  {
    id: "a4",
    title: "Debate & Civic Reasoning Lab",
    org: "National Student Forum",
    location: "Atlanta, GA",
    region: "Southeast",
    description:
      "Policy debate, public forum, and mock legislature tracks. Travel tournaments optional with scholarships.",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    category: "activity",
    badge: "Leadership",
    footer: "Beginner track available",
  },
];

export const summerCamps: Listing[] = [
  {
    id: "c1",
    title: "Coastal Marine Science Immersion",
    org: "Blue Harbor Institute",
    location: "San Diego, CA",
    region: "Pacific",
    description:
      "Two weeks of field work, ROV workshops, and lab time with graduate students. Housing on a small college campus.",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
    category: "camp",
    badge: "STEM",
    footer: "Ages 15–17 · Residential",
    deadline: "Early bird Mar 1",
  },
  {
    id: "c2",
    title: "Design & Fabrication Studio",
    org: "Maker Guild Summer",
    location: "Detroit, MI",
    region: "Midwest",
    description:
      "CNC, electronics, and sustainable materials. Capstone: a community installation co-designed with a local nonprofit.",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
    category: "camp",
    badge: "Design",
    footer: "Day camp · Lunch included",
  },
  {
    id: "c3",
    title: "Creative Writing & Journalism Intensive",
    org: "Inkwell Summer",
    location: "New York, NY",
    region: "Northeast",
    description:
      "Newsroom simulations, podcast production, and mentorship from working editors. Portfolio review on the final day.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    category: "camp",
    badge: "Arts",
    footer: "1-week sessions",
  },
  {
    id: "c4",
    title: "Outdoor Leadership & Wilderness Skills",
    org: "Ridge Trail Expeditions",
    location: "Denver, CO",
    region: "Mountain",
    description:
      "Backpacking fundamentals, leave-no-trace ethics, and peer leadership scenarios in Rocky Mountain front country.",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
    category: "camp",
    badge: "Outdoors",
    footer: "Scholarships available",
  },
];

export const internships: Listing[] = [
  {
    id: "i1",
    title: "Software Engineering Intern — Civic Tools",
    org: "OpenGov Labs",
    location: "Remote (US)",
    region: "Nationwide",
    description:
      "Ship features that help residents access public data. Stack: TypeScript, React, Postgres. Pairing-heavy culture.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    category: "internship",
    badge: "Tech",
    footer: "Paid · 10 weeks",
    deadline: "Applications due Feb 28",
  },
  {
    id: "i2",
    title: "Healthcare Research Assistant",
    org: "Lakeside Medical Center",
    location: "Minneapolis, MN",
    region: "Midwest",
    description:
      "Support clinical studies in cardiology. Training in data ethics, REDCap, and literature reviews with PI oversight.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    category: "internship",
    badge: "Research",
    footer: "Rising college juniors+",
  },
  {
    id: "i3",
    title: "Sustainable Supply Chain Analyst Intern",
    org: "Northwind Foods",
    location: "Seattle, WA",
    region: "Pacific",
    description:
      "Model supplier emissions, present to ops leaders, and shadow vendor audits. Excel + Python friendly team.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    category: "internship",
    badge: "Business",
    footer: "Hybrid · Stipend",
  },
  {
    id: "i4",
    title: "Museum Education & Exhibit Design Intern",
    org: "Riverfront Museum of History",
    location: "Philadelphia, PA",
    region: "Northeast",
    description:
      "Facilitate school programs, prototype interactives, and assist curators with a new youth history gallery.",
    image:
      "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80",
    category: "internship",
    badge: "Education",
    footer: "Part-time summer",
  },
  {
    id: "i5",
    title: "Renewable Energy Field Intern",
    org: "SunPath Energy",
    location: "Albuquerque, NM",
    region: "Southwest",
    description:
      "Site surveys, GIS support, and community outreach for residential solar pilots. OSHA-10 training provided.",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    category: "internship",
    badge: "Energy",
    footer: "Paid mileage",
  },
];

export const regions = [
  "All regions",
  "Northeast",
  "Southeast",
  "Midwest",
  "Southwest",
  "Pacific",
  "Mountain",
  "Nationwide",
] as const;

export function featuredListings(): Listing[] {
  return [
    internships[0],
    summerCamps[0],
    extracurriculars[1],
    internships[2],
  ];
}
