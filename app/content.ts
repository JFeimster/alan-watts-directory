export type Verification =
  | "Verified source"
  | "Probable attribution"
  | "Source not yet confirmed"
  | "Commonly misattributed";

export type Topic = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  questions: string[];
  tone: string;
};

export type Lecture = {
  slug: string;
  title: string;
  speaker: string;
  series: string;
  album: string;
  date: string;
  summary: string;
  ideas: string[];
  topics: string[];
  transcript: "Available" | "Excerpt only" | "Not yet available";
  audio: string | null;
  source: string;
  sourceNote: string;
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  kind: string;
  items: string[];
};

export type Book = {
  slug: string;
  title: string;
  details: string;
  overview: string;
  ideas: string[];
  audience: string;
  misunderstanding: string;
  topics: string[];
};

export type Quote = {
  slug: string;
  quotation: string | null;
  title: string;
  verification: Verification;
  source: string;
  context: string;
  interpretation: string;
  topics: string[];
  lecture?: string;
};

export type Essay = {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readingTime: string;
  topics: string[];
  label: string;
  body: string[];
  sources: string[];
};

export type Video = {
  slug: string;
  title: string;
  description: string;
  lecture: string;
  topics: string[];
  transcript: string;
  questions: string[];
};

export type NavGroup = {
  label: string;
  href: string;
  links: { label: string; href: string }[];
};

export type DirectoryPage = {
  path: string;
  title: string;
  eyebrow: string;
  description: string;
  status: string;
  links?: { label: string; href: string; meta?: string }[];
};

export type ResourceCategory = {
  slug: string;
  title: string;
  description: string;
  examples: string[];
  verification: Verification;
};

export const navGroups: NavGroup[] = [
  {
    label: "Explore",
    href: "/explore/",
    links: [
      { label: "Start Here", href: "/start-here/" },
      { label: "Topics", href: "/topics/" },
      { label: "Listening Paths", href: "/listening-paths/" },
      { label: "Timeline", href: "/timeline/" },
      { label: "Comparisons", href: "/comparisons/" },
      { label: "Interactive Experiences", href: "/interactive-experiences/" },
    ],
  },
  {
    label: "Library",
    href: "/library/",
    links: [
      { label: "Lectures", href: "/lectures/" },
      { label: "Books", href: "/books/" },
      { label: "Quotes", href: "/quotes/" },
      { label: "Collections", href: "/collections/" },
      { label: "Transcripts", href: "/transcripts/" },
      { label: "Resources", href: "/resources/" },
    ],
  },
  {
    label: "Media",
    href: "/media/",
    links: [
      { label: "Essays", href: "/essays/" },
      { label: "Newsletter", href: "/newsletter/" },
      { label: "Podcasts", href: "/podcasts/" },
      { label: "Videos", href: "/videos/" },
      { label: "Shorts", href: "/shorts/" },
    ],
  },
  {
    label: "Community",
    href: "/community/",
    links: [
      { label: "Discussions", href: "/discussions/" },
      { label: "Listening Club", href: "/listening-club/" },
      { label: "Groups", href: "/groups/" },
      { label: "Events", href: "/events/" },
      { label: "Member Essays", href: "/member-essays/" },
    ],
  },
  {
    label: "Tools",
    href: "/tools/",
    links: [
      { label: "Ask the Archive", href: "/ask-the-archive/" },
      { label: "GPT Directory", href: "/gpt-directory/" },
      { label: "Prompt Library", href: "/prompt-library/" },
      { label: "Quote Verifier", href: "/quote-verifier/" },
      { label: "Lecture Finder", href: "/lecture-finder/" },
      { label: "Archive Importer", href: "/archive-importer/" },
      { label: "Creator Studio", href: "/creator-studio/" },
    ],
  },
  {
    label: "About",
    href: "/about/",
    links: [
      { label: "Authenticity", href: "/about/authenticity/" },
      { label: "Editorial Standards", href: "/about/editorial-standards/" },
      { label: "Sources", href: "/about/sources/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];

export const footerBusinessLinks = [
  { label: "Speaking", href: "/speaking/" },
  { label: "Services", href: "/services/" },
  { label: "Partners", href: "/partners/" },
  { label: "Accelerator", href: "/accelerator/" },
  { label: "Sponsor", href: "/sponsor/" },
  { label: "Licensing Information", href: "/licensing-information/" },
  { label: "Contact", href: "/contact/" },
];

export const topics: Topic[] = [
  {
    slug: "ego-identity-separate-self",
    title: "Ego, Identity and the Separate Self",
    eyebrow: "Self & consciousness",
    description:
      "A source-led path through Watts’ recurring examination of the social self, the felt boundary of the individual, and the wider field of experience.",
    questions: ["What is the ‘I’ we defend?", "Where does a person end and a world begin?"],
    tone: "#536354",
  },
  {
    slug: "overthinking-anxiety-mental-noise",
    title: "Overthinking, Anxiety and Mental Noise",
    eyebrow: "Mind & attention",
    description:
      "Listening and reading for the difference between useful thought and the attempt to think our way out of being alive.",
    questions: ["Can thought quiet thought?", "What changes when attention is not forced?"],
    tone: "#334c5e",
  },
  {
    slug: "letting-go-control-backwards-law",
    title: "Letting Go, Control and the Backwards Law",
    eyebrow: "Effort & surrender",
    description:
      "An inquiry into the paradoxes that appear when the will tries to manufacture spontaneity, security, sleep, or happiness.",
    questions: ["Can letting go be made into a task?", "When does effort defeat its own purpose?"],
    tone: "#836632",
  },
  {
    slug: "time-present-moment-insecurity",
    title: "Time, the Present Moment and Insecurity",
    eyebrow: "Time & experience",
    description:
      "A reading path on memory, anticipation, the elusive present, and the search for psychological certainty.",
    questions: ["Is the present an instant or a field?", "What would security have to guarantee?"],
    tone: "#5c493b",
  },
  {
    slug: "death-mortality-rebirth",
    title: "Death, Mortality and Rebirth",
    eyebrow: "Mortality & continuity",
    description:
      "Lectures and books that approach death without reducing it to either a comforting doctrine or a final philosophical answer.",
    questions: ["What exactly is imagined to continue?", "How does mortality shape attention?"],
    tone: "#493f55",
  },
  {
    slug: "life-play-work-purpose",
    title: "Life as Play, Work and Purpose",
    eyebrow: "Play & seriousness",
    description:
      "A study of music, games, work, purposiveness, and the habit of treating life only as transportation to a later result.",
    questions: ["What is activity for its own sake?", "When does purpose become postponement?"],
    tone: "#8a563e",
  },
  {
    slug: "zen-taoism-buddhism",
    title: "Zen, Taoism and Buddhism",
    eyebrow: "Traditions & translation",
    description:
      "Source notes and listening guides for Watts’ interpretations of Asian philosophies, with room for historical context and criticism.",
    questions: ["What did Watts illuminate for Western audiences?", "Where is more context needed?"],
    tone: "#4e6548",
  },
  {
    slug: "love-relationships-desire",
    title: "Love, Relationships and Desire",
    eyebrow: "Intimacy & attachment",
    description:
      "Material on desire, trust, vulnerability, and the ways possession can disguise itself as love.",
    questions: ["Can affection be secured by contract?", "What is threatened by another’s freedom?"],
    tone: "#81545b",
  },
  {
    slug: "god-religion-mysticism",
    title: "God, Religion and Mysticism",
    eyebrow: "Religion & experience",
    description:
      "Watts’ encounters with Christian language, mystical experience, comparative religion, and the limits of literal belief.",
    questions: ["What happens when metaphor hardens into fact?", "Can mystery survive explanation?"],
    tone: "#675635",
  },
  {
    slug: "nature-ecology-interdependence",
    title: "Nature, Ecology and Interdependence",
    eyebrow: "World & organism",
    description:
      "A path through organism–environment relations, ecology, and the vocabulary of belonging to rather than merely occupying a world.",
    questions: ["Is an organism separate from its environment?", "What does interdependence demand?"],
    tone: "#3f604f",
  },
  {
    slug: "tricksters-gurus-spiritual-authority",
    title: "Tricksters, Gurus and Spiritual Authority",
    eyebrow: "Authority & mischief",
    description:
      "A skeptical, playful investigation of teachers, seekers, performance, spiritual status, and the seductions of certainty.",
    questions: ["Why do seekers manufacture authorities?", "Can a trick expose a deeper trick?"],
    tone: "#784d2d",
  },
  {
    slug: "ai-technology-modern-life",
    title: "AI, Technology and Modern Life",
    eyebrow: "Contemporary interpretation",
    description:
      "Editorial applications of documented Watts themes to automation, synthetic media, identity, and technological life. These are contemporary interpretations—not claims about what Watts would say.",
    questions: ["What is lost when a style is mistaken for a person?", "Can a simulation deepen inquiry without impersonation?"],
    tone: "#344e59",
  },
];

export const lectures: Lecture[] = [
  {
    slug: "the-joker-part-1a",
    title: "The Joker — Part 1A",
    speaker: "Alan Watts",
    series: "The Joker",
    album: "The Joker",
    date: "Lecture date not established; supplied audio edition metadata lists 2001",
    summary:
      "The opening track of a supplied six-part audio set. This catalog record publishes the recording without assigning an undocumented lecture date or transcript.",
    ideas: ["The trickster figure", "Spiritual authority", "Play and performance"],
    topics: ["tricksters-gurus-spiritual-authority", "life-play-work-purpose"],
    transcript: "Not yet available",
    audio: "/audio/the-joker/1a.mp3",
    source: "User-supplied MP3: 1a.mp3",
    sourceNote:
      "Embedded metadata identifies Alan Watts as artist, The Joker as album, and 1A as track title. Historical lecture date remains unverified.",
  },
  {
    slug: "the-joker-part-1b",
    title: "The Joker — Part 1B",
    speaker: "Alan Watts",
    series: "The Joker",
    album: "The Joker",
    date: "Lecture date not established; supplied audio edition metadata lists 2001",
    summary:
      "The second track of the supplied six-part Joker audio set, published as a playable historical recording while its original lecture date remains open.",
    ideas: ["The trickster figure", "Spiritual authority", "Play and performance"],
    topics: ["tricksters-gurus-spiritual-authority", "life-play-work-purpose"],
    transcript: "Not yet available",
    audio: "/audio/the-joker/1b.mp3",
    source: "User-supplied MP3: 1b.mp3",
    sourceNote:
      "Embedded metadata identifies Alan Watts as artist, The Joker as album, and 1B as track title. Historical lecture date remains unverified.",
  },
  {
    slug: "the-joker-part-2a",
    title: "The Joker — Part 2A",
    speaker: "Alan Watts",
    series: "The Joker",
    album: "The Joker",
    date: "Lecture date not established; supplied audio edition metadata lists 2001",
    summary:
      "The third supplied Joker track, cataloged from embedded metadata and made playable without adding unsupported archival claims.",
    ideas: ["The trickster figure", "Spiritual authority", "Play and performance"],
    topics: ["tricksters-gurus-spiritual-authority", "life-play-work-purpose"],
    transcript: "Not yet available",
    audio: "/audio/the-joker/2a.mp3",
    source: "User-supplied MP3: 2a.mp3",
    sourceNote:
      "Embedded metadata identifies Alan Watts as artist, The Joker as album, and 2A as track title. Historical lecture date remains unverified.",
  },
  {
    slug: "the-joker-part-2b",
    title: "The Joker — Part 2B",
    speaker: "Alan Watts",
    series: "The Joker",
    album: "The Joker",
    date: "Lecture date not established; supplied audio edition metadata lists 2001",
    summary:
      "The fourth supplied Joker track, presented as a historical audio file with transcript and original date still pending.",
    ideas: ["The trickster figure", "Spiritual authority", "Play and performance"],
    topics: ["tricksters-gurus-spiritual-authority", "life-play-work-purpose"],
    transcript: "Not yet available",
    audio: "/audio/the-joker/2b.mp3",
    source: "User-supplied MP3: 2b.mp3",
    sourceNote:
      "Embedded metadata identifies Alan Watts as artist, The Joker as album, and 2B as track title. Historical lecture date remains unverified.",
  },
  {
    slug: "the-joker-part-3a",
    title: "The Joker — Part 3A",
    speaker: "Alan Watts",
    series: "The Joker",
    album: "The Joker",
    date: "Lecture date not established; supplied audio edition metadata lists 2001",
    summary:
      "The fifth supplied Joker track, added as playable audio while keeping all unresolved bibliographic details visible.",
    ideas: ["The trickster figure", "Spiritual authority", "Play and performance"],
    topics: ["tricksters-gurus-spiritual-authority", "life-play-work-purpose"],
    transcript: "Not yet available",
    audio: "/audio/the-joker/3a.mp3",
    source: "User-supplied MP3: 3a.mp3",
    sourceNote:
      "Embedded metadata identifies Alan Watts as artist, The Joker as album, and 3A as track title. Historical lecture date remains unverified.",
  },
  {
    slug: "the-joker-part-3b",
    title: "The Joker — Part 3B",
    speaker: "Alan Watts",
    series: "The Joker",
    album: "The Joker",
    date: "Lecture date not established; supplied audio edition metadata lists 2001",
    summary:
      "The closing track of the supplied Joker audio set, available for listening with source notes and authenticity labeling.",
    ideas: ["The trickster figure", "Spiritual authority", "Play and performance"],
    topics: ["tricksters-gurus-spiritual-authority", "life-play-work-purpose"],
    transcript: "Not yet available",
    audio: "/audio/the-joker/3b.mp3",
    source: "User-supplied MP3: 3b.mp3",
    sourceNote:
      "Embedded metadata identifies Alan Watts as artist, The Joker as album, and 3B as track title. Historical lecture date remains unverified.",
  },
  {
    slug: "the-inevitable-ecstasy",
    title: "The Inevitable Ecstasy",
    speaker: "Alan Watts",
    series: "9 Alan Watts Collection",
    album: "9 Alan Watts Collection",
    date: "Not yet established",
    summary:
      "A playable catalog entry grounded in the supplied lecture archive. Detailed session boundaries and original lecture date await source reconciliation.",
    ideas: ["Consciousness", "Experience", "Ecstasy and ordinary life"],
    topics: ["ego-identity-separate-self", "life-play-work-purpose"],
    transcript: "Not yet available",
    audio: "/audio/lectures/the-inevitable-ecstasy.mp3",
    source: "Alan Watts lecture archive supplied for this project: The Inevitable Ecstacy.mp3",
    sourceNote:
      "Embedded metadata lists title as The Inevitable Ecstacy, artist as 9 Alan Watts, and album as 9 Alan Watts Collection. Spelling normalized in the public title; original lecture date remains unverified.",
  },
  {
    slug: "zen-clues",
    title: "Zen Clues",
    speaker: "Alan Watts",
    series: "9 Alan Watts Collection",
    album: "9 Alan Watts Collection",
    date: "Not yet established",
    summary:
      "A playable listening record for an identified archive file. The page deliberately separates the known title from editorial topic mapping.",
    ideas: ["Zen", "Direct experience", "Language and paradox"],
    topics: ["zen-taoism-buddhism", "overthinking-anxiety-mental-noise"],
    transcript: "Not yet available",
    audio: "/audio/lectures/zen-clues.mp3",
    source: "Alan Watts lecture archive supplied for this project: Zen Clues.mp3",
    sourceNote:
      "Embedded metadata lists title as Zen Clues, artist as 9 Alan Watts, and album as 9 Alan Watts Collection. Further bibliographic work is open.",
  },
  {
    slug: "source-of-spiritual-authority",
    title: "The Source of Spiritual Authority",
    speaker: "Alan Watts",
    series: "9 Alan Watts Collection",
    album: "9 Alan Watts Collection",
    date: "Not yet established",
    summary:
      "An archive-led entry for exploring the relationship between experience, doctrine, teachers, and institutional authority.",
    ideas: ["Authority", "Religious institutions", "Direct experience"],
    topics: ["tricksters-gurus-spiritual-authority", "god-religion-mysticism"],
    transcript: "Not yet available",
    audio: "/audio/lectures/the-source-of-spiritual-authority.mp3",
    source: "Alan Watts lecture archive supplied for this project: The Source of Spiritual Authority.mp3",
    sourceNote:
      "Embedded metadata lists title as The Source of Spiritual Authority, artist as 9 Alan Watts, and album as 9 Alan Watts Collection. Date and collection relationship remain open.",
  },
  {
    slug: "karma-of-christianity",
    title: "Karma of Christianity",
    speaker: "Alan Watts",
    series: "9 Alan Watts Collection",
    album: "9 Alan Watts Collection",
    date: "Not yet established",
    summary:
      "A catalog record for a supplied lecture file, mapped editorially to religion, cultural inheritance, and comparative philosophy.",
    ideas: ["Christian symbolism", "Cultural inheritance", "Comparative religion"],
    topics: ["god-religion-mysticism", "zen-taoism-buddhism"],
    transcript: "Not yet available",
    audio: "/audio/lectures/karma-of-christianity.mp3",
    source: "Alan Watts lecture archive supplied for this project: Karma-of-Christianity.mp3",
    sourceNote:
      "Embedded metadata lists title as Karma-of-Christianity, artist as 9 Alan Watts, and album as 9 Alan Watts Collection. Public title normalizes punctuation only.",
  },
  {
    slug: "mysticism-and-morals",
    title: "Mysticism & Morals",
    speaker: "Alan Watts",
    series: "9 Alan Watts Collection",
    album: "9 Alan Watts Collection",
    date: "Not yet established",
    summary:
      "A source inventory entry for the tension between mystical experience, ethical systems, and the performance of spiritual respectability.",
    ideas: ["Mysticism", "Ethics", "Social performance"],
    topics: ["god-religion-mysticism", "tricksters-gurus-spiritual-authority"],
    transcript: "Not yet available",
    audio: "/audio/lectures/mysticism-and-morals.mp3",
    source: "Alan Watts lecture archive supplied for this project: Mysticism & Morals.mp3",
    sourceNote:
      "Embedded metadata lists title as Mysticism & Morals, artist as 9 Alan Watts, and album as 9 Alan Watts Collection. Transcript and date remain unconfirmed.",
  },
  {
    slug: "sahaja",
    title: "Sahaja",
    speaker: "Alan Watts",
    series: "9 Alan Watts Collection",
    album: "9 Alan Watts Collection",
    date: "Not yet established",
    summary:
      "A playable archive record for the supplied Sahaja audio file. Editorial topic mapping is provisional until stronger bibliographic context is added.",
    ideas: ["Spontaneity", "Naturalness", "Liberation"],
    topics: ["zen-taoism-buddhism", "letting-go-control-backwards-law"],
    transcript: "Not yet available",
    audio: "/audio/lectures/sahaja.mp3",
    source: "Alan Watts lecture archive supplied for this project: Sahaja.mp3",
    sourceNote:
      "Embedded metadata lists title as Sahaja, artist as 9 Alan Watts, and album as 9 Alan Watts Collection. Original lecture date remains unverified.",
  },
  {
    slug: "talk-with-mrs-huxley",
    title: "Talk with Mrs. Huxley",
    speaker: "Alan Watts",
    series: "9 Alan Watts Collection",
    album: "9 Alan Watts Collection",
    date: "Not yet established",
    summary:
      "A playable archive record for the supplied conversation file. Participant, venue, and date details await source reconciliation.",
    ideas: ["Conversation", "Culture", "Comparative philosophy"],
    topics: ["god-religion-mysticism", "ai-technology-modern-life"],
    transcript: "Not yet available",
    audio: "/audio/lectures/talk-with-mrs-huxley.mp3",
    source: "Alan Watts lecture archive supplied for this project: Talk-with-Mrs.-Huxley.mp3",
    sourceNote:
      "Embedded metadata lists title as Talk-with-Mrs.-Huxley, artist as 9 Alan Watts, and album as 9 Alan Watts Collection. Public title normalizes punctuation only.",
  },
  {
    slug: "the-power-the-kingdom-the-glory",
    title: "The Power, the Kingdom, the Glory",
    speaker: "Alan Watts",
    series: "9 Alan Watts Collection",
    album: "9 Alan Watts Collection",
    date: "Not yet established",
    summary:
      "A playable archive record for a supplied lecture title that points toward religious symbolism, institutional power, and mystical language.",
    ideas: ["Power", "Religious symbolism", "Mysticism"],
    topics: ["god-religion-mysticism", "tricksters-gurus-spiritual-authority"],
    transcript: "Not yet available",
    audio: "/audio/lectures/the-power-the-kingdom-the-glory.mp3",
    source: "Alan Watts lecture archive supplied for this project: The-Power-the-Kingdom-the-Glory.mp3",
    sourceNote:
      "Embedded metadata lists title as The-Power-the-Kingdom-the-Glory, artist as 9 Alan Watts, and album as 9 Alan Watts Collection. Public title normalizes punctuation only.",
  },
];

export const collections: Collection[] = [
  {
    slug: "the-joker-audio-edition",
    title: "The Joker Audio Edition",
    description:
      "A six-part supplied audio set, cataloged from embedded file metadata and published as playable historical audio. This is an audio-edition record, not a claim about the original lecture date.",
    kind: "Source-led audio collection",
    items: ["The Joker — Part 1A", "The Joker — Part 1B", "The Joker — Part 2A", "The Joker — Part 2B", "The Joker — Part 3A", "The Joker — Part 3B"],
  },
  {
    slug: "trickster-and-spiritual-authority",
    title: "Trickster & Spiritual Authority",
    description:
      "An editorial collection connecting the supplied essay The Trickster Guru with identified lecture records about teachers, seekers, performance, and authority.",
    kind: "Editorial collection",
    items: ["The Trickster Guru", "The Source of Spiritual Authority", "The Joker — Part 1A"],
  },
  {
    slug: "eastern-ways-of-liberation",
    title: "Eastern Ways of Liberation",
    description:
      "A provisional listening path through playable archive titles associated with Zen and comparative philosophy. Relationships are editorial, not archival.",
    kind: "Editorial listening path",
    items: ["Zen Clues", "Sahaja", "The Way of Zen", "Zen, Taoism and Buddhism"],
  },
  {
    slug: "self-time-and-security",
    title: "Self, Time & Security",
    description:
      "A reading path joining books and topic hubs around identity, mental time, uncertainty, and the urge to make life safe before living it.",
    kind: "Editorial reading path",
    items: ["The Wisdom of Insecurity", "The Book", "Time, the Present Moment and Insecurity"],
  },
];

export const books: Book[] = [
  {
    slug: "the-wisdom-of-insecurity",
    title: "The Wisdom of Insecurity",
    details: "Alan Watts · Publication details pending bibliographic verification",
    overview:
      "A catalog page prepared for a source-grounded overview of insecurity, time, and the effort to obtain psychological certainty.",
    ideas: ["Security and uncertainty", "The present", "Self-consciousness"],
    audience: "Readers beginning with Watts’ writing on time, anxiety, and direct experience.",
    misunderstanding: "The book should not be reduced to a slogan about ignoring practical plans.",
    topics: ["time-present-moment-insecurity", "overthinking-anxiety-mental-noise"],
  },
  {
    slug: "the-way-of-zen",
    title: "The Way of Zen",
    details: "Alan Watts · Publication details pending bibliographic verification",
    overview:
      "A book record for Watts’ historical and interpretive presentation of Zen to Western readers, with room for later scholarly context.",
    ideas: ["Zen history", "Taoist background", "Practice and spontaneity"],
    audience: "Readers seeking a structured entry into Watts’ account of Zen.",
    misunderstanding: "Watts’ interpretation is influential, but it is not a substitute for the full range of Zen traditions.",
    topics: ["zen-taoism-buddhism"],
  },
  {
    slug: "the-book",
    title: "The Book",
    details: "Alan Watts · Publication details pending bibliographic verification",
    overview:
      "A catalog entry centered on the social fiction of the isolated individual and the wider ecological field of identity.",
    ideas: ["The separate self", "Cosmic identity", "Organism and environment"],
    audience: "Readers drawn to Watts’ most direct treatment of identity and interdependence.",
    misunderstanding: "Interdependence does not erase personal difference or practical responsibility.",
    topics: ["ego-identity-separate-self", "nature-ecology-interdependence"],
  },
  {
    slug: "nature-man-and-woman",
    title: "Nature, Man and Woman",
    details: "Alan Watts · Publication details pending bibliographic verification",
    overview:
      "A record prepared for examining nature, embodiment, culture, and the inherited split between humanity and its world.",
    ideas: ["Nature and culture", "Embodiment", "Polarity"],
    audience: "Readers interested in ecology, embodiment, and comparative philosophy.",
    misunderstanding: "Poetic polarity should not be flattened into rigid claims about gender.",
    topics: ["nature-ecology-interdependence", "love-relationships-desire"],
  },
  {
    slug: "the-joyous-cosmology",
    title: "The Joyous Cosmology",
    details: "Alan Watts · Publication details pending bibliographic verification",
    overview:
      "A catalog page designed to place the work in historical context without turning it into psychedelic lifestyle branding.",
    ideas: ["Consciousness", "Perception", "Religious experience"],
    audience: "Readers interested in Watts’ descriptions of altered perception and philosophical context.",
    misunderstanding: "The work is neither a clinical manual nor permission to confuse intensity with insight.",
    topics: ["god-religion-mysticism", "ego-identity-separate-self"],
  },
  {
    slug: "become-what-you-are",
    title: "Become What You Are",
    details: "Alan Watts · Publication details pending bibliographic verification",
    overview:
      "A catalog entry for essays associated with selfhood, acceptance, paradox, and the impossibility of manufacturing authenticity.",
    ideas: ["Self-acceptance", "Paradox", "Effort"],
    audience: "Readers who prefer shorter essays and recurring themes.",
    misunderstanding: "The title is not a productivity command or personal-brand manifesto.",
    topics: ["letting-go-control-backwards-law", "ego-identity-separate-self"],
  },
];

export const quotes: Quote[] = [
  {
    slug: "what-else-is-art",
    quotation: "What else is art?",
    title: "Art and illusion",
    verification: "Verified source",
    source: "The Trickster Guru, p. 9, supplied PDF",
    context:
      "Appears in a discussion of the trickster guru as illusionist and of shared interpretations that shape social reality.",
    interpretation:
      "The question complicates the easy division between deception and creative transformation; it does not excuse manipulation.",
    topics: ["tricksters-gurus-spiritual-authority"],
    lecture: "the-joker-part-1a",
  },
  {
    slug: "mans-extremity",
    quotation: "Man’s extremity is God’s opportunity.",
    title: "Extremity and opportunity",
    verification: "Verified source",
    source: "The Trickster Guru, p. 11, supplied PDF",
    context:
      "The line closes a sequence of deliberately unanswerable questions framed as a Zen koan.",
    interpretation:
      "It lands as a final reversal, not as a complete doctrine or a promise of rescue.",
    topics: ["god-religion-mysticism", "tricksters-gurus-spiritual-authority"],
  },
  {
    slug: "cock-crows-evening",
    quotation: "The cock crows in the evening; at midnight, the brilliant sun.",
    title: "The brilliant sun",
    verification: "Verified source",
    source: "The Trickster Guru, p. 11, supplied PDF",
    context:
      "Two paradoxical lines appear at the close of the essay, immediately before its source credit.",
    interpretation:
      "The image resists ordinary sequence and invites inquiry without supplying a tidy explanation.",
    topics: ["zen-taoism-buddhism", "time-present-moment-insecurity"],
  },
  ...[
    ["separate-self-verification-file", "The separate self — verification file", "ego-identity-separate-self"],
    ["present-moment-verification-file", "The present moment — verification file", "time-present-moment-insecurity"],
    ["backwards-law-verification-file", "The backwards law — verification file", "letting-go-control-backwards-law"],
    ["life-as-music-verification-file", "Life as music — verification file", "life-play-work-purpose"],
    ["death-verification-file", "Death and continuity — verification file", "death-mortality-rebirth"],
    ["love-verification-file", "Love and freedom — verification file", "love-relationships-desire"],
    ["nature-verification-file", "Nature and interdependence — verification file", "nature-ecology-interdependence"],
    ["authority-verification-file", "Spiritual authority — verification file", "tricksters-gurus-spiritual-authority"],
    ["technology-verification-file", "Technology and identity — verification file", "ai-technology-modern-life"],
  ].map(([slug, title, topic]) => ({
    slug,
    quotation: null,
    title,
    verification: "Source not yet confirmed" as Verification,
    source: "Candidate source record awaiting exact edition, timestamp, or page reference",
    context:
      "This record reserves a research slot. No wording is displayed until an exact source can be checked.",
    interpretation:
      "Interpretation is intentionally withheld alongside the quotation.",
    topics: [topic],
  })),
];

export const essays: Essay[] = [
  {
    slug: "digital-zen-age-of-ai",
    title: "Digital Zen in the Age of AI",
    description:
      "What philosophical simulations can offer—and why imitation must never be confused with historical speech.",
    author: "Jason Feimster",
    date: "2023-12-28",
    readingTime: "6 min",
    topics: ["ai-technology-modern-life", "tricksters-gurus-spiritual-authority"],
    label: "Contemporary editorial interpretation",
    body: [
      "A system can reproduce patterns of language without becoming the person whose style it resembles. That distinction is not a technical footnote; it is the ethical center of any project placing Alan Watts beside artificial intelligence.",
      "The useful question is not whether a model can perform a convincing Watts impression. It is whether technology can guide a reader back toward documented lectures, books, and questions without laundering generated prose into historical authority.",
      "This archive therefore treats synthetic interpretation as commentary. It can prompt inquiry, compare themes, and expose assumptions. It cannot create new Alan Watts quotations, settle what he believed, or masquerade as a recording.",
    ],
    sources: [
      "Earlier article supplied through Google Drive",
      "Site authenticity and editorial standards",
    ],
  },
  {
    slug: "the-trickster-after-the-algorithm",
    title: "The Trickster After the Algorithm",
    description:
      "A contemporary reading of performance, authority, and automated credibility.",
    author: "Alan Watts Wisdom editors",
    date: "2026-07-23",
    readingTime: "4 min",
    topics: ["tricksters-gurus-spiritual-authority", "ai-technology-modern-life"],
    label: "Contemporary editorial interpretation",
    body: [
      "The internet did not invent the trickster guru. It industrialized the costume department.",
      "Read beside The Trickster Guru, automated authority becomes less a prophecy than a fresh example of an old appetite: the desire for someone—or something—that appears to know without hesitation.",
      "The editorial task is to preserve the joke without becoming its mark: identify the source, label the interpretation, and leave uncertainty visible.",
    ],
    sources: ["The Trickster Guru, supplied PDF", "The Joker audio set, supplied files"],
  },
  {
    slug: "why-the-present-is-not-a-productivity-hack",
    title: "Why the Present Is Not a Productivity Hack",
    description:
      "On the modern habit of turning presence into another performance metric.",
    author: "Alan Watts Wisdom editors",
    date: "2026-07-23",
    readingTime: "4 min",
    topics: ["time-present-moment-insecurity", "life-play-work-purpose"],
    label: "Editorial interpretation based on documented themes",
    body: [
      "Presence becomes absurd the moment it is sold as a way to dominate the future more efficiently.",
      "A source-grounded reading should preserve Watts’ paradoxes rather than recruit them into the very machinery of deferred living they examine.",
    ],
    sources: ["The Wisdom of Insecurity — bibliography pending verification"],
  },
  {
    slug: "the-ego-needs-better-public-relations",
    title: "The Ego Needs Better Public Relations",
    description:
      "Why declaring war on the ego often gives it a more impressive uniform.",
    author: "Alan Watts Wisdom editors",
    date: "2026-07-23",
    readingTime: "5 min",
    topics: ["ego-identity-separate-self", "letting-go-control-backwards-law"],
    label: "Editorial interpretation based on documented themes",
    body: [
      "Abolishing the ego can become the ego’s grandest project. The language changes; the manager keeps the corner office.",
      "The more useful inquiry asks how identity is assembled and defended without pretending that ordinary personhood must be spiritually exterminated.",
    ],
    sources: ["The Book — bibliography pending verification"],
  },
  {
    slug: "ecology-of-a-person",
    title: "The Ecology of a Person",
    description:
      "A field guide to reading the self as relationship rather than sealed object.",
    author: "Alan Watts Wisdom editors",
    date: "2026-07-23",
    readingTime: "5 min",
    topics: ["nature-ecology-interdependence", "ego-identity-separate-self"],
    label: "Editorial interpretation based on documented themes",
    body: [
      "A person is easier to catalog as a noun than to encounter as a pattern of relations.",
      "Ecological language changes the question from ‘What am I made of?’ to ‘What exchanges, histories, places, and other lives make this moment possible?’",
    ],
    sources: ["The Book and Nature, Man and Woman — bibliographies pending verification"],
  },
  {
    slug: "how-not-to-build-a-quote-farm",
    title: "How Not to Build a Quote Farm",
    description:
      "Why missing citations are more honest than beautifully typeset inventions.",
    author: "Alan Watts Wisdom editors",
    date: "2026-07-23",
    readingTime: "3 min",
    topics: ["tricksters-gurus-spiritual-authority", "ai-technology-modern-life"],
    label: "Editorial standards essay",
    body: [
      "A quotation without a source is not improved by parchment, a portrait, or twelve thousand shares.",
      "This archive keeps candidate records visible but withholds wording until an edition, page, recording, or timestamp can be checked. The empty space is part of the scholarship.",
    ],
    sources: ["Alan Watts Wisdom editorial standards"],
  },
];

export const videos: Video[] = [
  {
    slug: "the-joker-listening-room",
    title: "The Joker: Listening Room",
    description: "A restrained video-page prototype for the supplied 1A recording.",
    lecture: "the-joker-part-1a",
    topics: ["tricksters-gurus-spiritual-authority"],
    transcript: "Transcript not yet available. No generated transcript is presented as archival text.",
    questions: ["Where does performance become authority?", "What makes a teacher feel genuine?"],
  },
  {
    slug: "zen-clues-field-notes",
    title: "Zen Clues: Field Notes",
    description: "A companion-page concept for listening without reducing Zen to slogans.",
    lecture: "zen-clues",
    topics: ["zen-taoism-buddhism"],
    transcript: "Transcript awaiting source preparation.",
    questions: ["Which paradox opens inquiry rather than closing it?", "Where is historical context needed?"],
  },
  {
    slug: "source-of-authority-guide",
    title: "The Source of Authority: A Listening Guide",
    description: "Questions and source notes for an identified archival lecture file.",
    lecture: "source-of-spiritual-authority",
    topics: ["tricksters-gurus-spiritual-authority", "god-religion-mysticism"],
    transcript: "Transcript awaiting source preparation.",
    questions: ["What grants authority?", "What is the difference between trust and surrender?"],
  },
  {
    slug: "present-moment-without-slogans",
    title: "The Present Moment Without Slogans",
    description: "An editorial video outline linked to verified book records, not synthetic speech.",
    lecture: "the-inevitable-ecstasy",
    topics: ["time-present-moment-insecurity"],
    transcript: "Editorial video not yet produced.",
    questions: ["Can the present be used as a technique?", "What remains when anticipation relaxes?"],
  },
  {
    slug: "ego-identity-listening-path",
    title: "Ego & Identity: A Listening Path",
    description: "A visual map joining book, lecture, and topic records.",
    lecture: "the-inevitable-ecstasy",
    topics: ["ego-identity-separate-self"],
    transcript: "Editorial video not yet produced.",
    questions: ["Which self is being observed?", "Can identity be relational without disappearing?"],
  },
  {
    slug: "ai-and-the-voice-of-authority",
    title: "AI and the Voice of Authority",
    description: "A contemporary interpretation about synthetic media and historical identity.",
    lecture: "the-joker-part-1a",
    topics: ["ai-technology-modern-life", "tricksters-gurus-spiritual-authority"],
    transcript: "Editorial video not yet produced. It will not use synthetic Alan Watts audio.",
    questions: ["When does homage become impersonation?", "Can a model point beyond itself?"],
  },
];

export const resourceCategories: ResourceCategory[] = [
  {
    slug: "organizations",
    title: "Organizations",
    description: "Institutional homes, nonprofits, academic bodies, and public organizations relevant to Watts studies or adjacent philosophy.",
    examples: ["Alan Watts Organization", "University philosophy departments", "Comparative religion centers"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "archives",
    title: "Archives",
    description: "Audio, manuscript, catalog, and media archives that may help verify recordings, lecture titles, and source provenance.",
    examples: ["Audio edition catalogs", "Library collections", "Publisher archives"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "foundations",
    title: "Foundations",
    description: "Foundations and preservation projects connected to philosophy, religion, broadcasting, or historical media.",
    examples: ["Media preservation foundations", "Religious studies foundations", "Oral history projects"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "books",
    title: "Books",
    description: "Primary Watts books, edited collections, biographies, and carefully labeled secondary scholarship.",
    examples: ["The Wisdom of Insecurity", "The Way of Zen", "The Book"],
    verification: "Probable attribution",
  },
  {
    slug: "lectures",
    title: "Lectures",
    description: "Lecture series, commercial audio editions, individual talks, and catalog records awaiting transcript or date verification.",
    examples: ["The Joker", "Zen Clues", "The Source of Spiritual Authority"],
    verification: "Probable attribution",
  },
  {
    slug: "podcasts",
    title: "Podcasts",
    description: "Podcast feeds and episodes that discuss Watts with a clear distinction between historical material and modern commentary.",
    examples: ["Listening companion shows", "Philosophy podcasts", "Archive discussion episodes"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "youtube-channels",
    title: "YouTube Channels",
    description: "Channels publishing historical excerpts, editorial analysis, or study material, ranked by source clarity rather than view count.",
    examples: ["Official or rights-cleared channels", "Lecture excerpt channels", "Editorial analysis channels"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "websites",
    title: "Websites",
    description: "Web references, catalog pages, essays, and public guides that can support discovery or verification.",
    examples: ["Publisher pages", "Archive notes", "Scholarly introductions"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "newsletters",
    title: "Newsletters",
    description: "Ongoing publications for philosophy, comparative religion, listening notes, and modern applications.",
    examples: ["Editorial briefings", "Archive updates", "Contemporary interpretation newsletters"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "communities",
    title: "Communities",
    description: "Discussion spaces where readers and listeners exchange interpretations without turning Watts into an argument trophy.",
    examples: ["Reddit communities", "Facebook groups", "Listening clubs"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "scholars",
    title: "Scholars",
    description: "Researchers and teachers whose work adds historical, religious, philosophical, or critical context.",
    examples: ["Religious studies scholars", "Zen historians", "Comparative philosophy writers"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "creators",
    title: "Creators",
    description: "Essayists, video makers, podcast hosts, and educators creating responsible secondary material.",
    examples: ["Video essayists", "Podcast hosts", "Independent educators"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "courses",
    title: "Courses",
    description: "Structured learning paths that can contextualize Watts alongside Zen, Taoism, Buddhism, Christianity, ecology, and modernity.",
    examples: ["Intro philosophy courses", "Comparative religion courses", "Listening workshops"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "events",
    title: "Events",
    description: "Lectures, salons, listening sessions, and public programs connected to Watts themes or wider philosophical inquiry.",
    examples: ["Listening salons", "Discussion nights", "Academic talks"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "tools",
    title: "Tools",
    description: "Search, verification, creator, and study tools that help readers work with sources instead of decorating uncertainty.",
    examples: ["Quote Verifier", "Lecture Finder", "Archive Importer"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "gpts",
    title: "GPTs",
    description: "Clearly labeled AI tools that guide users toward sources without impersonating Alan Watts or inventing quotations.",
    examples: ["Ask the Archive", "Prompt Library", "Creator Studio"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "transcripts",
    title: "Transcripts",
    description: "Transcript sources, preparation notes, timestamped excerpts, and records that separate human review from machine drafts.",
    examples: ["Reviewed transcript files", "Timestamped excerpt notes", "Correction queues"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "libraries",
    title: "Libraries",
    description: "Public library catalogs, university holdings, and digital-library records useful for edition-level source work.",
    examples: ["WorldCat-style catalogs", "University library entries", "Digital lending catalogs"],
    verification: "Source not yet confirmed",
  },
  {
    slug: "research-papers",
    title: "Research Papers",
    description: "Academic and critical papers that place Watts in historical, religious, media, and cultural context.",
    examples: ["Comparative religion papers", "Media history research", "Philosophy articles"],
    verification: "Source not yet confirmed",
  },
];

export const directoryPages: DirectoryPage[] = [
  {
    path: "/explore/",
    title: "Explore",
    eyebrow: "Orientation layer",
    description: "Start with questions, topic paths, timelines, comparisons, and interactive ways to enter the archive.",
    status: "Navigation hub",
    links: navGroups.find((group) => group.label === "Explore")?.links,
  },
  {
    path: "/library/",
    title: "Library",
    eyebrow: "Source shelves",
    description: "Lectures, books, quotations, collections, transcripts, and resource records arranged for source work.",
    status: "Library hub",
    links: navGroups.find((group) => group.label === "Library")?.links,
  },
  {
    path: "/media/",
    title: "Media",
    eyebrow: "Editorial channels",
    description: "Essays, newsletters, podcasts, videos, and shorts that keep modern interpretation visibly separate from historical speech.",
    status: "Media hub",
    links: navGroups.find((group) => group.label === "Media")?.links,
  },
  {
    path: "/community/",
    title: "Community",
    eyebrow: "Discussion over declaration",
    description: "Spaces for listening clubs, group discussion, member essays, and events built around careful inquiry.",
    status: "Community hub",
    links: navGroups.find((group) => group.label === "Community")?.links,
  },
  {
    path: "/tools/",
    title: "Tools",
    eyebrow: "Research utilities",
    description: "Practical tools for finding lectures, checking quotations, importing source pages, building prompts, and creating source-respectful media.",
    status: "Tools hub",
    links: navGroups.find((group) => group.label === "Tools")?.links,
  },
  {
    path: "/archive-importer/",
    title: "Archive Importer",
    eyebrow: "URL to source record",
    description: "A local scraping utility for turning public URLs into review-ready JSON records for lectures, transcripts, videos, books, articles, and resource pages.",
    status: "Utility available",
    links: [
      { label: "Import a URL", href: "/archive-importer/", meta: "npm run import:url" },
      { label: "Lecture Finder", href: "/lecture-finder/", meta: "Related tool" },
      { label: "Quote Verifier", href: "/quote-verifier/", meta: "Related tool" },
      { label: "Sources", href: "/about/sources/", meta: "Editorial standard" },
    ],
  },
  {
    path: "/listening-paths/",
    title: "Listening Paths",
    eyebrow: "Guided routes",
    description: "Curated sequences for moving from a question to related lectures, books, quotations, and essays.",
    status: "Planned expansion",
    links: collections.map((item) => ({ label: item.title, href: `/collections/${item.slug}/`, meta: item.kind })),
  },
  {
    path: "/timeline/",
    title: "Timeline",
    eyebrow: "Chronology with humility",
    description: "A future chronology for publication dates, lecture editions, and verified historical records. Unknown dates remain unknown.",
    status: "Research queue",
  },
  {
    path: "/comparisons/",
    title: "Comparisons",
    eyebrow: "Context without flattening",
    description: "Comparative pages for Watts, Zen, Taoism, Buddhism, Christianity, Jung, technology, and modern selfhood.",
    status: "Editorial queue",
    links: topics.slice(6, 12).map((topic) => ({ label: topic.title, href: `/topics/${topic.slug}/`, meta: topic.eyebrow })),
  },
  {
    path: "/interactive-experiences/",
    title: "Interactive Experiences",
    eyebrow: "Experiments",
    description: "Future listening rooms, quote verification flows, topic maps, and study tools that make the archive usable without making it gimmicky.",
    status: "Prototype queue",
    links: [
      { label: "Ask the Archive", href: "/ask-the-archive/", meta: "Tool concept" },
      { label: "Quote Verifier", href: "/quote-verifier/", meta: "Tool concept" },
      { label: "Lecture Finder", href: "/lecture-finder/", meta: "Tool concept" },
    ],
  },
  {
    path: "/transcripts/",
    title: "Transcripts",
    eyebrow: "Prepared carefully",
    description: "A transcript index for reviewed lecture text, timestamps, excerpt status, and correction notes.",
    status: "Review queue",
  },
  {
    path: "/newsletter/",
    title: "Newsletter",
    eyebrow: "Notes from the source desk",
    description: "Issue concepts for verified quotations, listening paths, modern applications, and source corrections.",
    status: "Publication queue",
  },
  {
    path: "/podcasts/",
    title: "Podcasts",
    eyebrow: "Listening companions",
    description: "Podcast records and episode concepts for source-grounded conversations about Watts and adjacent philosophy.",
    status: "Media queue",
  },
  {
    path: "/shorts/",
    title: "Shorts",
    eyebrow: "Short form, sourced",
    description: "Short-video concepts that avoid fake quotations, synthetic voice ambiguity, and guru-funnel energy.",
    status: "Creator queue",
  },
  {
    path: "/discussions/",
    title: "Discussions",
    eyebrow: "Questions that breathe",
    description: "Discussion prompts and post formats for Reddit, Facebook groups, and future site-native conversations.",
    status: "Community queue",
  },
  {
    path: "/listening-club/",
    title: "Listening Club",
    eyebrow: "Shared attention",
    description: "A future program for small-group listening sessions built around one recording, source notes, and open questions.",
    status: "Community program",
  },
  {
    path: "/groups/",
    title: "Groups",
    eyebrow: "Public and private spaces",
    description: "A directory for community channels such as Facebook, Reddit, Discord, LinkedIn, and site-native discussion spaces.",
    status: "Directory queue",
  },
  {
    path: "/events/",
    title: "Events",
    eyebrow: "In-person and online",
    description: "Events, salons, webinars, and listening nights connected to the archive’s topics and media.",
    status: "Program queue",
  },
  {
    path: "/member-essays/",
    title: "Member Essays",
    eyebrow: "Reader contributions",
    description: "A future editorial lane for thoughtful responses and essays from the community, reviewed under the same source standards.",
    status: "Submission queue",
  },
  {
    path: "/ask-the-archive/",
    title: "Ask the Archive",
    eyebrow: "AI tool concept",
    description: "A future assistant that answers by pointing to lectures, books, source notes, and verification status—not by pretending to be Alan Watts.",
    status: "Tool concept",
  },
  {
    path: "/gpt-directory/",
    title: "GPT Directory",
    eyebrow: "Labeled AI tools",
    description: "A directory for project GPTs, research assistants, and creator tools with clear boundaries around synthetic interpretation.",
    status: "Tool directory",
  },
  {
    path: "/prompt-library/",
    title: "Prompt Library",
    eyebrow: "Creator utility",
    description: "Prompts for essays, listening notes, captions, verification workflows, and source-respectful video planning.",
    status: "Tool concept",
  },
  {
    path: "/quote-verifier/",
    title: "Quote Verifier",
    eyebrow: "Receipts department",
    description: "A future workflow for checking wording, edition, page, recording, timestamp, and misattribution risk.",
    status: "Tool concept",
    links: quotes.map((quote) => ({ label: quote.title, href: `/quotes/${quote.slug}/`, meta: quote.verification })),
  },
  {
    path: "/lecture-finder/",
    title: "Lecture Finder",
    eyebrow: "Catalog utility",
    description: "A future finder for titles, series, topics, transcripts, audio availability, and source notes.",
    status: "Tool concept",
    links: lectures.map((lecture) => ({ label: lecture.title, href: `/lectures/${lecture.slug}/`, meta: lecture.series })),
  },
  {
    path: "/creator-studio/",
    title: "Creator Studio",
    eyebrow: "Source-respectful production",
    description: "A workspace for turning authentic lectures and verified source notes into essays, captions, videos, shorts, and discussion prompts.",
    status: "Tool concept",
  },
  {
    path: "/speaking/",
    title: "Speaking",
    eyebrow: "Business layer",
    description: "Talks and salons on Alan Watts, source integrity, AI, synthetic media, and modern spiritual authority.",
    status: "Future offer page",
  },
  {
    path: "/services/",
    title: "Services",
    eyebrow: "Business layer",
    description: "Editorial, archival, creator, and AI-assisted services for source-grounded philosophical media projects.",
    status: "Future offer page",
  },
  {
    path: "/partners/",
    title: "Partners",
    eyebrow: "Business layer",
    description: "Potential collaborations with archives, publishers, creators, educators, communities, and event organizers.",
    status: "Partner queue",
  },
  {
    path: "/accelerator/",
    title: "Accelerator",
    eyebrow: "Business layer",
    description: "A future program for creators building high-integrity philosophy, archive, and media projects.",
    status: "Program concept",
  },
  {
    path: "/sponsor/",
    title: "Sponsor",
    eyebrow: "Business layer",
    description: "Sponsorship opportunities for newsletters, listening paths, events, tools, and research infrastructure.",
    status: "Sponsor concept",
  },
  {
    path: "/licensing-information/",
    title: "Licensing Information",
    eyebrow: "Business layer",
    description: "A plain-language page for rights, attribution, source handling, synthetic media policy, and licensing inquiries.",
    status: "Policy queue",
  },
  {
    path: "/contact/",
    title: "Contact",
    eyebrow: "Corrections and collaboration",
    description: "Send source corrections, collaboration ideas, speaking inquiries, licensing questions, or community proposals.",
    status: "Contact page",
  },
];

export const allRoutes = [
  "/",
  ...directoryPages.map((item) => item.path),
  "/start-here/",
  "/topics/",
  ...topics.map((item) => `/topics/${item.slug}/`),
  "/lectures/",
  ...lectures.map((item) => `/lectures/${item.slug}/`),
  "/collections/",
  ...collections.map((item) => `/collections/${item.slug}/`),
  "/books/",
  ...books.map((item) => `/books/${item.slug}/`),
  "/quotes/",
  ...quotes.map((item) => `/quotes/${item.slug}/`),
  "/essays/",
  ...essays.map((item) => `/essays/${item.slug}/`),
  "/videos/",
  ...videos.map((item) => `/videos/${item.slug}/`),
  "/resources/",
  ...resourceCategories.map((item) => `/resources/${item.slug}/`),
  "/search/",
  "/about/",
  "/about/authenticity/",
  "/about/editorial-standards/",
  "/about/sources/",
];

export const topicTitle = (slug: string) =>
  topics.find((topic) => topic.slug === slug)?.title ?? slug;
