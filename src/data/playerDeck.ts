import type { PlayerCard } from "../types/game";

export const playerDeck: PlayerCard[] = [
  {
    "id": "danielas-wrench-2",
    "name": "Daniela's Wrench",
    "type": "asset",
    "text": "Daniela Reyes deck only. Fast. Exhaust Daniela's Wrench: Choose an enemy at your location. That enemy engages you and makes an immediate attack. Action:: Fight (combat). You get +2 combat for this attack. If this enemy attacked you this round, this attack deals +1 damage.",
    "image": "players/Danielas_Wrench.jpg",
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
    "id": "in-harms-way-3",
    "name": "In Harm's Way",
    "type": "treachery",
    "text": "Revelation - Put In Harm's Way into play in your threat area. Forced - After you deal damage to an enemy: Take 1 damage and place 1 damage on In Harm's Way. If there is 3 or more damage on this card, discard it. Forced - When the game ends: Suffer 1 physical trauma.",
    "image": "players/In_Harms_Way.jpg",
    "traits": [
      "Flaw"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12003",
  },
  {
    "id": "detectives-intuition-5",
    "name": "Detective's Intuition",
    "type": "event",
    "text": "Joe Diamond deck only. Gain 2 resources and heal 1 damage or 1 horror. Reaction: After you draw Detective's Intuition during your turn: Reveal it and draw 2 additional cards.",
    "image": "players/Detectives_Intuition.jpg",
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
    "id": "dead-ends-6",
    "name": "Dead Ends",
    "type": "event",
    "text": "Forced - When you search your deck and Dead Ends is among the searched cards: Draw it, cancel the effects of the search, and shuffle your deck. Forced - When the game ends or you are eliminated, if this card is in your hand: You earn 2 fewer experience.",
    "image": "players/Dead_Ends.jpg",
    "cost": 5,
    "traits": [
      "Blunder"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12006",
  },
  {
    "id": "covert-ops-8",
    "name": "Covert Ops",
    "type": "asset",
    "text": "Trish Scarborough deck only. Reaction: After you evade an enemy, exhaust Covert Ops: Either draw 1 card, or move to a connecting location.",
    "image": "players/Covert_Ops.jpg",
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
    "id": "black-chamber-operative-9",
    "name": "Black Chamber Operative",
    "type": "enemy",
    "text": "Hunter. Prey (Trish Scarborough only). Forced - After you evade Black Chamber Operative: Place 1 of your clues on your location. If you cannot, this enemy readies, engages you, and makes an immediate attack.",
    "image": "players/Black_Chamber_Operative.jpg",
    "traits": [
      "Humanoid",
      "Coterie"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12009",
  },
  {
    "id": "for-my-next-trick-1",
    "name": "\"For my next trick...\"",
    "type": "event",
    "text": "Dexter Drake deck only. Search your deck for a [[Spell]] or [[Item]] asset and play it, reducing its cost by 2 <i>(shuffle your deck)</i>. This action does not provoke attacks of opportunity.",
    "image": "players/For_my_next_trick.jpg",
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
    "id": "the-necronomicon-2",
    "name": "The Necronomicon",
    "type": "asset",
    "text": "Revelation - Put The Necronomicon into play in your threat area. It cannot leave play except by the Action: ability below. You cannot play assets or trigger abilities on other assets you control. Action:: Test willpower (5). If you succeed, discard The Necronomicon. If you fail, shuffle it into your deck and take 1 horror.",
    "image": "players/The_Necronomicon.jpg",
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
    "id": "isabelles-twin-45s-4",
    "name": "Isabelle's Twin .45s",
    "type": "asset",
    "text": "Isabelle Barnes deck only. Uses (6 ammo). Action: Spend 1 ammo: Fight (combat). You get +1 combat and deal +1 damage for this attack. Reaction: After you resolve the above ability, spend 1 ammo and exhaust Isabelle's Twin .45s: Fight (agility). You get +1 agility and deal +1 damage for this attack.",
    "image": "players/Isabelles_Twin_45s.jpg",
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
    "id": "breaking-point-5",
    "name": "Breaking Point",
    "type": "treachery",
    "text": "Revelation - Take 1 direct damage. Then, if you have 6 or fewer remaining sanity, take 1 direct damage. Then, if you have 3 or fewer remaining sanity, take 1 direct damage.",
    "image": "players/Breaking_Point.jpg",
    "traits": [
      "Hardship"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12015",
  },
  {
    "id": "bodyguard-6",
    "name": "Bodyguard",
    "type": "asset",
    "text": "Bodyguard may be assigned damage dealt to other investigators at your location. Reaction: When Bodyguard is defeated: Deal 1 damage to an enemy at your location.",
    "image": "players/Bodyguard.jpg",
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
    "id": "endurance-7",
    "name": "Endurance",
    "type": "asset",
    "text": "Fast. Spend 1 resource: You get +1 combat for this skill test (+2 combat instead if this is an attack or evasion). Fast. Spend 1 resource: You get +1 agility for this skill test (+2 agility instead if this is an attack or evasion).",
    "image": "players/Endurance.jpg",
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
    "id": "logan-hastings-8",
    "name": "Logan Hastings",
    "type": "asset",
    "text": "You get +1 combat. Reaction: After you defeat an enemy, exhaust Logan Hastings: Gain 1 resource.",
    "image": "players/Logan_Hastings.jpg",
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
    "id": "m1911-9",
    "name": "M1911",
    "type": "asset",
    "text": "Uses (4 ammo). Action: Spend 1 ammo: Fight (combat). You get +1 combat and deal +1 damage for this attack.",
    "image": "players/M1911.jpg",
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
    "id": "machete-0",
    "name": "Machete",
    "type": "asset",
    "text": "Action:: Fight. You get +1 combat for this attack. If the attacked enemy is the only enemy engaged with you, this attack deals +1 damage.",
    "image": "players/Machete.jpg",
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
    "id": "resilience-1",
    "name": "Resilience",
    "type": "asset",
    "text": "",
    "image": "players/Resilience.jpg",
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
    "id": "lesson-learned-2",
    "name": "Lesson Learned",
    "type": "event",
    "text": "Fast. Play after an enemy attacks you. Discover 1 clue at your location.",
    "image": "players/Lesson_Learned.jpg",
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
    "id": "right-tool-for-the-job-3",
    "name": "Right Tool for the Job",
    "type": "event",
    "text": "Search the top 9 cards of your deck for a [[Tool]] or [[Weapon]] asset and add it to your hand. Shuffle your deck.",
    "image": "players/Right_Tool_for_the_Job.jpg",
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
    "id": "scene-of-the-crime-4",
    "name": "Scene of the Crime",
    "type": "event",
    "text": "Play only as your first action. Discover 1 clue at your location (2 clues instead if there is an enemy at that location). This action does not provoke attacks of opportunity.",
    "image": "players/Scene_of_the_Crime.jpg",
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
    "id": "vicious-blow-5",
    "name": "Vicious Blow",
    "type": "skill",
    "text": "If this skill test is successful during an attack, that attack deals +1 damage.",
    "image": "players/Vicious_Blow.jpg",
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
    "id": "counterattack-6",
    "name": "Counterattack",
    "type": "event",
    "text": "Fast. Play when an enemy attacks an investigator at your location <i>(before resolving that attack)</i>. Cancel that attack. Deal 1 damage to that enemy.",
    "image": "players/Counterattack.jpg",
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
    "id": "bodyguard-7",
    "name": "Bodyguard",
    "type": "asset",
    "text": "Bodyguard may be assigned damage dealt to other investigators at your location. Reaction: When Bodyguard is defeated: Deal 2 damage to an enemy at your location.",
    "image": "players/Bodyguard.jpg",
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
    "id": "sledgehammer-8",
    "name": "Sledgehammer",
    "type": "asset",
    "text": "Action:: Fight (combat). This attack deals + 1 damage. Action:Action:: Fight (combat). You get +3 combat for this attack. If you succeed, you may exhaust Sledgehammer for this attack to deal +2 damage.",
    "image": "players/Sledgehammer.jpg",
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
    "id": "winchester-model-12-9",
    "name": "Winchester Model 12",
    "type": "asset",
    "text": "Uses (3 ammo). Action: Spend 1 ammo: Fight (combat). You get +3 combat for this attack. If you succeed, this attack deals +1 damage for each point you succeed by (to a maximum of +4). If you fail and would deal damage to another investigator, this attack deals 1 damage for each point you fail by (to a maximum of 5 damage).",
    "image": "players/Winchester_Model_12.jpg",
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
    "id": "dorothy-simmons-0",
    "name": "Dorothy Simmons",
    "type": "asset",
    "text": "You get +1 intellect. Reaction: After you successfully investigate by exactly 1 or 3, exhaust Dorothy Simmons: Gain 1 resource.",
    "image": "players/Dorothy_Simmons.jpg",
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
    "id": "fingerprint-kit-1",
    "name": "Fingerprint Kit",
    "type": "asset",
    "text": "Uses (3 supplies). Action: Exhaust Fingerprint Kit and spend 1 supply: Investigate. You get +1 intellect for this investigation. If you succeed, you discover 1 additional clue at your location.",
    "image": "players/Fingerprint_Kit.jpg",
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
    "id": "laboratory-assistant-2",
    "name": "Laboratory Assistant",
    "type": "asset",
    "text": "Your maximum hand size is increased by 2. Reaction: After Laboratory Assistant enters play: Draw 2 cards.",
    "image": "players/Laboratory_Assistant.jpg",
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
    "id": "local-map-3",
    "name": "Local Map",
    "type": "asset",
    "text": "Uses (4 secrets). Action: Spend 1 secret: Investigate (intellect). Investigate a revealed connecting location. You get +1 intellect for this investigation. If you succeed, you may exhaust Local Map to move to that location.",
    "image": "players/Local_Map.jpg",
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
    "id": "magnifying-glass-4",
    "name": "Magnifying Glass",
    "type": "asset",
    "text": "Fast. You get +1 intellect while investigating.",
    "image": "players/Magnifying_Glass.jpg",
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
    "id": "sharp-rhetoric-5",
    "name": "Sharp Rhetoric",
    "type": "asset",
    "text": "Fast. Spend 1 resource: You get +1 intellect for this skill test (+2 intellect instead if this is an investigation or parley). Fast. Spend 1 resource: You get +1 willpower for this skill test (+2 willpower instead if this is an investigation or parley).",
    "image": "players/Sharp_Rhetoric.jpg",
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
    "id": "gather-intel-6",
    "name": "Gather Intel",
    "type": "event",
    "text": "Fast. Play when an enemy enters your location. Draw 2 cards.",
    "image": "players/Gather_Intel.jpg",
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
    "id": "through-the-cracks-7",
    "name": "Through the Cracks",
    "type": "event",
    "text": "Evade (agility). You get +1 agility for this evasion for each clue you control (to a maximum of +3). If you succeed, you may disengage from each enemy engaged with you and move to a revealed connecting location.",
    "image": "players/Through_the_Cracks.jpg",
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
    "id": "working-a-hunch-8",
    "name": "Working a Hunch",
    "type": "event",
    "text": "Fast. Play only during your turn. Discover 1 clue at your location.",
    "image": "players/Working_a_Hunch.jpg",
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
    "id": "deduction-9",
    "name": "Deduction",
    "type": "skill",
    "text": "If this skill test is successful while investigating a location, discover 1 additional clue at that location.",
    "image": "players/Deduction.jpg",
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
    "id": "mysterious-grimoire-0",
    "name": "Mysterious Grimoire",
    "type": "asset",
    "text": "Uses (4 secrets). Fast. During your turn, spend 1 or 2 secrets and exhaust Mysterious Grimoire: Search the top 3 cards (or 6 cards instead if you spent 2 secrets) of your deck for a card and draw it. If 1 or more weaknesses are among the searched cards, draw them as well. Shuffle your deck.",
    "image": "players/Mysterious_Grimoire.jpg",
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
    "id": "through-the-cracks-1",
    "name": "Through the Cracks",
    "type": "event",
    "text": "Evade (agility). You get +2 agility for this evasion for each clue you control (to a maximum of +6). If you succeed, you may disengage from each enemy engaged with you and move to a revealed connecting location.",
    "image": "players/Through_the_Cracks.jpg",
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
    "id": "studious-2",
    "name": "Studious",
    "type": "asset",
    "text": "Permanent. You begin each game with 1 additional card in your opening hand.",
    "image": "players/Studious.jpg",
    "traits": [
      "Talent"
    ],
    "faction": "seeker",
    "code": "12042"
  },
  {
    "id": "unbridled-knowledge-3",
    "name": "Unbridled Knowledge",
    "type": "event",
    "text": "Reveal the top 5 cards of your deck (8 cards instead if you control 2 or more clues). Draw 3 of them and place the rest of those cards on the top and/or bottom of your deck in any order.",
    "image": "players/Unbridled_Knowledge.jpg",
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
    "id": "lucky-cigarette-case-4",
    "name": "Lucky Cigarette Case",
    "type": "asset",
    "text": "Reaction: After you succeed at a skill test by 2 or more, exhaust Lucky Cigarette Case: Draw 1 card.",
    "image": "players/Lucky_Cigarette_Case.jpg",
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
    "id": "m1903-hammerless-5",
    "name": "M1903 Hammerless",
    "type": "asset",
    "text": "Uses (4 ammo). Action: Spend 1 ammo: Fight (agility). If the targeted enemy is exhausted, this attack deals +1 damage.",
    "image": "players/M1903_Hammerless.jpg",
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
    "id": "olivier-bishop-6",
    "name": "Olivier Bishop",
    "type": "asset",
    "text": "You get +1 agility. Fast. During your turn, exhaust Olivier Bishop: Move to a connecting location.",
    "image": "players/Olivier_Bishop.jpg",
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
    "id": "silver-tongue-7",
    "name": "Silver Tongue",
    "type": "asset",
    "text": "Fast. Spend 1 resource: You get +1 intellect for this skill test (+2 intellect instead if this is an evasion or parley). Fast. Spend 1 resource: You get +1 agility for this skill test (+2 agility instead if this is an evasion or parley).",
    "image": "players/Silver_Tongue.jpg",
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
    "id": "sticky-fingers-8",
    "name": "Sticky Fingers",
    "type": "asset",
    "text": "Limit 1 per investigator. Reaction: After you successfully evade an enemy, exhaust Sticky Fingers: Gain 1 resource.",
    "image": "players/Sticky_Fingers.jpg",
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
    "id": "thieves-kit-9",
    "name": "Thieves' Kit",
    "type": "asset",
    "text": "Uses (6 supplies). Action: Spend 1 supply: Investigate. You may use agility instead of intellect for this investigation. If you succeed, gain 1 resource.",
    "image": "players/Thieves_Kit.jpg",
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
    "id": "breaking-and-entering-0",
    "name": "Breaking and Entering",
    "type": "event",
    "text": "Investigate. Add your agility value to your skill value for this investigation. If you succeed by 2 or more, you may automatically evade an enemy at this location. This action does not provoke attacks of opportunity.",
    "image": "players/Breaking_and_Entering.jpg",
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
    "id": "paint-the-town-red-1",
    "name": "Paint the Town Red",
    "type": "event",
    "text": "Parley. Search the top 9 cards of the encounter deck for a non-[[Elite]] enemy, draw it, and gain resources equal to that enemy's printed health. Shuffle the encounter deck.",
    "image": "players/Paint_the_Town_Red.jpg",
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
    "id": "prestidigitation-2",
    "name": "Prestidigitation",
    "type": "event",
    "text": "Fast. Play only during your turn. Play an [[Item]] asset from your hand, reducing its cost by 2. When your turn ends, return an [[Item]] asset you control to your hand.",
    "image": "players/Prestidigitation.jpg",
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
    "id": "out-of-sight-3",
    "name": "Out of Sight",
    "type": "skill",
    "text": "Max 1 committed per skill test. If this test is successful by 2 or more, the performing investigator may disengage from each enemy and move to a revealed connecting location.",
    "image": "players/Out_of_Sight.jpg",
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
    "id": "sticky-fingers-4",
    "name": "Sticky Fingers",
    "type": "asset",
    "text": "Fast. Limit 1 per investigator. Reaction: After you successfully evade an enemy, exhaust Sticky Fingers: Gain 1 resource.",
    "image": "players/Sticky_Fingers.jpg",
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
    "id": "decisive-strike-5",
    "name": "Decisive Strike",
    "type": "event",
    "text": "Fight (combat). You get +2 combat and deal +1 damage for this attack. If this attack defeats an enemy, gain 5 resources.",
    "image": "players/Decisive_Strike.jpg",
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
    "id": "another-day-another-dollar-6",
    "name": "Another Day, Another Dollar",
    "type": "asset",
    "text": "Permanent. You begin each game with 2 additional resources.",
    "image": "players/Another_Day_Another_Dollar.jpg",
    "traits": [
      "Talent"
    ],
    "faction": "rogue",
    "code": "12056"
  },
  {
    "id": "out-of-sight-7",
    "name": "Out of Sight",
    "type": "skill",
    "text": "Max 1 committed per skill test. If this test is successful by 1 or more, the performing investigator may disengage from each enemy and move to a revealed location up to 2 connections away.",
    "image": "players/Out_of_Sight.jpg",
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
    "id": "cloak-of-resonance-8",
    "name": "Cloak of Resonance",
    "type": "asset",
    "text": "Reaction: When horror is placed on Cloak of Resonance, exhaust it: Deal 1 damage to an enemy at your location.",
    "image": "players/Cloak_of_Resonance.jpg",
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
    "id": "cosmic-flame-9",
    "name": "Cosmic Flame",
    "type": "asset",
    "text": "Uses (3 charges). Action:: Fight (willpower). If you succeed, you may spend 1 charge to deal +1 damage for this attack. If you reveal a [skull] token during this test, remove 1 charge from Cosmic Flame (if you cannot, take 1 damage and discard this card).",
    "image": "players/Cosmic_Flame.jpg",
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
    "id": "jim-culver-0",
    "name": "Jim Culver",
    "type": "asset",
    "text": "You get +1 willpower. Reaction: After you take damage and/or horror, exhaust Jim Culver: Draw 1 card.",
    "image": "players/Jim_Culver.jpg",
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
    "id": "lucky-charm-1",
    "name": "Lucky Charm",
    "type": "asset",
    "text": "Uses (4 charges). Fast. Spend 1 charge and exhaust Lucky Charm: Move 1 damage or 1 horror from a card at your location to a card you control <i>(with a health or sanity value)</i>.",
    "image": "players/Lucky_Charm.jpg",
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
    "id": "second-sight-2",
    "name": "Second Sight",
    "type": "asset",
    "text": "Uses (3 charges). Action:: Investigate (willpower). If you succeed, you may spend 1 charge to discover 1 additional clue at your location. If you reveal a [cultist] token during this test, remove 1 charge from Second Sight (if you cannot, take 1 horror and discard this card).",
    "image": "players/Second_Sight.jpg",
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
    "id": "spiritual-intuition-3",
    "name": "Spiritual Intuition",
    "type": "asset",
    "text": "Fast. Spend 1 resource: You get +1 willpower for this skill test (+2 willpower instead if this test is on a [[Spell]] or [[Ritual]] card). Fast. Spend 1 resource: You get +1 combat for this skill test (+2 combat instead if this test is on a [[Spell]] or [[Ritual]] card).",
    "image": "players/Spiritual_Intuition.jpg",
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
    "id": "premonition-4",
    "name": "Premonition",
    "type": "event",
    "text": "Fast. Play during any Fast. player window. Put Premonition into play, reveal a random chaos token from the chaos bag, and seal it on Premonition. Forced - When a chaos token would be revealed from the chaos bag: Resolve the token sealed here as if it were just revealed from the chaos bag, instead. Then, discard Premonition.",
    "image": "players/Premonition.jpg",
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
    "id": "ward-of-protection-5",
    "name": "Ward of Protection",
    "type": "event",
    "text": "Fast. Play when you draw a non-weakness treachery card. Cancel that card's revelation effect. Then, take 1 horror.",
    "image": "players/Ward_of_Protection.jpg",
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
    "id": "will-of-the-cosmos-6",
    "name": "Will of the Cosmos",
    "type": "event",
    "text": "Place 1 doom on a player card you control. Then, discover 1 clue at your location and 1 clue at another revealed location.",
    "image": "players/Will_of_the_Cosmos.jpg",
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
    "id": "soul-link-7",
    "name": "Soul Link",
    "type": "skill",
    "text": "As an additional cost to commit Soul Link, take 1 horror.",
    "image": "players/Soul_Link.jpg",
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
    "id": "mask-of-silenus-8",
    "name": "Mask of Silenus",
    "type": "asset",
    "text": "Uses (3 charges). Reaction: When you would reveal a chaos token, spend 1 charge: Reveal 1 additional token. Choose 1 of those tokens to resolve and ignore the other. If you resolved a token with a symbol, take 1 horror.",
    "image": "players/Mask_of_Silenus.jpg",
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
    "id": "fearless-9",
    "name": "Fearless",
    "type": "skill",
    "text": "If this skill test is successful, heal 1 horror (2 horror instead if it succeeds by 2 or more).",
    "image": "players/Fearless.jpg",
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
    "id": "augur-of-elokoss-0",
    "name": "Augur of Elokoss",
    "type": "event",
    "text": "Investigate (intellect). Add your willpower to your intellect for this investigation. If you succeed, discover 1 additional clue at your location. If you succeed and a token with a symbol was revealed during this test, you may discard a [[Terror]] or [[Hex]] treachery from any investigator's threat area.",
    "image": "players/Augur_of_Elokoss.jpg",
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
    "id": "cosmic-flame-1",
    "name": "Cosmic Flame",
    "type": "asset",
    "text": "Uses (4 charges). Action:: Fight (willpower). You get +2 willpower and deal +1 damage for this attack. If you succeed, you may spend 1 charge to deal 1 damage to an enemy at your location. If you reveal a [skull] token during this test, remove 1 charge from Cosmic Flame (if you cannot, take 1 damage and discard this card).",
    "image": "players/Cosmic_Flame.jpg",
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
    "id": "aleksey-saburov-2",
    "name": "Aleksey Saburov",
    "type": "asset",
    "text": "Reaction: When your turn begins: Heal 1 damage or 1 horror from Aleksey Saburov.",
    "image": "players/Aleksey_Saburov.jpg",
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
    "id": "bandages-3",
    "name": "Bandages",
    "type": "asset",
    "text": "Uses (3 supplies). If Bandages has no supplies, discard it. Reaction: After an investigator or [[Ally]] asset at your location takes 1 or more damage, spend 1 supply: Heal 1 damage from that card.",
    "image": "players/Bandages.jpg",
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
    "id": "hunters-instinct-4",
    "name": "Hunter's Instinct",
    "type": "asset",
    "text": "Limit 1 per investigator. Uses (3 supplies). If there are no supplies on Hunter's Instinct, discard it. Reaction: After you engage an enemy, spend 1 supply and exhaust Hunter's Instinct: Add a level 0 event in your discard pile to your hand.",
    "image": "players/Hunters_Instinct.jpg",
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
    "id": "jumpsuit-5",
    "name": "Jumpsuit",
    "type": "asset",
    "text": "Fast. During your turn, discard Jumpsuit: Choose a [[Tool]] or [[Weapon]] asset in your discard pile and add it to your hand.",
    "image": "players/Jumpsuit.jpg",
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
    "id": "levelheaded-6",
    "name": "Levelheaded",
    "type": "asset",
    "text": "Fast. Spend 1 resource: You get +1 willpower for this skill test (+2 willpower instead if this test is on a scenario card). Fast. Spend 1 resource: You get +1 agility for this skill test (+2 agility instead if this test is on a scenario card).",
    "image": "players/Levelheaded.jpg",
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
    "id": "meat-cleaver-7",
    "name": "Meat Cleaver",
    "type": "asset",
    "text": "Action:: Fight. You get +1 combat for this attack (+2 combat instead if you have 3 or fewer remaining sanity). If this attack defeats an enemy, you may heal 1 horror. As an additional cost to initiate this ability, you may take 1 horror to have this attack deal +1 damage.",
    "image": "players/Meat_Cleaver.jpg",
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
    "id": "look-what-i-found-8",
    "name": "\"Look what I found!\"",
    "type": "event",
    "text": "Fast. Play after you fail a skill test by 2 or less while investigating. Discover 2 clues in your location.",
    "image": "players/Look_what_I_found.jpg",
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
    "id": "shove-off-9",
    "name": "\"Shove off!\"",
    "type": "event",
    "text": "Evade (agility). If you succeed, deal 1 damage to the evaded enemy. If you fail, return \"Shove off!\" to your hand at the end of your turn.",
    "image": "players/Shove_off.jpg",
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
    "id": "slippery-0",
    "name": "Slippery",
    "type": "skill",
    "text": "If this skill test is successful while evading a non-[[Elite]] enemy, that enemy does not ready during the next upkeep phase.",
    "image": "players/Slippery.jpg",
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
    "id": "timely-intervention-1",
    "name": "Timely Intervention",
    "type": "skill",
    "text": "Max 1 committed per skill test. You may commit Timely Intervention from your hand after revealing chaos tokens during a skill test you are performing.",
    "image": "players/Timely_Intervention.jpg",
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
    "id": "scrape-by-2",
    "name": "Scrape By",
    "type": "event",
    "text": "Fast. Play when you would fail a skill test during which a non-[auto_fail] token was revealed. You succeed at that skill test instead. If a token with a symbol was revealed during that skill test, take 1 horror.",
    "image": "players/Scrape_By.jpg",
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
    "id": "old-compass-3",
    "name": "Old Compass",
    "type": "asset",
    "text": "Action:: Investigate (intellect). Your location gets -1 shroud for this investigation. If you fail, you may exhaust Old Compass to attempt this test again. If you do, your location gets -2 shroud for this investigation, instead.",
    "image": "players/Old_Compass.jpg",
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
    "id": "on-the-brink-4",
    "name": "On the Brink",
    "type": "skill",
    "text": "Max 1 committed per skill test. If this test fails, return each other card committed to this test to its owner's hand and draw 1 card.",
    "image": "players/On_the_Brink.jpg",
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
    "id": "meat-cleaver-5",
    "name": "Meat Cleaver",
    "type": "asset",
    "text": "Action:: Fight (combat). You get +2 combat for this attack (+3 combat instead if you have 3 or fewer remaining sanity). If this attack defeats an enemy, you may heal 1 horror. Reaction: When you trigger the above Action: ability, take 1 horror: This attack deals +1 damage.",
    "image": "players/Meat_Cleaver.jpg",
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
    "id": "broken-bottle-6",
    "name": "Broken Bottle",
    "type": "asset",
    "text": "Action:: Fight (combat). You get +1 combat for this attack. If you succeed, you may discard Broken Bottle to deal +1 damage for this attack.",
    "image": "players/Broken_Bottle.jpg",
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
    "id": "fedora-7",
    "name": "Fedora",
    "type": "asset",
    "text": "",
    "image": "players/Fedora.jpg",
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
    "id": "hand-crank-flashlight-8",
    "name": "Hand-Crank Flashlight",
    "type": "asset",
    "text": "Action:: Investigate (intellect). You get +1 intellect for this test. If you succeed, you may discard Hand-Crank Flashlight for your location to get -1 shroud until the end of the round.",
    "image": "players/Hand-Crank_Flashlight.jpg",
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
    "id": "emergency-cache-9",
    "name": "Emergency Cache",
    "type": "event",
    "text": "Gain 3 resources.",
    "image": "players/Emergency_Cache.jpg",
    "cost": 0,
    "traits": [
      "Supply"
    ],
    "faction": "neutral",
    "code": "12089"
  },
  {
    "id": "guts-0",
    "name": "Guts",
    "type": "skill",
    "text": "Max 1 committed per skill test. If this test is successful, draw 1 card.",
    "image": "players/Guts.jpg",
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
    "id": "manual-dexterity-1",
    "name": "Manual Dexterity",
    "type": "skill",
    "text": "Max 1 committed per skill test. If this test is successful, draw 1 card.",
    "image": "players/Manual_Dexterity.jpg",
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
    "id": "overpower-2",
    "name": "Overpower",
    "type": "skill",
    "text": "Max 1 committed per skill test. If this test is successful, draw 1 card.",
    "image": "players/Overpower.jpg",
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
    "id": "perception-3",
    "name": "Perception",
    "type": "skill",
    "text": "Max 1 committed per skill test. If this test is successful, draw 1 card.",
    "image": "players/Perception.jpg",
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
    "id": "unexpected-courage-4",
    "name": "Unexpected Courage",
    "type": "skill",
    "text": "Max 1 committed per skill test.",
    "image": "players/Unexpected_Courage.jpg",
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
    "id": "charisma-5",
    "name": "Charisma",
    "type": "asset",
    "text": "Permanent. You have 1 additional ally slot.",
    "image": "players/Charisma.jpg",
    "traits": [
      "Talent"
    ],
    "faction": "neutral",
    "code": "12095"
  },
  {
    "id": "relic-hunter-6",
    "name": "Relic Hunter",
    "type": "asset",
    "text": "Permanent. You have 1 additional accessory slot.",
    "image": "players/Relic_Hunter.jpg",
    "traits": [
      "Talent"
    ],
    "faction": "neutral",
    "code": "12096"
  },
  {
    "id": "amnesia-7",
    "name": "Amnesia",
    "type": "treachery",
    "text": "Revelation - Choose and discard all but 1 card from your hand.",
    "image": "players/Amnesia.jpg",
    "traits": [
      "Madness"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12097"
  },
  {
    "id": "the-gold-bug-8",
    "name": "The Gold Bug",
    "type": "asset",
    "text": "Revelation - Put The Gold Bug into play in your threat area. It cannot leave play except by the Action: ability below. You get -1 health and -1 sanity. Action:: Shuffle the Gold Bug into your deck.",
    "image": "players/The_Gold_Bug.jpg",
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
    "id": "the-nameless-lurker-9",
    "name": "The Nameless Lurker",
    "type": "enemy",
    "text": "Aloof. Spawn - Farthest empty location. Forced - When the investigation phase ends, if The Nameless Lurker is ready and has no doom on it: Place 1 doom on it.",
    "image": "players/The_Nameless_Lurker.jpg",
    "traits": [
      "Humanoid",
      "Monster"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12099"
  },
  {
    "id": "overzealous-0",
    "name": "Overzealous",
    "type": "treachery",
    "text": "Revelation - Draw the top card of the encounter deck. That card gains surge.",
    "image": "players/Overzealous.jpg",
    "traits": [
      "Flaw"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12100"
  },
  {
    "id": "paranoia-1",
    "name": "Paranoia",
    "type": "treachery",
    "text": "Revelation - Discard all your resources.",
    "image": "players/Paranoia.jpg",
    "traits": [
      "Madness"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12101"
  },
  {
    "id": "pursued-2",
    "name": "Pursued",
    "type": "treachery",
    "text": "Revelation - Put Pursued into play in your threat area. Forced - After an enemy enters <i>(moves into or spawns at)</i> your location: Take 1 horror. Action:Action:: Discard Pursued.",
    "image": "players/Pursued.jpg",
    "traits": [
      "Terror"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12102"
  },
  {
    "id": "syndicate-obligations-3",
    "name": "Syndicate Obligations",
    "type": "treachery",
    "text": "Revelation - Put Syndicate Obligations into play in your threat area. Forced - After you spend 1 or more resources: Take 1 damage. Action:Action:: Discard Syndicate Obligations.",
    "image": "players/Syndicate_Obligations.jpg",
    "traits": [
      "Pact",
      "Syndicate"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12103"
  },
  {
    "id": "wounded-4",
    "name": "Wounded",
    "type": "treachery",
    "text": "Revelation - Put Wounded into play in your threat area. Forced - The first time you move each turn: Take 1 damage. Action:Action:: Discard Wounded.",
    "image": "players/Wounded.jpg",
    "traits": [
      "Injury"
    ],
    "faction": "neutral",
    "isWeakness": true,
    "code": "12104"
  }
];
