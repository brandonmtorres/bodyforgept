/* Verbatim patient reviews. Quoted exactly as written, including the em dashes and
   the straight quotes in the pull lines. Nothing here is trimmed for flattery — see
   the verified-claims rule in PRODUCT.md. */

export type Testimonial = {
  id: string;
  pull: string;
  intro: string;
  /* only the lead review carries the rest of the text behind a disclosure */
  full?: string[];
  avatar: string;
  name: string;
  /* the lead review is written by the patient's daughter, so the byline names both
     and marks which of them was treated */
  nameNote?: string;
  nameRest?: string;
  context: string;
};

export const LEAD: Testimonial = {
  id: "tst1",
  pull: '"After just five weeks of working with David, her progress was so remarkable that even our orthopedic surgeon was impressed."',
  intro:
    "When my 80-year-old mother underwent knee surgery after a fall, I knew finding the right physical therapist would be crucial for her recovery. After interviewing several professionals, I was fortunate to find David, who is an absolute gem.",
  full: [
    "David approached my mom's therapy with a personalized touch, carefully tailoring the plan to her specific needs and limitations. Her recovery journey wasn't without challenges—she also suffered a rib fracture, which delayed the start of therapy and left her knee very stiff. Despite these setbacks, David was patient, encouraging, and incredibly knowledgeable. His thoughtful approach helped her regain confidence and strength with each session.",
    "After just five weeks of working with David, her progress was so remarkable that even our orthopedic surgeon was impressed. David didn't just focus on her knee—he paid attention to her overall well-being, ensuring her therapy would support long-term mobility and health.",
    "My mom has made an incredible recovery thanks to David's dedication and expertise. I'm beyond grateful for the care and support he provided. If you're looking for a physical therapist who genuinely cares and delivers outstanding results, I wholeheartedly recommend David!",
  ],
  avatar: "p-yiqin",
  name: "Shumin Yin",
  nameNote: "(patient)",
  nameRest: " and Yiqin Zuo",
  context: "Knee replacement, age 80",
};

export const PAIR: Testimonial[] = [
  {
    id: "tst2",
    pull: '"I felt strong, empowered and like I was in the best shape I\'ve been in years."',
    intro:
      "I had the good fortune to meet David when I needed mandatory PT to get an MRI for my hip. I'm an active person, yet after a few weeks with David, I felt like a different person. He is very knowledgeable and passionate about his profession. That intelligence combined with his caring, compassion and attention to detail helped me successfully complete my rehab after hip replacement. I was so happy with the results from working with David on my hip, that I am now seeing him for my knee.",
    avatar: "p-diane",
    name: "Diane H.",
    context: "Hip replacement, now in knee rehab",
  },
  {
    id: "tst3",
    pull: '"He set me up with the tools and knowledge to continue improving and avoid injuries."',
    intro:
      "David is truly exceptional! I was recovering from a knee injury, and he played a crucial role in getting me back to running. He went above and beyond in every session, from the first meeting to the end of treatment. He was always responsive to my questions and feedback. His knowledge, experience, and great attitude set him apart. I would highly recommend him to anyone in need of care.",
    avatar: "p-maria",
    name: "Maria Rossi",
    context: "Knee injury, returned to running",
  },
];
