/**
 * Science drill-down copy — Social: connection, relationships, communication.
 *
 * Several of these cite the Gottman Institute's longitudinal couples work,
 * which is real research but heavily commercialised; the copy describes the
 * observed pattern rather than promising outcomes. Holt-Lunstad's mortality
 * meta-analysis underpins the loneliness framing throughout.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const SOCIAL_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Daily Meaningful Interaction': {
    tagline: 'One real conversation a day — not a text.',
    lead: 'Social connection predicts mortality about as strongly as smoking does, and the effect tracks real interaction rather than contact counts. A phone call clears the bar; scrolling past someone’s update does not.',
    evidence:
      'Holt-Lunstad et al. (2010) meta-analysed 148 studies and found stronger social relationships were associated with a 50% increased likelihood of survival.',
    cadenceLabel: 'Daily · one real interaction',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'A mortality-scale effect',
        description: 'Comparable in size to major lifestyle risks.',
      },
      {
        icon: 'wave',
        title: 'Buffers stress',
        description: 'Connection changes how stress lands.',
      },
      {
        icon: 'target',
        title: 'Voice beats text',
        description: 'The benefit is in real exchange.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Mildly effortful',
        description: 'Initiating is the whole difficulty.',
      },
      {
        when: 'Week 3',
        title: 'Relationships thicken',
        description: 'Frequency changes depth on its own.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Reaching out stops being a decision.',
        peak: true,
      },
    ],
    howToStart: [
      'Call one person for 60 seconds.',
      'Voice or in person. Texting does not count for this one.',
      'Keep a short list of people so you never have to think who.',
    ],
    sources: [
      {
        authors: 'Holt-Lunstad J, Smith TB, Layton JB',
        title: 'Social relationships and mortality risk: a meta-analytic review',
        journal: 'PLoS Medicine',
        year: '2010',
      },
    ],
  },

  'Reach Out Daily': {
    tagline: 'Send one message to someone you care about.',
    lead: 'Relationships decay quietly through absence rather than conflict. A message costs almost nothing and interrupts that decay — and people consistently underestimate how much a small unprompted contact means to the person receiving it.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Stops quiet decay',
        description: 'Most friendships end from neglect, not falling out.',
      },
      {
        icon: 'sparkle',
        title: 'Worth more than you think',
        description: 'Receivers value it more than senders expect.',
      },
      {
        icon: 'wave',
        title: 'Reciprocal',
        description: 'Reaching out tends to bring contact back.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Slightly awkward',
        description: 'Messaging after a long gap always is.',
      },
      {
        when: 'Week 3',
        title: 'Conversations restart',
        description: 'Dormant threads come back to life.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You think of someone and just message them.',
        peak: true,
      },
    ],
    howToStart: [
      'Send one "thinking of you" text to a friend.',
      'No agenda needed. "Saw this and thought of you" is enough.',
      'Work down a list rather than always messaging the easiest person.',
    ],
    sources: [
      {
        authors: 'Gable SL, Reis HT, Impett EA, Asher ER',
        title:
          'What do you do when things go right? The intrapersonal and interpersonal benefits of sharing positive events',
        journal: 'Journal of Personality and Social Psychology',
        year: '2004',
      },
    ],
  },

  'Active Constructive Responding': {
    tagline: 'When someone shares good news, actually celebrate.',
    lead: 'How you respond to someone’s good news predicts relationship quality better than how you respond to their problems. Enthusiasm plus curious questions — rather than a flat "nice" or a caveat — is the response that builds the bond.',
    evidence:
      'Gable et al. (2004) found that active-constructive responses to a partner’s positive events were associated with higher relationship wellbeing, while passive or negative responses predicted the opposite.',
    cadenceLabel: 'Every time · ongoing',
    benefitDetails: [
      {
        icon: 'target',
        title: 'A top relationship predictor',
        description: 'Good news handling outperforms bad news handling.',
      },
      {
        icon: 'sparkle',
        title: 'Free',
        description: 'It costs enthusiasm and two questions.',
      },
      {
        icon: 'leaf',
        title: 'Compounds fast',
        description: 'People bring you more of their life.',
      },
    ],
    timeline: [
      {
        when: 'First try',
        title: 'You notice your default',
        description: 'Most defaults are flatter than we think.',
      },
      {
        when: 'Week 3',
        title: 'They share more',
        description: 'The response shapes what you get told.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Enthusiasm becomes your first reaction.',
        peak: true,
      },
    ],
    howToStart: [
      'React with genuine enthusiasm before anything else.',
      'Ask two questions that let them relive it.',
      'No "but" and no caveats. Those are for later, if ever.',
    ],
    sources: [
      {
        authors: 'Gable SL, Reis HT, Impett EA, Asher ER',
        title: 'What do you do when things go right?',
        journal: 'Journal of Personality and Social Psychology',
        year: '2004',
      },
    ],
  },

  'Deep Questions': {
    tagline: 'Ask something that is not small talk.',
    lead: 'Escalating self-disclosure generates closeness reliably enough that it has been produced experimentally between strangers. The mechanism is mutual and gradual — a real question invites a real answer, which invites another.',
    evidence:
      'Aron et al. (1997) generated interpersonal closeness in a laboratory setting using a structured sequence of escalating personal questions between strangers.',
    cadenceLabel: 'Daily · one question',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Closeness, on demand',
        description: 'Produced experimentally, not just observed.',
      },
      {
        icon: 'wave',
        title: 'Better conversations',
        description: 'One question changes the whole register.',
      },
      {
        icon: 'leaf',
        title: 'Works with anyone',
        description: 'Old friends and new acquaintances alike.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels forward',
        description: 'It is less intrusive than you fear.',
      },
      {
        when: 'Week 2',
        title: 'Conversations change',
        description: 'People are relieved to skip the weather.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You default past small talk.',
        peak: true,
      },
    ],
    howToStart: [
      'Ask one person, "what’s been on your mind?"',
      'Then be quiet. The question only works if you let them answer.',
      'Match their depth. Reciprocity is what makes it safe.',
    ],
    sources: [
      {
        authors: 'Aron A, Melinat E, Aron EN, Vallone RD, Bator RJ',
        title:
          'The experimental generation of interpersonal closeness: a procedure and some preliminary findings',
        journal: 'Personality and Social Psychology Bulletin',
        year: '1997',
      },
    ],
  },

  'Deep Listening': {
    tagline: 'Listen without planning your reply.',
    lead: 'Most listening is really rehearsal — waiting for a gap while assembling your response. Genuine attention, without that parallel process running, is rare enough that people notice immediately when they get it.',
    cadenceLabel: 'Daily · one conversation',
    benefitDetails: [
      {
        icon: 'target',
        title: 'People feel heard',
        description: 'Rarer than it should be, and unmistakable.',
      },
      {
        icon: 'wave',
        title: 'You learn more',
        description: 'Rehearsing means missing most of it.',
      },
      {
        icon: 'leaf',
        title: 'Less exhausting',
        description: 'Dropping the parallel process is restful.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Reveals the habit',
        description: 'You catch yourself rehearsing constantly.',
      },
      {
        when: 'Week 3',
        title: 'Longer silences',
        description: 'You get comfortable not filling them.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Attention without agenda becomes default.',
        peak: true,
      },
    ],
    howToStart: [
      'Listen to someone for 60 seconds without speaking.',
      'When you catch yourself preparing a reply, return to their words.',
      'Leave two seconds of silence before responding.',
    ],
    sources: [
      {
        authors: 'Rogers CR',
        title: 'Client-Centered Therapy',
        journal: 'Houghton Mifflin',
        year: '1951',
      },
    ],
  },

  'Reflective Listening': {
    tagline: 'Say back what you heard.',
    lead: 'Reflecting content back does two things at once: it proves you were listening, and it lets the other person correct you before a misunderstanding compounds. It feels mechanical to do and lands as care.',
    cadenceLabel: 'Daily · one conversation',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Fewer misunderstandings',
        description: 'Errors get caught at the source.',
      },
      {
        icon: 'wave',
        title: 'They feel understood',
        description: 'Being reflected accurately is disarming.',
      },
      {
        icon: 'leaf',
        title: 'Defuses conflict',
        description: 'Hard to escalate at someone who understood you.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Clunky',
        description: 'It sounds like a technique at first.',
      },
      {
        when: 'Week 3',
        title: 'Natural',
        description: 'It stops sounding like a script.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Reflecting becomes part of listening.',
        peak: true,
      },
    ],
    howToStart: [
      'Try: "so what I’m hearing is…" then let them correct you.',
      'Reflect the feeling as well as the content.',
      'Ask open questions — what, how — rather than yes/no ones.',
    ],
    sources: [
      {
        authors: 'Rogers CR',
        title: 'Client-Centered Therapy',
        journal: 'Houghton Mifflin',
        year: '1951',
      },
    ],
  },

  'Express Gratitude': {
    tagline: 'Tell someone specifically what they did.',
    lead: 'Expressed gratitude strengthens the relationship on both sides, and specificity is what carries it — "thank you for covering for me on Tuesday" does work that "thanks for everything" cannot. Senders reliably underestimate the impact.',
    evidence:
      'Algoe et al. (2010) found that expressions of gratitude predicted improvements in relationship quality for both the person expressing and the person receiving.',
    cadenceLabel: 'Daily · 3 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Both sides benefit',
        description: 'Measured in giver and receiver.',
      },
      {
        icon: 'target',
        title: 'Specificity carries it',
        description: 'Named actions land; generalities do not.',
      },
      {
        icon: 'sparkle',
        title: 'Undervalued',
        description: 'People consistently expect it to matter less than it does.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Slightly vulnerable',
        description: 'Sincere thanks feels exposed. That is the point.',
      },
      {
        when: 'Week 3',
        title: 'You notice more',
        description: 'Looking for things to thank people for changes attention.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Gratitude gets said rather than assumed.',
        peak: true,
      },
    ],
    howToStart: [
      'Tell one person "thank you" out loud.',
      'Name the specific thing and its effect on you.',
      'Say it directly. A note is good; in person is better.',
    ],
    sources: [
      {
        authors: 'Algoe SB, Gable SL, Maisel NC',
        title:
          'It’s the little things: everyday gratitude as a booster shot for romantic relationships',
        journal: 'Personal Relationships',
        year: '2010',
      },
    ],
  },

  'Daily Compliment': {
    tagline: 'Say the good thing you noticed.',
    lead: 'Most compliments go unsaid because we assume the person already knows. They usually do not — and giving praise activates reward circuitry in the giver too, which is why this is one of the cheapest mood levers available.',
    cadenceLabel: 'Daily · one compliment',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Rewarding to give',
        description: 'Social reward engages the same circuitry as money.',
      },
      {
        icon: 'target',
        title: 'Usually news to them',
        description: 'People rarely know what you appreciate.',
      },
      {
        icon: 'leaf',
        title: 'Trains noticing',
        description: 'You start looking for the good thing.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Awkward',
        description: 'Sincerity feels riskier than it is.',
      },
      {
        when: 'Week 2',
        title: 'Easier and better',
        description: 'Specific beats generic, and you get specific.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You say it as you notice it.',
        peak: true,
      },
    ],
    howToStart: [
      'Tell one person what you appreciate about them.',
      'Character or effort beats appearance.',
      'Be specific enough that it could only apply to them.',
    ],
    sources: [
      {
        authors: 'Izuma K, Saito DN, Sadato N',
        title:
          'Processing of social and monetary rewards in the human striatum',
        journal: 'Neuron',
        year: '2008',
      },
    ],
  },

  'Random Act of Kindness': {
    tagline: 'Do one unprompted good thing.',
    lead: 'Kindness toward others raises the actor’s own wellbeing — it is one of the better-replicated findings in positive psychology, and among the few interventions where the benefit flows in both directions at once.',
    evidence:
      'Lyubomirsky et al. (2005) reviewed intentional activity interventions and found deliberate acts of kindness produced measurable, sustainable increases in wellbeing.',
    cadenceLabel: 'Daily · one act',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Your mood rises',
        description: 'The actor benefits, reliably.',
      },
      {
        icon: 'target',
        title: 'Two people benefit',
        description: 'Rare efficiency for a one-minute action.',
      },
      {
        icon: 'sparkle',
        title: 'Scale does not matter',
        description: 'Small and frequent beats large and rare.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Immediate lift',
        description: 'The effect arrives with the act.',
      },
      {
        when: 'Week 3',
        title: 'Opportunities everywhere',
        description: 'You start seeing them because you are looking.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Kindness stops needing a prompt.',
        peak: true,
      },
    ],
    howToStart: [
      'Smile at one stranger today.',
      'Vary it — clustering several in one day works well.',
      'Anonymous counts. It is not about credit.',
    ],
    sources: [
      {
        authors: 'Lyubomirsky S, Sheldon KM, Schkade D',
        title: 'Pursuing happiness: the architecture of sustainable change',
        journal: 'Review of General Psychology',
        year: '2005',
      },
    ],
  },

  'Acts of Service': {
    tagline: 'Help someone, deliberately.',
    lead: 'Helping others is associated with better wellbeing and health in the helper, and volunteering adds a second ingredient — it puts you in a room with people repeatedly, which is how adult friendships actually form.',
    cadenceLabel: 'Weekly · one act',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Helper benefits',
        description: 'Associated with wellbeing and health.',
      },
      {
        icon: 'target',
        title: 'Builds connection',
        description: 'Repeated shared activity is how friendships start.',
      },
      {
        icon: 'wave',
        title: 'Perspective',
        description: 'Hard to ruminate while being useful.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Better than expected',
        description: 'The lift is usually immediate.',
      },
      {
        when: 'Week 6',
        title: 'Faces become familiar',
        description: 'Where the connection benefit shows up.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A standing commitment in the week.',
        peak: true,
      },
    ],
    howToStart: [
      'Hold the door for someone today. Start absurdly small.',
      'For the connection benefit, choose something recurring.',
      'Match it to a skill you have — sustainability comes from that.',
    ],
    sources: [
      {
        authors: 'Post SG',
        title: 'Altruism, happiness, and health: it’s good to be good',
        journal: 'International Journal of Behavioral Medicine',
        year: '2005',
      },
    ],
  },

  'Face-to-Face Time': {
    tagline: 'See someone in person.',
    lead: 'In-person contact carries wellbeing benefits that online interaction does not fully replicate — the bandwidth of a face, a voice and shared physical space is doing work a screen cannot. Frequency matters more than duration.',
    evidence:
      'Helliwell & Huang (2013) compared the wellbeing effects of real-world and online friendships and found real-life social networks were substantially more strongly associated with subjective wellbeing.',
    cadenceLabel: 'Daily · one in-person conversation',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Stronger than online',
        description: 'Measured directly against each other.',
      },
      {
        icon: 'wave',
        title: 'Full bandwidth',
        description: 'Tone, face and presence all carry information.',
      },
      {
        icon: 'target',
        title: 'Brief still counts',
        description: 'A short real exchange beats a long thread.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Easier than it sounds',
        description: 'Neighbours and colleagues count.',
      },
      {
        when: 'Week 3',
        title: 'Loneliness eases',
        description: 'Cumulative in-person contact is what shifts it.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You choose in-person by default.',
        peak: true,
      },
    ],
    howToStart: [
      'Say hi to one person in person today.',
      'Turn a call into a coffee where you can.',
      'Short exchanges count. This is about frequency.',
    ],
    sources: [
      {
        authors: 'Helliwell JF, Huang H',
        title:
          'Comparing the happiness effects of real and on-line friends',
        journal: 'PLoS ONE',
        year: '2013',
      },
    ],
  },

  'Group Activities': {
    tagline: 'Join something that meets regularly.',
    lead: 'Loneliness has measurable health consequences, and the fix is structural rather than motivational — a recurring commitment produces contact without requiring you to organise it each time. Regularity is the active ingredient.',
    cadenceLabel: 'Weekly · one group',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Counters loneliness',
        description: 'Which carries real health consequences.',
      },
      {
        icon: 'target',
        title: 'No organising',
        description: 'The schedule exists without you.',
      },
      {
        icon: 'wave',
        title: 'Repetition builds friendship',
        description: 'Familiarity needs frequency.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Uncomfortable',
        description: 'Walking in the first time is the hard part.',
      },
      {
        when: 'Week 6',
        title: 'It becomes yours',
        description: 'Roughly when strangers become acquaintances.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'A fixed feature of your week.',
        peak: true,
      },
    ],
    howToStart: [
      'Reply yes to one invitation.',
      'Pick something recurring, not a one-off event.',
      'Commit to four sessions before judging it. One is not enough data.',
    ],
    sources: [
      {
        authors: 'Hawkley LC, Cacioppo JT',
        title:
          'Loneliness matters: a theoretical and empirical review of consequences and mechanisms',
        journal: 'Annals of Behavioral Medicine',
        year: '2010',
      },
    ],
  },

  'Standing Social Events': {
    tagline: 'One recurring commitment in the diary.',
    lead: 'Adult friendships die of scheduling, not of feeling. A standing slot — the same night, the same people — removes the coordination cost that quietly kills most good intentions to see people more.',
    cadenceLabel: 'Weekly · one standing event',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Beats coordination decay',
        description: 'No arranging means it actually happens.',
      },
      {
        icon: 'leaf',
        title: 'Reliable connection',
        description: 'Frequency without effort.',
      },
      {
        icon: 'wave',
        title: 'Something to look forward to',
        description: 'Anticipation is part of the benefit.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Needs setting up',
        description: 'One round of organising buys months.',
      },
      {
        when: 'Week 4',
        title: 'It runs itself',
        description: 'The slot becomes assumed.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Protected time nobody has to negotiate.',
        peak: true,
      },
    ],
    howToStart: [
      'Reply yes to one invitation.',
      'Propose a fixed slot — "first Thursday" beats "sometime soon".',
      'Keep it low-effort. Sustainable beats impressive.',
    ],
    sources: [
      {
        authors: 'Holt-Lunstad J, Smith TB, Layton JB',
        title: 'Social relationships and mortality risk: a meta-analytic review',
        journal: 'PLoS Medicine',
        year: '2010',
      },
    ],
  },

  'Friend Check-Ins': {
    tagline: 'Ask three close friends how they really are.',
    lead: 'Close friendships take sustained hours to build and sustained contact to keep. A monthly deliberate check-in — with the real question, not the pleasantry — is the minimum maintenance that stops closeness quietly eroding.',
    cadenceLabel: 'Monthly · 3 friends',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Maintains closeness',
        description: 'Friendship needs contact hours, not goodwill.',
      },
      {
        icon: 'target',
        title: 'The real question',
        description: '"How are you really?" gets a different answer.',
      },
      {
        icon: 'wave',
        title: 'Reciprocal support',
        description: 'You find out who needed asking.',
      },
    ],
    timeline: [
      {
        when: 'Month 1',
        title: 'Some awkwardness',
        description: 'Especially with anyone you have drifted from.',
      },
      {
        when: 'Month 3',
        title: 'Real conversations',
        description: 'The habit gives permission on both sides.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'A monthly round you do without prompting.',
        peak: true,
      },
    ],
    howToStart: [
      'Send one friend a "how are you really?" text.',
      'Name three people and put a monthly reminder in.',
      'Be ready to actually listen — the question invites a real answer.',
    ],
    sources: [
      {
        authors: 'Hall JA',
        title: 'How many hours does it take to make a friend?',
        journal: 'Journal of Social and Personal Relationships',
        year: '2019',
      },
    ],
  },

  'Handwritten Letters': {
    tagline: 'Post something you wrote by hand.',
    lead: 'A letter signals cost — time, attention, a stamp — in a way a message cannot, which is most of why it lands harder. People routinely underestimate how much a written expression of appreciation affects the person who receives it.',
    evidence:
      'Kumar & Epley (2018) found that senders of gratitude letters substantially underestimated how positively recipients would feel, while overestimating how awkward it would be.',
    cadenceLabel: 'Monthly · one letter',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Disproportionate impact',
        description: 'Recipients value it far more than senders expect.',
      },
      {
        icon: 'leaf',
        title: 'It gets kept',
        description: 'Letters survive in drawers for decades.',
      },
      {
        icon: 'target',
        title: 'Signals cost',
        description: 'Effort is the message underneath the message.',
      },
    ],
    timeline: [
      {
        when: 'Letter 1',
        title: 'Harder than texting',
        description: 'The friction is exactly what makes it land.',
      },
      {
        when: 'Month 2',
        title: 'Reactions surprise you',
        description: 'Usually much bigger than anticipated.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'A monthly card becomes normal.',
        peak: true,
      },
    ],
    howToStart: [
      'Write one sentence on a postcard.',
      'Be specific about why you are writing to them.',
      'Keep stamps and cards in a drawer so friction stays low.',
    ],
    sources: [
      {
        authors: 'Kumar A, Epley N',
        title:
          'Undervaluing gratitude: expressers misunderstand the consequences of showing appreciation',
        journal: 'Psychological Science',
        year: '2018',
      },
    ],
  },

  'Vulnerability Practice': {
    tagline: 'Say the honest thing.',
    lead: 'Trust is built by disclosure that could have been withheld — closeness needs someone to go first. The caveat matters though: vulnerability is for relationships that have earned it, not a technique to apply indiscriminately.',
    cadenceLabel: 'Weekly · one honest disclosure',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Builds real trust',
        description: 'Disclosure invites reciprocal disclosure.',
      },
      {
        icon: 'leaf',
        title: 'Less performing',
        description: 'Exhausting to maintain a version of yourself.',
      },
      {
        icon: 'wave',
        title: 'Deeper relationships',
        description: 'Depth requires someone going first.',
      },
    ],
    timeline: [
      {
        when: 'First time',
        title: 'Genuinely uncomfortable',
        description: 'That discomfort is the signal, not a warning.',
      },
      {
        when: 'Week 4',
        title: 'Reciprocated',
        description: 'People tend to meet you there.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Honesty becomes the default register.',
        peak: true,
      },
    ],
    howToStart: [
      'Share one true feeling with someone you already trust.',
      'Start with something mildly uncomfortable, not your deepest fear.',
      'Choose the person carefully. This is not for everyone.',
    ],
    sources: [
      {
        authors: 'Brown B',
        title: 'Daring Greatly',
        journal: 'Gotham Books',
        year: '2012',
      },
    ],
  },

  'Eye Contact Practice': {
    tagline: 'Hold eye contact a beat longer.',
    lead: 'Sustained mutual gaze increases perceived warmth and trustworthiness and is part of how social bonding is signalled. Culture and neurotype vary a lot here, so calibrate to the person rather than to a rule.',
    cadenceLabel: 'Daily · in conversation',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Perceived as warmer',
        description: 'Gaze reads as attention and honesty.',
      },
      {
        icon: 'wave',
        title: 'Better presence',
        description: 'Hard to be distracted while looking at someone.',
      },
      {
        icon: 'leaf',
        title: 'Costs nothing',
        description: 'A small change in an existing behaviour.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels intense',
        description: 'Three seconds is longer than you think.',
      },
      {
        when: 'Week 3',
        title: 'Natural',
        description: 'Soft rather than staring is the target.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Comfortable contact becomes your default.',
        peak: true,
      },
    ],
    howToStart: [
      'Hold soft eye contact for about three seconds, then look away naturally.',
      'Soft, not fixed — staring reads as aggression.',
      'Respect that many people and cultures prefer less. Follow their lead.',
    ],
    sources: [
      {
        authors: 'Akechi H, et al.',
        title:
          'Attention to eye contact in the West and East: autonomic responses and evaluative ratings',
        journal: 'PLoS ONE',
        year: '2013',
      },
    ],
  },

  'Receive Feedback Gracefully': {
    tagline: 'Say thank you before you say anything else.',
    lead: 'Defensiveness is the default response to criticism and it teaches people to stop telling you things. Receiving well is a separate skill from giving well — and the person who can hear feedback gets far more of it.',
    cadenceLabel: 'Every time · ongoing',
    benefitDetails: [
      {
        icon: 'target',
        title: 'You keep getting told',
        description: 'Defensiveness switches off the supply.',
      },
      {
        icon: 'wave',
        title: 'Faster improvement',
        description: 'You cannot fix what nobody mentions.',
      },
      {
        icon: 'leaf',
        title: 'Better relationships',
        description: 'People relax around someone who can hear it.',
      },
    ],
    timeline: [
      {
        when: 'First time',
        title: 'Defensiveness is fast',
        description: 'It arrives before you decide anything.',
      },
      {
        when: 'Week 4',
        title: 'You catch it',
        description: 'A pause opens up before the reaction.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'Curiosity becomes the first response.',
        peak: true,
      },
    ],
    howToStart: [
      'Say "thank you" the next time someone gives you feedback.',
      'Ask one clarifying question before defending anything.',
      'Decide later whether you agree. Separate hearing from judging.',
    ],
    sources: [
      {
        authors: 'Stone D, Heen S',
        title: 'Thanks for the Feedback',
        journal: 'Viking',
        year: '2014',
      },
    ],
  },

  'Boundary Practice': {
    tagline: 'Buy yourself time before agreeing.',
    lead: 'Most overcommitment happens in the two seconds where saying yes is easier than pausing. "Let me get back to you" is not a boundary in itself — it is the space in which you can actually set one.',
    cadenceLabel: 'Daily · as needed',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Fewer regretted yeses',
        description: 'The pause is where the real decision happens.',
      },
      {
        icon: 'wave',
        title: 'Less resentment',
        description: 'Overcommitment turns into it, reliably.',
      },
      {
        icon: 'leaf',
        title: 'Your yes means more',
        description: 'It stops being automatic.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels rude',
        description: 'It is not. It is honest.',
      },
      {
        when: 'Week 3',
        title: 'Easier',
        description: 'Nobody reacted badly, which is instructive.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The pause happens on its own.',
        peak: true,
      },
    ],
    howToStart: [
      'Say "let me get back to you" to one ask.',
      'Then actually get back to them. The habit needs the follow-through.',
      'A no does not require justification. "I can’t take that on" is complete.',
    ],
    sources: [
      {
        authors: 'Cloud H, Townsend J',
        title: 'Boundaries: When to Say Yes, How to Say No',
        journal: 'Zondervan',
        year: '1992',
      },
    ],
  },

  'Pet Time': {
    tagline: 'Deliberate time with an animal.',
    lead: 'Interacting with a familiar animal is associated with oxytocin release and reductions in cortisol and blood pressure. Petting a dog is not a substitute for human contact, but it is a genuine and unusually reliable stress lever.',
    evidence:
      'Beetz et al. (2012) reviewed human-animal interaction studies and found associations with increased oxytocin and reduced cortisol, heart rate and blood pressure.',
    cadenceLabel: 'Daily · 5-10 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Measured stress drop',
        description: 'Cortisol and blood pressure both respond.',
      },
      {
        icon: 'leaf',
        title: 'Oxytocin',
        description: 'The bonding pathway, genuinely engaged.',
      },
      {
        icon: 'target',
        title: 'Present-moment',
        description: 'Animals are a good excuse not to think.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Immediate',
        description: 'The effect arrives during the interaction.',
      },
      {
        when: 'Week 2',
        title: 'A reliable reset',
        description: 'You start using it deliberately.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Built into the day.',
        peak: true,
      },
    ],
    howToStart: [
      'Pet your animal for 30 seconds.',
      'Phone down — the benefit is in the attention.',
      'No pet? Borrow a dog, or walk one for a neighbour.',
    ],
    sources: [
      {
        authors: 'Beetz A, Uvnäs-Moberg K, Julius H, Kotrschal K',
        title:
          'Psychosocial and psychophysiological effects of human-animal interactions: the possible role of oxytocin',
        journal: 'Frontiers in Psychology',
        year: '2012',
      },
    ],
  },

  'Quality Partner Time': {
    tagline: 'Undistracted time with your partner.',
    lead: 'Gottman’s long-running observational work points at the accumulation of small positive moments rather than grand gestures as what distinguishes stable couples. Undistracted is the operative word — a phone on the table halves the value.',
    cadenceLabel: 'Daily · 20 min undistracted',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Small moments accumulate',
        description: 'The pattern Gottman’s work keeps identifying.',
      },
      {
        icon: 'wave',
        title: 'Undistracted matters',
        description: 'Presence is the ingredient, not duration.',
      },
      {
        icon: 'leaf',
        title: 'Prevents drift',
        description: 'Couples grow apart in the gaps.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Notice the pull',
        description: 'The phone reflex is strong.',
      },
      {
        when: 'Week 3',
        title: 'Conversations deepen',
        description: 'Attention changes what gets said.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A protected slot in the evening.',
        peak: true,
      },
    ],
    howToStart: [
      'Ask your partner "how was your day?" with your phone down.',
      'Phones in another room. Not face-down on the table.',
      'Twenty minutes daily beats one long evening a fortnight.',
    ],
    sources: [
      {
        authors: 'Gottman JM, Silver N',
        title: 'The Seven Principles for Making Marriage Work',
        journal: 'Crown',
        year: '1999',
      },
    ],
  },

  'Stress-Reducing Conversation': {
    tagline: 'Twenty minutes on the day, no problem-solving.',
    lead: 'The Gottman version of this has a specific rule that makes it work: you are supporting each other about stress from outside the relationship, and you are not solving anything. Advice is what turns a debrief into an argument.',
    cadenceLabel: 'Daily · 20 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Stress offloaded',
        description: 'Being heard does the work.',
      },
      {
        icon: 'target',
        title: 'No solving',
        description: 'The rule that keeps it from becoming a fight.',
      },
      {
        icon: 'leaf',
        title: 'A team, not a fixer',
        description: 'You end up allied against outside stress.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Advice slips out',
        description: 'Not solving is genuinely hard.',
      },
      {
        when: 'Week 3',
        title: 'It becomes a debrief',
        description: 'You both stop bracing for suggestions.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The end-of-day ritual.',
        peak: true,
      },
    ],
    howToStart: [
      'Ask your partner "how was your day?" with your phone down.',
      'Ten minutes each. Listen, sympathise, take their side.',
      'No advice unless explicitly asked. That is the whole discipline.',
    ],
    sources: [
      {
        authors: 'Gottman Institute',
        title: 'The stress-reducing conversation',
        journal: 'Gottman Institute research summaries',
        year: '2020',
      },
    ],
  },

  'Express Daily Appreciation': {
    tagline: 'Tell your partner one thing, daily.',
    lead: 'Gottman’s observational work describes a lopsided ratio of positive to negative interactions in stable couples — roughly five to one. Daily appreciation is the cheapest way to keep the numerator moving.',
    cadenceLabel: 'Daily · one appreciation',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Keeps the ratio up',
        description: 'The pattern that distinguishes stable couples.',
      },
      {
        icon: 'target',
        title: 'Counters taking-for-granted',
        description: 'Familiarity stops things being said.',
      },
      {
        icon: 'wave',
        title: 'Buffers conflict',
        description: 'Goodwill in the bank helps in arguments.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Slightly formal',
        description: 'Saying it deliberately feels odd at first.',
      },
      {
        when: 'Week 3',
        title: 'Genuine',
        description: 'You start noticing things to say.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Appreciation gets voiced, not assumed.',
        peak: true,
      },
    ],
    howToStart: [
      'Tell your partner one thing you appreciate.',
      'Specific and small — the tea, the school run, the patience.',
      'Character beats appearance for this one.',
    ],
    sources: [
      {
        authors: 'Gottman JM',
        title: 'The Marriage Clinic',
        journal: 'W. W. Norton',
        year: '1999',
      },
    ],
  },

  'Love Maps Question': {
    tagline: 'Ask about their inner world.',
    lead: 'Gottman uses "love maps" for how well you know your partner’s internal life — worries, hopes, the current state of their world. It drifts without maintenance, because you stop asking once you assume you already know.',
    cadenceLabel: 'Daily · one question',
    benefitDetails: [
      {
        icon: 'target',
        title: 'You stay current',
        description: 'People change; assumptions do not.',
      },
      {
        icon: 'wave',
        title: 'Signals interest',
        description: 'Being asked about is being valued.',
      },
      {
        icon: 'leaf',
        title: 'Prevents drift',
        description: 'Distance starts as not-knowing.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Surprising answers',
        description: 'You usually know less than you assumed.',
      },
      {
        when: 'Week 3',
        title: 'Real curiosity',
        description: 'The questions get better.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Asking becomes how you relate.',
        peak: true,
      },
    ],
    howToStart: [
      'Ask your partner one curious question.',
      'Go for the inner world: what are they worried about, hoping for.',
      'Listen without turning it into logistics.',
    ],
    sources: [
      {
        authors: 'Gottman Institute',
        title: 'The Sound Relationship House: building love maps',
        journal: 'Gottman Institute research summaries',
        year: '2020',
      },
    ],
  },

  '6-Second Hug': {
    tagline: 'Hug for long enough to mean it.',
    lead: 'Brief social touch is associated with oxytocin release and lower cortisol, and the "six seconds" framing exists because a normal hug is over before any of that engages. The duration is the intervention.',
    cadenceLabel: 'Daily · one 6-second hug',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Oxytocin and lower cortisol',
        description: 'Sustained contact, not a pat.',
      },
      {
        icon: 'leaf',
        title: 'Wordless connection',
        description: 'Works when conversation is not available.',
      },
      {
        icon: 'sparkle',
        title: 'Six seconds',
        description: 'The shortest habit on this list.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels long',
        description: 'Six seconds is much longer than a normal hug.',
      },
      {
        when: 'Week 2',
        title: 'Feels short',
        description: 'You start holding it longer without counting.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Part of arriving and leaving.',
        peak: true,
      },
    ],
    howToStart: [
      'Give one 6-second hug today.',
      'Count if you need to. It is longer than instinct suggests.',
      'Attach it to a moment you already have — leaving, arriving, bed.',
    ],
    sources: [
      {
        authors: 'Gottman JM, Silver N',
        title: 'The Seven Principles for Making Marriage Work',
        journal: 'Crown',
        year: '1999',
      },
    ],
  },

  'Six-Second Kiss': {
    tagline: 'A kiss long enough to register.',
    lead: 'Same mechanism as the extended hug, and the same reason for the specific number — a passing kiss is too brief to do anything. Gottman treats it as a ritual of connection, which is to say a small reliable moment rather than a romantic gesture.',
    cadenceLabel: 'Daily · one 6-second kiss',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Bonding chemistry',
        description: 'Duration is what engages it.',
      },
      {
        icon: 'target',
        title: 'A ritual, not a gesture',
        description: 'Reliability is the point.',
      },
      {
        icon: 'leaf',
        title: 'Interrupts autopilot',
        description: 'Six seconds is impossible to do absent-mindedly.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Awkwardly long',
        description: 'Which tells you how brief the usual one is.',
      },
      {
        when: 'Week 2',
        title: 'Looked forward to',
        description: 'It becomes a moment rather than a formality.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Part of leaving and returning.',
        peak: true,
      },
    ],
    howToStart: [
      'Give your partner one 6-second kiss.',
      'Attach it to a daily transition — the door, bedtime.',
      'Put things down first. It does not work one-handed.',
    ],
    sources: [
      {
        authors: 'Gottman Institute',
        title: 'Rituals of connection',
        journal: 'Gottman Institute research summaries',
        year: '2020',
      },
    ],
  },

  'Weekly Date Night': {
    tagline: 'A protected evening, phones away.',
    lead: 'A recurring date is mostly a scheduling device — it defends couple time from everything else that expands to fill it. Novelty helps, but reliability matters more: the same night every week beats an ambitious plan that keeps slipping.',
    cadenceLabel: 'Weekly · one evening',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Protected time',
        description: 'Otherwise it gets eaten by everything else.',
      },
      {
        icon: 'leaf',
        title: 'Associated with satisfaction',
        description: 'Couple rituals track with relationship quality.',
      },
      {
        icon: 'sparkle',
        title: 'Anticipation',
        description: 'Having it in the diary is part of the benefit.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Logistics',
        description: 'Childcare and calendars are the real work.',
      },
      {
        when: 'Week 4',
        title: 'Assumed',
        description: 'It stops needing to be arranged.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The night is simply reserved.',
        peak: true,
      },
    ],
    howToStart: [
      'Block 30 minutes on the calendar for your partner.',
      'Same night weekly. Reliability beats ambition.',
      'Phones away, and try something new occasionally — novelty helps.',
    ],
    sources: [
      {
        authors: 'Wilcox WB, Dew J',
        title: 'The date night opportunity',
        journal: 'National Marriage Project',
        year: '2012',
      },
    ],
  },

  'Highs and Lows Ritual': {
    tagline: 'Everyone shares a high and a low.',
    lead: 'Family rituals are associated with better wellbeing and stronger bonds, and this one works because it is structured — the question gives people, especially children, a way in that "how was your day?" does not.',
    evidence:
      'Fiese et al. (2002) reviewed 50 years of research on family routines and rituals and found consistent associations with child wellbeing and family cohesion.',
    cadenceLabel: 'Daily · at dinner',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Family cohesion',
        description: 'Rituals are consistently associated with it.',
      },
      {
        icon: 'target',
        title: 'A way in',
        description: 'Structure beats an open question, especially for kids.',
      },
      {
        icon: 'wave',
        title: 'Lows get said',
        description: 'It legitimises mentioning the bad bit.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Eye-rolling',
        description: 'Expect some resistance. Keep going.',
      },
      {
        when: 'Week 3',
        title: 'Genuinely used',
        description: 'People start bringing real things.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Dinner has a shape.',
        peak: true,
      },
    ],
    howToStart: [
      'Ask one person "what was your high today?"',
      'Everyone answers, including you. Model the honesty.',
      'No fixing the lows. Just hear them.',
    ],
    sources: [
      {
        authors: 'Fiese BH, et al.',
        title:
          'A review of 50 years of research on naturally occurring family routines and rituals',
        journal: 'Journal of Family Psychology',
        year: '2002',
      },
    ],
  },

  'Weekly Networking Outreach': {
    tagline: 'Two to five professional messages a week.',
    lead: 'Networking behaviour predicts career outcomes over time — not through any single conversation, but through maintaining a wide enough set of weak ties that opportunities have a route to you. It is maintenance, not hustle.',
    evidence:
      'Wolff & Moser (2009) followed employees over three years and found networking behaviour predicted current salary, salary growth, and career satisfaction.',
    cadenceLabel: 'Weekly · 2-5 contacts',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Predicts career outcomes',
        description: 'Measured longitudinally, not anecdotally.',
      },
      {
        icon: 'sparkle',
        title: 'Compounds quietly',
        description: 'Hundreds of touches a year from minutes a week.',
      },
      {
        icon: 'leaf',
        title: 'Best done before you need it',
        description: 'Asking cold from nowhere rarely works.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Transactional-feeling',
        description: 'Give something and it stops feeling that way.',
      },
      {
        when: 'Month 2',
        title: 'Conversations, not messages',
        description: 'Some turn into real relationships.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'A standing weekly slot.',
        peak: true,
      },
    ],
    howToStart: [
      'Send one professional message.',
      'Lead with something useful to them rather than an ask.',
      'Keep a list so choosing who is never the blocker.',
    ],
    sources: [
      {
        authors: 'Wolff H-G, Moser K',
        title: 'Effects of networking on career success: a longitudinal study',
        journal: 'Journal of Applied Psychology',
        year: '2009',
      },
    ],
  },
};
