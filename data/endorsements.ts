export type Endorsement = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  context?: string;
};

/**
 * Latest three LinkedIn recommendations (Profile → Recommendations).
 */
export const endorsements: Endorsement[] = [
  {
    id: '1',
    quote:
      'If you are considering hiring, promoting, or pulling Zach onto a new project, do it! You will not regret it! Not only is Zach an outstanding developer, teammate, and coach, but he stays grounded and communicates clearly and constructively during challenging situations. While working with him on the Promotions Pod at Purple we faced heavy workloads and tight deadlines back-to-back. Zach was consistently fulfilling his responsibilities, supporting his teammates across the board.',
    author: 'Kimball Heaton',
    role: 'CAPM, CSM',
    context: 'Worked with Zach on the same team.',
  },
  {
    id: '2',
    quote:
      "Zach is one of the most thorough and communicative developers I've worked with. He's able to call out when things are in jeopardy and is very invested in the culture of the company. He's a great developer who is always willing to dig in and do the research as well as support his team. He has a background in project management and that comes through with how thorough he is in his documentation and how organized he is when he tackles projects.",
    author: 'Katherine Liu',
    role: 'Sr. Software Engineering Manager at Purple',
    context: 'Katherine managed Zach directly.',
  },
  {
    id: '3',
    quote:
      "Zach and I worked together on the Promotions pod at Purple. During this time, Zach was a Developer on the team. I greatly appreciated Zach's ability to vocalize and lead communication for the development team. This unique skill allowed us to mitigate and tackle perceived risk and issues early on. As a Project Manager, I appreciated the level of importance Zach placed on process and culture, and I was thankful for Zach's help in driving both forward with the team.",
    author: 'Lia Young',
    role: 'PMP, Certified Scrum Master® — Adobe Sr. Program Manager',
    context: 'Worked with Zach on the same team.',
  },
];
