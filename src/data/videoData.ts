export interface BreedInfo {
  id: string;
  name: string;
  temperament?: string;
  origin?: string;
  description?: string;
  life_span?: string;
  adaptability?: number;
  affection_level?: number;
  child_friendly?: number;
  dog_friendly?: number;
  energy_level?: number;
  grooming?: number;
  health_issues?: number;
  intelligence?: number;
  shedding_level?: number;
  social_needs?: number;
  stranger_friendly?: number;
  vocalisation?: number;
  wikipedia_url?: string;
}

export interface CatReelItem {
  id: string;
  type: 'video' | 'gif' | 'image';
  url: string;
  username: string;
  caption: string;
  hashtags: string[];
  likes: number;
  bookmarks: number;
  breed?: BreedInfo;
}

export const curatedCatVideos: CatReelItem[] = [
  {
    id: "v1",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-playful-cat-lying-on-its-back-31034-large.mp4",
    username: "playful_paws",
    caption: "Just rolling around dreaming of catnip... 💭🐾",
    hashtags: ["funnycats", "playfulcat", "catlife", "meow"],
    likes: 12430,
    bookmarks: 3120,
    breed: {
      id: "asho",
      name: "American Shorthair",
      origin: "United States",
      temperament: "Active, Curious, Easy Going, Gentle, Calm, Playful",
      description: "The American Shorthair is known for its longevity, robust health, gentle nature with children and dogs, and quiet disposition.",
      life_span: "15 - 20",
      energy_level: 3,
      affection_level: 5,
      intelligence: 4,
      social_needs: 3
    }
  },
  {
    id: "v2",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-cat-lying-on-a-cushion-leaning-its-head-42171-large.mp4",
    username: "royal_sleeps",
    caption: "Maximum comfort achieved. Do not disturb the king! 👑💤",
    hashtags: ["sleepycat", "chillin", "lazyday", "caturday"],
    likes: 8520,
    bookmarks: 1450,
    breed: {
      id: "pers",
      name: "Persian",
      origin: "Iran (Persia)",
      temperament: "Quiet, Sweet, Gentle, Peaceful, Patient",
      description: "Persians are quiet, sweet cats who prefer a peaceful home. They are known for their long, luxurious coats and round faces.",
      life_span: "14 - 15",
      energy_level: 1,
      affection_level: 4,
      intelligence: 3,
      social_needs: 2
    }
  },
  {
    id: "v3",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-funny-cat-licking-itself-41716-large.mp4",
    username: "hygiene_cat",
    caption: "Gotta stay clean, the camera is watching 🧼✨",
    hashtags: ["grooming", "funnycat", "catsdoingthings", "cutecat"],
    likes: 19800,
    bookmarks: 4210,
    breed: {
      id: "siam",
      name: "Siamese",
      origin: "Thailand",
      temperament: "Active, Social, Vocal, Clever, Dependent",
      description: "Siamese cats are extremely vocal and outgoing. They love to communicate and follow their humans everywhere.",
      life_span: "12 - 15",
      energy_level: 5,
      affection_level: 5,
      intelligence: 5,
      social_needs: 5
    }
  },
  {
    id: "v4",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-white-cat-with-green-eyes-42183-large.mp4",
    username: "green_eyed_beauty",
    caption: "Staring straight into your soul... 💚👀",
    hashtags: ["greeneyes", "whitecat", "gorgeous", "hypnotic"],
    likes: 31200,
    bookmarks: 8900,
    breed: {
      id: "kora",
      name: "Korat",
      origin: "Thailand",
      temperament: "Active, Loyal, Playful, Gentle, Clever",
      description: "Korats are silver-blue cats with a heart-shaped face and large green eyes. They are highly intelligent and extremely affectionate.",
      life_span: "10 - 15",
      energy_level: 4,
      affection_level: 5,
      intelligence: 5,
      social_needs: 4
    }
  },
  {
    id: "v5",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-ginger-cat-lying-in-bed-42175-large.mp4",
    username: "ginger_cuddles",
    caption: "Warm blankets + ginger fur = perfection. 🧡🛌",
    hashtags: ["gingercat", "cuddleweather", "bedtime", "purr"],
    likes: 15400,
    bookmarks: 2800,
    breed: {
      id: "mcoo",
      name: "Maine Coon",
      origin: "United States",
      temperament: "Adaptable, Gentle, Loving, Intelligent, Friendly",
      description: "Maine Coons are the gentle giants of the cat world. They are highly intelligent, playful, and great with families.",
      life_span: "12 - 15",
      energy_level: 3,
      affection_level: 5,
      intelligence: 5,
      social_needs: 3
    }
  },
  {
    id: "v6",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-fluffy-cat-resting-on-a-cushion-42187-large.mp4",
    username: "fluff_cloud",
    caption: "Is it a cat or just a giant cotton ball? ☁️🤔",
    hashtags: ["fluffycat", "cloud", "petoftheday", "meowlife"],
    likes: 22100,
    bookmarks: 5600,
    breed: {
      id: "raga",
      name: "Ragamuffin",
      origin: "United States",
      temperament: "Friendly, Gentle, Calm, Warm, Affectionate",
      description: "Ragamuffins are known for their sweet, docile nature and tendency to go limp in your arms when held.",
      life_span: "12 - 16",
      energy_level: 2,
      affection_level: 5,
      intelligence: 4,
      social_needs: 4
    }
  },
  {
    id: "v7",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-cat-purring-and-squinting-its-eyes-42188-large.mp4",
    username: "purr_factory",
    caption: "Turn the volume up! The engine is purring hard 🔊😸",
    hashtags: ["purring", "happycat", "closeups", "satisfying"],
    likes: 27900,
    bookmarks: 6890,
    breed: {
      id: "beng",
      name: "Bengal",
      origin: "United States",
      temperament: "Alert, Agile, Energetic, Demanding, Intelligent",
      description: "Bengals are wild-looking, highly active cats with beautiful spotted or marbled coats. They love climbing and even water!",
      life_span: "12 - 15",
      energy_level: 5,
      affection_level: 5,
      intelligence: 5,
      social_needs: 4
    }
  },
  {
    id: "v8",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-grey-cat-looking-closely-at-the-camera-42189-large.mp4",
    username: "detective_meow",
    caption: "Who goes there? Inspecting the lens... 🕵️‍♂️🔎",
    hashtags: ["curiouscat", "funnyanimals", "greycat", "lenscheck"],
    likes: 18450,
    bookmarks: 3900,
    breed: {
      id: "bslo",
      name: "British Shorthair",
      origin: "United Kingdom",
      temperament: "Affectionate, Easy Going, Gentle, Loyal, Patient",
      description: "British Shorthairs are easygoing, quiet, and loyal companions. They have distinct round faces and dense, plush coats.",
      life_span: "12 - 17",
      energy_level: 2,
      affection_level: 4,
      intelligence: 3,
      social_needs: 3
    }
  },
  {
    id: "v9",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-cute-kitten-looking-around-42211-large.mp4",
    username: "tiny_beans",
    caption: "World is so big, but I am so smol 🥺🍼",
    hashtags: ["kittensofinstagram", "cutest", "smol", "babycat"],
    likes: 45000,
    bookmarks: 12100,
    breed: {
      id: "tish",
      name: "Toyger",
      origin: "United States",
      temperament: "Playful, Social, Intelligent, Friendly",
      description: "Toygers are bred to look like miniature toy tigers. They are active, intelligent, and highly social cats.",
      life_span: "10 - 15",
      energy_level: 4,
      affection_level: 5,
      intelligence: 5,
      social_needs: 4
    }
  },
  {
    id: "v10",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-ginger-cat-licking-itself-42218-large.mp4",
    username: "bath_time",
    caption: "Cleanliness is close to godliness 🐾🛁",
    hashtags: ["gingerlife", "selfcare", "satisfying", "catlover"],
    likes: 13900,
    bookmarks: 2100,
    breed: {
      id: "abys",
      name: "Abyssinian",
      origin: "Egypt",
      temperament: "Active, Energetic, Independent, Intelligent, Gentle",
      description: "The Abyssinian is easy to care for, and a joy to have in your home. They’re affectionate and love being around people.",
      life_span: "14 - 15",
      energy_level: 5,
      affection_level: 5,
      intelligence: 5,
      social_needs: 5
    }
  }
];

export const randomCaptions = [
  "Just standard cat business, move along.",
  "Caption this expression because I have no words 😂",
  "Felt cute, might delete later. Or knock over a glass of water.",
  "When you realize caturday is almost over...",
  "Running around at 3 AM is my favorite workout routine.",
  "If it fits, I sits. Simple rules.",
  "Waiting patiently for my dinner that is 3 minutes late.",
  "My reaction when someone says they are a dog person.",
  "Did somebody say treats?! 🐟",
  "Living rent-free and judgment-free.",
  "Please insert salmon here 🍣",
  "Currently planning to conquer the red laser dot."
];

export const randomUsernames = [
  "floof_officially",
  "catnip_dealer",
  "purrfect_day",
  "sir_meowsalot",
  "whiskers_wonder",
  "claw_and_order",
  "tabby_times",
  "sleepy_kitten",
  "crazy_cat_person",
  "pawsome_shots"
];

export const randomHashtags = [
  ["catstagram", "catsofworld", "meowed", "dailycat"],
  ["funnycat", "kittylove", "derp", "petstagram"],
  ["loaf", "cutenessoverload", "fluffy", "adorable"],
  ["instacat", "gatto", "neko", "petlovers"]
];
