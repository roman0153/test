export const site = {
  name: "Eden Gardens",
  description:
    "Záhrady, ktoré sa stanú domovom. Návrh, realizácia a starostlivosť o záhrady s rešpektom k prírode aj architektúre.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "",
};

export function getSiteUrl() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
    if (url.protocol === "https:" || url.protocol === "http:") return url;
  } catch {
    // A missing or malformed local configuration must not break the preview.
  }
  return new URL("http://localhost:3000");
}

export const navigation = [
  { href: "/realizacie", label: "Realizácie" },
  { href: "/sluzby", label: "Služby" },
  { href: "/o-nas", label: "O nás" },
  { href: "/media", label: "Médiá" },
  { href: "/kontakt", label: "Kontakt" },
];

// Selected from Eden Gardens' public ÁTRIOVÁ záhrada Pinterest board.
// Direct image URLs are required: pin.it and Pinterest pin pages are not images.
// Pin sources are recorded below; permission must be confirmed before publication.
// The project names, locations and descriptions below remain illustrative.
export const images = {
  // https://www.pinterest.com/pin/714876140876899590/ (the supplied pin.it link)
  garden: "https://i.pinimg.com/originals/a9/c9/d2/a9c9d25249ba410fb8e56f2c225b6ee6.jpg",
  // https://www.pinterest.com/pin/714876140878298150/
  courtyard: "https://i.pinimg.com/originals/0f/cd/28/0fcd286694c8d2f236e6345f785caf73.jpg",
  // https://www.pinterest.com/pin/714876140876633241/
  house: "https://i.pinimg.com/originals/1e/22/dd/1e22dd57193e2324f48a9912d02d772f.jpg",
  // https://www.pinterest.com/pin/714876140877421156/
  greenery: "https://i.pinimg.com/originals/a8/0f/a7/a80fa732a3cec95342a0d7d6f03050d0.jpg",
  // https://www.pinterest.com/pin/714876140876459917/
  planting: "https://i.pinimg.com/originals/3d/2e/e2/3d2ee2f24a9fd74aa0a0d117230c0b5c.jpg",
  // https://www.pinterest.com/pin/714876140876459927/
  park: "https://i.pinimg.com/originals/2e/5a/d4/2e5ad4d1b7f9f8bc0a62b47f0f40ee52.jpg",
  // https://www.pinterest.com/pin/714876140884895355/
  detail: "https://i.pinimg.com/originals/2d/77/ea/2d77eae51f7ca21cfebd04d2bfd069ec.jpg",
};

export type ServiceId = "navrh" | "realizacia" | "udrzba" | "zavlahy";
export type Service = {
  id: ServiceId;
  number: string;
  name: string;
  short: string;
  title: string;
  description: string;
  details: string[];
  image: string;
};

export const services: Service[] = [
  {
    id: "navrh",
    number: "01",
    name: "Návrh záhrady",
    short: "Koncepcia, ktorá rešpektuje priestor, architektúru a váš životný štýl.",
    title: "Každá dobrá záhrada začína počúvaním.",
    description:
      "Najprv spoznáme vás, miesto a jeho možnosti. Až potom kreslíme. Hľadáme rovnováhu medzi tým, čo potrebujete dnes, a tým, ako bude záhrada žiť o niekoľko rokov.",
    details: ["Úvodná konzultácia a analýza miesta", "Priestorová štúdia a materiálový koncept", "Osadzovací plán a výber rastlín", "Podklady pre realizáciu a rámcový rozpočet"],
    image: images.greenery,
  },
  {
    id: "realizacia",
    number: "02",
    name: "Realizácia",
    short: "Precízne prevedenie s dôrazom na kvalitu a každý detail.",
    title: "Od myšlienky k miestu, ktoré žije.",
    description:
      "Návrh premieňame na skutočný priestor. Koordinujeme jednotlivé kroky, prepájame remeslá a dohliadame na detaily, ktoré vo výsledku pôsobia úplne prirodzene.",
    details: ["Príprava terénu a pôdy", "Spevnené plochy a záhradné prvky", "Výsadba stromov, krov a trvaliek", "Založenie trávnika a odovzdanie záhrady"],
    image: images.courtyard,
  },
  {
    id: "udrzba",
    number: "03",
    name: "Údržba",
    short: "Aby vaša záhrada ostala krásna po celý rok.",
    title: "Krása, ktorá rastie s časom.",
    description:
      "Záhrada sa nekončí poslednou vysadenou rastlinou. Citlivou sezónnou starostlivosťou pomáhame jej prirodzenému vývoju, zdraviu aj dlhodobej kráse.",
    details: ["Pravidelná aj jednorazová starostlivosť", "Odborný rez stromov a krov", "Sezónna starostlivosť o trávnik", "Výživa pôdy a obnova výsadby"],
    image: images.planting,
  },
  {
    id: "zavlahy",
    number: "04",
    name: "Závlahy / zeleň",
    short: "Zdravá zeleň a efektívne riešenia pre udržateľnú záhradu.",
    title: "Správna voda. Na správnom mieste.",
    description:
      "Navrhujeme závlahu podľa konkrétneho miesta a potrieb rastlín. Myslíme na rozumnú spotrebu vody, jednoduché ovládanie aj možnosti využitia dažďovej vody.",
    details: ["Návrh a montáž automatickej závlahy", "Kvapková závlaha výsadbových plôch", "Nastavenie a sezónny servis", "Riešenia pre hospodárenie s dažďovou vodou"],
    image: images.park,
  },
];

export const projectCategories = ["Všetky", "Rodinné záhrady", "Mestské záhrady", "Terasy"] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  slug: string;
  title: string;
  category: Exclude<ProjectCategory, "Všetky">;
  location: string;
  year: string;
  area: string;
  image: string;
  imageAlt: string;
  intro: string;
  description: string;
  gallery: { src: string; alt: string }[];
  tags: string[];
};

export const projects: Project[] = [
  {
    slug: "zahrada-pre-pomaly-zivot",
    title: "Záhrada pre pomalý život",
    category: "Rodinné záhrady",
    location: "Bratislava",
    year: "2025",
    area: "680 m²",
    image: images.garden,
    imageAlt: "Zelený trávnik so vzrastlou borovicou pri modernom dome",
    intro: "Miesto, kde sa interiér prirodzene stretáva s prírodou.",
    description:
      "Ukážkový koncept rodinnej záhrady stavia na jednoduchosti. Pokojná trávnatá plocha, mäkké línie výsadby a terasa pri dome vytvárajú priestor pre obyčajné, vzácne chvíle. Kompozícia pracuje s prirodzeným svetlom a pohľadmi z obytných miestností.",
    gallery: [
      { src: images.courtyard, alt: "Kamenné nášľapy a okrúhla hrdzavá misa medzi výsadbou" },
      { src: images.greenery, alt: "Záhradný chodník medzi trávnikom a nízkou výsadbou" },
      { src: images.house, alt: "Moderný dom s átriovou záhradou a okrúhlou misou" },
    ],
    tags: ["Návrh", "Výsadba", "Pobytová terasa"],
  },
  {
    slug: "priroda-za-mestom",
    title: "Príroda za mestom",
    category: "Rodinné záhrady",
    location: "Pezinok",
    year: "2025",
    area: "920 m²",
    image: images.greenery,
    imageAlt: "Svieža zelená záhrada s prirodzenou výsadbou",
    intro: "Voľnosť krajiny, zachytená v súkromnej záhrade.",
    description:
      "Ilustračná štúdia záhrady na okraji mesta necháva hlavnú úlohu rastlinám. Vrstvená výsadba vytvára súkromie, zatiaľ čo otvorené plochy nechávajú záhradu dýchať. Výber druhov zohľadňuje slnečné stanovište a premenlivosť ročných období.",
    gallery: [
      { src: images.park, alt: "Pohľad zhora na nášľapy, výsadbu a okrúhlu misu v átriu" },
      { src: images.planting, alt: "Trvalková výsadba pri presklenom okne domu" },
    ],
    tags: ["Prírodná výsadba", "Trvalky", "Súkromie"],
  },
  {
    slug: "terasa-v-zeleni",
    title: "Terasa v zeleni",
    category: "Terasy",
    location: "Bratislava",
    year: "2024",
    area: "85 m²",
    image: images.courtyard,
    imageAlt: "Nášľapový chodník a okrúhla misa vo výsadbe pri modernom dome",
    intro: "Ďalšia obývacia izba. Tentoraz pod otvoreným nebom.",
    description:
      "Táto ukážková štúdia prepája jedálenskú a oddychovú zónu s výsadbou v nádobách. Prírodné materiály, jemné textúry a rastliny vytvárajú pokojné zázemie bez zbytočných prvkov. Aj menšia plocha môže ponúknuť veľkorysý pocit priestoru.",
    gallery: [
      { src: images.house, alt: "Architektonický detail exteriéru" },
      { src: images.greenery, alt: "Zeleň ako prirodzená clona" },
    ],
    tags: ["Terasa", "Rastliny v nádobách", "Oddych"],
  },
  {
    slug: "tiche-mestske-atrium",
    title: "Tiché mestské átrium",
    category: "Mestské záhrady",
    location: "Trnava",
    year: "2024",
    area: "140 m²",
    image: images.house,
    imageAlt: "Súkromné átrium modernej mestskej rezidencie",
    intro: "Malý svet, ktorý necháva ruch mesta za bránou.",
    description:
      "Ilustračný koncept mestského átria ukazuje, ako pracovať s obmedzeným priestorom. Jasná geometria, zelené pozadie a jeden výrazný strom vytvárajú pevnú kompozíciu. Priestor je navrhnutý pre pokojné ranné chvíle aj večerné stretnutia.",
    gallery: [
      { src: images.courtyard, alt: "Komorná pobytová plocha" },
      { src: images.greenery, alt: "Výsadba pre súkromie v meste" },
    ],
    tags: ["Átrium", "Architektúra", "Súkromie"],
  },
  {
    slug: "zahrada-v-rytme-prirody",
    title: "V rytme prírody",
    category: "Rodinné záhrady",
    location: "Modra",
    year: "2024",
    area: "1 100 m²",
    image: images.park,
    imageAlt: "Átriová záhrada s nášľapmi a hustou výsadbou pri pohľade zhora",
    intro: "Záhrada, ktorá je v každom ročnom období trochu iná.",
    description:
      "Ukážkový návrh väčšej záhrady skladá jednotlivé plochy do voľnej krajinnej kompozície. Stromy poskytujú tieň a charakter, trvalky prinášajú sezónnosť. Hlavnou myšlienkou je vytvoriť pestré miesto pre ľudí aj drobných záhradných návštevníkov.",
    gallery: [
      { src: images.greenery, alt: "Prirodzené zelené okraje záhrady" },
      { src: images.planting, alt: "Detail trvalkového záhona pri modernej fasáde" },
    ],
    tags: ["Biodiverzita", "Stromy", "Sezónnosť"],
  },
  {
    slug: "zeleny-mestsky-dvor",
    title: "Zelený mestský dvor",
    category: "Mestské záhrady",
    location: "Nitra",
    year: "2025",
    area: "210 m²",
    image: images.detail,
    imageAlt: "Drevené vyvýšené záhony so zeleninou pri zelenom plote",
    intro: "Priestor na pestovanie, stretávanie a obyčajný oddych.",
    description:
      "Ilustračná štúdia dvora prepája úžitkovú a okrasnú záhradu. Vyvýšené záhony dopĺňajú trvalky a jednoduchá pobytová plocha. Dôraz je na dobrej pôde, dostupnosti jednotlivých záhonov a radosti z vlastného pestovania.",
    gallery: [
      { src: images.greenery, alt: "Zeleň v mestskom priestore" },
      { src: images.park, alt: "Pohľad zhora na členenie átriovej záhrady a výsadbu" },
    ],
    tags: ["Úžitková záhrada", "Vyvýšené záhony", "Trvalky"],
  },
];

export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  sections: { title: string; text: string }[];
};

export const articles: Article[] = [
  {
    slug: "zahrada-ktora-zije-cely-rok",
    title: "Záhrada, ktorá žije celý rok",
    category: "Inšpirácia",
    date: "2026-09-01",
    readTime: "3 min čítania",
    excerpt: "Krásna záhrada nie je len letná záležitosť. Je to premyslený príbeh štyroch ročných období.",
    image: images.park,
    sections: [
      { title: "Začnite kostrou záhrady", text: "Stromy, kry a jasné členenie priestoru tvoria základ, ktorý zostáva čitateľný aj v zime. Skôr než vyberiete prvé kvety, premyslite si pohľady z domu, miesta na sedenie a spôsob, akým budete záhradou prechádzať. Dobrá kompozícia funguje aj bez farieb." },
      { title: "Nechajte rastliny striedať sa", text: "Skoré cibuľoviny, letné trvalky a jesenné trávy nemusia súperiť o pozornosť. Skladajte ich tak, aby jedna skupina prirodzene odovzdávala miesto ďalšej. Pri výbere vždy rešpektujte svetlo, pôdu a dostupnosť vody na konkrétnom stanovišti." },
      { title: "Aj zima má svoje detaily", text: "Suché súkvetia, kôra stromov a siluety tráv dokážu záhrade dodať charakter aj v chladných mesiacoch. Nie všetko treba na jeseň ostrihať. Niektoré rastliny môžu zároveň poskytnúť úkryt hmyzu alebo potravu vtákom; termín rezu prispôsobte druhu aj miestnym podmienkam." },
    ],
  },
  {
    slug: "menej-vody-viac-zivota",
    title: "Menej vody. Viac života.",
    category: "Starostlivosť",
    date: "2026-08-12",
    readTime: "3 min čítania",
    excerpt: "Ako premýšľať o vode v záhrade od prvého návrhu až po každodennú starostlivosť.",
    image: images.greenery,
    sections: [
      { title: "Správna rastlina na správnom mieste", text: "Najefektívnejšia závlaha začína výberom rastlín. Druhy vhodné pre miestne podmienky zvyčajne potrebujú po zakorenení menej zásahov. Rastliny s podobnými nárokmi na vodu zoskupujte, aby ste nemuseli zalievať celú záhradu podľa najnáročnejšieho záhona." },
      { title: "Pôda je zásobáreň", text: "Organická hmota pomáha pôde pracovať s vodou. Vhodná vrstva mulču môže obmedziť odparovanie a rast burín, jej typ a hrúbku však treba prispôsobiť výsadbe. Mulč neukladajte priamo ku kmeňom stromov ani ku krčkom citlivých rastlín." },
      { title: "Zalievajte podľa potreby, nie podľa kalendára", text: "Skontrolujte vlhkosť pod povrchom pôdy a sledujte počasie. Dobre nastavená kvapková závlaha vie priviesť vodu ku koreňom, ale ani automatika nenahrádza občasnú kontrolu. Nové výsadby potrebujú počas zakoreňovania osobitnú pozornosť." },
    ],
  },
  {
    slug: "kde-sa-konci-dom-a-zacina-zahrada",
    title: "Kde sa končí dom a začína záhrada?",
    category: "Architektúra",
    date: "2026-07-20",
    readTime: "3 min čítania",
    excerpt: "Najlepšie prepojenie interiéru a exteriéru je to, ktoré si takmer nevšimnete.",
    image: images.courtyard,
    sections: [
      { title: "Dívajte sa zvnútra", text: "Záhradu často vnímame cez okná. Pri návrhu preto pracujte aj s pohľadmi od jedálenského stola, z pohovky alebo z kuchyne. Jeden dobre umiestnený strom môže mať pre atmosféru domu väčší význam než množstvo drobných dekorácií." },
      { title: "Materiály, ktoré sa rozprávajú", text: "Exteriér nemusí kopírovať interiér doslova. Stačí nadviazať odtieňom, textúrou alebo rytmom. Pri výbere dlažby či dreva myslite na odolnosť, údržbu a bezpečný povrch za mokra; estetika je len jednou časťou rozhodnutia." },
      { title: "Vytvorte si dôvod vyjsť von", text: "Malý stôl na rannú kávu, tieň pod stromom alebo miesto na čítanie dávajú záhrade každodenný zmysel. Navrhujte ju podľa života, ktorý chcete viesť, nie iba podľa fotografie. Práve používanie postupne premení pekný exteriér na skutočný domov." },
    ],
  },
];