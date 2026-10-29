export const SITE_URL = "https://www.pavexpertclub.com"
export const SITE_NAME = "PavExpert Hub"

export interface SeoFaq {
  question: string
  answer: string
}

export interface SeoPageCopy {
  title: string
  description: string
  h1: string
  body: string
}

export interface SeoService extends SeoPageCopy {
  slug: string
  name: string
  navLabel: string
  price: string
  includes: string[]
  faqs: SeoFaq[]
}

export interface SeoArea extends SeoPageCopy {
  slug: string
  name: string
  navLabel: string
  highlights: string[]
  faqs: SeoFaq[]
}

export const SERVICES: SeoService[] = [
  {
    slug: "pavers-installation",
    name: "Pavers Installation",
    navLabel: "Paver installation",
    price: "$3.50 – $5.00 per square foot",
    title: "Paver Installer in Las Vegas",
    description:
      "Paver installer for driveways, patios, walkways, and pool decks in Las Vegas, Henderson, and Summerlin. Installation and base sand from $3.50 per sq ft.",
    h1: "Paver installer in Las Vegas",
    body: "PavExpert Hub is a paver installer for driveways, patios, walkways, pool decks, and backyards in Las Vegas, Henderson, and Summerlin. The price includes professional installation and base sand, so the field stays put in desert heat and caliche soil. New paver steps are part of an install. Loose or broken steps are a repair.",
    includes: [
      "Driveway pavers, patio pavers, and walkway pavers",
      "Pool deck pavers and backyard pavers",
      "Interlocking paver installation with base sand",
      "New paver steps on a new project",
    ],
    faqs: [
      {
        question: "How much does paver installation cost in Las Vegas?",
        answer:
          "Paver installation is $3.50 to $5.00 per square foot, including professional installation and base sand. A free estimate uses your measurements and photos.",
      },
      {
        question: "Do you install driveway, patio, and pool deck pavers?",
        answer:
          "Yes. The same crew installs driveway pavers, patio pavers, walkways, pool decks, and backyard pavers in Las Vegas, Henderson, and Summerlin.",
      },
      {
        question: "Can you build new paver steps?",
        answer:
          "New steps go in with the installation. If the steps you already have are loose, settled, or broken, that is paver step repair.",
      },
    ],
  },
  {
    slug: "travertine-installation",
    name: "Travertine Installation",
    navLabel: "Travertine pavers",
    price: "$5.00 – $9.00 per square foot",
    title: "Travertine Pavers in Las Vegas",
    description:
      "Travertine paver installation for patios and pool decks in Las Vegas, Henderson, and Summerlin. Install, base, and sealing from $5.00 per sq ft.",
    h1: "Travertine pavers in Las Vegas",
    body: "Travertine installation covers patios, pool decks, and outdoor living areas that need a cooler surface in the Las Vegas sun. The price includes professional installation, base materials, and sealing. Travertine coping for the pool edge is its own job.",
    includes: [
      "Travertine patio and travertine pool deck",
      "Base materials and sealing",
      "Outdoor living areas in Las Vegas, Henderson, and Summerlin",
    ],
    faqs: [
      {
        question: "How much does travertine installation cost?",
        answer:
          "Travertine installation is $5.00 to $9.00 per square foot, including installation, base materials, and sealing.",
      },
      {
        question: "Is travertine better than porcelain around a Las Vegas pool?",
        answer:
          "Travertine stays cooler underfoot, which is why it is a common pool deck here. Porcelain is tighter and easier to keep clean. The estimate can compare both for your deck.",
      },
      {
        question: "Do you install travertine coping?",
        answer:
          "Pool edge coping is quoted as coping installation, including travertine coping, custom cutting, and the set.",
      },
    ],
  },
  {
    slug: "porcelain-installation",
    name: "Porcelain Installation",
    navLabel: "Porcelain pavers",
    price: "$5.50 – $9.50 per square foot",
    title: "Porcelain Paver Installation",
    description:
      "Porcelain paver installation for outdoor patios and pool decks in Las Vegas, Henderson, and Summerlin. Install, adhesive, and grout from $5.50 per sq ft.",
    h1: "Porcelain paver installation in Las Vegas",
    body: "Porcelain pavers are for outdoor patios, pool decks, and other spaces that need a consistent, low-porosity surface. Installation includes adhesive and grout. In Las Vegas heat, porcelain holds color and does not need the same sealing cycle as concrete pavers.",
    includes: [
      "Outdoor porcelain pavers and porcelain patios",
      "Porcelain pool decks",
      "Adhesive and grout",
    ],
    faqs: [
      {
        question: "How much does porcelain paver installation cost?",
        answer:
          "Porcelain installation is $5.50 to $9.50 per square foot, including expert installation, adhesive, and grout.",
      },
      {
        question: "Can porcelain pavers go outdoors in Las Vegas?",
        answer:
          "Yes. Outdoor porcelain is used on patios and pool decks because it handles sun and needs less sealing than concrete pavers.",
      },
      {
        question: "Porcelain or travertine for a patio?",
        answer:
          "Choose porcelain for a uniform, easy-to-clean surface. Choose travertine if you want natural stone that stays cooler by the pool.",
      },
    ],
  },
  {
    slug: "pavers-repair",
    name: "Pavers Repair",
    navLabel: "Paver repair",
    price: "Starts at $150",
    title: "Paver Repair in Las Vegas",
    description:
      "Paver repair in Las Vegas, Henderson, and Summerlin. Sinking pavers, uneven patios, loose driveway pavers, and trip hazards. Repairs start at $150.",
    h1: "Paver repair in Las Vegas",
    body: "Paver repair fixes damaged or settled pavers in driveways, patios, and walkways. That includes sinking pavers, uneven spots, paver leveling, resetting, and replacing broken pieces that have become a trip hazard. The visit covers the assessment, materials, and the repair. Loose paver steps are handled as step repair.",
    includes: [
      "Sinking pavers and uneven patios",
      "Paver leveling and resetting",
      "Broken paver replacement on driveways and walkways",
    ],
    faqs: [
      {
        question: "Can you repair sinking pavers without replacing the whole patio?",
        answer:
          "Often yes. Settled areas are lifted, the base is corrected, and the same pavers are reset. Full replacement is only when the field is too far gone.",
      },
      {
        question: "How much does paver repair cost?",
        answer:
          "Paver repair starts at $150, including assessment, materials, and the work. Larger sunken areas are priced from photos or a visit.",
      },
      {
        question: "Do you fix loose paver steps?",
        answer:
          "Yes. Stair treads and risers are a separate paver step repair so the edge you walk on is solid.",
      },
    ],
  },
  {
    slug: "paver-step-repair",
    name: "Paver Step Repair",
    navLabel: "Paver step repair",
    price: "Free estimate",
    title: "Paver Step Repair in Las Vegas",
    description:
      "Paver step repair in Las Vegas, Henderson, and Summerlin. Loose paver steps, wobbly treads, settled stairs, and broken outdoor steps.",
    h1: "Paver step repair in Las Vegas",
    body: "Paver step repair rebuilds loose, settled, or broken outdoor steps. Treads rock, risers open up, and the nose of the step becomes a trip. Flat patio repair does not fix that edge. We reset or replace the paver treads so the stairs are solid again in Las Vegas, Henderson, and Summerlin.",
    includes: [
      "Loose paver steps and wobbly treads",
      "Settled paver stairs and open risers",
      "Broken step noses that catch a foot",
    ],
    faqs: [
      {
        question: "How do you fix loose paver steps?",
        answer:
          "The loose treads come up, the base under the stair is rebuilt, and the pavers are reset or replaced so the step does not rock.",
      },
      {
        question: "Is step repair the same as paver repair?",
        answer:
          "No. Paver repair levels a patio, driveway, or walkway. Step repair is the stairs: treads, risers, and the edge you step on.",
      },
      {
        question: "Can you add new paver steps instead of repairing them?",
        answer:
          "New steps are part of paver installation. Send photos of the stairs you have and we will say whether they need repair or a rebuild.",
      },
    ],
  },
  {
    slug: "paver-sealing",
    name: "Paver Sealing",
    navLabel: "Paver sealing",
    price: "$1.00 – $3.50 per square foot",
    title: "Paver Sealing in Las Vegas",
    description:
      "Paver sealing in Las Vegas, Henderson, and Summerlin. Clean and seal concrete pavers so the desert sun does not fade the color. From $1.00 per sq ft.",
    h1: "Paver sealing in Las Vegas",
    body: "Paver sealing protects concrete pavers after a real cleaning. Desert sun fades color and joint sand washes out. The price includes thorough cleaning, professional-grade sealer, and a finish check.",
    includes: [
      "Clean and seal for existing pavers",
      "Color protection against fading",
      "Finish inspection after the sealer cures",
    ],
    faqs: [
      {
        question: "How much does it cost to seal pavers?",
        answer:
          "Paver sealing is $1.00 to $3.50 per square foot, including cleaning, sealer, and the finish inspection.",
      },
      {
        question: "Do travertine and porcelain need the same sealer?",
        answer:
          "Concrete pavers are the usual sealing job. Travertine is sealed as part of travertine installation. Porcelain does not take the same sealer.",
      },
    ],
  },
  {
    slug: "coping-installation",
    name: "Coping Installation",
    navLabel: "Pool coping",
    price: "$25.00 – $45.00 per square foot",
    title: "Pool Coping Installation",
    description:
      "Pool coping installation in Las Vegas, Henderson, and Summerlin. Travertine and paver coping with custom cutting. $25.00 to $45.00 per sq ft.",
    h1: "Pool coping installation in Las Vegas",
    body: "Coping installation finishes the pool edge and other raised borders. The work includes materials, custom cutting, and the set, including travertine coping and paver coping on pools and raised patios.",
    includes: [
      "Pool coping and raised patio edges",
      "Travertine coping and paver coping",
      "Custom cutting",
    ],
    faqs: [
      {
        question: "How much does pool coping cost?",
        answer:
          "Coping installation is $25.00 to $45.00 per square foot, including materials, custom cutting, and professional installation.",
      },
      {
        question: "Can coping match my travertine deck?",
        answer:
          "Yes. Travertine coping is cut to the pool edge so it meets the travertine pavers on the deck.",
      },
    ],
  },
  {
    slug: "decorative-wall-installation",
    name: "Decorative Wall Installation",
    navLabel: "Landscape walls",
    price: "$20.00 – $25.00 per square foot",
    title: "Landscape Wall Installation",
    description:
      "Decorative landscape walls in Las Vegas, Henderson, and Summerlin. Seat walls and block walls from $20.00 per sq ft, including materials.",
    h1: "Landscape wall installation in Las Vegas",
    body: "Decorative wall installation builds landscape walls, seat walls, and block walls around patios and yards. The price includes design consultation, materials, and construction.",
    includes: [
      "Seat walls and decorative block walls",
      "Walls that frame a paver patio",
      "Design consultation and materials",
    ],
    faqs: [
      {
        question: "How much does a landscape wall cost?",
        answer:
          "Decorative wall installation is $20.00 to $25.00 per square foot, including design consultation, materials, and construction.",
      },
    ],
  },
  {
    slug: "turf-installation",
    name: "Turf Installation",
    navLabel: "Artificial turf",
    price: "$3.00 – $4.50 per square foot",
    title: "Artificial Turf Installation",
    description:
      "Artificial turf installation in Las Vegas, Henderson, and Summerlin. Lawns and play areas from $3.00 per sq ft, including site prep and turf.",
    h1: "Artificial turf installation in Las Vegas",
    body: "Turf installation replaces a thirsty lawn with artificial turf for yards and play areas. The price includes site preparation, the turf, and the install. It pairs with paver patios and decorative rock on the same landscape project.",
    includes: [
      "Artificial turf for lawns and play areas",
      "Site preparation and premium turf",
      "Edges that meet pavers or rock",
    ],
    faqs: [
      {
        question: "How much does artificial turf cost in Las Vegas?",
        answer:
          "Turf installation is $3.00 to $4.50 per square foot, including site preparation, turf, and installation.",
      },
    ],
  },
  {
    slug: "rock-spreading",
    name: "Rock Spreading",
    navLabel: "Decorative rock",
    price: "Starts at $1.00 per square foot",
    title: "Decorative Rock Spreading",
    description:
      "Decorative rock and gravel spreading in Las Vegas, Henderson, and Summerlin. Ground cover from $1.00 per sq ft, including material and prep.",
    h1: "Decorative rock spreading in Las Vegas",
    body: "Rock spreading places decorative rock and gravel as ground cover around pavers, turf, and walls. The price includes material selection, site preparation, and the spread.",
    includes: [
      "Decorative rock and gravel ground cover",
      "Material selection and site preparation",
      "Borders next to pavers and turf",
    ],
    faqs: [
      {
        question: "How much does rock spreading cost?",
        answer:
          "Rock spreading starts at $1.00 per square foot, including material selection, site preparation, and spreading.",
      },
    ],
  },
  {
    slug: "drainage-installation",
    name: "Drainage Installation",
    navLabel: "Yard drainage",
    price: "Starts at $4.00 per square foot",
    title: "Yard Drainage Installation",
    description:
      "Yard drainage and french drains in Las Vegas, Henderson, and Summerlin. Keep water off pavers and plants. Drainage starts at $4.00 per sq ft.",
    h1: "Yard drainage installation in Las Vegas",
    body: "Drainage installation moves storm water off pavers, turf, and planting beds. A patio that holds water will settle. The price includes the site assessment, materials, and the install, including french drains where the yard needs them.",
    includes: [
      "Drainage that protects paver patios and driveways",
      "French drains and yard drainage",
      "Site assessment and materials",
    ],
    faqs: [
      {
        question: "Why do Las Vegas pavers sink after rain?",
        answer:
          "Water sitting under the base washes out the sand. Drainage is installed so the next paver repair is not the same sunken spot.",
      },
      {
        question: "How much does drainage installation cost?",
        answer:
          "Drainage installation starts at $4.00 per square foot, including assessment, materials, and the work.",
      },
    ],
  },
  {
    slug: "landscape",
    name: "Landscape Projects",
    navLabel: "Landscape projects",
    price: "Quoted by the work",
    title: "Landscape Projects in Las Vegas",
    description:
      "Landscape projects in Las Vegas, Henderson, and Summerlin: artificial turf, decorative rock, yard drainage, and landscape walls with your pavers.",
    h1: "Landscape projects in Las Vegas",
    body: "A landscape project here is the yard around the pavers: artificial turf, decorative rock, drainage, and landscape walls. PavExpert Hub installs those with the patio, driveway, or pool deck so the hardscape and the yard are one job in Las Vegas, Henderson, and Summerlin.",
    includes: [
      "Artificial turf",
      "Decorative rock",
      "Yard drainage",
      "Landscape walls",
    ],
    faqs: [
      {
        question: "What is included in a landscape project?",
        answer:
          "Turf, rock spreading, drainage, and decorative walls. Paver, travertine, and porcelain installation stay on their own pages and can be quoted with the yard.",
      },
      {
        question: "Do you landscape in Henderson and Summerlin?",
        answer:
          "Yes. The same crews work Las Vegas, Henderson, and Summerlin.",
      },
    ],
  },
]

export const AREAS: SeoArea[] = [
  {
    slug: "las-vegas",
    name: "Las Vegas",
    navLabel: "Las Vegas",
    title: "Las Vegas Paver Contractor",
    description:
      "Las Vegas paver contractor for installation, travertine, porcelain, paver repair, step repair, sealing, and landscape projects.",
    h1: "Las Vegas paver contractor",
    body: "Las Vegas yards deal with caliche, hard sun, and pool decks that get used all year. PavExpert Hub installs pavers, travertine, and porcelain, and repairs sinking patios and loose paver steps across the city. Sealing, pool coping, turf, rock, drainage, and landscape walls are part of the same visit list.",
    highlights: [
      "Driveways, patios, walkways, and pool decks",
      "Travertine and porcelain next to concrete pavers",
      "Repairs where caliche and a thin base let pavers sink",
    ],
    faqs: [
      {
        question: "Which Las Vegas neighborhoods do you serve?",
        answer:
          "The Las Vegas service area includes the city and nearby Henderson and Summerlin. The estimate form confirms the address.",
      },
      {
        question: "Can you repair pavers and install new travertine on the same property?",
        answer:
          "Yes. A sunken concrete-paver walkway can be repaired while a pool deck is quoted in travertine or porcelain.",
      },
    ],
  },
  {
    slug: "henderson",
    name: "Henderson",
    navLabel: "Henderson",
    title: "Paver Installer in Henderson",
    description:
      "Paver installer in Henderson for travertine, porcelain, paver repair, step repair, and landscape projects in Green Valley, Anthem, and Inspirada.",
    h1: "Paver installer in Henderson",
    body: "Henderson jobs run from older Green Valley patios to newer pools in Anthem and Inspirada. Homeowners ask for travertine and porcelain pool decks, paver driveways, and repairs where the original sand has settled. Turf and rock finish the yard once the hardscape is in.",
    highlights: [
      "Green Valley, Anthem, and Inspirada",
      "Travertine and porcelain pool decks",
      "Repairs on paver patios where the sand has settled",
    ],
    faqs: [
      {
        question: "Do you install travertine pavers in Henderson?",
        answer:
          "Yes. Travertine patios and pool decks are a regular Henderson request, along with porcelain when you want a tighter surface.",
      },
      {
        question: "Can you fix sinking pavers in Green Valley?",
        answer:
          "Yes. Paver repair and paver step repair cover settled patios and loose stairs in Green Valley and the rest of Henderson.",
      },
    ],
  },
  {
    slug: "summerlin",
    name: "Summerlin",
    navLabel: "Summerlin",
    title: "Paver Installer in Summerlin",
    description:
      "Paver installer in Summerlin for driveways, patios, travertine, porcelain, paver repair, and landscape projects in west Las Vegas.",
    h1: "Paver installer in Summerlin",
    body: "Summerlin streets are master-planned, and a lot of driveways and front walks are already pavers. We install and repair those fields, add travertine or porcelain at the pool, and keep the work lined up with the house. West-side yards also get turf, decorative rock, and drainage when monsoon water sits on the patio.",
    highlights: [
      "Paver driveways and front walks",
      "Pool decks in travertine or porcelain",
      "Turf, rock, and drainage when water sits on the patio",
    ],
    faqs: [
      {
        question: "Do you repair existing Summerlin paver driveways?",
        answer:
          "Yes. Paver repair resets sinking or uneven driveway and walkway pavers. Loose front steps are paver step repair.",
      },
      {
        question: "Can a Summerlin pool deck be porcelain or travertine?",
        answer:
          "Both. Travertine stays cooler. Porcelain stays uniform. The estimate uses your deck measurements.",
      },
    ],
  },
]

export const PRODUCTS_COPY: SeoPageCopy = {
  title: "Paver Installer in Las Vegas",
  description:
    "Paver installer in Las Vegas, Henderson, and Summerlin. Travertine and porcelain installation, paver repair, paver step repair, sealing, and landscape projects.",
  h1: "Paver installer in Las Vegas",
  body: "Browse paver products, then ask PavExpert Hub to install them. We are a paver installer for driveways, patios, walkways, and pool decks, and we install travertine and porcelain pavers. We also repair sinking pavers, rebuild loose paver steps, seal concrete pavers, and build landscape projects in Las Vegas, Henderson, and Summerlin.",
}

export const SERVICES_INDEX_COPY: SeoPageCopy = {
  title: "Paving and Landscape Services in Las Vegas",
  description:
    "Paver installation, travertine, porcelain, paver repair, step repair, sealing, coping, and landscape projects in Las Vegas, Henderson, and Summerlin.",
  h1: "Paving and landscape services in Las Vegas",
  body: "Every job has its own page: paver installation, travertine pavers, porcelain pavers, paver repair, paver step repair, sealing, pool coping, and landscape work (turf, rock, drainage, and walls). Prices on the service page are the same ranges used for estimates in Las Vegas, Henderson, and Summerlin.",
}

export const SUPPLIERS_COPY: SeoPageCopy = {
  title: "Paver Suppliers in Las Vegas",
  description:
    "Paver, travertine, and porcelain suppliers used for installation in Las Vegas, Henderson, and Summerlin.",
  h1: "Paver suppliers for Las Vegas jobs",
  body: "Supplier yards are where the pavers, travertine, and porcelain on an install come from. Pick a material here, then request installation, repair, or sealing from PavExpert Hub.",
}

export const ESTIMATE_COPY: SeoPageCopy = {
  title: "Free Paver Estimate in Las Vegas",
  description:
    "Free estimate for paver installation, travertine, porcelain, paver repair, step repair, and landscape projects in Las Vegas, Henderson, and Summerlin.",
  h1: "Free estimate for pavers, travertine, and repair",
  body: "Send measurements and photos for paver installation, travertine or porcelain, paver repair, paver step repair, sealing, or a landscape project. The form covers Las Vegas, Henderson, and North Las Vegas addresses, including Summerlin.",
}

export const BLOG_COPY: SeoPageCopy = {
  title: "Paver Guides",
  description: "Notes on paver installation, materials, and maintenance.",
  h1: "Paver installation notes",
  body: "Guides sit next to the work we actually do: paver installation, travertine, porcelain, repair, and sealing in Las Vegas.",
}

export const VIDEOS_COPY: SeoPageCopy = {
  title: "Paver Videos",
  description: "Videos about paver installation and maintenance.",
  h1: "Paver installation videos",
  body: "Short videos about installing and caring for pavers. For a price, use the free estimate.",
}

const SERVICE_BY_SLUG = new Map(SERVICES.map((service) => [service.slug, service]))
const AREA_BY_SLUG = new Map(AREAS.map((area) => [area.slug, area]))

export function getService(slug: string): SeoService | undefined {
  return SERVICE_BY_SLUG.get(slug)
}

export function getArea(slug: string): SeoArea | undefined {
  return AREA_BY_SLUG.get(slug)
}

export function normalizeSeoPath(pathname: string | null | undefined): string {
  if (!pathname) return "/"
  const path = pathname.split(/[?#]/)[0].replace(/\/+$/, "")
  return path || "/"
}

export function getFooterSeoCopy(pathname: string | null | undefined): SeoPageCopy {
  const path = normalizeSeoPath(pathname)
  const serviceSlug = path.match(/^\/services\/([^/]+)$/)?.[1]
  if (serviceSlug) {
    const service = getService(serviceSlug)
    if (service) return service
  }
  const areaSlug = path.match(/^\/areas\/([^/]+)$/)?.[1]
  if (areaSlug) {
    const area = getArea(areaSlug)
    if (area) return area
  }
  if (path === "/" || path === "/services") return SERVICES_INDEX_COPY
  if (path === "/suppliers") return SUPPLIERS_COPY
  if (path === "/estimate") return ESTIMATE_COPY
  if (path.startsWith("/expert-blog")) return BLOG_COPY
  if (path.startsWith("/videos")) return VIDEOS_COPY
  return PRODUCTS_COPY
}

export interface FooterLink {
  href: string
  label: string
}

export function footerLinks(): FooterLink[] {
  return [
    ...SERVICES.map((service) => ({
      href: `/services/${service.slug}`,
      label: service.navLabel,
    })),
    ...AREAS.map((area) => ({
      href: `/areas/${area.slug}`,
      label: area.navLabel,
    })),
    { href: "/products", label: "Products" },
    { href: "/estimate", label: "Free estimate" },
  ]
}

export function serviceRelatedLinks(slug: string): FooterLink[] {
  const links: FooterLink[] = SERVICES.filter((service) => service.slug !== slug).map(
    (service) => ({
      href: `/services/${service.slug}`,
      label: service.navLabel,
    })
  )
  links.push(
    ...AREAS.map((area) => ({
      href: `/areas/${area.slug}`,
      label: `${area.name}`,
    }))
  )
  return links
}

export function areaServiceLinks(area: SeoArea): FooterLink[] {
  return SERVICES.map((service) => ({
    href: `/services/${service.slug}`,
    label: `${service.navLabel} in ${area.name}`,
  }))
}
