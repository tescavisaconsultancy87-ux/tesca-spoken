export interface Question {
  id: number;
  text: string;
  options: string[];
  answer: number; // index of correct option
}

export const ALL_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Choose the correct sentence:",
    options: [
      "She don't like coffee in the morning.",
      "She doesn't likes coffee in the morning.",
      "She doesn't like coffee in the morning.",
      "She not likes coffee in the morning."
    ],
    answer: 2
  },
  {
    id: 2,
    text: "Which word best completes: 'If it rains tomorrow, we _______ stay at home.'",
    options: [
      "would",
      "will",
      "are",
      "have"
    ],
    answer: 1
  },
  {
    id: 3,
    text: "Identify the antonym of the word 'AMBIGUOUS':",
    options: [
      "Unclear",
      "Vague",
      "Precise",
      "Cryptic"
    ],
    answer: 2
  },
  {
    id: 4,
    text: "Complete the idiom: 'By working hard, he finally got the ball _______.'",
    options: [
      "rolling",
      "playing",
      "spinning",
      "moving"
    ],
    answer: 0
  },
  {
    id: 5,
    text: "Choose the correct past participle form: 'They have _______ all the juice.'",
    options: [
      "drank",
      "drunk",
      "drinked",
      "drunken"
    ],
    answer: 1
  },
  {
    id: 6,
    text: "Which sentence uses the present perfect continuous tense correctly?",
    options: [
      "I am learning English for three years.",
      "I learned English for three years.",
      "I have been learning English for three years.",
      "I have learned English for three years."
    ],
    answer: 2
  },
  {
    id: 7,
    text: "What does 'I am looking forward to meeting you' mean?",
    options: [
      "I am searching for you.",
      "I am excited about our future meeting.",
      "I am looking at your face.",
      "I met you in the past."
    ],
    answer: 1
  },
  {
    id: 8,
    text: "Select the correct word: 'The company's new policy has had a major _______ on employee morale.'",
    options: [
      "affect",
      "effect",
      "effection",
      "affection"
    ],
    answer: 1
  },
  {
    id: 9,
    text: "Complete: 'Had I known about the storm, I _______ stayed indoors.'",
    options: [
      "will have",
      "would have",
      "should",
      "had"
    ],
    answer: 1
  },
  {
    id: 10,
    text: "What is the closest synonym to the word 'METICULOUS'?",
    options: [
      "Careless",
      "Thorough",
      "Quick",
      "Lazy"
    ],
    answer: 1
  },
  {
    id: 11,
    text: "Select the correct preposition: 'She has been living in London _______ 2018.'",
    options: [
      "for",
      "since",
      "from",
      "during"
    ],
    answer: 1
  },
  {
    id: 12,
    text: "Choose the correct sentence with articles:",
    options: [
      "He is a honest man.",
      "He is an honest man.",
      "He is the honest man.",
      "He is honest man."
    ],
    answer: 1
  },
  {
    id: 13,
    text: "What is the meaning of 'to call off a meeting'?",
    options: [
      "To postpone a meeting",
      "To cancel a meeting",
      "To start a meeting early",
      "To invite people to a meeting"
    ],
    answer: 1
  },
  {
    id: 14,
    text: "Complete: 'Look at those dark clouds! It _______ rain soon.'",
    options: [
      "must",
      "is going to",
      "should",
      "shall"
    ],
    answer: 1
  },
  {
    id: 15,
    text: "Find the opposite (antonym) of 'TRANSPARENT':",
    options: [
      "Clear",
      "Opaque",
      "Bright",
      "Translucent"
    ],
    answer: 1
  },
  {
    id: 16,
    text: "Choose the correct conjunction: '_______ it was freezing outside, she went for a walk without a coat.'",
    options: [
      "Although",
      "Despite",
      "Because",
      "However"
    ],
    answer: 0
  },
  {
    id: 17,
    text: "What does the idiom 'bite the bullet' mean?",
    options: [
      "To eat something very hard",
      "To face a difficult situation with courage",
      "To get angry quickly",
      "To make a mistake"
    ],
    answer: 1
  },
  {
    id: 18,
    text: "Change to reported speech: He said, 'I am working on a new project.'",
    options: [
      "He said that he is working on a new project.",
      "He said that he was working on a new project.",
      "He said that he had worked on a new project.",
      "He said that he will work on a new project."
    ],
    answer: 1
  },
  {
    id: 19,
    text: "Select the correct passive form of: 'The team completed the project on time.'",
    options: [
      "The project was completed on time by the team.",
      "The project is completed on time by the team.",
      "The project had completed on time by the team.",
      "The project completed on time by the team."
    ],
    answer: 0
  },
  {
    id: 20,
    text: "Complete the sentence: 'She excels _______ mathematics and physics.'",
    options: [
      "at",
      "in",
      "on",
      "with"
    ],
    answer: 1
  },
  {
    id: 21,
    text: "What is the synonym of 'CANDOR'?",
    options: [
      "Deceit",
      "Honesty",
      "Courage",
      "Wisdom"
    ],
    answer: 1
  },
  {
    id: 22,
    text: "Choose the grammatically correct inverted sentence:",
    options: [
      "Never I have seen such a beautiful sunset.",
      "Never have I seen such a beautiful sunset.",
      "Never I saw such a beautiful sunset.",
      "Never had seen I such a beautiful sunset."
    ],
    answer: 1
  },
  {
    id: 23,
    text: "Which sentence is grammatically correct?",
    options: [
      "This house is more bigger than mine.",
      "This house is much bigger than mine.",
      "This house is most bigger than mine.",
      "This house is as bigger as mine."
    ],
    answer: 1
  },
  {
    id: 24,
    text: "Complete: 'I prefer tea _______ coffee in the afternoon.'",
    options: [
      "than",
      "to",
      "over",
      "from"
    ],
    answer: 1
  },
  {
    id: 25,
    text: "Identify the word that means 'lasting for a very short time':",
    options: [
      "Eternal",
      "Ephemeral",
      "Enduring",
      "Permanent"
    ],
    answer: 1
  },
  {
    id: 26,
    text: "Choose the correct relative pronoun: 'The professor _______ lecture we attended yesterday was very inspiring.'",
    options: [
      "who",
      "whom",
      "whose",
      "which"
    ],
    answer: 2
  },
  {
    id: 27,
    text: "Select the correct sentence:",
    options: [
      "Neither of the candidates are qualified.",
      "Neither of the candidates is qualified.",
      "Neither of candidates were qualified.",
      "Neither of the candidate is qualified."
    ],
    answer: 1
  },
  {
    id: 28,
    text: "What does 'hitting two birds with one stone' mean?",
    options: [
      "Hurt two birds while hunting",
      "Solving two problems with a single action",
      "Trying to do impossible tasks",
      "Making a compromise"
    ],
    answer: 1
  },
  {
    id: 29,
    text: "Fill in the blank: 'We had to _______ the outdoor event due to heavy rain.'",
    options: [
      "put off",
      "put out",
      "take off",
      "turn up"
    ],
    answer: 0
  },
  {
    id: 30,
    text: "What is the meaning of 'PRAGMATIC'?",
    options: [
      "Idealistic and unrealistic",
      "Practical and logical",
      "Dramatic and emotional",
      "Hesitant and slow"
    ],
    answer: 1
  },
  {
    id: 31,
    text: "Complete: 'I wish I _______ more time to study for the examination.'",
    options: [
      "have",
      "had",
      "would have",
      "will have"
    ],
    answer: 1
  },
  {
    id: 32,
    text: "Choose the correct option: 'She stopped _______ when the teacher entered the room.'",
    options: [
      "to talk",
      "talking",
      "talked",
      "talk"
    ],
    answer: 1
  },
  {
    id: 33,
    text: "Choose the closest meaning of 'ELOQUENT':",
    options: [
      "Silent and reserved",
      "Fluent and persuasive in speaking",
      "Confused and disorganized",
      "Loud and aggressive"
    ],
    answer: 1
  },
  {
    id: 34,
    text: "Complete: 'Are you interested _______ applying for the leadership workshop?'",
    options: [
      "for",
      "in",
      "on",
      "about"
    ],
    answer: 1
  },
  {
    id: 35,
    text: "Complete: 'By the time we arrive at the theater, the movie _______.'",
    options: [
      "will start",
      "will have started",
      "has started",
      "started"
    ],
    answer: 1
  }
];

export function getRandomQuestions(count: number = 10): Question[] {
  // Fisher-Yates shuffle copy
  const shuffled = [...ALL_QUESTIONS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
