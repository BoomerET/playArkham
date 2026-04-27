import type { PlayerCard } from "../types/game";

export const playerDeck: PlayerCard[] = [
  {
    "instanceId": "danielas-wrench-2",
    "name": "Daniela's Wrench",
    "type": "asset",
    "text": ["Daniela Reyes deck only. Fast. Exhaust Daniela's Wrench: Choose an enemy at your location. That enemy engages you and makes an immediate attack. Action:: Fight (combat). You get +2 combat for this attack. If this enemy attacked you this round, this attack deals +1 damage.",],
    "cost": 2,
    "icons": [
      "combat",
      "wild"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Tool",
      "Weapon",
      "Melee"
    ],
    "faction": "guardian",
    "code": "12002",
  },
  {
    "instanceId": "in-harms-way-3",
    "name": "In Harm's Way",
    "type": "treachery",
    "text": ["Revelation - Put In Harm's Way into play in your threat area. Forced - After you deal damage to an enemy: Take 1 damage and place 1 damage on In Harm's Way. If there is 3 or more damage on this card, discard it. Forced - When the game ends: Suffer 1 physical trauma.",],
    "traits": [
      "Flaw"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12003",
  },
  {
    "instanceId": "detectives-intuition-5",
    "name": "Detective's Intuition",
    "type": "event",
    "text": ["Joe Diamond deck only. Gain 2 resources and heal 1 damage or 1 horror. Reaction: After you draw Detective's Intuition during your turn: Reveal it and draw 2 additional cards.",],
    "cost": 0,
    "icons": [
      "willpower",
      "intellect",
      "wild"
    ],
    "traits": [
      "Insight"
    ],
    "faction": "seeker",
    "code": "12005",
  },
  {
    "instanceId": "dead-ends-6",
    "name": "Dead Ends",
    "type": "event",
    "text": ["Forced - When you search your deck and Dead Ends is among the searched cards: Draw it, cancel the effects of the search, and shuffle your deck. Forced - When the game ends or you are eliminated, if this card is in your hand: You earn 2 fewer experience.",],
    "cost": 5,
    "traits": [
      "Blunder"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12006",
  },
  {
    "instanceId": "covert-ops-8",
    "name": "Covert Ops",
    "type": "asset",
    "text": ["Trish Scarborough deck only. Reaction: After you evade an enemy, exhaust Covert Ops: Either draw 1 card, or move to a connecting location.",],
    "cost": 2,
    "icons": [
      "intellect",
      "agility",
      "wild"
    ],
    "traits": [
      "Talent",
      "Illicit"
    ],
    "faction": "rogue",
    "code": "12008",
  },
  {
    "instanceId": "black-chamber-operative-9",
    "name": "Black Chamber Operative",
    "type": "enemy",
    "text": ["Hunter. Prey (Trish Scarborough only). Forced - After you evade Black Chamber Operative: Place 1 of your clues on your location. If you cannot, this enemy readies, engages you, and makes an immediate attack.",],
    "traits": [
      "Humanoid",
      "Coterie"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12009",
  },
  {
    "instanceId": "for-my-next-trick-1",
    "name": "\"For my next trick...\"",
    "type": "event",
    "text": ["Dexter Drake deck only. Search your deck for a [[Spell]] or [[Item]] asset and play it, reducing its cost by 2 <i>(shuffle your deck)</i>. This action does not provoke attacks of opportunity.",],
    "cost": 0,
    "icons": [
      "willpower",
      "agility",
      "wild"
    ],
    "traits": [
      "Spell",
      "Trick"
    ],
    "faction": "mystic",
    "code": "12011",
  },
  {
    "instanceId": "the-necronomicon-2",
    "name": "The Necronomicon",
    "type": "asset",
    "text": ["Revelation - Put The Necronomicon into play in your threat area. It cannot leave play except by the Action: ability below. You cannot play assets or trigger abilities on other assets you control. Action:: Test willpower (5). If you succeed, discard The Necronomicon. If you fail, shuffle it into your deck and take 1 horror.",],
    "slot": "Arcane",
    "traits": [
      "Item",
      "Tome",
      "Cursed"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12012",
  },
  {
    "instanceId": "isabelles-twin-45s-4",
    "name": "Isabelle's Twin .45s",
    "type": "asset",
    "text": ["Isabelle Barnes deck only. Uses (6 ammo). Action: Spend 1 ammo: Fight (combat). You get +1 combat and deal +1 damage for this attack. Reaction: After you resolve the above ability, spend 1 ammo and exhaust Isabelle's Twin .45s: Fight (agility). You get +1 agility and deal +1 damage for this attack.",],
    "cost": 4,
    "icons": [
      "combat",
      "agility",
      "wild"
    ],
    "slot": "Hand x2",
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "faction": "survivor",
    "code": "12014",
  },
  {
    "instanceId": "breaking-point-5",
    "name": "Breaking Point",
    "type": "treachery",
    "text": ["Revelation - Take 1 direct damage. Then, if you have 6 or fewer remaining sanity, take 1 direct damage. Then, if you have 3 or fewer remaining sanity, take 1 direct damage.",],
    "traits": [
      "Hardship"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12015",
  },
  {
    "instanceId": "bodyguard-6",
    "name": "Bodyguard",
    "type": "asset",
    "text": ["Bodyguard may be assigned damage dealt to other investigators at your location. Reaction: When Bodyguard is defeated: Deal 1 damage to an enemy at your location.",],
    "cost": 3,
    "icons": [
      "combat"
    ],
    "slot": "Ally",
    "traits": [
      "Ally"
    ],
    "faction": "guardian",
    "code": "12016",
  },
  {
    "instanceId": "endurance-7",
    "name": "Endurance",
    "type": "asset",
    "text": ["Fast. Spend 1 resource: You get +1 combat for this skill test (+2 combat instead if this is an attac  k or evasion). Fast. Spend 1 resource: You get +1 agility for this skill test (+2 agility instead if this is an attack or evasion).",],
    "cost": 2,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "faction": "guardian",
    "code": "12017",
  },
  {
    "instanceId": "logan-hastings-8",
    "name": "Logan Hastings",
    "type": "asset",
    "text": ["You get +1 combat. Reaction: After you defeat an enemy, exhaust Logan Hastings: Gain 1 resource.",],
    "cost": 4,
    "icons": [
      "combat"
    ],
    "slot": "Ally",
    "traits": [
      "Ally",
      "Hunter"
    ],
    "faction": "guardian",
    "code": "12018"
  },
  {
    "instanceId": "m1911-9",
    "name": "M1911",
    "type": "asset",
    "text": ["Uses (4 ammo). Action: Spend 1 ammo: Fight (combat). You get +1 combat and deal +1 damage for this attack.",],
    "cost": 3,
    "icons": [
      "agility"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "faction": "guardian",
    "code": "12019"
  },
  {
    "instanceId": "machete-0",
    "name": "Machete",
    "type": "asset",
    "text": ["Action:: Fight. You get +1 combat for this attack. If the attacked enemy is the only enemy engaged with you, this attack deals +1 damage.",],
    "cost": 3,
    "icons": [
      "combat"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Weapon",
      "Melee"
    ],
    "faction": "guardian",
    "code": "12020"
  },
  {
    "instanceId": "resilience-1",
    "name": "Resilience",
    "type": "asset",
    "text": [""],
    "cost": 3,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Talent"
    ],
    "faction": "guardian",
    "code": "12021"
  },
  {
    "instanceId": "lesson-learned-2",
    "name": "Lesson Learned",
    "type": "event",
    "text": ["Fast. Play after an enemy attacks you. Discover 1 clue at your location.",],
    "cost": 1,
    "icons": [
      "intellect",
      "combat"
    ],
    "traits": [
      "Insight",
      "Spirit"
    ],
    "faction": "guardian",
    "code": "12022"
  },
  {
    "instanceId": "right-tool-for-the-job-3",
    "name": "Right Tool for the Job",
    "type": "event",
    "text": ["Search the top 9 cards of your deck for a [[Tool]] or [[Weapon]] asset and add it to your hand. Shuffle your deck.",],
    "cost": 1,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Insight"
    ],
    "faction": "guardian",
    "code": "12023"
  },
  {
    "instanceId": "scene-of-the-crime-4",
    "name": "Scene of the Crime",
    "type": "event",
    "text": ["Play only as your first action. Discover 1 clue at your location (2 clues instead if there is an enemy at that location). This action does not provoke attacks of opportunity.",],
    "cost": 2,
    "icons": [
      "intellect",
      "combat"
    ],
    "traits": [
      "Insight",
      "Bold"
    ],
    "faction": "guardian",
    "code": "12024"
  },
  {
    "instanceId": "vicious-blow-5",
    "name": "Vicious Blow",
    "type": "skill",
    "text": ["If this skill test is successful during an attack, that attack deals +1 damage.",],
    "icons": [
      "combat"
    ],
    "traits": [
      "Practiced"
    ],
    "faction": "guardian",
    "code": "12025"
  },
  {
    "instanceId": "counterattack-6",
    "name": "Counterattack",
    "type": "event",
    "text": ["Fast. Play when an enemy attacks an investigator at your location <i>(before resolving that attack)</i>. Cancel that attack. Deal 1 damage to that enemy.",],
    "cost": 1,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Spirit",
      "Tactic"
    ],
    "faction": "guardian",
    "code": "12026"
  },
  {
    "instanceId": "bodyguard-7",
    "name": "Bodyguard",
    "type": "asset",
    "text": ["Bodyguard may be assigned damage dealt to other investigators at your location. Reaction: When Bodyguard is defeated: Deal 2 damage to an enemy at your location.",],
    "cost": 3,
    "icons": [
      "combat",
      "wild"
    ],
    "slot": "Ally",
    "traits": [
      "Ally"
    ],
    "faction": "guardian",
    "code": "12027"
  },
  {
    "instanceId": "sledgehammer-8",
    "name": "Sledgehammer",
    "type": "asset",
    "text": ["Action:: Fight (combat). This attack deals + 1 damage. Action:Action:: Fight (combat). You get +3 combat for this attack. If you succeed, you may exhaust Sledgehammer for this attack to deal +2 damage.",],
    "cost": 3,
    "icons": [
      "combat",
      "combat"
    ],
    "slot": "Hand x2",
    "traits": [
      "Item",
      "Tool",
      "Weapon",
      "Melee"
    ],
    "faction": "guardian",
    "code": "12028"
  },
  {
    "instanceId": "winchester-model-12-9",
    "name": "Winchester Model 12",
    "type": "asset",
    "text": ["Uses (3 ammo). Action: Spend 1 ammo: Fight (combat). You get   +3 combat for this attack. If you succeed, this attack deals +1 damage for each point you succeed by (to a maximum of +4). If you fail and would deal damage to another investigator, this attack deals 1 damage for each point you fail by (to a maximum of 5 damage).",],
    "cost": 4,
    "icons": [
      "combat",
      "combat"
    ],
    "slot": "Hand x2",
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "faction": "guardian",
    "code": "12029"
  },
  {
    "instanceId": "dorothy-simmons-0",
    "name": "Dorothy Simmons",
    "type": "asset",
    "text": ["You get +1 intellect. Reaction: After you successfully   investigate by exactly 1 or 3, exhaust Dorothy Simmons: Gain 1 resource.",],
    "cost": 3,
    "icons": [
      "intellect"
    ],
    "slot": "Ally",
    "traits": [
      "Ally",
      "Miskatonic"
    ],
    "faction": "seeker",
    "code": "12030"
  },
  {
    "instanceId": "fingerprint-kit-1",
    "name": "Fingerprint Kit",
    "type": "asset",
    "text": ["Uses (3 supplies). Action: Exhaust Fingerprint Kit and spend 1 supply: Investigate. You get +1 intellect for this investigation. If you succeed, you discover 1 additional clue at your location.",],
    "cost": 4,
    "icons": [
      "intellect"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Tool"
    ],
    "faction": "seeker",
    "code": "12031"
  },
  {
    "instanceId": "laboratory-assistant-2",
    "name": "Laboratory Assistant",
    "type": "asset",
    "text": ["Your maximum hand size is increased by 2. Reaction: After Laboratory Assistant enters play: Draw 2 cards.",],
    "cost": 2,
    "icons": [
      "intellect"
    ],
    "slot": "Ally",
    "traits": [
      "Ally",
      "Miskatonic",
      "Science"
    ],
    "faction": "seeker",
    "code": "12032"
  },
  {
    "instanceId": "local-map-3",
    "name": "Local Map",
    "type": "asset",
    "text": ["Uses (4 secrets). Action: Spend 1 secret: Investigate (intellect). Investigate a revealed connecting location. You get +1 intellect for this investigation. If you succeed, you may exhaust Local Map to move to that location.",],
    "cost": 3,
    "icons": [
      "agility"
    ],
    "slot": "Hand",
    "traits": [
      "Item"
    ],
    "faction": "seeker",
    "code": "12033"
  },
  {
    "instanceId": "magnifying-glass-4",
    "name": "Magnifying Glass",
    "type": "asset",
    "text": ["Fast. You get +1 intellect while investigating.",],
    "cost": 1,
    "icons": [
      "intellect"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Tool"
    ],
    "faction": "seeker",
    "code": "12034",
    "passiveSkillModifiers": [
      {
        "skill": "intellect",
        "amount": 1,
        "appliesTo": "investigate"
      }
    ]
  },
  {
    "instanceId": "sharp-rhetoric-5",
    "name": "Sharp Rhetoric",
    "type": "asset",
    "text": ["Fast. Spend 1 resource: You get +1 intellect for this skill test (+2 intellect instead if this is an investigation or parley). Fast. Spend 1 resource: You get +1 willpower for this skill test (+2 willpower instead if this is an investigation or parley).",],
    "cost": 2,
    "icons": [
      "willpower",
      "intellect"
    ],
    "traits": [
      "Talent"
    ],
    "faction": "seeker",
    "code": "12035"
  },
  {
    "instanceId": "gather-intel-6",
    "name": "Gather Intel",
    "type": "event",
    "text": ["Fast. Play when an enemy enters your location. Draw 2 cards.",],
    "cost": 1,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Insight"
    ],
    "faction": "seeker",
    "code": "12036"
  },
  {
    "instanceId": "through-the-cracks-7",
    "name": "Through the Cracks",
    "type": "event",
    "text": ["Evade (agility). You get +1 agility for this evasion for each clue you control (to a maximum of +3). If you succeed, you may disengage from each enemy engaged with you and move to a revealed connecting location.",],
    "cost": 3,
    "icons": [
      "agility"
    ],
    "traits": [
      "Insight",
      "Trick"
    ],
    "faction": "seeker",
    "code": "12037"
  },
  {
    "instanceId": "working-a-hunch-8",
    "name": "Working a Hunch",
    "type": "event",
    "text": ["Fast. Play only during your turn. Discover 1 clue at your location.",],
    "cost": 2,
    "icons": [
      "intellect",
      "intellect"
    ],
    "traits": [
      "Insight"
    ],
    "faction": "seeker",
    "code": "12038"
  },
  {
    "instanceId": "deduction-9",
    "name": "Deduction",
    "type": "skill",
    "text": ["If this skill test is successful while investigating a location, discover 1 additional clue at that location.",],
    "icons": [
      "intellect"
    ],
    "traits": [
      "Practiced"
    ],
    "faction": "seeker",
    "code": "12039"
  },
  {
    "instanceId": "mysterious-grimoire-0",
    "name": "Mysterious Grimoire",
    "type": "asset",
    "text": ["Uses (4 secrets). Fast. During your turn, spend 1 or 2 secrets and exhaust Mysterious Grimoire: Search the top 3 cards (or 6 cards instead if you spent 2 secrets) of your deck for a card and draw it. If 1 or more weaknesses are among the searched cards, draw them as well. Shuffle your deck.",],
    "cost": 3,
    "icons": [
      "intellect",
      "intellect"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Tome"
    ],
    "faction": "seeker",
    "code": "12040"
  },
  {
    "instanceId": "through-the-cracks-1",
    "name": "Through the Cracks",
    "type": "event",
    "text": ["Evade (agility). You get +2 agility for this evasion for each clue you control (to a maximum of +6). If you succeed, you may disengage from each enemy engaged with you and move to a revealed connecting location.",],
    "cost": 2,
    "icons": [
      "agility",
      "wild"
    ],
    "traits": [
      "Insight",
      "Trick"
    ],
    "faction": "seeker",
    "code": "12041"
  },
  {
    "instanceId": "studious-2",
    "name": "Studious",
    "type": "asset",
    "text": ["Permanent. You begin each game with 1 additional card in your opening hand.",],
    "traits": [
      "Talent"
    ],
    "faction": "seeker",
    "code": "12042"
  },
  {
    "instanceId": "unbridled-knowledge-3",
    "name": "Unbridled Knowledge",
    "type": "event",
    "text": ["Reveal the top 5 cards of your deck (8 cards instead if you control 2 or more clues). Draw 3 of them and place the rest of those cards on the top and/or bottom of your deck in any order.",],
    "cost": 1,
    "icons": [
      "intellect",
      "intellect",
      "wild"
    ],
    "traits": [
      "Insight"
    ],
    "faction": "seeker",
    "code": "12043"
  },
  {
    "instanceId": "lucky-cigarette-case-4",
    "name": "Lucky Cigarette Case",
    "type": "asset",
    "text": ["Reaction: After you succeed at a skill test by 2 or more, exhaust Lucky Cigarette Case: Draw 1 card.",],
    "cost": 2,
    "icons": [
      "willpower"
    ],
    "slot": "Accessory",
    "traits": [
      "Item",
      "Charm"
    ],
    "faction": "rogue",
    "code": "12044"
  },
  {
    "instanceId": "m1903-hammerless-5",
    "name": "M1903 Hammerless",
    "type": "asset",
    "text": ["Uses (4 ammo). Action: Spend 1 ammo: Fight (agility). If the targeted enemy is exhausted, this attack deals +1 damage.",],
    "cost": 3,
    "icons": [
      "agility"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "faction": "rogue",
    "code": "12045"
  },
  {
    "instanceId": "olivier-bishop-6",
    "name": "Olivier Bishop",
    "type": "asset",
    "text": ["You get +1 agility. Fast. During your turn, exhaust Olivier Bishop: Move to a connecting location.",],
    "cost": 4,
    "icons": [
      "agility"
    ],
    "slot": "Ally",
    "traits": [
      "Ally",
      "Criminal",
      "Socialite"
    ],
    "faction": "rogue",
    "code": "12046"
  },
  {
    "instanceId": "silver-tongue-7",
    "name": "Silver Tongue",
    "type": "asset",
    "text": ["Fast. Spend 1 resource: You get +1 intellect for this skill test (+2 intellect instead if this is an evasion or parley). Fast. Spend 1 resource: You get +1 agility for this skill test (+2 agility instead if this is an evasion or parley).",],
    "cost": 2,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "faction": "rogue",
    "code": "12047"
  },
  {
    "instanceId": "sticky-fingers-8",
    "name": "Sticky Fingers",
    "type": "asset",
    "text": ["Limit 1 per investigator. Reaction: After you successfully evade an enemy, exhaust Sticky Fingers: Gain 1 resource.",],
    "cost": 1,
    "icons": [
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "faction": "rogue",
    "code": "12048"
  },
  {
    "instanceId": "thieves-kit-9",
    "name": "Thieves' Kit",
    "type": "asset",
    "text": ["Uses (6 supplies). Action: Spend 1 supply: Investigate. You may use agility instead of intellect for this investigation. If you succeed, gain 1 resource.",],
    "cost": 3,
    "icons": [
      "intellect"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Tool",
      "Illicit"
    ],
    "faction": "rogue",
    "code": "12049"
  },
  {
    "instanceId": "breaking-and-entering-0",
    "name": "Breaking and Entering",
    "type": "event",
    "text": ["Investigate. Add your agility value to your skill value for this investigation. If you succeed by 2 or more, you may automatically evade an enemy at this location. This action does not provoke attacks of opportunity.",],
    "cost": 2,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Trick"
    ],
    "faction": "rogue",
    "code": "12050"
  },
  {
    "instanceId": "paint-the-town-red-1",
    "name": "Paint the Town Red",
    "type": "event",
    "text": ["Parley. Search the top 9 cards of the encounter deck for a non-[[Elite]] enemy, draw it, and gain resources equal to that enemy's printed health. Shuffle the encounter deck.",],
    "cost": 0,
    "icons": [
      "willpower",
      "agility"
    ],
    "traits": [
      "Fortune",
      "Gambit"
    ],
    "faction": "rogue",
    "code": "12051"
  },
  {
    "instanceId": "prestidigitation-2",
    "name": "Prestidigitation",
    "type": "event",
    "text": ["Fast. Play only during your turn. Play an [[Item]] asset from your hand, reducing its cost by 2. When your turn ends, return an [[Item]] asset you control to your hand.",],
    "cost": 1,
    "icons": [
      "willpower",
      "agility"
    ],
    "traits": [
      "Trick"
    ],
    "faction": "rogue",
    "code": "12052"
  },
  {
    "instanceId": "out-of-sight-3",
    "name": "Out of Sight",
    "type": "skill",
    "text": ["Max 1 committed per skill test. If this test is successful by 2 or more, the performing investigator may disengage from each enemy and move to a revealed connecting location.",],
    "icons": [
      "agility"
    ],
    "traits": [
      "Practiced"
    ],
    "faction": "rogue",
    "code": "12053"
  },
  {
    "instanceId": "sticky-fingers-4",
    "name": "Sticky Fingers",
    "type": "asset",
    "text": ["Fast. Limit 1 per investigator. Reaction: After you successfully evade an enemy, exhaust Sticky Fingers: Gain 1 resource.",],
    "cost": 1,
    "icons": [
      "agility",
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "faction": "rogue",
    "code": "12054"
  },
  {
    "instanceId": "decisive-strike-5",
    "name": "Decisive Strike",
    "type": "event",
    "text": ["Fight (combat). You get +2 combat and deal +1 damage for this attack. If this attack defeats an enemy, gain 5 resources.",],
    "cost": 2,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Tactic",
      "Gambit"
    ],
    "faction": "rogue",
    "code": "12055"
  },
  {
    "instanceId": "another-day-another-dollar-6",
    "name": "Another Day, Another Dollar",
    "type": "asset",
    "text": ["Permanent. You begin each game with 2 additional resources.",],
    "traits": [
      "Talent"
    ],
    "faction": "rogue",
    "code": "12056"
  },
  {
    "instanceId": "out-of-sight-7",
    "name": "Out of Sight",
    "type": "skill",
    "text": ["Max 1 committed per skill test. If this test is successful by 1 or more, the performing investigator may disengage from each enemy and move to a revealed location up to 2 connections away.",],
    "icons": [
      "agility",
      "agility",
      "agility"
    ],
    "traits": [
      "Practiced",
      "Expert"
    ],
    "faction": "rogue",
    "code": "12057"
  },
  {
    "instanceId": "cloak-of-resonance-8",
    "name": "Cloak of Resonance",
    "type": "asset",
    "text": ["Reaction: When horror is placed on Cloak of Resonance, exhaust it: Deal 1 damage to an enemy at your location.",],
    "cost": 3,
    "icons": [
      "willpower"
    ],
    "slot": "Body",
    "traits": [
      "Item",
      "Clothing",
      "Alchemy"
    ],
    "faction": "mystic",
    "code": "12058"
  },
  {
    "instanceId": "cosmic-flame-9",
    "name": "Cosmic Flame",
    "type": "asset",
    "text": ["Uses (3 charges). Action:: Fight (willpower). If you succeed, you may spend 1 charge to deal +1 damage for this attack. If you reveal a [skull] token during this test, remove 1 charge from Cosmic Flame (if you cannot, take 1 damage and discard this card).",],
    "cost": 3,
    "icons": [
      "combat"
    ],
    "slot": "Arcane",
    "traits": [
      "Spell"
    ],
    "faction": "mystic",
    "code": "12059"
  },
  {
    "instanceId": "jim-culver-0",
    "name": "Jim Culver",
    "type": "asset",
    "text": ["You get +1 willpower. Reaction: After you take damage and/or horror, exhaust Jim Culver: Draw 1 card.",],
    "cost": 4,
    "icons": [
      "willpower"
    ],
    "slot": "Ally",
    "traits": [
      "Ally",
      "Performer"
    ],
    "faction": "mystic",
    "code": "12060"
  },
  {
    "instanceId": "lucky-charm-1",
    "name": "Lucky Charm",
    "type": "asset",
    "text": ["Uses (4 charges). Fast. Spend 1 charge and exhaust Lucky Charm: Move 1 damage or 1 horror from a card at your location to a card you control <i>(with a health or sanity value)</i>.",],
    "cost": 2,
    "icons": [
      "willpower"
    ],
    "slot": "Accessory",
    "traits": [
      "Item",
      "Charm",
      "Blessed"
    ],
    "faction": "mystic",
    "code": "12061"
  },
  {
    "instanceId": "second-sight-2",
    "name": "Second Sight",
    "type": "asset",
    "text": ["Uses (3 charges). Action:: Investigate (willpower). If you succeed, you may spend 1 charge to discover 1 additional clue at your location. If you reveal a [cultist] token during this test, remove 1 charge from Second Sight (if you cannot, take 1 horror and discard this card).",],
    "cost": 4,
    "icons": [
      "intellect"
    ],
    "slot": "Arcane",
    "traits": [
      "Spell"
    ],
    "faction": "mystic",
    "code": "12062"
  },
  {
    "instanceId": "spiritual-intuition-3",
    "name": "Spiritual Intuition",
    "type": "asset",
    "text": ["Fast. Spend 1 resource: You get +1 willpower for this skill test (+2 willpower instead if this test is on a [[Spell]] or [[Ritual]] card). Fast. Spend 1 resource: You get +1 combat for this skill test (+2 combat instead if this test is on a [[Spell]] or [[Ritual]] card).",],
    "cost": 2,
    "icons": [
      "willpower",
      "combat"
    ],
    "traits": [
      "Talent"
    ],
    "faction": "mystic",
    "code": "12063"
  },
  {
    "instanceId": "premonition-4",
    "name": "Premonition",
    "type": "event",
    "text": ["Fast. Play during any Fast. player window. Put Premonition into play, reveal a random chaos token from the chaos bag, and seal it on Premonition. Forced - When a chaos token would be revealed from the chaos bag: Resolve the token sealed here as if it were just revealed from the chaos bag, instead. Then, discard Premonition.",],
    "cost": 0,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Augury"
    ],
    "faction": "mystic",
    "code": "12064"
  },
  {
    "instanceId": "ward-of-protection-5",
    "name": "Ward of Protection",
    "type": "event",
    "text": ["Fast. Play when you draw a non-weakness treachery card. Cancel that card's revelation effect. Then, take 1 horror.",],
    "cost": 1,
    "icons": [
      "wild"
    ],
    "traits": [
      "Spell",
      "Spirit"
    ],
    "faction": "mystic",
    "code": "12065"
  },
  {
    "instanceId": "will-of-the-cosmos-6",
    "name": "Will of the Cosmos",
    "type": "event",
    "text": ["Place 1 doom on a player card you control. Then, discover 1 clue at your location and 1 clue at another revealed location.",],
    "cost": 0,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Insight",
      "Augury"
    ],
    "faction": "mystic",
    "code": "12066"
  },
  {
    "instanceId": "soul-link-7",
    "name": "Soul Link",
    "type": "skill",
    "text": ["As an additional cost to commit Soul Link, take 1 horror.",],
    "icons": [
      "wild",
      "wild",
      "wild"
    ],
    "traits": [
      "Innate",
      "Spell"
    ],
    "faction": "mystic",
    "code": "12067"
  },
  {
    "instanceId": "mask-of-silenus-8",
    "name": "Mask of Silenus",
    "type": "asset",
    "text": ["Uses (3 charges). Reaction: When you would reveal a chaos token, spend 1 charge: Reveal 1 additional token. Choose 1 of those tokens to resolve and ignore the other. If you resolved a token with a symbol, take 1 horror.",],
    "cost": 3,
    "icons": [
      "wild"
    ],
    "slot": "Head",
    "traits": [
      "Item",
      "Mask",
      "Relic",
      "Cursed"
    ],
    "faction": "mystic",
    "code": "12068"
  },
  {
    "instanceId": "fearless-9",
    "name": "Fearless",
    "type": "skill",
    "text": ["If this skill test is successful, heal 1 horror (2 horror instead if it succeeds by 2 or more).",],
    "icons": [
      "willpower",
      "willpower"
    ],
    "traits": [
      "Innate",
      "Developed"
    ],
    "faction": "mystic",
    "code": "12069"
  },
  {
    "instanceId": "augur-of-elokoss-0",
    "name": "Augur of Elokoss",
    "type": "event",
    "text": ["Investigate (intellect). Add your willpower to your intellect for this investigation. If you succeed, discover 1 additional clue at your location. If you succeed and a token with a symbol was revealed during this test, you may discard a [[Terror]] or [[Hex]] treachery from any investigator's threat area.",],
    "cost": 2,
    "icons": [
      "willpower",
      "intellect",
      "wild"
    ],
    "traits": [
      "Spell",
      "Augury"
    ],
    "faction": "mystic",
    "code": "12070"
  },
  {
    "instanceId": "cosmic-flame-1",
    "name": "Cosmic Flame",
    "type": "asset",
    "text": ["Uses (4 charges). Action:: Fight (willpower). You get +2 willpower and deal +1 damage for this attack. If you succeed, you may spend 1 charge to deal 1 damage to an enemy at your location. If you reveal a [skull] token during this test, remove 1 charge from Cosmic Flame (if you cannot, take 1 damage and discard this card)."],
    "cost": 3,
    "icons": [
      "willpower",
      "combat",
      "wild"
    ],
    "slot": "Arcane",
    "traits": [
      "Spell"
    ],
    "faction": "mystic",
    "code": "12071"
  },
  {
    "instanceId": "aleksey-saburov-2",
    "name": "Aleksey Saburov",
    "type": "asset",
    "text": ["Reaction: When your turn begins: Heal 1 damage or 1 horror from Aleksey Saburov.",],
    "cost": 3,
    "icons": [
      "willpower"
    ],
    "slot": "Ally",
    "traits": [
      "Ally"
    ],
    "faction": "survivor",
    "code": "12072"
  },
  {
    "instanceId": "bandages-3",
    "name": "Bandages",
    "type": "asset",
    "text": ["Uses (3 supplies). If Bandages has no supplies, discard it. Reaction: After an investigator or [[Ally]] asset at your location takes 1 or more damage, spend 1 supply: Heal 1 damage from that card.",],
    "cost": 2,
    "icons": [
      "agility"
    ],
    "traits": [
      "Item"
    ],
    "faction": "survivor",
    "code": "12073"
  },
  {
    "instanceId": "hunters-instinct-4",
    "name": "Hunter's Instinct",
    "type": "asset",
    "text": ["Limit 1 per investigator. Uses (3 supplies). If there are no supplies on Hunter's Instinct, discard it. Reaction: After you engage an enemy, spend 1 supply and exhaust Hunter's Instinct: Add a level 0 event in your discard pile to your hand.",],
    "cost": 2,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "faction": "survivor",
    "code": "12074"
  },
  {
    "instanceId": "jumpsuit-5",
    "name": "Jumpsuit",
    "type": "asset",
    "text": ["Fast. During your turn, discard Jumpsuit: Choose a [[Tool]] or [[Weapon]] asset in your discard pile and add it to your hand.",],
    "cost": 1,
    "icons": [
      "combat"
    ],
    "slot": "Body",
    "traits": [
      "Item",
      "Clothing"
    ],
    "faction": "survivor",
    "code": "12075"
  },
  {
    "instanceId": "levelheaded-6",
    "name": "Levelheaded",
    "type": "asset",
    "text": ["Fast. Spend 1 resource: You get +1 willpower for this skill test (+2 willpower instead if this test is on a scenario card). Fast. Spend 1 resource: You get +1 agility for this skill test (+2 agility instead if this test is on a scenario card).",],
    "cost": 2,
    "icons": [
      "willpower",
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "faction": "survivor",
    "code": "12076"
  },
  {
    "instanceId": "meat-cleaver-7",
    "name": "Meat Cleaver",
    "type": "asset",
    "text": ["Action:: Fight. You get +1 combat for this attack (+2 combat instead if you have 3 or fewer remaining sanity). If this attack defeats an enemy, you may heal 1 horror. As an additional cost to initiate this ability, you may take 1 horror to have this attack deal +1 damage.",],
    "cost": 3,
    "icons": [
      "willpower"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Weapon",
      "Melee"
    ],
    "faction": "survivor",
    "code": "12077"
  },
  {
    "instanceId": "look-what-i-found-8",
    "name": "\"Look what I found!\"",
    "type": "event",
    "text": ["Fast. Play after you fail a skill test by 2 or less while investigating. Discover 2 clues in your location.",],
    "cost": 2,
    "icons": [
      "intellect",
      "intellect"
    ],
    "traits": [
      "Fortune"
    ],
    "faction": "survivor",
    "code": "12078"
  },
  {
    "instanceId": "shove-off-9",
    "name": "\"Shove off!\"",
    "type": "event",
    "text": ["Evade (agility). If you succeed, deal 1 damage to the evaded enemy. If you fail, return \"Shove off!\" to your hand at the end of your turn.",],
    "cost": 1,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Tactic"
    ],
    "faction": "survivor",
    "code": "12079"
  },
  {
    "instanceId": "slippery-0",
    "name": "Slippery",
    "type": "skill",
    "text": ["If this skill test is successful while evading a non-[[Elite]] enemy, that enemy does not ready during the next upkeep phase.",],
    "icons": [
      "agility"
    ],
    "traits": [
      "Practiced"
    ],
    "faction": "survivor",
    "code": "12080"
  },
  {
    "instanceId": "timely-intervention-1",
    "name": "Timely Intervention",
    "type": "skill",
    "text": ["Max 1 committed per skill test. You may commit Timely Intervention from your hand after revealing chaos tokens during a skill test you are performing.",],
    "icons": [
      "willpower",
      "agility",
      "wild"
    ],
    "traits": [
      "Fortune"
    ],
    "faction": "survivor",
    "code": "12081"
  },
  {
    "instanceId": "scrape-by-2",
    "name": "Scrape By",
    "type": "event",
    "text": ["Fast. Play when you would fail a skill test during which a non-[auto_fail] token was revealed. You succeed at that skill test instead. If a token with a symbol was revealed during that skill test, take 1 horror.",],
    "cost": 1,
    "icons": [
      "wild"
    ],
    "traits": [
      "Fortune"
    ],
    "faction": "survivor",
    "code": "12082"
  },
  {
    "instanceId": "old-compass-3",
    "name": "Old Compass",
    "type": "asset",
    "text": ["Action:: Investigate (intellect). Your location gets -1 shroud for this investigation. If you fail, you may exhaust Old Compass to attempt this test again. If you do, your location gets -2 shroud for this investigation, instead."],
    "cost": 2,
    "icons": [
      "intellect",
      "intellect"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Tool"
    ],
    "faction": "survivor",
    "code": "12083"
  },
  {
    "instanceId": "on-the-brink-4",
    "name": "On the Brink",
    "type": "skill",
    "text": ["Max 1 committed per skill test. If this test fails, return each other card committed to this test to its owner's hand and draw 1 card."],
    "icons": [
      "wild",
      "wild"
    ],
    "traits": [
      "Gambit",
      "Desperate"
    ],
    "faction": "survivor",
    "code": "12084"
  },
  {
    "instanceId": "meat-cleaver-5",
    "name": "Meat Cleaver",
    "type": "asset",
    "text": ["Action:: Fight (combat). You get +2 combat for this attack (+3 combat instead if you have 3 or fewer remaining sanity). If this attack defeats an enemy, you may heal 1 horror. Reaction: When you trigger the above Action: ability, take 1 horror: This attack deals +1 damage.",],
    "cost": 2,
    "icons": [
      "willpower",
      "combat",
      "wild"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Weapon",
      "Melee"
    ],
    "faction": "survivor",
    "code": "12085"
  },
  {
    "instanceId": "broken-bottle-6",
    "name": "Broken Bottle",
    "type": "asset",
    "text": ["Action:: Fight (combat). You get +1 combat for this attack. If you succeed, you may discard Broken Bottle to deal +1 damage for this attack.",],
    "cost": 1,
    "icons": [
      "combat"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Weapon",
      "Melee",
      "Improvised"
    ],
    "faction": "neutral",
    "code": "12086"
  },
  {
    "instanceId": "fedora-7",
    "name": "Fedora",
    "type": "asset",
    "text": ["Fast. During your turn, discard Fedora: Gain 1 experience. If you do, move to an adjacent location.",],
    "cost": 2,
    "icons": [
      "agility"
    ],
    "slot": "Head",
    "traits": [
      "Item",
      "Apparel",
      "Headwear"
    ],
    "faction": "neutral",
    "code": "12087"
  },
  {
    "instanceId": "hand-crank-flashlight-8",
    "name": "Hand-Crank Flashlight",
    "type": "asset",
    "text": ["Action:: Investigate (intellect). You get +1 intellect for this test. If you succeed, you may discard Hand-Crank Flashlight for your location to get -1 shroud until the end of the round.",],
    "cost": 1,
    "icons": [
      "intellect"
    ],
    "slot": "Hand",
    "traits": [
      "Item",
      "Tool"
    ],
    "faction": "neutral",
    "code": "12088"
  },
  {
    "instanceId": "emergency-cache-9",
    "name": "Emergency Cache",
    "type": "event",
    "text": ["Gain 3 resources.",],
    "cost": 0,
    "traits": [
      "Supply"
    ],
    "faction": "neutral",
    "code": "12089"
  },
  {
    "instanceId": "guts-0",
    "name": "Guts",
    "type": "skill",
    "text": ["Max 1 committed per skill test. If this test is successful, draw 1 card.",],
    "icons": [
      "willpower",
      "willpower"
    ],
    "traits": [
      "Innate"
    ],
    "faction": "neutral",
    "code": "12090"
  },
  {
    "instanceId": "manual-dexterity-1",
    "name": "Manual Dexterity",
    "type": "skill",
    "text": ["Max 1 committed per skill test. If this test is successful, draw 1 card.",],
    "icons": [
      "agility",
      "agility"
    ],
    "traits": [
      "Innate"
    ],
    "faction": "neutral",
    "code": "12091"
  },
  {
    "instanceId": "overpower-2",
    "name": "Overpower",
    "type": "skill",
    "text": ["Max 1 committed per skill test. If this test is successful, draw 1 card.",],
    "icons": [
      "combat",
      "combat"
    ],
    "traits": [
      "Practiced"
    ],
    "faction": "neutral",
    "code": "12092"
  },
  {
    "instanceId": "perception-3",
    "name": "Perception",
    "type": "skill",
    "text": ["Max 1 committed per skill test. If this test is successful, draw 1 card.",],
    "icons": [
      "intellect",
      "intellect"
    ],
    "traits": [
      "Practiced"
    ],
    "faction": "neutral",
    "code": "12093"
  },
  {
    "instanceId": "unexpected-courage-4",
    "name": "Unexpected Courage",
    "type": "skill",
    "text": ["Max 1 committed per skill test."],
    "icons": [
      "wild",
      "wild"
    ],
    "traits": [
      "Innate"
    ],
    "faction": "neutral",
    "code": "12094"
  },
  {
    "instanceId": "charisma-5",
    "name": "Charisma",
    "type": "asset",
    "text": ["Permanent. You have 1 additional ally slot."],
    "traits": [
      "Talent"
    ],
    "faction": "neutral",
    "code": "12095"
  },
  {
    "instanceId": "relic-hunter-6",
    "name": "Relic Hunter",
    "type": "asset",
    "text": ["Permanent. You have 1 additional accessory slot."],
    "traits": [
      "Talent"
    ],
    "faction": "neutral",
    "code": "12096"
  },
  {
    "instanceId": "amnesia-7",
    "name": "Amnesia",
    "type": "treachery",
    "text": ["Revelation - Choose and discard all but 1 card from your hand."],
    "traits": [
      "Madness"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12097"
  },
  {
    "instanceId": "the-gold-bug-8",
    "name": "The Gold Bug",
    "type": "asset",
    "text": ["Revelation - Put The Gold Bug into play in your threat area. It cannot leave play except by the Action: ability below. You get -1 health and -1 sanity. Action:: Shuffle the Gold Bug into your deck."],
    "slot": "Accessory",
    "traits": [
      "Item",
      "Relic",
      "Alchemy",
      "Cursed"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12098"
  },
  {
    "instanceId": "the-nameless-lurker-9",
    "name": "The Nameless Lurker",
    "type": "enemy",
    "text": ["Aloof. Spawn - Farthest empty location. Forced - When the investigation phase ends, if The Nameless Lurker is ready and has no doom on it: Place 1 doom on it."],
    "traits": [
      "Humanoid",
      "Monster"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12099"
  },
  {
    "instanceId": "overzealous-0",
    "name": "Overzealous",
    "type": "treachery",
    "text": ["Revelation - Draw the top card of the encounter deck. That card gains surge."],
    "traits": [
      "Flaw"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12100"
  },
  {
    "instanceId": "paranoia-1",
    "name": "Paranoia",
    "type": "treachery",
    "text": ["Revelation - Discard all your resources."],
    "traits": [
      "Madness"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12101"
  },
  {
    "instanceId": "pursued-2",
    "name": "Pursued",
    "type": "treachery",
    "text": ["Revelation - Put Pursued into play in your threat area. Forced - After an enemy enters <i>(moves into or spawns at)</i> your location: Take 1 horror. Action:Action:: Discard Pursued."],
    "traits": [
      "Terror"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12102"
  },
  {
    "instanceId": "syndicate-obligations-3",
    "name": "Syndicate Obligations",
    "type": "treachery",
    "text": ["Revelation - Put Syndicate Obligations into play in your threat area. Forced - After you spend 1 or more resources: Take 1 damage. Action:Action:: Discard Syndicate Obligations."],
    "traits": [
      "Pact",
      "Syndicate"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12103"
  },
  {
    "instanceId": "wounded-4",
    "name": "Wounded",
    "type": "treachery",
    "text": ["Revelation - Put Wounded into play in your threat area. Forced - The first time you move each turn: Take 1 damage. Action:Action:: Discard Wounded."],
    "traits": [
      "Injury"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12104"
  },
  {
    "instanceId": "becky-1",
    "name": "Becky",
    "type": "asset",
    "text": [
      "Tommy Muldoon deck only. Uses (2 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +2 [combat] and deal +1 damage for this attack.",
      "[reaction] When you trigger the above [action] ability, exhaust Becky: This attack ignores the aloof and retaliate keywords."
    ],
    "traits": [
      "Item. Weapon. Firearm."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60152"
  },
  {
    "instanceId": "loose-cannon-1",
    "name": "Loose Cannon",
    "type": "treachery",
    "text": [
      "<b>Revelation</b> - You must either discard each [[Firearm]] asset you control or lose 5 resources."
    ],
    "traits": [
      "Flaw."
    ],
    "icons": [],
    "faction": "neutral",
    "isWeakness": true,
    "code": "60153"
  },
  {
    "instanceId": "overconfident-1",
    "name": "Overconfident",
    "type": "treachery",
    "text": [
      "<b>Revelation</b> - Put Overconfident into play in your threat area.",
      "<b>Forced</b> - After you fail a skill test: Take 1 damage.",
      "[action] [action]: Discard Overconfident."
    ],
    "traits": [
      "Flaw."
    ],
    "icons": [],
    "faction": "neutral",
    "isWeakness": true,
    "code": "60154"
  },
  {
    "instanceId": "m1911-1",
    "name": "M1911",
    "type": "asset",
    "text": [
      "Uses (4 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +1 [combat] and deal +1 damage for this attack."
    ],
    "traits": [
      "Item. Weapon. Firearm."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60155"
  },
  {
    "instanceId": "police-dog-1",
    "name": "Police Dog",
    "type": "asset",
    "text": [
      "[fast] During an attack or investigation at your location, exhaust Police Dog: The performing investigator gets +1 skill value for this test."
    ],
    "traits": [
      "Ally. Creature. Police."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60156"
  },
  {
    "instanceId": "rookie-cop-1",
    "name": "Rookie Cop",
    "type": "asset",
    "text": [
      "Rookie Cop may be assigned damage and/or horror dealt to other investigators at your location.",
      "[reaction] When Rookie Cop is defeated: Discover 1 clue at your location."
    ],
    "traits": [
      "Ally. Police."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60157"
  },
  {
    "instanceId": "service-revolver-1",
    "name": "Service Revolver",
    "type": "asset",
    "text": [
      "Uses (3 ammo).",
      "[reaction] After an enemy attacks you, spend 1 ammo: <b>Fight</b> ([combat]). This attack targets that enemy. You get +1 [combat] and deal +1 damage for this attack."
    ],
    "traits": [
      "Item. Weapon. Firearm. Police."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60158"
  },
  {
    "instanceId": "protective-vest-1",
    "name": "Protective Vest",
    "type": "asset",
    "text": [
      "[reaction] After you play Protective Vest: Search the top 6 cards of your deck for a [[Firearm]] or [[Upgrade]] card and add it to your hand. Shuffle your deck."
    ],
    "traits": [
      "Item. Armor."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60159"
  },
  {
    "instanceId": "make-em-sing-1",
    "name": "\"Make 'em sing\"",
    "type": "event",
    "text": [
      "<b>Parley.</b> Choose an enemy at your location and test [combat] (X), where X is that enemy's remaining health. If you succeed, automatically evade that enemy and discover 1 clue at your location."
    ],
    "traits": [
      "Tactic."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60160"
  },
  {
    "instanceId": "bounty-1",
    "name": "Bounty",
    "type": "event",
    "text": [
      "Fast. Play after an enemy at your location is defeated.",
      "Investigators at your location gain a total of X resources, distributed as your wish. X is that enemy's printed health (to a maximum of 6)."
    ],
    "traits": [
      "Fortune."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60161"
  },
  {
    "instanceId": "custom-grip-1",
    "name": "Custom Grip",
    "type": "event",
    "text": [
      "Fast. Play only during your turn.",
      "Attach to a [[Firearm]] asset you control.",
      "[fast] During your turn, except during an action, discard Custom Grip: Return attached asset to your hand. You may play a [[Firearm]] asset from your hand <i>(paying its cost)</i>."
    ],
    "traits": [
      "Upgrade."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60162"
  },
  {
    "instanceId": "iron-sights-1",
    "name": "Iron Sights",
    "type": "event",
    "text": [
      "Fast. Play only during your turn.",
      "Attach to a [[Firearm]] asset you control.",
      "[action] Exhaust Iron Sights: You get +3 skill value the next time you fight using attached asset this turn. This action does not provoke attacks of opportunity."
    ],
    "traits": [
      "Item. Upgrade."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60163"
  },
  {
    "instanceId": "physical-fitness-1",
    "name": "Physical Fitness",
    "type": "event",
    "text": [
      "<b>Move.</b> After this move, heal 2 damage."
    ],
    "traits": [
      "Spirit."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60164"
  },
  {
    "instanceId": "restrained-1",
    "name": "Restrained",
    "type": "event",
    "text": [
      "Fast. Play after a non-[[Elite]] enemy attacks you.",
      "Automatically evade that enemy and attach Restrained to it. Attached enemy cannot ready.",
      "<b>Forced</b> - When the round ends, if attached enemy is not a [[Humanoid]]: Discard Restrained."
    ],
    "traits": [
      "Tactic."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60165"
  },
  {
    "instanceId": "stakeout-1",
    "name": "Stakeout",
    "type": "event",
    "text": [
      "<b>Investigate</b> ([intellect]). You get +2 [intellect] for this investigation. If you succeed, heal 1 horror."
    ],
    "traits": [
      "Tactic."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60166"
  },
  {
    "instanceId": "adapt-and-overcome-1",
    "name": "Adapt and Overcome",
    "type": "skill",
    "text": [
      "Commit only to a skill test during an attack or evasion.",
      "The performing investigator ignores the alert and retaliate keywords during this test."
    ],
    "traits": [
      "Practiced."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60167"
  },
  {
    "instanceId": "armed-to-the-teeth-1",
    "name": "Armed to the Teeth",
    "type": "skill",
    "text": [
      "While it is committed to a skill test on an [[Item]] asset you control, Armed to the Teeth gains [wild] [wild]."
    ],
    "traits": [
      "Practiced."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60168"
  },
  {
    "instanceId": "vicious-blow-1",
    "name": "Vicious Blow",
    "type": "skill",
    "text": [
      "If this skill test is successful during an attack, that attack deals +1 damage."
    ],
    "traits": [
      "Practiced."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60169"
  },
  {
    "instanceId": "police-dog-1",
    "name": "Police Dog",
    "type": "asset",
    "text": [
      "[fast] During an attack or investigation at your location, exhaust Police Dog: The performing investigator gets +2 skill value for this test."
    ],
    "traits": [
      "Ally. Creature. Police."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60170"
  },
  {
    "instanceId": "m1911-1",
    "name": "M1911",
    "type": "asset",
    "text": [
      "Uses (4 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +2 [combat] and deal +1 damage for this attack. Ignore the retaliate keyword for this attack."
    ],
    "traits": [
      "Item. Weapon. Firearm."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60171"
  },
  {
    "instanceId": "extended-barrel-1",
    "name": "Extended Barrel",
    "type": "event",
    "text": [
      "Fast. Play only during your turn.",
      "Attach to a [[Firearm]] asset you control.",
      "You get +1 skill value while attacking with attached asset."
    ],
    "traits": [
      "Item. Upgrade."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60172"
  },
  {
    "instanceId": "on-the-beat-1",
    "name": "On the Beat",
    "type": "event",
    "text": [
      "Fast. Play when your turn begins.",
      "Until the end of your turn, you get +3 skill value while investigating or parleying."
    ],
    "traits": [
      "Tactic. Police."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60173"
  },
  {
    "instanceId": "physical-fitness-1",
    "name": "Physical Fitness",
    "type": "event",
    "text": [
      "<b>Move.</b> After this move, heal 3 damage."
    ],
    "traits": [
      "Spirit."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60174"
  },
  {
    "instanceId": "stock-ammo-reload-1",
    "name": "Stock Ammo Reload",
    "type": "event",
    "text": [
      "Place 5 ammo, divided as you choose, among [[Firearm]] assets you control."
    ],
    "traits": [
      "Supply."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60175"
  },
  {
    "instanceId": "vicious-blow-1",
    "name": "Vicious Blow",
    "type": "skill",
    "text": [
      "If this skill test is successful during an attack, that attack deals +1 damage (+2 damage instead if it succeeds by 2 or more)."
    ],
    "traits": [
      "Practiced. Expert."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60176"
  },
  {
    "instanceId": "detective-sherman-1",
    "name": "Detective Sherman",
    "type": "asset",
    "text": [
      "You get +1 [combat].",
      "Detective Sherman may be assigned damage and/or horror dealt to other investigators at your location.",
      "[reaction] After damage is placed on Detective Sherman, exhaust him: Discover 1 clue at your location."
    ],
    "traits": [
      "Ally. Detective. Police."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60177"
  },
  {
    "instanceId": "endurance-1",
    "name": "Endurance",
    "type": "asset",
    "text": [
      "Starting. <i>(You may begin the game with 1 copy of a starting card in your opening hand.)</i>",
      "[fast] Spend 1 resource: You get +1 [combat] for this skill test (+2 [combat] instead if this is an attack or evasion).",
      "[fast] Spend 1 resource: You get +1 [agility] for this skill test (+2 [agility] instead if this is an attack or evasion)."
    ],
    "traits": [
      "Talent."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60178"
  },
  {
    "instanceId": "stakeout-1",
    "name": "Stakeout",
    "type": "event",
    "text": [
      "<b>Investigate</b> ([intellect]). You get +3 [intellect] for this investigation. If you succeed, discover 1 additional clue at your location and heal 2 horror."
    ],
    "traits": [
      "Tactic."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60179"
  },
  {
    "instanceId": "indomitable-1",
    "name": "Indomitable",
    "type": "skill",
    "text": [
      "If an enemy has attacked an investigator at this location this round, Indomitable gains [wild] [wild] [wild]."
    ],
    "traits": [
      "Innate. Developed."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60180"
  },
  {
    "instanceId": "protective-vest-1",
    "name": "Protective Vest",
    "type": "asset",
    "text": [
      "You have 1 additional hand slot, which may only be used to hold a [[Firearm]] asset.",
      "[reaction] After you play Protective Vest: Search the top 9 cards of your deck for a [[Firearm]] or [[Upgrade]] card and add it to your hand. Shuffle your deck."
    ],
    "traits": [
      "Item. Armor. Police."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60181"
  },
  {
    "instanceId": "thompson-submachine-gun-1",
    "name": "Thompson Submachine Gun",
    "type": "asset",
    "text": [
      "Uses (6 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +3 [combat] and deal +1 damage for this attack.",
      "[reaction] After you resolve the above [action] ability, spend 1 ammo: <b>Fight</b> ([combat]). This attack deals +1 damage."
    ],
    "traits": [
      "Item. Weapon. Firearm."
    ],
    "icons": [],
    "faction": "guardian",
    "isWeakness": false,
    "code": "60182"
  },
  {
    "instanceId": "experimental-psychology-1",
    "name": "Experimental Psychology",
    "type": "asset",
    "text": [
      "Carolyn Fern deck only.",
      "[action]: Test [intellect] (2). If you succeed, heal 1 horror from an investigator or [[Ally]] asset at your location.",
      "[reaction] After you heal horror from an investigator, exhaust Experimental Psychology: That investigator gets +2 skill value to their next skill test this round."
    ],
    "traits": [
      "Item. Tome. Science."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60252"
  },
  {
    "instanceId": "unbroken-web-1",
    "name": "Unbroken Web",
    "type": "treachery",
    "text": [
      "<b>Revelation</b> - Put this card into play in your threat area.",
      "[reaction] When you would discover any number of clues: Place that much horror on Unbroken Web, instead. Then, discard this card if there is 4 or more horror on it.",
      "<b>Forced</b> - When the game ends or you are eliminated: You earn 2 fewer experience."
    ],
    "traits": [
      "Terror. Dreamlands."
    ],
    "icons": [],
    "faction": "neutral",
    "isWeakness": true,
    "code": "60253"
  },
  {
    "instanceId": "lethal-curiosity-1",
    "name": "Lethal Curiosity",
    "type": "treachery",
    "text": [
      "<b>Revelation</b> - Test [willpower] (4). For each point you fail by, you must either take 1 damage or place 1 of your clues on your location."
    ],
    "traits": [
      "Flaw."
    ],
    "icons": [],
    "faction": "neutral",
    "isWeakness": true,
    "code": "60254"
  },
  {
    "instanceId": "dreamer-s-chronicle-1",
    "name": "Dreamer's Chronicle",
    "type": "asset",
    "text": [
      "Uses (4 secrets).",
      "[action] Spend 1 secret: <b>Investigate</b> ([intellect]). The first card you commit to this investigation gains [wild]. If you succeed, you may take 1 horror to discover 1 additional clue at your location."
    ],
    "traits": [
      "Item. Tome."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60255"
  },
  {
    "instanceId": "occult-records-1",
    "name": "Occult Records",
    "type": "asset",
    "text": [
      "Uses (3 secrets).",
      "[fast] During your turn, spend 1 secret and exhaust Occult Records: Heal 2 horror from an investigator at your location. Then, test [willpower] (2). If you fail, discard 1 card at random from your hand."
    ],
    "traits": [
      "Item. Tome. Occult."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60256"
  },
  {
    "instanceId": "private-practice-1",
    "name": "Private Practice",
    "type": "asset",
    "text": [
      "Limit 1 per investigator.",
      "[reaction] After you heal 1 or more horror, exhaust Private Practice: Gain 1 resource."
    ],
    "traits": [
      "Profession."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60257"
  },
  {
    "instanceId": "psychology-student-1",
    "name": "Psychology Student",
    "type": "asset",
    "text": [
      "[reaction] After you play Psychology Student: Heal 2 horror from an investigator or [[Ally]] asset at your location."
    ],
    "traits": [
      "Ally. Miskatonic."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60258"
  },
  {
    "instanceId": "scroll-of-the-pharaohs-1",
    "name": "Scroll of the Pharaohs",
    "type": "asset",
    "text": [
      "Uses (4 secrets).",
      "[action] Spend 1 secret and exhaust Scroll of the Pharaohs: Deal 1 horror to an investigator or [[Ally]] asset at your location. Then, if there are no secrets on Scroll of the Pharaohs, discard it, draw 3 cards, and record \"you have unearthed the secrets of the Pharaohs\" in your campaign log."
    ],
    "traits": [
      "Item. Relic. Tome."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60259"
  },
  {
    "instanceId": "university-archivist-1",
    "name": "University Archivist",
    "type": "asset",
    "text": [
      "You have 1 additional hand slot, which can only be used to hold a [[Tome]] asset.",
      "[reaction] After University Archivist enters play: Search the top 6 cards of your deck for a [[Tome]] asset and add it to your hand. Shuffle your deck."
    ],
    "traits": [
      "Ally. Miskatonic."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60260"
  },
  {
    "instanceId": "caustic-reaction-1",
    "name": "Caustic Reaction",
    "type": "event",
    "text": [
      "<b>Fight</b> ([intellect]). You get +1 [intellect] for this attack. If you control 2 or more clues, this attack deals +1 damage."
    ],
    "traits": [
      "Tactic. Science."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60261"
  },
  {
    "instanceId": "unflappable-1",
    "name": "Unflappable",
    "type": "event",
    "text": [
      "<b>Evade</b> ([agility]). You get +2 [agility] for this evasion. If you succeed and you control 2 or more clues, heal 1 horror."
    ],
    "traits": [
      "Insight."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60262"
  },
  {
    "instanceId": "preposterous-sketches-1",
    "name": "Preposterous Sketches",
    "type": "event",
    "text": [
      "Play only if there is a clue on your location.",
      "Draw 3 cards."
    ],
    "traits": [
      "Insight."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60263"
  },
  {
    "instanceId": "psychoanalysis-1",
    "name": "Psychoanalysis",
    "type": "event",
    "text": [
      "Choose an investigator at your location and reveal the top 3 cards of their deck. That investigator may choose to either draw 1 revealed card and shuffle the rest into their deck, or heal 2 horror and return the revealed cards to the top of their owner's deck in any order."
    ],
    "traits": [
      "Insight. Science."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60264"
  },
  {
    "instanceId": "de-escalate-1",
    "name": "De-Escalate",
    "type": "event",
    "text": [
      "<b>Parley.</b> Choose an enemy at your location. Heal horror equal to that enemy's horror value."
    ],
    "traits": [
      "Insight."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60265"
  },
  {
    "instanceId": "insidious-truths-1",
    "name": "Insidious Truths",
    "type": "event",
    "text": [
      "As an additional cost to play Insidious Truths, you may discard up to 2 cards from hand.",
      "<b>Fight</b> ([combat]). For each card discarded as part of this card's cost, you get +2 [combat] and deal +1 damage for this attack."
    ],
    "traits": [
      "Insight. Cursed."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60266"
  },
  {
    "instanceId": "deduction-1",
    "name": "Deduction",
    "type": "skill",
    "text": [
      "If this skill test is successful while investigating a location, discover 1 additional clue at that location."
    ],
    "traits": [
      "Practiced."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60267"
  },
  {
    "instanceId": "establish-motive-1",
    "name": "Establish Motive",
    "type": "skill",
    "text": [
      "If this skill test is successful, the performing investigator searches the top 6 cards of their deck for an [[Insight]] event, draws it, and shuffles their deck."
    ],
    "traits": [
      "Practiced."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60268"
  },
  {
    "instanceId": "literary-analysis-1",
    "name": "Literary Analysis",
    "type": "skill",
    "text": [
      "If this skill test is successful, replenish 1 secret on a [[Tome]] asset at your location."
    ],
    "traits": [
      "Practiced."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60269"
  },
  {
    "instanceId": "magnifying-glass-1",
    "name": "Magnifying Glass",
    "type": "asset",
    "text": [
      "Fast.",
      "You get +1 [intellect] while investigating.",
      "[fast] If there are no clues on your location: Return Magnifying Glass to your hand."
    ],
    "traits": [
      "Item. Tool."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60270"
  },
  {
    "instanceId": "unflappable-1",
    "name": "Unflappable",
    "type": "event",
    "text": [
      "<b>Evade</b> ([agility]). You get +3 [agility] for this evasion. If you succeed, heal 2 horror from among cards you control."
    ],
    "traits": [
      "Insight."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60271"
  },
  {
    "instanceId": "typewriter-1",
    "name": "Typewriter",
    "type": "asset",
    "text": [
      "Uses (3 secrets). If there are no secrets on Typewriter, discard it.",
      "Secrets on Typewriter may be spent as if they were on [[Tome]] assets you control."
    ],
    "traits": [
      "Item. Tool."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60272"
  },
  {
    "instanceId": "caustic-reaction-1",
    "name": "Caustic Reaction",
    "type": "event",
    "text": [
      "<b>Fight</b> ([intellect]). You get +2 [intellect] and deal +1 damage for this attack. If you succeed and you control 2 or more clues, this attack deals +2 damage instead."
    ],
    "traits": [
      "Tactic. Science."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60273"
  },
  {
    "instanceId": "hypnotize-1",
    "name": "Hypnotize",
    "type": "event",
    "text": [
      "<b>Parley</b> ([intellect]). You get +2 [intellect] for this parley. Choose a non-[[Elite]] enemy at your location. This test's difficulty is equal to that enemy's remaining health. If you succeed, shuffle that enemy into the encounter deck."
    ],
    "traits": [
      "Science."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60274"
  },
  {
    "instanceId": "deduction-1",
    "name": "Deduction",
    "type": "skill",
    "text": [
      "If this skill test is successful while investigating a location, discover 1 additional clue at that location (2 additional clues instead if it succeeds by 2 or more)."
    ],
    "traits": [
      "Practiced. Expert."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60275"
  },
  {
    "instanceId": "autopsy-report-1",
    "name": "Autopsy Report",
    "type": "asset",
    "text": [
      "[reaction] After an enemy at your location is defeated, exhaust Autopsy Report: <b>Investigate</b> ([intellect]). You get +X [intellect] for this investigation, where X is the defeated enemy's printed health (to a maximum of +5)."
    ],
    "traits": [
      "Item. Tome. Science."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60276"
  },
  {
    "instanceId": "sharp-rhetoric-1",
    "name": "Sharp Rhetoric",
    "type": "asset",
    "text": [
      "Starting. <i>(You may begin the game with 1 copy of a starting card in your opening hand.)</i>",
      "[fast] Spend 1 resource: You get +1 [intellect] for this skill test (+2 [intellect] instead if this is an investigation or parley).",
      "[fast] Spend 1 resource: You get +1 [willpower] for this skill test (+2 [willpower] instead if this is an investigation or parley)."
    ],
    "traits": [
      "Talent."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60277"
  },
  {
    "instanceId": "psychoanalysis-1",
    "name": "Psychoanalysis",
    "type": "event",
    "text": [
      "One at a time, each investigator at your location reveals the top 3 cards of their deck, draws 1 of those cards, shuffles the remaining cards into their deck, and heals 2 horror."
    ],
    "traits": [
      "Insight. Science."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60278"
  },
  {
    "instanceId": "scroll-of-the-pharaohs-1",
    "name": "Scroll of the Pharaohs",
    "type": "asset",
    "text": [
      "Researched. Uses (4 secrets).",
      "[action] Take 1 horror and spend 1 or 2 secrets: For each secret you spent as part of this ability's cost, reveal 3 cards from the top of the encounter deck. Choose and discard 1 non-peril, non-[[Elite]] card among them, then return the rest to the top of the encounter deck in any order."
    ],
    "traits": [
      "Item. Relic. Tome."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60279"
  },
  {
    "instanceId": "scroll-of-the-pharaohs-1",
    "name": "Scroll of the Pharaohs",
    "type": "asset",
    "text": [
      "Researched. Uses (4 secrets).",
      "[action] Take 1 horror and spend 1 or 2 secrets: <b>Fight</b> ([intellect]). You get +3 [intellect] for this attack. If you succeed, this attack deals +1 damage for each secret you spent as part of this ability's cost."
    ],
    "traits": [
      "Item. Relic. Tome."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60280"
  },
  {
    "instanceId": "scroll-of-the-pharaohs-1",
    "name": "Scroll of the Pharaohs",
    "type": "asset",
    "text": [
      "Researched. Uses (4 secrets).",
      "[action] Take 1 horror and spend 1 or 2 secrets: <b>Investigate</b> ([intellect]). You get +3 [intellect] for this investigation. If you succeed, discover 1 additional clue at your location for each secret you spent as part of this ability's cost."
    ],
    "traits": [
      "Item. Relic. Tome."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60281"
  },
  {
    "instanceId": "commune-with-the-cosmos-1",
    "name": "Commune with the Cosmos",
    "type": "event",
    "text": [
      "When you play Commune with the Cosmos, you may take up to 3 horror.",
      "<b>Investigate</b> ([intellect]). You get +2 [intellect] for this investigation. If you succeed, discover X additional clues at your location, where X is the amount of horror on you (to a maximum of 4 additional clues)."
    ],
    "traits": [
      "Spell."
    ],
    "icons": [],
    "faction": "seeker",
    "isWeakness": false,
    "code": "60282"
  },
  {
    "instanceId": "know-the-exit-1",
    "name": "Know the Exit",
    "type": "skill",
    "text": [
      "André Patel deck only.",
      "While this card is committed to an attack or an evasion, it gains [wild] [wild]."
    ],
    "traits": [
      "Practiced."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60352"
  },
  {
    "instanceId": "know-the-line-1",
    "name": "Know the Line",
    "type": "skill",
    "text": [
      "André Patel deck only.",
      "While this card is committed to a skill test on a scenario card, it gains [wild] [wild]."
    ],
    "traits": [
      "Practiced."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60353"
  },
  {
    "instanceId": "know-the-scene-1",
    "name": "Know the Scene",
    "type": "skill",
    "text": [
      "André Patel deck only.",
      "While this card is committed to an investigation or parley, it gains [wild] [wild]."
    ],
    "traits": [
      "Practiced."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60354"
  },
  {
    "instanceId": "weight-of-the-world-1",
    "name": "Weight of the World",
    "type": "treachery",
    "text": [
      "<b>Revelation</b> - Put Weight of the World into play in your threat area.",
      "<b>Forced</b> - When you fail a skill test while Weight of the World is in play, take 1 horror and shuffle it back into your deck."
    ],
    "traits": [
      "Terror."
    ],
    "icons": [],
    "faction": "neutral",
    "isWeakness": true,
    "code": "60355"
  },
  {
    "instanceId": "unaware-1",
    "name": "Unaware",
    "type": "treachery",
    "text": [
      "<b>Revelation</b> - Put Unaware into play in your threat area.",
      "<b>Forced</b> - The first time you fail a skill test during your turn: Draw the top card of the encounter deck. If that card is an enemy, discard Unaware."
    ],
    "traits": [
      "Flaw."
    ],
    "icons": [],
    "faction": "neutral",
    "isWeakness": true,
    "code": "60356"
  },
  {
    "instanceId": "center-stage-1",
    "name": "Center Stage",
    "type": "asset",
    "text": [
      "Limit 1 per investigator. Uses (3 renown). If there is no renown on Center Stage, discard it.",
      "[fast] During a skill test, spend 1 renown and exhaust Center Stage: You get +1 skill value for each action you have spent this round <i>(including this one, if this is triggered during one of your actions)</i>."
    ],
    "traits": [
      "Talent."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60357"
  },
  {
    "instanceId": "fame-1",
    "name": "Fame",
    "type": "asset",
    "text": [
      "Uses (4 renown). If there is no renown on Fame, discard it.",
      "[action] If there is an enemy at your location, spend 1 renown: <b>Parley.</b> Gain 2 resources."
    ],
    "traits": [
      "Condition."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60358"
  },
  {
    "instanceId": "the-grapevine-1",
    "name": "The Grapevine",
    "type": "asset",
    "text": [
      "Uses (3 rumors). If there are no rumors on The Grapevine, discard it.",
      "[action] Spend 1 rumor and exhaust The Grapevine: <b>Parley.</b> Choose an enemy at a revealed location up to 2 connections away. Move (one location at a time) along the shortest path to that enemy's location and engage it."
    ],
    "traits": [
      "Connection."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60359"
  },
  {
    "instanceId": "extravagant-ring-1",
    "name": "Extravagant Ring",
    "type": "asset",
    "text": [
      "Uses (3 renown).",
      "[reaction] When you would succeed at a skill test, spend 1 renown and exhaust Extravagant Ring: You get +2 skill value for this test."
    ],
    "traits": [
      "Item. Charm."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60360"
  },
  {
    "instanceId": "lockpicks-1",
    "name": "Lockpicks",
    "type": "asset",
    "text": [
      "[action] Exhaust Lockpicks: <b>Investigate</b> ([intellect]). Add your [agility] to your [intellect] for this test. If you do not succeed by at least 2, discard Lockpicks."
    ],
    "traits": [
      "Item. Tool. Illicit."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60361"
  },
  {
    "instanceId": "marcus-sengstacke-1",
    "name": "Marcus Sengstacke",
    "type": "asset",
    "text": [
      "You gain 1 additional resource during the upkeep phase.",
      "<b>Forced</b> - After you fail a skill test: Deal 1 horror to Marcus Sengstacke."
    ],
    "traits": [
      "Ally. Patron."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60362"
  },
  {
    "instanceId": "polished-cane-1",
    "name": "Polished Cane",
    "type": "asset",
    "text": [
      "[action]: <b>Fight</b> ([combat]). Add your [agility] to your [combat] for this attack. If this attack succeeds by 2 or more against a non-[[Elite]] enemy, you may exhaust Polished Cane to automatically evade that enemy."
    ],
    "traits": [
      "Item. Weapon. Melee."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60363"
  },
  {
    "instanceId": "clean-sweep-1",
    "name": "Clean Sweep",
    "type": "event",
    "text": [
      "<b>Investigate</b> ([intellect]). You get +2 [intellect] for this investigation. If you discover the last clue at your location, you may move to a connecting location."
    ],
    "traits": [
      "Tactic. Trick."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60364"
  },
  {
    "instanceId": "pay-your-dues-1",
    "name": "Pay Your Dues",
    "type": "event",
    "text": [
      "<b>Parley.</b> Choose a non-[[Elite]] enemy at your location with X remaining health. That enemy disengages from each investigator and gains aloof until the end of the round. Discover 1 clue at your location."
    ],
    "traits": [
      "Favor."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60365"
  },
  {
    "instanceId": "quick-exit-1",
    "name": "Quick Exit",
    "type": "event",
    "text": [
      "<b>Evade</b> ([agility]). You get +2 [agility] for this evasion. If you succeed by 2 or more and the evaded enemy is non-[[Elite]], that enemy does not ready during the next upkeep phase."
    ],
    "traits": [
      "Tactic. Trick."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60366"
  },
  {
    "instanceId": "a-sudden-fall-1",
    "name": "A Sudden Fall",
    "type": "event",
    "text": [
      "<b>Fight</b> ([combat]). You get +2 [combat] for this attack. If the targeted enemy is exhausted, this attack deals +1 damage."
    ],
    "traits": [
      "Tactic. Trick."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60367"
  },
  {
    "instanceId": "right-under-their-noses-1",
    "name": "Right Under Their Noses",
    "type": "event",
    "text": [
      "Fast. Play after you successfully evade an enemy.",
      "Discover 1 clue at your location (if you succeeded by 2 or more, you may discover 1 clue at a connecting location, instead)."
    ],
    "traits": [
      "Trick. Illicit."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60368"
  },
  {
    "instanceId": "easy-street-1",
    "name": "Easy Street",
    "type": "skill",
    "text": [
      "Commit only to a skill test you are performing. Max 1 committed per skill test.",
      "Easy Street gains [wild] for every 3 resources you have (to a maximum of [wild] [wild] [wild])."
    ],
    "traits": [
      "Favor."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60369"
  },
  {
    "instanceId": "out-the-door-1",
    "name": "Out the Door",
    "type": "skill",
    "text": [
      "After Out the Door is committed to a skill test, the performing investigator gains 2 resources. If this skill test fails, that investigator loses 2 resources."
    ],
    "traits": [
      "Gambit."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60370"
  },
  {
    "instanceId": "watch-this-1",
    "name": "\"Watch this!\"",
    "type": "skill",
    "text": [
      "Commit only to a skill test you are performing. As an additional cost to commit \"Watch this!\" spend up to 3 resources.",
      "If you succeed by 1 or more, gain twice that many resources."
    ],
    "traits": [
      "Gambit."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60371"
  },
  {
    "instanceId": "lockpicks-1",
    "name": "Lockpicks",
    "type": "asset",
    "text": [
      "Uses (3 supplies). If there are no supplies on Lockpicks, discard it.",
      "[action] Exhaust Lockpicks: <b>Investigate</b> ([intellect]). Add your [agility] to your [intellect] for this test. If you do not succeed by at least 2, remove 1 supply from Lockpicks."
    ],
    "traits": [
      "Item. Tool. Illicit."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60372"
  },
  {
    "instanceId": "out-the-door-1",
    "name": "Out the Door",
    "type": "skill",
    "text": [
      "After Out the Door is committed to a skill test, the performing investigator gains 4 resources. If this skill test fails, that investigator loses 4 resources."
    ],
    "traits": [
      "Gambit."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60373"
  },
  {
    "instanceId": "the-grapevine-1",
    "name": "The Grapevine",
    "type": "asset",
    "text": [
      "Uses (3 rumors). If there are no rumors on The Grapevine, discard it.",
      "[action] Spend 1 rumor and exhaust The Grapevine: <b>Parley.</b> Choose an enemy at a revealed location up to 3 connections away. Move (one location at a time) along the shortest path to that enemy's location and engage it. Draw 1 card."
    ],
    "traits": [
      "Connection."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60374"
  },
  {
    "instanceId": "marcus-sengstacke-1",
    "name": "Marcus Sengstacke",
    "type": "asset",
    "text": [
      "You gain 1 additional resource during the upkeep phase.",
      "<b>Forced</b> - After you fail a skill test: Deal 1 horror to Marcus Sengstacke."
    ],
    "traits": [
      "Ally. Patron."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60375"
  },
  {
    "instanceId": "clean-sweep-1",
    "name": "Clean Sweep",
    "type": "event",
    "text": [
      "<b>Investigate</b> ([agility]). Add your [intellect] to your [agility] for this test. After this test resolves, you may move to a connecting location."
    ],
    "traits": [
      "Tactic. Trick."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60376"
  },
  {
    "instanceId": "quick-exit-1",
    "name": "Quick Exit",
    "type": "event",
    "text": [
      "<b>Evade</b> ([agility]). Add your [willpower] to your [agility] for this test. If you succeed and the evaded enemy is non-[[Elite]], that enemy does not ready during the next upkeep phase."
    ],
    "traits": [
      "Tactic. Trick."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60377"
  },
  {
    "instanceId": "a-sudden-fall-1",
    "name": "A Sudden Fall",
    "type": "event",
    "text": [
      "<b>Fight</b> ([agility]). Add your [combat] to your [agility] for this test. If the targeted enemy is exhausted, this attack deals +2 damage."
    ],
    "traits": [
      "Tactic. Trick."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60378"
  },
  {
    "instanceId": "the-black-fan-1",
    "name": "The Black Fan",
    "type": "asset",
    "text": [
      "Exceptional.",
      "While you have...",
      "- ...10+ resources, you get +1 health and +1 sanity.",
      "- ...15+ resources, you may take an additional action during your turn.",
      "- ...20+ resources, you get +1 to each of your skills."
    ],
    "traits": [
      "Item. Relic."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60379"
  },
  {
    "instanceId": "silver-tongue-1",
    "name": "Silver Tongue",
    "type": "asset",
    "text": [
      "Starting. <i>(You may begin the game with 1 copy of a starting card in your opening hand.)</i>",
      "[fast] Spend 1 resource: You get +1 [intellect] for this skill test (+2 [intellect] instead if this is an evasion or parley).",
      "[fast] Spend 1 resource: You get +1 [agility] for this skill test (+2 [agility] instead if this is an evasion or parley)."
    ],
    "traits": [
      "Talent."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60380"
  },
  {
    "instanceId": "well-connected-1",
    "name": "Well Connected",
    "type": "asset",
    "text": [
      "Limit 1 per investigator.",
      "[fast] Exhaust Well Connected: You get +1 skill value for this skill test for every 4 resources you have.",
      "[fast] Spend 2 resources: Ready Well Connected. (Limit once per round.)"
    ],
    "traits": [
      "Condition."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60381"
  },
  {
    "instanceId": "right-under-their-noses-1",
    "name": "Right Under Their Noses",
    "type": "event",
    "text": [
      "Fast. Play after you successfully evade an enemy.",
      "Discover 1 clue at your location (if you succeeded by 2 or more, you may discover 1 clue at a connecting location, as well)."
    ],
    "traits": [
      "Trick. Illicit."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60382"
  },
  {
    "instanceId": "contingency-1",
    "name": "Contingency",
    "type": "skill",
    "text": [
      "While Contingency is committed to a skill test targeting an enemy, after revealing chaos tokens, you may spend 3 resources to cancel a revealed token, return it to the chaos bag, and reveal a new one. <i>(You may do this any number of times.)</i>"
    ],
    "traits": [
      "Practiced. Expert."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60383"
  },
  {
    "instanceId": "the-red-clock-1",
    "name": "The Red Clock",
    "type": "asset",
    "text": [
      "Exceptional. Uses (0 charges).",
      "<b>Forced</b> - After your turn begins: You may take all charges here, as resources. Place 1 charge here. If it has exactly...",
      "- ...1 charge, you get +4 skill value for your next skill test.",
      "- ...2 charges, you may move up to 3 times.",
      "- ...3 charges, you may take 2 additional actions this turn."
    ],
    "traits": [
      "Item. Relic."
    ],
    "icons": [],
    "faction": "rogue",
    "isWeakness": false,
    "code": "60384"
  },
  {
    "instanceId": "grand-m-re-s-charm-1",
    "name": "Grand-Mère's Charm",
    "type": "asset",
    "text": [
      "Marie Lambeau deck only.",
      "[fast] Take 1 direct damage and exhaust Grand-Mère's Charm: Replenish 1 charge on an asset at your location."
    ],
    "traits": [
      "Item. Charm. Occult. Blessed."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60452"
  },
  {
    "instanceId": "called-to-guin-e-1",
    "name": "Called to Guinée",
    "type": "treachery",
    "text": [
      "<b>Revelation</b> - Put Called to Guinée into play in your threat area.",
      "You cannot heal damage.",
      "[action] Choose and discard 3 cards from your hand: Discard Called to Guinée."
    ],
    "traits": [
      "Curse. Pact."
    ],
    "icons": [],
    "faction": "neutral",
    "isWeakness": true,
    "code": "60453"
  },
  {
    "instanceId": "hemophobia-1",
    "name": "Hemophobia",
    "type": "treachery",
    "text": [
      "<b>Revelation</b> - Put Hemophobia into play in your threat area.",
      "<b>Forced</b> - The first time each round an investigator at your location takes damage: Take 1 horror.",
      "[action] [action]: Discard Hemophobia."
    ],
    "traits": [
      "Terror."
    ],
    "icons": [],
    "faction": "neutral",
    "isWeakness": true,
    "code": "60454"
  },
  {
    "instanceId": "arcane-initiate-1",
    "name": "Arcane Initiate",
    "type": "asset",
    "text": [
      "<b>Forced</b> - After Arcane Initiate enters play: Place 1 doom on it.",
      "[fast] Exhaust Arcane Initiate: Search the top 3 cards of your deck for a [[Spell]] card and draw it. Shuffle your deck."
    ],
    "traits": [
      "Ally. Sorcerer."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60455"
  },
  {
    "instanceId": "offering-bowl-1",
    "name": "Offering Bowl",
    "type": "asset",
    "text": [
      "Uses (3 offerings). If there are no offerings on Offering Bowl, discard it.",
      "[fast] Spend 1 offering and exhaust Offering Bowl: Take 1 damage and gain 2 resources."
    ],
    "traits": [
      "Item. Occult."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60456"
  },
  {
    "instanceId": "bloodstone-1",
    "name": "Bloodstone",
    "type": "asset",
    "text": [
      "You get +1 [willpower]."
    ],
    "traits": [
      "Item. Charm. Cursed."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60457"
  },
  {
    "instanceId": "sacrificial-doll-1",
    "name": "Sacrificial Doll",
    "type": "asset",
    "text": [
      "While you have 3 or fewer remaining health, Sacrificial Doll does not take up a hand slot.",
      "[reaction] After you reveal a non-[auto_fail] chaos token during a skill test, take 1 damage and exhaust Sacrificial Doll: Cancel that token and reveal tokens from the chaos bag until a symbol token is revealed. Resolve that token and ignore the rest."
    ],
    "traits": [
      "Item. Charm. Occult."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60458"
  },
  {
    "instanceId": "cosmic-flame-1",
    "name": "Cosmic Flame",
    "type": "asset",
    "text": [
      "Uses (3 charges).",
      "[action]: <b>Fight</b> ([willpower]). If you succeed, you may spend 1 charge to deal +1 damage for this attack. If you reveal a [skull] token during this test, remove 1 charge from Cosmic Flame (if you cannot, take 1 damage and discard this card)."
    ],
    "traits": [
      "Spell."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60459"
  },
  {
    "instanceId": "second-sight-1",
    "name": "Second Sight",
    "type": "asset",
    "text": [
      "Uses (3 charges).",
      "[action]: <b>Investigate</b> ([willpower]). If you succeed, you may spend 1 charge to discover 1 additional clue at your location. If you reveal a [cultist] token during this test, remove 1 charge from Second Sight (if you cannot, take 1 horror and discard this card)."
    ],
    "traits": [
      "Spell."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60460"
  },
  {
    "instanceId": "shadowmeld-1",
    "name": "Shadowmeld",
    "type": "asset",
    "text": [
      "Uses (4 charges).",
      "[action]: <b>Evade</b> ([willpower]). If you succeed, you may spend 1 charge to move to a connecting location. If you reveal a [tablet] token during this test, remove 1 charge from Shadowmeld (if you cannot, lose 1 action and discard this card)."
    ],
    "traits": [
      "Spell."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60461"
  },
  {
    "instanceId": "consume-life-1",
    "name": "Consume Life",
    "type": "event",
    "text": [
      "<b>Fight</b> ([willpower]). This attack deals +1 damage. If this attack defeats an enemy, heal 1 damage from an investigator or [[Ally]] asset at your location."
    ],
    "traits": [
      "Spell."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60462"
  },
  {
    "instanceId": "favor-of-baalshandor-1",
    "name": "Favor of Baalshandor",
    "type": "event",
    "text": [
      "As an additional cost to play Favor of Baalshandor, take 1 damage.",
      "Play a [[Spell]] or [[Ritual]] asset from your hand, reducing its cost by 3. Playing this card does not provoke attacks of opportunity."
    ],
    "traits": [
      "Ritual."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60463"
  },
  {
    "instanceId": "infuse-life-1",
    "name": "Infuse Life",
    "type": "event",
    "text": [
      "Heal 3 damage from among investigators and/or [[Ally]] assets at your location."
    ],
    "traits": [
      "Spell."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60464"
  },
  {
    "instanceId": "mirror-form-1",
    "name": "Mirror Form",
    "type": "event",
    "text": [
      "Fast. Play only during your turn.",
      "Choose a [[Spell]] or [[Charm]] asset in your hand and put it into play under your control. When the round ends, shuffle that asset into your deck if it is still in play."
    ],
    "traits": [
      "Spell."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60465"
  },
  {
    "instanceId": "spiritual-charm-1",
    "name": "Spiritual Charm",
    "type": "event",
    "text": [
      "<b>Parley</b>. Choose a non-[[Elite]] enemy at your location or at a connecting location. Move that enemy to your location, engage it, and gain resources equal to its combined damage/horror values."
    ],
    "traits": [
      "Spell. Trick."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60466"
  },
  {
    "instanceId": "blood-curse-1",
    "name": "Blood Curse",
    "type": "skill",
    "text": [
      "Max 1 committed per skill test.",
      "If this skill test is successful, take 1 direct damage."
    ],
    "traits": [
      "Spell. Cursed."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60467"
  },
  {
    "instanceId": "cosmic-guidance-1",
    "name": "Cosmic Guidance",
    "type": "skill",
    "text": [
      "If this skill test is successful, heal 1 damage from the performing investigator."
    ],
    "traits": [
      "Augury."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60468"
  },
  {
    "instanceId": "torrent-of-power-1",
    "name": "Torrent of Power",
    "type": "skill",
    "text": [
      "As an additional cost to commit Torrent of Power to a skill test, spend up to 3 charges from among assets you control.",
      "For each charge spent in this way, Torrent of Power gains [willpower] [wild]."
    ],
    "traits": [
      "Practiced."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60469"
  },
  {
    "instanceId": "ceremonial-robes-1",
    "name": "Ceremonial Robes",
    "type": "asset",
    "text": [
      "Reduce the cost of the first [[Spell]] or [[Ritual]] card you play each round by 1."
    ],
    "traits": [
      "Item. Clothing."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60470"
  },
  {
    "instanceId": "eldritch-whispers-1",
    "name": "Eldritch Whispers",
    "type": "skill",
    "text": [
      "Max 1 committed per skill test.",
      "If a symbol token is revealed during this test, place up to 2 charges or 2 secrets among assets you control."
    ],
    "traits": [
      "Innate."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60471"
  },
  {
    "instanceId": "blood-ward-1",
    "name": "Blood Ward",
    "type": "event",
    "text": [
      "Fast. Play when a non-[[Elite]] enemy attacks an investigator at your location.",
      "Cancel that attack and heal 2 damage from the targeted investigator."
    ],
    "traits": [
      "Spell."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60472"
  },
  {
    "instanceId": "retribution-1",
    "name": "Retribution",
    "type": "event",
    "text": [
      "Fast. Play when an enemy attacks an investigator at your location.",
      "You take all damage and horror from this attack. For each point of damage/horror taken, deal 1 damage to an enemy at your location."
    ],
    "traits": [
      "Spell. Spirit."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60473"
  },
  {
    "instanceId": "dread-curse-of-azathoth-1",
    "name": "Dread Curse of Azathoth",
    "type": "asset",
    "text": [
      "Exceptional.",
      "[action] Place 1 doom on Dread Curse of Azathoth: <b>Fight</b> ([willpower]). You get +2 [willpower] and deal +1 damage for this attack. If this attack defeats an enemy, remove 1 doom from Dread Curse of Azathoth. If a [skull] or [elder_thing] token is revealed during this test, remove all doom from this card."
    ],
    "traits": [
      "Spell. Cursed."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60474"
  },
  {
    "instanceId": "ritual-dagger-1",
    "name": "Ritual Dagger",
    "type": "asset",
    "text": [
      "[action]: <b>Fight</b> ([combat]). Add your [willpower] to your [combat] for this attack.",
      "[reaction] After you play a [[Spell]] event, take 1 damage and exhaust Ritual Dagger: Shuffle that event into your deck instead of discarding it."
    ],
    "traits": [
      "Item. Weapon. Melee. Cursed."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60475"
  },
  {
    "instanceId": "spiritual-intuition-1",
    "name": "Spiritual Intuition",
    "type": "asset",
    "text": [
      "Starting. <i>(You may begin the game with 1 copy of a starting card in your opening hand.)</i>",
      "[fast] Spend 1 resource: You get +1 [willpower] for this skill test (+2 [willpower] instead if this test is on a [[Spell]] or [[Ritual]] card).",
      "[fast] Spend 1 resource: You get +1 [combat] for this skill test (+2 [combat] instead if this test is on a [[Spell]] or [[Ritual]] card)."
    ],
    "traits": [
      "Talent."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60476"
  },
  {
    "instanceId": "blood-curse-1",
    "name": "Blood Curse",
    "type": "skill",
    "text": [
      "Max 1 committed per skill test.",
      "If this test is successful, deal 1 damage to a card with health at your location."
    ],
    "traits": [
      "Spell. Cursed."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60477"
  },
  {
    "instanceId": "arcane-experience-1",
    "name": "Arcane Experience",
    "type": "asset",
    "text": [
      "Permanent. Limit 1 per deck.",
      "You have 1 additional arcane slot."
    ],
    "traits": [
      "Condition."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60478"
  },
  {
    "instanceId": "jim-culver-1",
    "name": "Jim Culver",
    "type": "asset",
    "text": [
      "You get +1 [willpower].",
      "[reaction] After you take damage and/or horror, exhaust Jim Culver: Draw 1 card and gain 1 resource."
    ],
    "traits": [
      "Ally. Performer."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60479"
  },
  {
    "instanceId": "ultimate-sacrifice-1",
    "name": "Ultimate Sacrifice",
    "type": "event",
    "text": [
      "Fast. Play when the investigation phase ends.",
      "Repeat the investigation phase. At the end of that phase, you are defeated and suffer 1 physical trauma. Max once per game."
    ],
    "traits": [
      "Spell. Spirit."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60480"
  },
  {
    "instanceId": "second-sight-1",
    "name": "Second Sight",
    "type": "asset",
    "text": [
      "Uses (4 charges).",
      "[action]: <b>Investigate</b> ([willpower]). You get +2 [willpower] for this investigation. If you succeed, you may spend 1 charge to discover 1 additional clue at your location or 1 clue at a connecting location. If you reveal a [cultist] token during this test, remove 1 charge from Second Sight (if you cannot, take 1 horror and discard this card)."
    ],
    "traits": [
      "Spell."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60481"
  },
  {
    "instanceId": "shadowmeld-1",
    "name": "Shadowmeld",
    "type": "asset",
    "text": [
      "Uses (5 charges).",
      "[action]: <b>Evade</b> ([willpower]). You get +2 [willpower] for this evasion. If you succeed, you may spend 1 charge to move to a location up to 2 connections away. If you reveal a [tablet] token during this test, remove 1 charge from Shadowmeld (if you cannot, lose 1 action and discard this card)."
    ],
    "traits": [
      "Spell."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60482"
  },
  {
    "instanceId": "bend-blood-1",
    "name": "Bend Blood",
    "type": "event",
    "text": [
      "<b>Fight</b> ([willpower]). You get +3 [willpower] and deal +1 damage for this attack. If you succeed, deal 1 damage to each other enemy at your location. Each enemy dealt damage by Bend Blood cannot attack you for the remainder of the round."
    ],
    "traits": [
      "Spell. Cursed."
    ],
    "icons": [],
    "faction": "mystic",
    "isWeakness": false,
    "code": "60483"
  },
  {
    "instanceId": "miguel-s-knapsack-1",
    "name": "Miguel's Knapsack",
    "type": "asset",
    "text": [
      "Miguel de la Cruz deck only.",
      "[reaction] When you play an event, exhaust Miguel's Knapsack: Either play that event at a connecting location as if you were at that location, or draw 1 card."
    ],
    "traits": [
      "Item."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60552"
  },
  {
    "instanceId": "feline-hybrid-1",
    "name": "Feline Hybrid",
    "type": "enemy",
    "text": [
      "Elusive. Hunter. Prey (Miguel de la Cruz only).",
      "Feline Hybrid is immune to player card effects."
    ],
    "traits": [
      "Creature. Mutated."
    ],
    "icons": [],
    "faction": "neutral",
    "isWeakness": true,
    "code": "60553"
  },
  {
    "instanceId": "blood-drinker-1",
    "name": "Blood Drinker",
    "type": "enemy",
    "text": [
      "Hunter. Retaliate.",
      "<b>Forced</b> - After Blood Drinker attacks: Heal 1 damage from it."
    ],
    "traits": [
      "Humanoid. Monster."
    ],
    "icons": [],
    "faction": "neutral",
    "isWeakness": true,
    "code": "60554"
  },
  {
    "instanceId": "daniel-jameson-1",
    "name": "Daniel Jameson",
    "type": "asset",
    "text": [
      "You get +1 [agility].",
      "[reaction] After you fail an attack or evasion, exhaust Daniel Jameson: Attempt that skill test again, with +1 skill value."
    ],
    "traits": [
      "Ally. Hunter."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60555"
  },
  {
    "instanceId": "hunting-dog-1",
    "name": "Hunting Dog",
    "type": "asset",
    "text": [
      "[reaction] When an enemy enters play, exhaust Hunting Dog: Move once toward that enemy's location."
    ],
    "traits": [
      "Ally. Creature."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60556"
  },
  {
    "instanceId": "loner-1",
    "name": "Loner",
    "type": "asset",
    "text": [
      "Limit 1 per investigator.",
      "[fast] During your turn, exhaust Loner: Move to an empty connecting location."
    ],
    "traits": [
      "Condition."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60557"
  },
  {
    "instanceId": "old-compass-1",
    "name": "Old Compass",
    "type": "asset",
    "text": [
      "[action]: <b>Investigate</b> ([intellect]). Your location gets -1 shroud for this investigation. If you fail, you may exhaust Old Compass to attempt this skill test again."
    ],
    "traits": [
      "Item. Tool."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60558"
  },
  {
    "instanceId": "pocketknife-1",
    "name": "Pocketknife",
    "type": "asset",
    "text": [
      "[action]: <b>Fight</b> ([combat] or [agility]). You get +1 skill value for this test. If this attack defeats an enemy, you may exhaust Pocketknife to gain 1 resource."
    ],
    "traits": [
      "Item. Tool. Weapon. Melee."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60559"
  },
  {
    "instanceId": "rabbit-s-foot-1",
    "name": "Rabbit's Foot",
    "type": "asset",
    "text": [
      "[reaction] After you fail a skill test, exhaust Rabbit's Foot: Draw 1 card."
    ],
    "traits": [
      "Item. Charm."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60560"
  },
  {
    "instanceId": "same-old-thing-1",
    "name": "Same Old Thing",
    "type": "asset",
    "text": [
      "Uses (5 supplies). If there are no supplies on Same Old Thing, discard it.",
      "You may spend supplies on Same Old Thing as resources to pay for events played by any investigator at your location."
    ],
    "traits": [
      "Condition."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60561"
  },
  {
    "instanceId": "decoy-trap-1",
    "name": "Decoy Trap",
    "type": "event",
    "text": [
      "Fast. Attach to your location. Limit 1 [[Trap]] per location.",
      "[reaction] After an enemy enters attached location, exhaust Decoy Trap: <b>Evade</b> ([intellect] or [agility]). Evade that enemy. You get +1 skill value for this evasion. If this test succeeds, you may discard Decoy Trap to move to this location. <i>(You may trigger this ability from any location.)</i>"
    ],
    "traits": [
      "Trap. Trick."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60562"
  },
  {
    "instanceId": "glassing-1",
    "name": "Glassing",
    "type": "event",
    "text": [
      "Fast. Attach to your location. Limit 1 [[Trap]] per location.",
      "[reaction] After an enemy enters attached location, exhaust Glassing: <b>Investigate</b> ([intellect] or [agility]). You get +1 skill value for this investigation. If you succeed, you may discard Glassing to discover 1 additional clue at this location. <i>(You may trigger this ability from any location.)</i>"
    ],
    "traits": [
      "Insight. Trap."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60563"
  },
  {
    "instanceId": "guerrilla-tactics-1",
    "name": "Guerrilla Tactics",
    "type": "event",
    "text": [
      "<b>Fight</b> ([combat]) or <b>Evade</b> ([agility]). You get +1 skill value for this test and you may target an enemy at a connecting location as if you were engaged with that enemy."
    ],
    "traits": [
      "Tactic."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60564"
  },
  {
    "instanceId": "hidden-shelter-1",
    "name": "Hidden Shelter",
    "type": "event",
    "text": [
      "Attach to your location. Limit 1 per location.",
      "[reaction] When the round ends, each investigator at this location may choose one of the following: Draw 1 card, gain 1 resource, heal 1 damage, or heal 1 horror.",
      "<b>Forced</b> - After an enemy enters this location: Discard Hidden Shelter."
    ],
    "traits": [
      "Supply. Trick."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60565"
  },
  {
    "instanceId": "lie-in-wait-1",
    "name": "Lie in Wait",
    "type": "event",
    "text": [
      "Fast. Attach to your location. Limit 1 [[Trap]] per location.",
      "[reaction] After an enemy enters this location, exhaust Lie in Wait: <b>Fight</b> ([combat] or [agility]). Fight that enemy. You get +1 skill value for this attack. You may discard Lie in Wait for this attack to deal +1 damage. <i>(You may trigger this ability from any location.)</i>"
    ],
    "traits": [
      "Tactic. Trap."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60566"
  },
  {
    "instanceId": "stalk-prey-1",
    "name": "Stalk Prey",
    "type": "event",
    "text": [
      "Search the top 9 cards of the encounter deck for an enemy, draw it, and shuffle the encounter deck. Then, draw 1 card and discover 1 clue at your location. If that enemy is not at your location, you may move once toward its location."
    ],
    "traits": [
      "Tactic."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60567"
  },
  {
    "instanceId": "do-or-die-1",
    "name": "Do-or-Die",
    "type": "skill",
    "text": [
      "If this skill test is successful, choose a [survivor] asset or event in your discard pile and add it to your hand."
    ],
    "traits": [
      "Fortune."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60568"
  },
  {
    "instanceId": "on-the-brink-1",
    "name": "On the Brink",
    "type": "skill",
    "text": [
      "Max 1 committed per skill test.",
      "If this test fails, return each other card committed to this test to its owner's hand."
    ],
    "traits": [
      "Gambit. Desperate."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60569"
  },
  {
    "instanceId": "extra-rations-1",
    "name": "Extra Rations",
    "type": "asset",
    "text": [
      "Uses (4 supplies). If there are no supplies on Extra Rations, discard it.",
      "[fast] Spend 1 supply and exhaust Extra Rations: Heal 1 damage from your investigator or an [[Ally]] asset you control."
    ],
    "traits": [
      "Item. Supply."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60570"
  },
  {
    "instanceId": "field-dressing-1",
    "name": "Field Dressing",
    "type": "event",
    "text": [
      "Fast. Play after a [[Creature]] or [[Monster]] enemy at your location is defeated.",
      "Heal up to 3 damage from among investigators and/or [[Ally]] assets at your location."
    ],
    "traits": [
      "Spirit."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60571"
  },
  {
    "instanceId": "rough-1",
    "name": "Rough",
    "type": "skill",
    "text": [
      "For every 2 damage on you (rounded up), Rough gains [wild]."
    ],
    "traits": [
      "Innate."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60572"
  },
  {
    "instanceId": "canteen-1",
    "name": "Canteen",
    "type": "asset",
    "text": [
      "Uses (3 supplies).",
      "[fast] Spend 1 supply and exhaust Canteen: Heal 2 horror."
    ],
    "traits": [
      "Item."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60573"
  },
  {
    "instanceId": "hunter-s-instinct-1",
    "name": "Hunter's Instinct",
    "type": "asset",
    "text": [
      "Limit 1 per investigator. Uses (3 supplies).",
      "[reaction] After you engage an enemy, spend 1 supply and exhaust Hunter's Instinct: Add a level 0-2 event in your discard pile to your hand."
    ],
    "traits": [
      "Talent."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60574"
  },
  {
    "instanceId": "winchester-model-52-1",
    "name": "Winchester Model 52",
    "type": "asset",
    "text": [
      "Uses (2 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +3 [combat] and deal +1 damage for this attack.",
      "[action] Discard Winchester Model 52: <b>Fight</b> ([combat]). You get +3 [combat] for this attack. If you succeed, automatically evade the targeted enemy."
    ],
    "traits": [
      "Item. Weapon. Firearm."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60575"
  },
  {
    "instanceId": "guerrilla-tactics-1",
    "name": "Guerrilla Tactics",
    "type": "event",
    "text": [
      "<b>Fight</b> ([combat]) or <b>Evade</b> ([agility]). You get +2 skill value for this test and you may target an enemy at a connecting location as if you were engaged with that enemy. If you succeed, deal 1 damage to that enemy <i>(in addition to its standard damage)</i>."
    ],
    "traits": [
      "Tactic."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60576"
  },
  {
    "instanceId": "respite-1",
    "name": "Respite",
    "type": "event",
    "text": [
      "Play only if there are no enemies at your location.",
      "Choose up to 3 level 0 event and/or skill cards in your discard pile and shuffle them into your deck. Draw 1 card."
    ],
    "traits": [
      "Spirit."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60577"
  },
  {
    "instanceId": "rope-trap-1",
    "name": "Rope Trap",
    "type": "event",
    "text": [
      "Attach to your location. Limit 1 [[Trap]] attached.",
      "[reaction] When an enemy enters attached location, exhaust Rope Trap: Deal 1 damage to that enemy. Reveal a random token from the chaos bag. If a [skull] or [auto_fail] token is revealed, discard Rope Trap. <i>(You may trigger this ability from any location.)</i>"
    ],
    "traits": [
      "Trap. Trick."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60578"
  },
  {
    "instanceId": "levelheaded-1",
    "name": "Levelheaded",
    "type": "asset",
    "text": [
      "Starting. <i>(You may begin the game with 1 copy of a starting card in your opening hand.)</i>",
      "[fast] Spend 1 resource: You get +1 [willpower] for this skill test (+2 [willpower] instead if this test is on a scenario card).",
      "[fast] Spend 1 resource: You get +1 [agility] for this skill test (+2 [agility] instead if this test is on a scenario card)."
    ],
    "traits": [
      "Talent."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60579"
  },
  {
    "instanceId": "longbow-1",
    "name": "Longbow",
    "type": "asset",
    "text": [
      "Uses (1 arrow).",
      "[action] Spend 1 arrow: <b>Fight</b> ([agility]). You get +2 [agility] and deal +2 damage for this attack. This attack ignores the aloof keyword.",
      "[action]: Replenish 1 arrow on Longbow."
    ],
    "traits": [
      "Item. Weapon. Ranged."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60580"
  },
  {
    "instanceId": "makeshift-bomb-1",
    "name": "Makeshift Bomb",
    "type": "event",
    "text": [
      "Attach to your location. Limit 1 [[Trap]] attached.",
      "[reaction] After an enemy or investigator enters attached location, discard Makeshift Bomb: Deal 3 damage to each enemy and investigator at that location. <i>(You may trigger this ability from any location.)</i>"
    ],
    "traits": [
      "Trap."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60581"
  },
  {
    "instanceId": "timely-intervention-1",
    "name": "Timely Intervention",
    "type": "skill",
    "text": [
      "Max 1 committed per skill test.",
      "You may commit Timely Intervention from your hand after revealing chaos tokens during a skill test you are performing."
    ],
    "traits": [
      "Fortune."
    ],
    "icons": [],
    "faction": "survivor",
    "isWeakness": false,
    "code": "60582"
  },
];
