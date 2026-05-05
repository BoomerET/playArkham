import type { PlayerCard } from "../types/game";

export const playerDeck: PlayerCard[] = 
[
  {
    "instanceId": "know-the-exit-60352",
    "code": "60352",
    "name": "Know the Exit",
    "type": "skill",
    "faction": "rogue",
    "icons": [
      "wild"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "Andr\u00e9 Patel deck only.",
      "While this card is committed to an attack or an evasion, it gains [wild] [wild]."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "know-the-line-60353",
    "code": "60353",
    "name": "Know the Line",
    "type": "skill",
    "faction": "rogue",
    "icons": [
      "wild"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "Andr\u00e9 Patel deck only.",
      "While this card is committed to a skill test on a scenario card, it gains [wild] [wild]."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "know-the-scene-60354",
    "code": "60354",
    "name": "Know the Scene",
    "type": "skill",
    "faction": "rogue",
    "icons": [
      "wild"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "Andr\u00e9 Patel deck only.",
      "While this card is committed to an investigation or parley, it gains [wild] [wild]."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "weight-of-the-world-60355",
    "code": "60355",
    "name": "Weight of the World",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Terror"
    ],
    "text": [
      "<b>Revelation</b> - Put Weight of the World into play in your threat area.",
      "<b>Forced</b> - When you fail a skill test while Weight of the World is in play, take 1 horror and shuffle it back into your deck."
    ],
    "subtype": "weakness",
    "isWeakness": true
  },
  {
    "instanceId": "unaware-60356",
    "code": "60356",
    "name": "Unaware",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Flaw"
    ],
    "text": [
      "<b>Revelation</b> - Put Unaware into play in your threat area.",
      "<b>Forced</b> - The first time you fail a skill test during your turn: Draw the top card of the encounter deck. If that card is an enemy, discard Unaware."
    ],
    "subtype": "basicweakness",
    "isWeakness": true
  },
  {
    "instanceId": "center-stage-60357",
    "code": "60357",
    "name": "Center Stage",
    "type": "asset",
    "faction": "rogue",
    "cost": 3,
    "icons": [],
    "traits": [
      "Talent"
    ],
    "text": [
      "Limit 1 per investigator. Uses (3 renown). If there is no renown on Center Stage, discard it.",
      "[fast] During a skill test, spend 1 renown and exhaust Center Stage: You get +1 skill value for each action you have spent this round <i>(including this one, if this is triggered during one of your actions)</i>."
    ],
    "abilities": []
  },
  {
    "instanceId": "fame-60358",
    "code": "60358",
    "name": "Fame",
    "type": "asset",
    "faction": "rogue",
    "cost": 1,
    "icons": [
      "agility"
    ],
    "traits": [
      "Condition"
    ],
    "text": [
      "Uses (4 renown). If there is no renown on Fame, discard it.",
      "[action] If there is an enemy at your location, spend 1 renown: <b>Parley.</b> Gain 2 resources."
    ],
    "abilities": [],
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "the-grapevine-60359",
    "code": "60359",
    "name": "The Grapevine",
    "type": "asset",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "agility"
    ],
    "traits": [
      "Connection"
    ],
    "text": [
      "Uses (3 rumors). If there are no rumors on The Grapevine, discard it.",
      "[action] Spend 1 rumor and exhaust The Grapevine: <b>Parley.</b> Choose an enemy at a revealed location up to 2 connections away. Move (one location at a time) along the shortest path to that enemy's location and engage it."
    ],
    "abilities": [],
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "extravagant-ring-60360",
    "code": "60360",
    "name": "Extravagant Ring",
    "type": "asset",
    "faction": "rogue",
    "cost": 1,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Charm"
    ],
    "text": [
      "Uses (3 renown).",
      "[reaction] When you would succeed at a skill test, spend 1 renown and exhaust Extravagant Ring: You get +2 skill value for this test."
    ],
    "abilities": [],
    "slot": "Accessory",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "lockpicks-60361",
    "code": "60361",
    "name": "Lockpicks",
    "type": "asset",
    "faction": "rogue",
    "cost": 3,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Tool",
      "Illicit"
    ],
    "text": [
      "[action] Exhaust Lockpicks: <b>Investigate</b> ([intellect]). Add your [agility] to your [intellect] for this test. If you do not succeed by at least 2, discard Lockpicks."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "marcus-sengstacke-60362",
    "code": "60362",
    "name": "Marcus Sengstacke",
    "type": "asset",
    "faction": "rogue",
    "cost": 3,
    "icons": [
      "willpower",
      "intellect"
    ],
    "traits": [
      "Ally",
      "Patron"
    ],
    "text": [
      "You gain 1 additional resource during the upkeep phase.",
      "<b>Forced</b> - After you fail a skill test: Deal 1 horror to Marcus Sengstacke."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 1,
    "sanity": 2,
    "statModifiers": {
      "willpower": 1,
      "intellect": 1
    }
  },
  {
    "instanceId": "polished-cane-60363",
    "code": "60363",
    "name": "Polished Cane",
    "type": "asset",
    "faction": "rogue",
    "cost": 3,
    "icons": [
      "agility"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Melee"
    ],
    "text": [
      "[action]: <b>Fight</b> ([combat]). Add your [agility] to your [combat] for this attack. If this attack succeeds by 2 or more against a non-[[Elite]] enemy, you may exhaust Polished Cane to automatically evade that enemy."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "clean-sweep-60364",
    "code": "60364",
    "name": "Clean Sweep",
    "type": "event",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Tactic",
      "Trick"
    ],
    "text": [
      "<b>Investigate</b> ([intellect]). You get +2 [intellect] for this investigation. If you discover the last clue at your location, you may move to a connecting location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "pay-your-dues-60365",
    "code": "60365",
    "name": "Pay Your Dues",
    "type": "event",
    "faction": "rogue",
    "cost": -2,
    "icons": [
      "willpower",
      "intellect"
    ],
    "traits": [
      "Favor"
    ],
    "text": [
      "<b>Parley.</b> Choose a non-[[Elite]] enemy at your location with X remaining health. That enemy disengages from each investigator and gains aloof until the end of the round. Discover 1 clue at your location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "quick-exit-60366",
    "code": "60366",
    "name": "Quick Exit",
    "type": "event",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "willpower",
      "agility"
    ],
    "traits": [
      "Tactic",
      "Trick"
    ],
    "text": [
      "<b>Evade</b> ([agility]). You get +2 [agility] for this evasion. If you succeed by 2 or more and the evaded enemy is non-[[Elite]], that enemy does not ready during the next upkeep phase."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "a-sudden-fall-60367",
    "code": "60367",
    "name": "A Sudden Fall",
    "type": "event",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Tactic",
      "Trick"
    ],
    "text": [
      "<b>Fight</b> ([combat]). You get +2 [combat] for this attack. If the targeted enemy is exhausted, this attack deals +1 damage."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "right-under-their-noses-60368",
    "code": "60368",
    "name": "Right Under Their Noses",
    "type": "event",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect"
    ],
    "traits": [
      "Trick",
      "Illicit"
    ],
    "text": [
      "Fast. Play after you successfully evade an enemy.",
      "Discover 1 clue at your location (if you succeeded by 2 or more, you may discover 1 clue at a connecting location, instead)."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "easy-street-60369",
    "code": "60369",
    "name": "Easy Street",
    "type": "skill",
    "faction": "rogue",
    "icons": [
      "wild"
    ],
    "traits": [
      "Favor"
    ],
    "text": [
      "Commit only to a skill test you are performing. Max 1 committed per skill test.",
      "Easy Street gains [wild] for every 3 resources you have (to a maximum of [wild] [wild] [wild])."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "out-the-door-60370",
    "code": "60370",
    "name": "Out the Door",
    "type": "skill",
    "faction": "rogue",
    "icons": [
      "agility",
      "wild"
    ],
    "traits": [
      "Gambit"
    ],
    "text": [
      "After Out the Door is committed to a skill test, the performing investigator gains 2 resources. If this skill test fails, that investigator loses 2 resources."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "watch-this-60371",
    "code": "60371",
    "name": "\"Watch this!\"",
    "type": "skill",
    "faction": "rogue",
    "icons": [
      "willpower",
      "combat",
      "agility"
    ],
    "traits": [
      "Gambit"
    ],
    "text": [
      "Commit only to a skill test you are performing. As an additional cost to commit \"Watch this!\" spend up to 3 resources.",
      "If you succeed by 1 or more, gain twice that many resources."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "lockpicks-60372",
    "code": "60372",
    "name": "Lockpicks",
    "type": "asset",
    "faction": "rogue",
    "cost": 3,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Tool",
      "Illicit"
    ],
    "text": [
      "Uses (3 supplies). If there are no supplies on Lockpicks, discard it.",
      "[action] Exhaust Lockpicks: <b>Investigate</b> ([intellect]). Add your [agility] to your [intellect] for this test. If you do not succeed by at least 2, remove 1 supply from Lockpicks."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "out-the-door-60373",
    "code": "60373",
    "name": "Out the Door",
    "type": "skill",
    "faction": "rogue",
    "icons": [
      "agility",
      "wild"
    ],
    "traits": [
      "Gambit"
    ],
    "text": [
      "After Out the Door is committed to a skill test, the performing investigator gains 4 resources. If this skill test fails, that investigator loses 4 resources."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "the-grapevine-60374",
    "code": "60374",
    "name": "The Grapevine",
    "type": "asset",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Connection"
    ],
    "text": [
      "Uses (3 rumors). If there are no rumors on The Grapevine, discard it.",
      "[action] Spend 1 rumor and exhaust The Grapevine: <b>Parley.</b> Choose an enemy at a revealed location up to 3 connections away. Move (one location at a time) along the shortest path to that enemy's location and engage it. Draw 1 card."
    ],
    "abilities": [],
    "statModifiers": {
      "intellect": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "marcus-sengstacke-60375",
    "code": "60375",
    "name": "Marcus Sengstacke",
    "type": "asset",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect"
    ],
    "traits": [
      "Ally",
      "Patron"
    ],
    "text": [
      "You gain 1 additional resource during the upkeep phase.",
      "<b>Forced</b> - After you fail a skill test: Deal 1 horror to Marcus Sengstacke."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 1,
    "sanity": 3,
    "statModifiers": {
      "willpower": 1,
      "intellect": 1
    }
  },
  {
    "instanceId": "clean-sweep-60376",
    "code": "60376",
    "name": "Clean Sweep",
    "type": "event",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "intellect",
      "intellect",
      "wild"
    ],
    "traits": [
      "Tactic",
      "Trick"
    ],
    "text": [
      "<b>Investigate</b> ([agility]). Add your [intellect] to your [agility] for this test. After this test resolves, you may move to a connecting location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "quick-exit-60377",
    "code": "60377",
    "name": "Quick Exit",
    "type": "event",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "willpower",
      "willpower",
      "wild"
    ],
    "traits": [
      "Tactic",
      "Trick"
    ],
    "text": [
      "<b>Evade</b> ([agility]). Add your [willpower] to your [agility] for this test. If you succeed and the evaded enemy is non-[[Elite]], that enemy does not ready during the next upkeep phase."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "a-sudden-fall-60378",
    "code": "60378",
    "name": "A Sudden Fall",
    "type": "event",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "combat",
      "combat",
      "wild"
    ],
    "traits": [
      "Tactic",
      "Trick"
    ],
    "text": [
      "<b>Fight</b> ([agility]). Add your [combat] to your [agility] for this test. If the targeted enemy is exhausted, this attack deals +2 damage."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "the-black-fan-60379",
    "code": "60379",
    "name": "The Black Fan",
    "type": "asset",
    "faction": "rogue",
    "cost": 3,
    "icons": [
      "intellect",
      "agility",
      "wild"
    ],
    "traits": [
      "Item",
      "Relic"
    ],
    "text": [
      "Exceptional.",
      "While you have...",
      "- ...10+ resources, you get +1 health and +1 sanity.",
      "- ...15+ resources, you may take an additional action during your turn.",
      "- ...20+ resources, you get +1 to each of your skills."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "silver-tongue-60380",
    "code": "60380",
    "name": "Silver Tongue",
    "type": "asset",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "intellect",
      "agility",
      "wild"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "Starting. <i>(You may begin the game with 1 copy of a starting card in your opening hand.)</i>",
      "[fast] Spend 1 resource: You get +1 [intellect] for this skill test (+2 [intellect] instead if this is an evasion or parley).",
      "[fast] Spend 1 resource: You get +1 [agility] for this skill test (+2 [agility] instead if this is an evasion or parley)."
    ],
    "abilities": [],
    "statModifiers": {
      "intellect": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "well-connected-60381",
    "code": "60381",
    "name": "Well Connected",
    "type": "asset",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Condition"
    ],
    "text": [
      "Limit 1 per investigator.",
      "[fast] Exhaust Well Connected: You get +1 skill value for this skill test for every 4 resources you have.",
      "[fast] Spend 2 resources: Ready Well Connected. (Limit once per round.)"
    ],
    "abilities": [],
    "statModifiers": {
      "intellect": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "right-under-their-noses-60382",
    "code": "60382",
    "name": "Right Under Their Noses",
    "type": "event",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect",
      "wild"
    ],
    "traits": [
      "Trick",
      "Illicit"
    ],
    "text": [
      "Fast. Play after you successfully evade an enemy.",
      "Discover 1 clue at your location (if you succeeded by 2 or more, you may discover 1 clue at a connecting location, as well)."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "contingency-60383",
    "code": "60383",
    "name": "Contingency",
    "type": "skill",
    "faction": "rogue",
    "icons": [
      "wild",
      "wild"
    ],
    "traits": [
      "Practiced",
      "Expert"
    ],
    "text": [
      "While Contingency is committed to a skill test targeting an enemy, after revealing chaos tokens, you may spend 3 resources to cancel a revealed token, return it to the chaos bag, and reveal a new one. <i>(You may do this any number of times.)</i>"
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "the-red-clock-60384",
    "code": "60384",
    "name": "The Red Clock",
    "type": "asset",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "wild",
      "wild"
    ],
    "traits": [
      "Item",
      "Relic"
    ],
    "text": [
      "Exceptional. Uses (0 charges).",
      "<b>Forced</b> - After your turn begins: You may take all charges here, as resources. Place 1 charge here. If it has exactly...",
      "- ...1 charge, you get +4 skill value for your next skill test.",
      "- ...2 charges, you may move up to 3 times.",
      "- ...3 charges, you may take 2 additional actions this turn."
    ],
    "abilities": [],
    "slot": "Accessory"
  },
  {
    "instanceId": "experimental-psychology-60252",
    "code": "60252",
    "name": "Experimental Psychology",
    "type": "asset",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect",
      "wild"
    ],
    "traits": [
      "Item",
      "Tome",
      "Science"
    ],
    "text": [
      "Carolyn Fern deck only.",
      "[action]: Test [intellect] (2). If you succeed, heal 1 horror from an investigator or [[Ally]] asset at your location.",
      "[reaction] After you heal horror from an investigator, exhaust Experimental Psychology: That investigator gets +2 skill value to their next skill test this round."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "willpower": 1,
      "intellect": 1
    }
  },
  {
    "instanceId": "unbroken-web-60253",
    "code": "60253",
    "name": "Unbroken Web",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Terror",
      "Dreamlands"
    ],
    "text": [
      "<b>Revelation</b> - Put this card into play in your threat area.",
      "[reaction] When you would discover any number of clues: Place that much horror on Unbroken Web, instead. Then, discard this card if there is 4 or more horror on it.",
      "<b>Forced</b> - When the game ends or you are eliminated: You earn 2 fewer experience."
    ],
    "subtype": "weakness",
    "isWeakness": true
  },
  {
    "instanceId": "lethal-curiosity-60254",
    "code": "60254",
    "name": "Lethal Curiosity",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Flaw"
    ],
    "text": [
      "<b>Revelation</b> - Test [willpower] (4). For each point you fail by, you must either take 1 damage or place 1 of your clues on your location."
    ],
    "subtype": "basicweakness",
    "isWeakness": true
  },
  {
    "instanceId": "dreamer-s-chronicle-60255",
    "code": "60255",
    "name": "Dreamer's Chronicle",
    "type": "asset",
    "faction": "seeker",
    "cost": 4,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Tome"
    ],
    "text": [
      "Uses (4 secrets).",
      "[action] Spend 1 secret: <b>Investigate</b> ([intellect]). The first card you commit to this investigation gains [wild]. If you succeed, you may take 1 horror to discover 1 additional clue at your location."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "occult-records-60256",
    "code": "60256",
    "name": "Occult Records",
    "type": "asset",
    "faction": "seeker",
    "cost": 3,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Item",
      "Tome",
      "Occult"
    ],
    "text": [
      "Uses (3 secrets).",
      "[fast] During your turn, spend 1 secret and exhaust Occult Records: Heal 2 horror from an investigator at your location. Then, test [willpower] (2). If you fail, discard 1 card at random from your hand."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "private-practice-60257",
    "code": "60257",
    "name": "Private Practice",
    "type": "asset",
    "faction": "seeker",
    "cost": 1,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Profession"
    ],
    "text": [
      "Limit 1 per investigator.",
      "[reaction] After you heal 1 or more horror, exhaust Private Practice: Gain 1 resource."
    ],
    "abilities": [],
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "psychology-student-60258",
    "code": "60258",
    "name": "Psychology Student",
    "type": "asset",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Ally",
      "Miskatonic"
    ],
    "text": [
      "[reaction] After you play Psychology Student: Heal 2 horror from an investigator or [[Ally]] asset at your location."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 1,
    "sanity": 1,
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "scroll-of-the-pharaohs-60259",
    "code": "60259",
    "name": "Scroll of the Pharaohs",
    "type": "asset",
    "faction": "seeker",
    "cost": 3,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Relic",
      "Tome"
    ],
    "text": [
      "Uses (4 secrets).",
      "[action] Spend 1 secret and exhaust Scroll of the Pharaohs: Deal 1 horror to an investigator or [[Ally]] asset at your location. Then, if there are no secrets on Scroll of the Pharaohs, discard it, draw 3 cards, and record \"you have unearthed the secrets of the Pharaohs\" in your campaign log."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "university-archivist-60260",
    "code": "60260",
    "name": "University Archivist",
    "type": "asset",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "agility"
    ],
    "traits": [
      "Ally",
      "Miskatonic"
    ],
    "text": [
      "You have 1 additional hand slot, which can only be used to hold a [[Tome]] asset.",
      "[reaction] After University Archivist enters play: Search the top 6 cards of your deck for a [[Tome]] asset and add it to your hand. Shuffle your deck."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 1,
    "sanity": 1,
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "caustic-reaction-60261",
    "code": "60261",
    "name": "Caustic Reaction",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "intellect",
      "combat"
    ],
    "traits": [
      "Tactic",
      "Science"
    ],
    "text": [
      "<b>Fight</b> ([intellect]). You get +1 [intellect] for this attack. If you control 2 or more clues, this attack deals +1 damage."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "unflappable-60262",
    "code": "60262",
    "name": "Unflappable",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Insight"
    ],
    "text": [
      "<b>Evade</b> ([agility]). You get +2 [agility] for this evasion. If you succeed and you control 2 or more clues, heal 1 horror."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "preposterous-sketches-60263",
    "code": "60263",
    "name": "Preposterous Sketches",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect"
    ],
    "traits": [
      "Insight"
    ],
    "text": [
      "Play only if there is a clue on your location.",
      "Draw 3 cards."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "psychoanalysis-60264",
    "code": "60264",
    "name": "Psychoanalysis",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "intellect",
      "wild"
    ],
    "traits": [
      "Insight",
      "Science"
    ],
    "text": [
      "Choose an investigator at your location and reveal the top 3 cards of their deck. That investigator may choose to either draw 1 revealed card and shuffle the rest into their deck, or heal 2 horror and return the revealed cards to the top of their owner's deck in any order."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "de-escalate-60265",
    "code": "60265",
    "name": "De-Escalate",
    "type": "event",
    "faction": "seeker",
    "cost": 1,
    "icons": [
      "willpower",
      "willpower"
    ],
    "traits": [
      "Insight"
    ],
    "text": [
      "<b>Parley.</b> Choose an enemy at your location. Heal horror equal to that enemy's horror value."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "insidious-truths-60266",
    "code": "60266",
    "name": "Insidious Truths",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Insight",
      "Cursed"
    ],
    "text": [
      "As an additional cost to play Insidious Truths, you may discard up to 2 cards from hand.",
      "<b>Fight</b> ([combat]). For each card discarded as part of this card's cost, you get +2 [combat] and deal +1 damage for this attack."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "deduction-60267",
    "code": "60267",
    "name": "Deduction",
    "type": "skill",
    "faction": "seeker",
    "icons": [
      "intellect"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "If this skill test is successful while investigating a location, discover 1 additional clue at that location."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "establish-motive-60268",
    "code": "60268",
    "name": "Establish Motive",
    "type": "skill",
    "faction": "seeker",
    "icons": [
      "wild"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "If this skill test is successful, the performing investigator searches the top 6 cards of their deck for an [[Insight]] event, draws it, and shuffles their deck."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "literary-analysis-60269",
    "code": "60269",
    "name": "Literary Analysis",
    "type": "skill",
    "faction": "seeker",
    "icons": [
      "intellect",
      "intellect"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "If this skill test is successful, replenish 1 secret on a [[Tome]] asset at your location."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "magnifying-glass-60270",
    "code": "60270",
    "name": "Magnifying Glass",
    "type": "asset",
    "faction": "seeker",
    "cost": 0,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Tool"
    ],
    "text": [
      "Fast.",
      "You get +1 [intellect] while investigating.",
      "[fast] If there are no clues on your location: Return Magnifying Glass to your hand."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "unflappable-60271",
    "code": "60271",
    "name": "Unflappable",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "intellect",
      "agility",
      "wild"
    ],
    "traits": [
      "Insight"
    ],
    "text": [
      "<b>Evade</b> ([agility]). You get +3 [agility] for this evasion. If you succeed, heal 2 horror from among cards you control."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "typewriter-60272",
    "code": "60272",
    "name": "Typewriter",
    "type": "asset",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect"
    ],
    "traits": [
      "Item",
      "Tool"
    ],
    "text": [
      "Uses (3 secrets). If there are no secrets on Typewriter, discard it.",
      "Secrets on Typewriter may be spent as if they were on [[Tome]] assets you control."
    ],
    "abilities": [],
    "statModifiers": {
      "willpower": 1,
      "intellect": 1
    }
  },
  {
    "instanceId": "caustic-reaction-60273",
    "code": "60273",
    "name": "Caustic Reaction",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "intellect",
      "combat",
      "combat"
    ],
    "traits": [
      "Tactic",
      "Science"
    ],
    "text": [
      "<b>Fight</b> ([intellect]). You get +2 [intellect] and deal +1 damage for this attack. If you succeed and you control 2 or more clues, this attack deals +2 damage instead."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "hypnotize-60274",
    "code": "60274",
    "name": "Hypnotize",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect",
      "wild"
    ],
    "traits": [
      "Science"
    ],
    "text": [
      "<b>Parley</b> ([intellect]). You get +2 [intellect] for this parley. Choose a non-[[Elite]] enemy at your location. This test's difficulty is equal to that enemy's remaining health. If you succeed, shuffle that enemy into the encounter deck."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "deduction-60275",
    "code": "60275",
    "name": "Deduction",
    "type": "skill",
    "faction": "seeker",
    "icons": [
      "intellect",
      "intellect"
    ],
    "traits": [
      "Practiced",
      "Expert"
    ],
    "text": [
      "If this skill test is successful while investigating a location, discover 1 additional clue at that location (2 additional clues instead if it succeeds by 2 or more)."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "autopsy-report-60276",
    "code": "60276",
    "name": "Autopsy Report",
    "type": "asset",
    "faction": "seeker",
    "cost": 3,
    "icons": [
      "combat",
      "agility",
      "wild"
    ],
    "traits": [
      "Item",
      "Tome",
      "Science"
    ],
    "text": [
      "[reaction] After an enemy at your location is defeated, exhaust Autopsy Report: <b>Investigate</b> ([intellect]). You get +X [intellect] for this investigation, where X is the defeated enemy's printed health (to a maximum of +5)."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "combat": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "sharp-rhetoric-60277",
    "code": "60277",
    "name": "Sharp Rhetoric",
    "type": "asset",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect",
      "wild"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "Starting. <i>(You may begin the game with 1 copy of a starting card in your opening hand.)</i>",
      "[fast] Spend 1 resource: You get +1 [intellect] for this skill test (+2 [intellect] instead if this is an investigation or parley).",
      "[fast] Spend 1 resource: You get +1 [willpower] for this skill test (+2 [willpower] instead if this is an investigation or parley)."
    ],
    "abilities": [],
    "statModifiers": {
      "willpower": 1,
      "intellect": 1
    }
  },
  {
    "instanceId": "psychoanalysis-60278",
    "code": "60278",
    "name": "Psychoanalysis",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect",
      "wild"
    ],
    "traits": [
      "Insight",
      "Science"
    ],
    "text": [
      "One at a time, each investigator at your location reveals the top 3 cards of their deck, draws 1 of those cards, shuffles the remaining cards into their deck, and heals 2 horror."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "scroll-of-the-pharaohs-60279",
    "code": "60279",
    "name": "Scroll of the Pharaohs",
    "type": "asset",
    "faction": "seeker",
    "cost": 3,
    "icons": [
      "willpower",
      "wild",
      "wild"
    ],
    "traits": [
      "Item",
      "Relic",
      "Tome"
    ],
    "text": [
      "Researched. Uses (4 secrets).",
      "[action] Take 1 horror and spend 1 or 2 secrets: For each secret you spent as part of this ability's cost, reveal 3 cards from the top of the encounter deck. Choose and discard 1 non-peril, non-[[Elite]] card among them, then return the rest to the top of the encounter deck in any order."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "scroll-of-the-pharaohs-60280",
    "code": "60280",
    "name": "Scroll of the Pharaohs",
    "type": "asset",
    "faction": "seeker",
    "cost": 3,
    "icons": [
      "intellect",
      "wild",
      "wild"
    ],
    "traits": [
      "Item",
      "Relic",
      "Tome"
    ],
    "text": [
      "Researched. Uses (4 secrets).",
      "[action] Take 1 horror and spend 1 or 2 secrets: <b>Fight</b> ([intellect]). You get +3 [intellect] for this attack. If you succeed, this attack deals +1 damage for each secret you spent as part of this ability's cost."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "scroll-of-the-pharaohs-60281",
    "code": "60281",
    "name": "Scroll of the Pharaohs",
    "type": "asset",
    "faction": "seeker",
    "cost": 3,
    "icons": [
      "intellect",
      "wild",
      "wild"
    ],
    "traits": [
      "Item",
      "Relic",
      "Tome"
    ],
    "text": [
      "Researched. Uses (4 secrets).",
      "[action] Take 1 horror and spend 1 or 2 secrets: <b>Investigate</b> ([intellect]). You get +3 [intellect] for this investigation. If you succeed, discover 1 additional clue at your location for each secret you spent as part of this ability's cost."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "commune-with-the-cosmos-60282",
    "code": "60282",
    "name": "Commune with the Cosmos",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "intellect",
      "intellect",
      "wild"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "When you play Commune with the Cosmos, you may take up to 3 horror.",
      "<b>Investigate</b> ([intellect]). You get +2 [intellect] for this investigation. If you succeed, discover X additional clues at your location, where X is the amount of horror on you (to a maximum of 4 additional clues)."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "grand-m-re-s-charm-60452",
    "code": "60452",
    "name": "Grand-M\u00e8re's Charm",
    "type": "asset",
    "faction": "mystic",
    "cost": 2,
    "icons": [
      "willpower",
      "willpower",
      "wild"
    ],
    "traits": [
      "Item",
      "Charm",
      "Occult",
      "Blessed"
    ],
    "text": [
      "Marie Lambeau deck only.",
      "[fast] Take 1 direct damage and exhaust Grand-M\u00e8re's Charm: Replenish 1 charge on an asset at your location."
    ],
    "abilities": [],
    "slot": "Accessory",
    "health": 3,
    "statModifiers": {
      "willpower": 2
    }
  },
  {
    "instanceId": "called-to-guin-e-60453",
    "code": "60453",
    "name": "Called to Guin\u00e9e",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Curse",
      "Pact"
    ],
    "text": [
      "<b>Revelation</b> - Put Called to Guin\u00e9e into play in your threat area.",
      "You cannot heal damage.",
      "[action] Choose and discard 3 cards from your hand: Discard Called to Guin\u00e9e."
    ],
    "subtype": "weakness",
    "isWeakness": true
  },
  {
    "instanceId": "hemophobia-60454",
    "code": "60454",
    "name": "Hemophobia",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Terror"
    ],
    "text": [
      "<b>Revelation</b> - Put Hemophobia into play in your threat area.",
      "<b>Forced</b> - The first time each round an investigator at your location takes damage: Take 1 horror.",
      "[action] [action]: Discard Hemophobia."
    ],
    "subtype": "basicweakness",
    "isWeakness": true
  },
  {
    "instanceId": "arcane-initiate-60455",
    "code": "60455",
    "name": "Arcane Initiate",
    "type": "asset",
    "faction": "mystic",
    "cost": 1,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Ally",
      "Sorcerer"
    ],
    "text": [
      "<b>Forced</b> - After Arcane Initiate enters play: Place 1 doom on it.",
      "[fast] Exhaust Arcane Initiate: Search the top 3 cards of your deck for a [[Spell]] card and draw it. Shuffle your deck."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 1,
    "sanity": 2,
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "offering-bowl-60456",
    "code": "60456",
    "name": "Offering Bowl",
    "type": "asset",
    "faction": "mystic",
    "cost": 1,
    "icons": [
      "wild"
    ],
    "traits": [
      "Item",
      "Occult"
    ],
    "text": [
      "Uses (3 offerings). If there are no offerings on Offering Bowl, discard it.",
      "[fast] Spend 1 offering and exhaust Offering Bowl: Take 1 damage and gain 2 resources."
    ],
    "abilities": []
  },
  {
    "instanceId": "bloodstone-60457",
    "code": "60457",
    "name": "Bloodstone",
    "type": "asset",
    "faction": "mystic",
    "cost": 2,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Item",
      "Charm",
      "Cursed"
    ],
    "text": [
      "You get +1 [willpower]."
    ],
    "abilities": [],
    "slot": "Accessory",
    "health": 2,
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "sacrificial-doll-60458",
    "code": "60458",
    "name": "Sacrificial Doll",
    "type": "asset",
    "faction": "mystic",
    "cost": 3,
    "icons": [
      "willpower",
      "combat"
    ],
    "traits": [
      "Item",
      "Charm",
      "Occult"
    ],
    "text": [
      "While you have 3 or fewer remaining health, Sacrificial Doll does not take up a hand slot.",
      "[reaction] After you reveal a non-[auto_fail] chaos token during a skill test, take 1 damage and exhaust Sacrificial Doll: Cancel that token and reveal tokens from the chaos bag until a symbol token is revealed. Resolve that token and ignore the rest."
    ],
    "abilities": [],
    "slot": "Hand",
    "health": 1,
    "statModifiers": {
      "willpower": 1,
      "combat": 1
    }
  },
  {
    "instanceId": "second-sight-60460",
    "code": "60460",
    "name": "Second Sight",
    "type": "asset",
    "faction": "mystic",
    "cost": 4,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "Uses (3 charges).",
      "[action]: <b>Investigate</b> ([willpower]). If you succeed, you may spend 1 charge to discover 1 additional clue at your location. If you reveal a [cultist] token during this test, remove 1 charge from Second Sight (if you cannot, take 1 horror and discard this card)."
    ],
    "abilities": [],
    "slot": "Arcane",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "shadowmeld-60461",
    "code": "60461",
    "name": "Shadowmeld",
    "type": "asset",
    "faction": "mystic",
    "cost": 2,
    "icons": [
      "agility"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "Uses (4 charges).",
      "[action]: <b>Evade</b> ([willpower]). If you succeed, you may spend 1 charge to move to a connecting location. If you reveal a [tablet] token during this test, remove 1 charge from Shadowmeld (if you cannot, lose 1 action and discard this card)."
    ],
    "abilities": [],
    "slot": "Arcane",
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "consume-life-60462",
    "code": "60462",
    "name": "Consume Life",
    "type": "event",
    "faction": "mystic",
    "cost": 3,
    "icons": [
      "willpower",
      "combat"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "<b>Fight</b> ([willpower]). This attack deals +1 damage. If this attack defeats an enemy, heal 1 damage from an investigator or [[Ally]] asset at your location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "favor-of-baalshandor-60463",
    "code": "60463",
    "name": "Favor of Baalshandor",
    "type": "event",
    "faction": "mystic",
    "cost": 0,
    "icons": [],
    "traits": [
      "Ritual"
    ],
    "text": [
      "As an additional cost to play Favor of Baalshandor, take 1 damage.",
      "Play a [[Spell]] or [[Ritual]] asset from your hand, reducing its cost by 3. Playing this card does not provoke attacks of opportunity."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "infuse-life-60464",
    "code": "60464",
    "name": "Infuse Life",
    "type": "event",
    "faction": "mystic",
    "cost": 4,
    "icons": [
      "wild"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "Heal 3 damage from among investigators and/or [[Ally]] assets at your location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "mirror-form-60465",
    "code": "60465",
    "name": "Mirror Form",
    "type": "event",
    "faction": "mystic",
    "cost": 1,
    "icons": [
      "willpower",
      "agility"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "Fast. Play only during your turn.",
      "Choose a [[Spell]] or [[Charm]] asset in your hand and put it into play under your control. When the round ends, shuffle that asset into your deck if it is still in play."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "spiritual-charm-60466",
    "code": "60466",
    "name": "Spiritual Charm",
    "type": "event",
    "faction": "mystic",
    "cost": 0,
    "icons": [
      "willpower",
      "agility"
    ],
    "traits": [
      "Spell",
      "Trick"
    ],
    "text": [
      "<b>Parley</b>. Choose a non-[[Elite]] enemy at your location or at a connecting location. Move that enemy to your location, engage it, and gain resources equal to its combined damage/horror values."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "blood-curse-60467",
    "code": "60467",
    "name": "Blood Curse",
    "type": "skill",
    "faction": "mystic",
    "icons": [
      "wild",
      "wild",
      "wild",
      "wild"
    ],
    "traits": [
      "Spell",
      "Cursed"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "If this skill test is successful, take 1 direct damage."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "cosmic-guidance-60468",
    "code": "60468",
    "name": "Cosmic Guidance",
    "type": "skill",
    "faction": "mystic",
    "icons": [
      "willpower"
    ],
    "traits": [
      "Augury"
    ],
    "text": [
      "If this skill test is successful, heal 1 damage from the performing investigator."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "torrent-of-power-60469",
    "code": "60469",
    "name": "Torrent of Power",
    "type": "skill",
    "faction": "mystic",
    "icons": [
      "wild"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "As an additional cost to commit Torrent of Power to a skill test, spend up to 3 charges from among assets you control.",
      "For each charge spent in this way, Torrent of Power gains [willpower] [wild]."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "ceremonial-robes-60470",
    "code": "60470",
    "name": "Ceremonial Robes",
    "type": "asset",
    "faction": "mystic",
    "cost": 1,
    "icons": [
      "wild"
    ],
    "traits": [
      "Item",
      "Clothing"
    ],
    "text": [
      "Reduce the cost of the first [[Spell]] or [[Ritual]] card you play each round by 1."
    ],
    "abilities": [],
    "slot": "Body",
    "health": 1,
    "sanity": 1
  },
  {
    "instanceId": "eldritch-whispers-60471",
    "code": "60471",
    "name": "Eldritch Whispers",
    "type": "skill",
    "faction": "mystic",
    "icons": [
      "willpower",
      "willpower"
    ],
    "traits": [
      "Innate"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "If a symbol token is revealed during this test, place up to 2 charges or 2 secrets among assets you control."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "blood-ward-60472",
    "code": "60472",
    "name": "Blood Ward",
    "type": "event",
    "faction": "mystic",
    "cost": 1,
    "icons": [
      "combat",
      "wild"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "Fast. Play when a non-[[Elite]] enemy attacks an investigator at your location.",
      "Cancel that attack and heal 2 damage from the targeted investigator."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "retribution-60473",
    "code": "60473",
    "name": "Retribution",
    "type": "event",
    "faction": "mystic",
    "cost": 2,
    "icons": [
      "wild"
    ],
    "traits": [
      "Spell",
      "Spirit"
    ],
    "text": [
      "Fast. Play when an enemy attacks an investigator at your location.",
      "You take all damage and horror from this attack. For each point of damage/horror taken, deal 1 damage to an enemy at your location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "dread-curse-of-azathoth-60474",
    "code": "60474",
    "name": "Dread Curse of Azathoth",
    "type": "asset",
    "faction": "mystic",
    "cost": 2,
    "icons": [
      "willpower",
      "combat"
    ],
    "traits": [
      "Spell",
      "Cursed"
    ],
    "text": [
      "Exceptional.",
      "[action] Place 1 doom on Dread Curse of Azathoth: <b>Fight</b> ([willpower]). You get +2 [willpower] and deal +1 damage for this attack. If this attack defeats an enemy, remove 1 doom from Dread Curse of Azathoth. If a [skull] or [elder_thing] token is revealed during this test, remove all doom from this card."
    ],
    "abilities": [],
    "slot": "Arcane",
    "statModifiers": {
      "willpower": 1,
      "combat": 1
    }
  },
  {
    "instanceId": "ritual-dagger-60475",
    "code": "60475",
    "name": "Ritual Dagger",
    "type": "asset",
    "faction": "mystic",
    "cost": 3,
    "icons": [
      "willpower",
      "combat",
      "wild"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Melee",
      "Cursed"
    ],
    "text": [
      "[action]: <b>Fight</b> ([combat]). Add your [willpower] to your [combat] for this attack.",
      "[reaction] After you play a [[Spell]] event, take 1 damage and exhaust Ritual Dagger: Shuffle that event into your deck instead of discarding it."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "willpower": 1,
      "combat": 1
    }
  },
  {
    "instanceId": "spiritual-intuition-60476",
    "code": "60476",
    "name": "Spiritual Intuition",
    "type": "asset",
    "faction": "mystic",
    "cost": 2,
    "icons": [
      "willpower",
      "combat",
      "wild"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "Starting. <i>(You may begin the game with 1 copy of a starting card in your opening hand.)</i>",
      "[fast] Spend 1 resource: You get +1 [willpower] for this skill test (+2 [willpower] instead if this test is on a [[Spell]] or [[Ritual]] card).",
      "[fast] Spend 1 resource: You get +1 [combat] for this skill test (+2 [combat] instead if this test is on a [[Spell]] or [[Ritual]] card)."
    ],
    "abilities": [],
    "statModifiers": {
      "willpower": 1,
      "combat": 1
    }
  },
  {
    "instanceId": "blood-curse-60477",
    "code": "60477",
    "name": "Blood Curse",
    "type": "skill",
    "faction": "mystic",
    "icons": [
      "wild",
      "wild",
      "wild",
      "wild",
      "wild"
    ],
    "traits": [
      "Spell",
      "Cursed"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "If this test is successful, deal 1 damage to a card with health at your location."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "arcane-experience-60478",
    "code": "60478",
    "name": "Arcane Experience",
    "type": "asset",
    "faction": "mystic",
    
    "icons": [],
    "traits": [
      "Condition"
    ],
    "text": [
      "Permanent. Limit 1 per deck.",
      "You have 1 additional arcane slot."
    ],
    "abilities": []
  },
  {
    "instanceId": "jim-culver-60479",
    "code": "60479",
    "name": "Jim Culver",
    "type": "asset",
    "faction": "mystic",
    "cost": 4,
    "icons": [
      "willpower",
      "willpower"
    ],
    "traits": [
      "Ally",
      "Performer"
    ],
    "text": [
      "You get +1 [willpower].",
      "[reaction] After you take damage and/or horror, exhaust Jim Culver: Draw 1 card and gain 1 resource."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 3,
    "sanity": 3,
    "statModifiers": {
      "willpower": 2
    }
  },
  {
    "instanceId": "ultimate-sacrifice-60480",
    "code": "60480",
    "name": "Ultimate Sacrifice",
    "type": "event",
    "faction": "mystic",
    "cost": 0,
    "icons": [
      "wild"
    ],
    "traits": [
      "Spell",
      "Spirit"
    ],
    "text": [
      "Fast. Play when the investigation phase ends.",
      "Repeat the investigation phase. At the end of that phase, you are defeated and suffer 1 physical trauma. Max once per game."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "second-sight-60481",
    "code": "60481",
    "name": "Second Sight",
    "type": "asset",
    "faction": "mystic",
    "cost": 4,
    "icons": [
      "willpower",
      "intellect",
      "wild"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "Uses (4 charges).",
      "[action]: <b>Investigate</b> ([willpower]). You get +2 [willpower] for this investigation. If you succeed, you may spend 1 charge to discover 1 additional clue at your location or 1 clue at a connecting location. If you reveal a [cultist] token during this test, remove 1 charge from Second Sight (if you cannot, take 1 horror and discard this card)."
    ],
    "abilities": [],
    "slot": "Arcane",
    "statModifiers": {
      "willpower": 1,
      "intellect": 1
    }
  },
  {
    "instanceId": "shadowmeld-60482",
    "code": "60482",
    "name": "Shadowmeld",
    "type": "asset",
    "faction": "mystic",
    "cost": 2,
    "icons": [
      "willpower",
      "agility",
      "wild"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "Uses (5 charges).",
      "[action]: <b>Evade</b> ([willpower]). You get +2 [willpower] for this evasion. If you succeed, you may spend 1 charge to move to a location up to 2 connections away. If you reveal a [tablet] token during this test, remove 1 charge from Shadowmeld (if you cannot, lose 1 action and discard this card)."
    ],
    "abilities": [],
    "slot": "Arcane",
    "statModifiers": {
      "willpower": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "bend-blood-60483",
    "code": "60483",
    "name": "Bend Blood",
    "type": "event",
    "faction": "mystic",
    "cost": 2,
    "icons": [
      "willpower",
      "willpower",
      "combat",
      "combat"
    ],
    "traits": [
      "Spell",
      "Cursed"
    ],
    "text": [
      "<b>Fight</b> ([willpower]). You get +3 [willpower] and deal +1 damage for this attack. If you succeed, deal 1 damage to each other enemy at your location. Each enemy dealt damage by Bend Blood cannot attack you for the remainder of the round."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "miguel-s-knapsack-60552",
    "code": "60552",
    "name": "Miguel's Knapsack",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "wild",
      "wild"
    ],
    "traits": [
      "Item"
    ],
    "text": [
      "Miguel de la Cruz deck only.",
      "[reaction] When you play an event, exhaust Miguel's Knapsack: Either play that event at a connecting location as if you were at that location, or draw 1 card."
    ],
    "abilities": [],
    "slot": "Body",
    "health": 2
  },
  {
    "instanceId": "daniel-jameson-60555",
    "code": "60555",
    "name": "Daniel Jameson",
    "type": "asset",
    "faction": "survivor",
    "cost": 3,
    "icons": [
      "agility"
    ],
    "traits": [
      "Ally",
      "Hunter"
    ],
    "text": [
      "You get +1 [agility].",
      "[reaction] After you fail an attack or evasion, exhaust Daniel Jameson: Attempt that skill test again, with +1 skill value."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 2,
    "sanity": 2,
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "hunting-dog-60556",
    "code": "60556",
    "name": "Hunting Dog",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "combat"
    ],
    "traits": [
      "Ally",
      "Creature"
    ],
    "text": [
      "[reaction] When an enemy enters play, exhaust Hunting Dog: Move once toward that enemy's location."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 1,
    "sanity": 1,
    "statModifiers": {
      "combat": 1
    }
  },
  {
    "instanceId": "loner-60557",
    "code": "60557",
    "name": "Loner",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Condition"
    ],
    "text": [
      "Limit 1 per investigator.",
      "[fast] During your turn, exhaust Loner: Move to an empty connecting location."
    ],
    "abilities": [],
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "old-compass-60558",
    "code": "60558",
    "name": "Old Compass",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Tool"
    ],
    "text": [
      "[action]: <b>Investigate</b> ([intellect]). Your location gets -1 shroud for this investigation. If you fail, you may exhaust Old Compass to attempt this skill test again."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "pocketknife-60559",
    "code": "60559",
    "name": "Pocketknife",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "agility"
    ],
    "traits": [
      "Item",
      "Tool",
      "Weapon",
      "Melee"
    ],
    "text": [
      "[action]: <b>Fight</b> ([combat] or [agility]). You get +1 skill value for this test. If this attack defeats an enemy, you may exhaust Pocketknife to gain 1 resource."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "rabbit-s-foot-60560",
    "code": "60560",
    "name": "Rabbit's Foot",
    "type": "asset",
    "faction": "survivor",
    "cost": 1,
    "icons": [
      "wild"
    ],
    "traits": [
      "Item",
      "Charm"
    ],
    "text": [
      "[reaction] After you fail a skill test, exhaust Rabbit's Foot: Draw 1 card."
    ],
    "abilities": [],
    "slot": "Accessory"
  },
  {
    "instanceId": "same-old-thing-60561",
    "code": "60561",
    "name": "Same Old Thing",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Condition"
    ],
    "text": [
      "Uses (5 supplies). If there are no supplies on Same Old Thing, discard it.",
      "You may spend supplies on Same Old Thing as resources to pay for events played by any investigator at your location."
    ],
    "abilities": [],
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "decoy-trap-60562",
    "code": "60562",
    "name": "Decoy Trap",
    "type": "event",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "combat",
      "agility",
      "wild"
    ],
    "traits": [
      "Trap",
      "Trick"
    ],
    "text": [
      "Fast. Attach to your location. Limit 1 [[Trap]] per location.",
      "[reaction] After an enemy enters attached location, exhaust Decoy Trap: <b>Evade</b> ([intellect] or [agility]). Evade that enemy. You get +1 skill value for this evasion. If this test succeeds, you may discard Decoy Trap to move to this location. <i>(You may trigger this ability from any location.)</i>"
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "glassing-60563",
    "code": "60563",
    "name": "Glassing",
    "type": "event",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "intellect",
      "agility",
      "wild"
    ],
    "traits": [
      "Insight",
      "Trap"
    ],
    "text": [
      "Fast. Attach to your location. Limit 1 [[Trap]] per location.",
      "[reaction] After an enemy enters attached location, exhaust Glassing: <b>Investigate</b> ([intellect] or [agility]). You get +1 skill value for this investigation. If you succeed, you may discard Glassing to discover 1 additional clue at this location. <i>(You may trigger this ability from any location.)</i>"
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "guerrilla-tactics-60564",
    "code": "60564",
    "name": "Guerrilla Tactics",
    "type": "event",
    "faction": "survivor",
    "cost": 1,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Tactic"
    ],
    "text": [
      "<b>Fight</b> ([combat]) or <b>Evade</b> ([agility]). You get +1 skill value for this test and you may target an enemy at a connecting location as if you were engaged with that enemy."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "hidden-shelter-60565",
    "code": "60565",
    "name": "Hidden Shelter",
    "type": "event",
    "faction": "survivor",
    "cost": 1,
    "icons": [],
    "traits": [
      "Supply",
      "Trick"
    ],
    "text": [
      "Attach to your location. Limit 1 per location.",
      "[reaction] When the round ends, each investigator at this location may choose one of the following: Draw 1 card, gain 1 resource, heal 1 damage, or heal 1 horror.",
      "<b>Forced</b> - After an enemy enters this location: Discard Hidden Shelter."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "lie-in-wait-60566",
    "code": "60566",
    "name": "Lie in Wait",
    "type": "event",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "willpower",
      "combat",
      "wild"
    ],
    "traits": [
      "Tactic",
      "Trap"
    ],
    "text": [
      "Fast. Attach to your location. Limit 1 [[Trap]] per location.",
      "[reaction] After an enemy enters this location, exhaust Lie in Wait: <b>Fight</b> ([combat] or [agility]). Fight that enemy. You get +1 skill value for this attack. You may discard Lie in Wait for this attack to deal +1 damage. <i>(You may trigger this ability from any location.)</i>"
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "stalk-prey-60567",
    "code": "60567",
    "name": "Stalk Prey",
    "type": "event",
    "faction": "survivor",
    "cost": 1,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Tactic"
    ],
    "text": [
      "Search the top 9 cards of the encounter deck for an enemy, draw it, and shuffle the encounter deck. Then, draw 1 card and discover 1 clue at your location. If that enemy is not at your location, you may move once toward its location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "do-or-die-60568",
    "code": "60568",
    "name": "Do-or-Die",
    "type": "skill",
    "faction": "survivor",
    "icons": [
      "willpower",
      "intellect",
      "agility"
    ],
    "traits": [
      "Fortune"
    ],
    "text": [
      "If this skill test is successful, choose a [survivor] asset or event in your discard pile and add it to your hand."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "on-the-brink-60569",
    "code": "60569",
    "name": "On the Brink",
    "type": "skill",
    "faction": "survivor",
    "icons": [
      "wild"
    ],
    "traits": [
      "Gambit",
      "Desperate"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "If this test fails, return each other card committed to this test to its owner's hand."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "extra-rations-60570",
    "code": "60570",
    "name": "Extra Rations",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "wild"
    ],
    "traits": [
      "Item",
      "Supply"
    ],
    "text": [
      "Uses (4 supplies). If there are no supplies on Extra Rations, discard it.",
      "[fast] Spend 1 supply and exhaust Extra Rations: Heal 1 damage from your investigator or an [[Ally]] asset you control."
    ],
    "abilities": []
  },
  {
    "instanceId": "field-dressing-60571",
    "code": "60571",
    "name": "Field Dressing",
    "type": "event",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Spirit"
    ],
    "text": [
      "Fast. Play after a [[Creature]] or [[Monster]] enemy at your location is defeated.",
      "Heal up to 3 damage from among investigators and/or [[Ally]] assets at your location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "rough-60572",
    "code": "60572",
    "name": "Rough",
    "type": "skill",
    "faction": "survivor",
    "icons": [
      "combat",
      "wild"
    ],
    "traits": [
      "Innate"
    ],
    "text": [
      "For every 2 damage on you (rounded up), Rough gains [wild]."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "canteen-60573",
    "code": "60573",
    "name": "Canteen",
    "type": "asset",
    "faction": "survivor",
    "cost": 1,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Item"
    ],
    "text": [
      "Uses (3 supplies).",
      "[fast] Spend 1 supply and exhaust Canteen: Heal 2 horror."
    ],
    "abilities": [],
    "slot": "Accessory",
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "hunter-s-instinct-60574",
    "code": "60574",
    "name": "Hunter's Instinct",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "combat",
      "agility",
      "wild"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "Limit 1 per investigator. Uses (3 supplies).",
      "[reaction] After you engage an enemy, spend 1 supply and exhaust Hunter's Instinct: Add a level 0-2 event in your discard pile to your hand."
    ],
    "abilities": [],
    "statModifiers": {
      "combat": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "winchester-model-52-60575",
    "code": "60575",
    "name": "Winchester Model 52",
    "type": "asset",
    "faction": "survivor",
    "cost": 3,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "text": [
      "Uses (2 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +3 [combat] and deal +1 damage for this attack.",
      "[action] Discard Winchester Model 52: <b>Fight</b> ([combat]). You get +3 [combat] for this attack. If you succeed, automatically evade the targeted enemy."
    ],
    "abilities": [],
    "slot": "Hand x2",
    "statModifiers": {
      "combat": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "guerrilla-tactics-60576",
    "code": "60576",
    "name": "Guerrilla Tactics",
    "type": "event",
    "faction": "survivor",
    "cost": 1,
    "icons": [
      "combat",
      "agility",
      "wild"
    ],
    "traits": [
      "Tactic"
    ],
    "text": [
      "<b>Fight</b> ([combat]) or <b>Evade</b> ([agility]). You get +2 skill value for this test and you may target an enemy at a connecting location as if you were engaged with that enemy. If you succeed, deal 1 damage to that enemy <i>(in addition to its standard damage)</i>."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "respite-60577",
    "code": "60577",
    "name": "Respite",
    "type": "event",
    "faction": "survivor",
    "cost": 1,
    "icons": [
      "wild",
      "wild"
    ],
    "traits": [
      "Spirit"
    ],
    "text": [
      "Play only if there are no enemies at your location.",
      "Choose up to 3 level 0 event and/or skill cards in your discard pile and shuffle them into your deck. Draw 1 card."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "rope-trap-60578",
    "code": "60578",
    "name": "Rope Trap",
    "type": "event",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "intellect",
      "combat"
    ],
    "traits": [
      "Trap",
      "Trick"
    ],
    "text": [
      "Attach to your location. Limit 1 [[Trap]] attached.",
      "[reaction] When an enemy enters attached location, exhaust Rope Trap: Deal 1 damage to that enemy. Reveal a random token from the chaos bag. If a [skull] or [auto_fail] token is revealed, discard Rope Trap. <i>(You may trigger this ability from any location.)</i>"
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "levelheaded-60579",
    "code": "60579",
    "name": "Levelheaded",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "willpower",
      "agility",
      "wild"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "Starting. <i>(You may begin the game with 1 copy of a starting card in your opening hand.)</i>",
      "[fast] Spend 1 resource: You get +1 [willpower] for this skill test (+2 [willpower] instead if this test is on a scenario card).",
      "[fast] Spend 1 resource: You get +1 [agility] for this skill test (+2 [agility] instead if this test is on a scenario card)."
    ],
    "abilities": [],
    "statModifiers": {
      "willpower": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "longbow-60580",
    "code": "60580",
    "name": "Longbow",
    "type": "asset",
    "faction": "survivor",
    "cost": 3,
    "icons": [
      "combat",
      "agility",
      "wild"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Ranged"
    ],
    "text": [
      "Uses (1 arrow).",
      "[action] Spend 1 arrow: <b>Fight</b> ([agility]). You get +2 [agility] and deal +2 damage for this attack. This attack ignores the aloof keyword.",
      "[action]: Replenish 1 arrow on Longbow."
    ],
    "abilities": [],
    "slot": "Hand x2",
    "statModifiers": {
      "combat": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "makeshift-bomb-60581",
    "code": "60581",
    "name": "Makeshift Bomb",
    "type": "event",
    "faction": "survivor",
    "cost": 3,
    "icons": [
      "combat",
      "agility",
      "wild"
    ],
    "traits": [
      "Trap"
    ],
    "text": [
      "Attach to your location. Limit 1 [[Trap]] attached.",
      "[reaction] After an enemy or investigator enters attached location, discard Makeshift Bomb: Deal 3 damage to each enemy and investigator at that location. <i>(You may trigger this ability from any location.)</i>"
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "timely-intervention-60582",
    "code": "60582",
    "name": "Timely Intervention",
    "type": "skill",
    "faction": "survivor",
    "icons": [
      "wild",
      "wild",
      "wild"
    ],
    "traits": [
      "Fortune"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "You may commit Timely Intervention from your hand after revealing chaos tokens during a skill test you are performing."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "becky-60152",
    "code": "60152",
    "name": "Becky",
    "type": "asset",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "willpower",
      "combat",
      "wild"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "text": [
      "Tommy Muldoon deck only. Uses (2 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +2 [combat] and deal +1 damage for this attack.",
      "[reaction] When you trigger the above [action] ability, exhaust Becky: This attack ignores the aloof and retaliate keywords."
    ],
    "abilities": [],
    "slot": "Hand x2",
    "statModifiers": {
      "willpower": 1,
      "combat": 1
    }
  },
  {
    "instanceId": "loose-cannon-60153",
    "code": "60153",
    "name": "Loose Cannon",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Flaw"
    ],
    "text": [
      "<b>Revelation</b> - You must either discard each [[Firearm]] asset you control or lose 5 resources."
    ],
    "subtype": "weakness",
    "isWeakness": true
  },
  {
    "instanceId": "overconfident-60154",
    "code": "60154",
    "name": "Overconfident",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Flaw"
    ],
    "text": [
      "<b>Revelation</b> - Put Overconfident into play in your threat area.",
      "<b>Forced</b> - After you fail a skill test: Take 1 damage.",
      "[action] [action]: Discard Overconfident."
    ],
    "subtype": "basicweakness",
    "isWeakness": true
  },
  {
    "instanceId": "m1911-60155",
    "code": "60155",
    "name": "M1911",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "agility"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "text": [
      "Uses (4 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +1 [combat] and deal +1 damage for this attack."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "police-dog-60156",
    "code": "60156",
    "name": "Police Dog",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "agility"
    ],
    "traits": [
      "Ally",
      "Creature",
      "Police"
    ],
    "text": [
      "[fast] During an attack or investigation at your location, exhaust Police Dog: The performing investigator gets +1 skill value for this test."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 1,
    "sanity": 1,
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "rookie-cop-60157",
    "code": "60157",
    "name": "Rookie Cop",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Ally",
      "Police"
    ],
    "text": [
      "Rookie Cop may be assigned damage and/or horror dealt to other investigators at your location.",
      "[reaction] When Rookie Cop is defeated: Discover 1 clue at your location."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 2,
    "sanity": 2,
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "service-revolver-60158",
    "code": "60158",
    "name": "Service Revolver",
    "type": "asset",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "agility"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Firearm",
      "Police"
    ],
    "text": [
      "Uses (3 ammo).",
      "[reaction] After an enemy attacks you, spend 1 ammo: <b>Fight</b> ([combat]). This attack targets that enemy. You get +1 [combat] and deal +1 damage for this attack."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "protective-vest-60159",
    "code": "60159",
    "name": "Protective Vest",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Item",
      "Armor"
    ],
    "text": [
      "[reaction] After you play Protective Vest: Search the top 6 cards of your deck for a [[Firearm]] or [[Upgrade]] card and add it to your hand. Shuffle your deck."
    ],
    "abilities": [],
    "slot": "Body",
    "health": 2,
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "make-em-sing-60160",
    "code": "60160",
    "name": "\"Make 'em sing\"",
    "type": "event",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "intellect",
      "combat"
    ],
    "traits": [
      "Tactic"
    ],
    "text": [
      "<b>Parley.</b> Choose an enemy at your location and test [combat] (X), where X is that enemy's remaining health. If you succeed, automatically evade that enemy and discover 1 clue at your location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "bounty-60161",
    "code": "60161",
    "name": "Bounty",
    "type": "event",
    "faction": "guardian",
    "cost": 0,
    "icons": [
      "combat"
    ],
    "traits": [
      "Fortune"
    ],
    "text": [
      "Fast. Play after an enemy at your location is defeated.",
      "Investigators at your location gain a total of X resources, distributed as your wish. X is that enemy's printed health (to a maximum of 6)."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "custom-grip-60162",
    "code": "60162",
    "name": "Custom Grip",
    "type": "event",
    "faction": "guardian",
    "cost": 1,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Upgrade"
    ],
    "text": [
      "Fast. Play only during your turn.",
      "Attach to a [[Firearm]] asset you control.",
      "[fast] During your turn, except during an action, discard Custom Grip: Return attached asset to your hand. You may play a [[Firearm]] asset from your hand <i>(paying its cost)</i>."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "iron-sights-60163",
    "code": "60163",
    "name": "Iron Sights",
    "type": "event",
    "faction": "guardian",
    "cost": 1,
    "icons": [
      "wild"
    ],
    "traits": [
      "Item",
      "Upgrade"
    ],
    "text": [
      "Fast. Play only during your turn.",
      "Attach to a [[Firearm]] asset you control.",
      "[action] Exhaust Iron Sights: You get +3 skill value the next time you fight using attached asset this turn. This action does not provoke attacks of opportunity."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "physical-fitness-60164",
    "code": "60164",
    "name": "Physical Fitness",
    "type": "event",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Spirit"
    ],
    "text": [
      "<b>Move.</b> After this move, heal 2 damage."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "restrained-60165",
    "code": "60165",
    "name": "Restrained",
    "type": "event",
    "faction": "guardian",
    "cost": 1,
    "icons": [
      "willpower",
      "agility"
    ],
    "traits": [
      "Tactic"
    ],
    "text": [
      "Fast. Play after a non-[[Elite]] enemy attacks you.",
      "Automatically evade that enemy and attach Restrained to it. Attached enemy cannot ready.",
      "<b>Forced</b> - When the round ends, if attached enemy is not a [[Humanoid]]: Discard Restrained."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "stakeout-60166",
    "code": "60166",
    "name": "Stakeout",
    "type": "event",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "intellect",
      "intellect"
    ],
    "traits": [
      "Tactic"
    ],
    "text": [
      "<b>Investigate</b> ([intellect]). You get +2 [intellect] for this investigation. If you succeed, heal 1 horror."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "adapt-and-overcome-60167",
    "code": "60167",
    "name": "Adapt and Overcome",
    "type": "skill",
    "faction": "guardian",
    "icons": [
      "combat",
      "agility",
      "wild"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "Commit only to a skill test during an attack or evasion.",
      "The performing investigator ignores the alert and retaliate keywords during this test."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "armed-to-the-teeth-60168",
    "code": "60168",
    "name": "Armed to the Teeth",
    "type": "skill",
    "faction": "guardian",
    "icons": [
      "willpower",
      "combat",
      "agility"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "While it is committed to a skill test on an [[Item]] asset you control, Armed to the Teeth gains [wild] [wild]."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "police-dog-60170",
    "code": "60170",
    "name": "Police Dog",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "agility"
    ],
    "traits": [
      "Ally",
      "Creature",
      "Police"
    ],
    "text": [
      "[fast] During an attack or investigation at your location, exhaust Police Dog: The performing investigator gets +2 skill value for this test."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 1,
    "sanity": 1,
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "m1911-60171",
    "code": "60171",
    "name": "M1911",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "text": [
      "Uses (4 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +2 [combat] and deal +1 damage for this attack. Ignore the retaliate keyword for this attack."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "combat": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "extended-barrel-60172",
    "code": "60172",
    "name": "Extended Barrel",
    "type": "event",
    "faction": "guardian",
    "cost": 1,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Upgrade"
    ],
    "text": [
      "Fast. Play only during your turn.",
      "Attach to a [[Firearm]] asset you control.",
      "You get +1 skill value while attacking with attached asset."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "on-the-beat-60173",
    "code": "60173",
    "name": "On the Beat",
    "type": "event",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect",
      "wild"
    ],
    "traits": [
      "Tactic",
      "Police"
    ],
    "text": [
      "Fast. Play when your turn begins.",
      "Until the end of your turn, you get +3 skill value while investigating or parleying."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "physical-fitness-60174",
    "code": "60174",
    "name": "Physical Fitness",
    "type": "event",
    "faction": "guardian",
    "cost": 1,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Spirit"
    ],
    "text": [
      "<b>Move.</b> After this move, heal 3 damage."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "stock-ammo-reload-60175",
    "code": "60175",
    "name": "Stock Ammo Reload",
    "type": "event",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Supply"
    ],
    "text": [
      "Place 5 ammo, divided as you choose, among [[Firearm]] assets you control."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "vicious-blow-60176",
    "code": "60176",
    "name": "Vicious Blow",
    "type": "skill",
    "faction": "guardian",
    "icons": [
      "combat",
      "combat"
    ],
    "traits": [
      "Practiced",
      "Expert"
    ],
    "text": [
      "If this skill test is successful during an attack, that attack deals +1 damage (+2 damage instead if it succeeds by 2 or more)."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "detective-sherman-60177",
    "code": "60177",
    "name": "Detective Sherman",
    "type": "asset",
    "faction": "guardian",
    "cost": 4,
    "icons": [
      "intellect",
      "combat",
      "wild"
    ],
    "traits": [
      "Ally",
      "Detective",
      "Police"
    ],
    "text": [
      "You get +1 [combat].",
      "Detective Sherman may be assigned damage and/or horror dealt to other investigators at your location.",
      "[reaction] After damage is placed on Detective Sherman, exhaust him: Discover 1 clue at your location."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 3,
    "sanity": 2,
    "statModifiers": {
      "intellect": 1,
      "combat": 1
    }
  },
  {
    "instanceId": "endurance-60178",
    "code": "60178",
    "name": "Endurance",
    "type": "asset",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "Starting. <i>(You may begin the game with 1 copy of a starting card in your opening hand.)</i>",
      "[fast] Spend 1 resource: You get +1 [combat] for this skill test (+2 [combat] instead if this is an attack or evasion).",
      "[fast] Spend 1 resource: You get +1 [agility] for this skill test (+2 [agility] instead if this is an attack or evasion)."
    ],
    "abilities": [],
    "statModifiers": {
      "combat": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "stakeout-60179",
    "code": "60179",
    "name": "Stakeout",
    "type": "event",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Tactic"
    ],
    "text": [
      "<b>Investigate</b> ([intellect]). You get +3 [intellect] for this investigation. If you succeed, discover 1 additional clue at your location and heal 2 horror."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "indomitable-60180",
    "code": "60180",
    "name": "Indomitable",
    "type": "skill",
    "faction": "guardian",
    "icons": [
      "willpower",
      "combat",
      "wild"
    ],
    "traits": [
      "Innate",
      "Developed"
    ],
    "text": [
      "If an enemy has attacked an investigator at this location this round, Indomitable gains [wild] [wild] [wild]."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "protective-vest-60181",
    "code": "60181",
    "name": "Protective Vest",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "willpower",
      "combat",
      "wild"
    ],
    "traits": [
      "Item",
      "Armor",
      "Police"
    ],
    "text": [
      "You have 1 additional hand slot, which may only be used to hold a [[Firearm]] asset.",
      "[reaction] After you play Protective Vest: Search the top 9 cards of your deck for a [[Firearm]] or [[Upgrade]] card and add it to your hand. Shuffle your deck."
    ],
    "abilities": [],
    "slot": "Body",
    "health": 3,
    "statModifiers": {
      "willpower": 1,
      "combat": 1
    }
  },
  {
    "instanceId": "thompson-submachine-gun-60182",
    "code": "60182",
    "name": "Thompson Submachine Gun",
    "type": "asset",
    "faction": "guardian",
    "cost": 6,
    "icons": [
      "combat",
      "combat"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "text": [
      "Uses (6 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +3 [combat] and deal +1 damage for this attack.",
      "[reaction] After you resolve the above [action] ability, spend 1 ammo: <b>Fight</b> ([combat]). This attack deals +1 damage."
    ],
    "abilities": [],
    "slot": "Hand x2",
    "statModifiers": {
      "combat": 2
    }
  },
  {
    "instanceId": "daniela-s-wrench-12002",
    "code": "12002",
    "name": "Daniela's Wrench",
    "type": "asset",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "combat",
      "wild"
    ],
    "traits": [
      "Item",
      "Tool",
      "Weapon",
      "Melee"
    ],
    "text": [
      "Daniela Reyes deck only.",
      "[fast] Exhaust Daniela's Wrench: Choose an enemy at your location. That enemy engages you and makes an immediate attack.",
      "[action]: <b>Fight</b> ([combat]). You get +2 [combat] for this attack. If this enemy attacked you this round, this attack deals +1 damage."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "combat": 1
    }
  },
  {
    "instanceId": "in-harm-s-way-12003",
    "code": "12003",
    "name": "In Harm's Way",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Flaw"
    ],
    "text": [
      "<b>Revelation</b> - Put In Harm's Way into play in your threat area.",
      "<b>Forced</b> - After you deal damage to an enemy: Take 1 damage and place 1 damage on In Harm's Way. If there is 3 or more damage on this card, discard it.",
      "<b>Forced</b> - When the game ends: Suffer 1 physical trauma."
    ],
    "subtype": "weakness",
    "isWeakness": true
  },
  {
    "instanceId": "detective-s-intuition-12005",
    "code": "12005",
    "name": "Detective's Intuition",
    "type": "event",
    "faction": "seeker",
    "cost": 0,
    "icons": [
      "willpower",
      "intellect",
      "wild"
    ],
    "traits": [
      "Insight"
    ],
    "text": [
      "Joe Diamond deck only.",
      "Gain 2 resources and heal 1 damage or 1 horror.",
      "[reaction] After you draw Detective's Intuition during your turn: Reveal it and draw 2 additional cards."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "dead-ends-12006",
    "code": "12006",
    "name": "Dead Ends",
    "type": "event",
    "faction": "neutral",
    "cost": 5,
    "icons": [],
    "traits": [
      "Blunder"
    ],
    "text": [
      "<b>Forced</b> - When you search your deck and Dead Ends is among the searched cards: Draw it, cancel the effects of the search, and shuffle your deck.",
      "<b>Forced</b> - When the game ends or you are eliminated, if this card is in your hand: You earn 2 fewer experience."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "covert-ops-12008",
    "code": "12008",
    "name": "Covert Ops",
    "type": "asset",
    "faction": "rogue",
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
    "text": [
      "Trish Scarborough deck only.",
      "[reaction] After you evade an enemy, exhaust Covert Ops: Either draw 1 card, or move to a connecting location."
    ],
    "abilities": [],
    "statModifiers": {
      "intellect": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "for-my-next-trick-12011",
    "code": "12011",
    "name": "\"For my next trick...\"",
    "type": "event",
    "faction": "mystic",
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
    "text": [
      "Dexter Drake deck only.",
      "Search your deck for a [[Spell]] or [[Item]] asset and play it, reducing its cost by 2 <i>(shuffle your deck)</i>. This action does not provoke attacks of opportunity."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "the-necronomicon-12012",
    "code": "12012",
    "name": "The Necronomicon",
    "type": "asset",
    "faction": "neutral",
    
    "icons": [],
    "traits": [
      "Item",
      "Tome",
      "Cursed"
    ],
    "text": [
      "<b>Revelation</b> - Put The Necronomicon into play in your threat area. It cannot leave play except by the [action] ability below.",
      "You cannot play assets or trigger abilities on other assets you control.",
      "[action]: Test [willpower] (5). If you succeed, discard The Necronomicon. If you fail, shuffle it into your deck and take 1 horror."
    ],
    "abilities": [],
    "slot": "Arcane"
  },
  {
    "instanceId": "isabelle-s-twin-45s-12014",
    "code": "12014",
    "name": "Isabelle's Twin .45s",
    "type": "asset",
    "faction": "survivor",
    "cost": 4,
    "icons": [
      "combat",
      "agility",
      "wild"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "text": [
      "Isabelle Barnes deck only. Uses (6 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +1 [combat] and deal +1 damage for this attack.",
      "[reaction] After you resolve the above ability, spend 1 ammo and exhaust Isabelle's Twin .45s: <b>Fight</b> ([agility]). You get +1 [agility] and deal +1 damage for this attack."
    ],
    "abilities": [],
    "slot": "Hand x2",
    "statModifiers": {
      "combat": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "breaking-point-12015",
    "code": "12015",
    "name": "Breaking Point",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Hardship"
    ],
    "text": [
      "<b>Revelation</b> - Take 1 direct damage. Then, if you have 6 or fewer remaining sanity, take 1 direct damage. Then, if you have 3 or fewer remaining sanity, take 1 direct damage."
    ],
    "subtype": "weakness",
    "isWeakness": true
  },
  {
    "instanceId": "bodyguard-12016",
    "code": "12016",
    "name": "Bodyguard",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "combat"
    ],
    "traits": [
      "Ally"
    ],
    "text": [
      "Bodyguard may be assigned damage dealt to other investigators at your location.",
      "[reaction] When Bodyguard is defeated: Deal 1 damage to an enemy at your location."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 2,
    "sanity": 1,
    "statModifiers": {
      "combat": 1
    }
  },
  {
    "instanceId": "endurance-12017",
    "code": "12017",
    "name": "Endurance",
    "type": "asset",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "[fast] Spend 1 resource: You get +1 [combat] for this skill test (+2 [combat] instead if this is an attack or evasion).",
      "[fast] Spend 1 resource: You get +1 [agility] for this skill test (+2 [agility] instead if this is an attack or evasion)."
    ],
    "abilities": [],
    "statModifiers": {
      "combat": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "logan-hastings-12018",
    "code": "12018",
    "name": "Logan Hastings",
    "type": "asset",
    "faction": "guardian",
    "cost": 4,
    "icons": [
      "combat"
    ],
    "traits": [
      "Ally",
      "Hunter"
    ],
    "text": [
      "You get +1 [combat].",
      "[reaction] After you defeat an enemy, exhaust Logan Hastings: Gain 1 resource."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 2,
    "sanity": 1,
    "statModifiers": {
      "combat": 1
    }
  },
  {
    "instanceId": "m1911-12019",
    "code": "12019",
    "name": "M1911",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "agility"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "text": [
      "Uses (4 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +1 [combat] and deal +1 damage for this attack."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "machete-12020",
    "code": "12020",
    "name": "Machete",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "combat"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Melee"
    ],
    "text": [
      "[action]: <b>Fight</b> ([combat]). You get +1 [combat] for this attack. If the attacked enemy is the only enemy engaged with you, you may exhaust Machete to deal +1 damage for this attack."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "combat": 1
    }
  },
  {
    "instanceId": "resilience-12021",
    "code": "12021",
    "name": "Resilience",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Talent"
    ],
    "text": [],
    "abilities": [],
    "health": 2,
    "sanity": 2,
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "lesson-learned-12022",
    "code": "12022",
    "name": "Lesson Learned",
    "type": "event",
    "faction": "guardian",
    "cost": 1,
    "icons": [
      "intellect",
      "combat"
    ],
    "traits": [
      "Insight",
      "Spirit"
    ],
    "text": [
      "Fast. Play after an enemy attacks you.",
      "Discover 1 clue at your location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "right-tool-for-the-job-12023",
    "code": "12023",
    "name": "Right Tool for the Job",
    "type": "event",
    "faction": "guardian",
    "cost": 1,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Insight"
    ],
    "text": [
      "Search the top 9 cards of your deck for a [[Tool]] or [[Weapon]] asset and add it to your hand. Shuffle your deck."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "scene-of-the-crime-12024",
    "code": "12024",
    "name": "Scene of the Crime",
    "type": "event",
    "faction": "guardian",
    "cost": 2,
    "icons": [
      "intellect",
      "combat"
    ],
    "traits": [
      "Insight",
      "Bold"
    ],
    "text": [
      "Play only as your first action.",
      "Discover 1 clue at your location (2 clues instead if there is an enemy at that location). This action does not provoke attacks of opportunity."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "vicious-blow-12025",
    "code": "12025",
    "name": "Vicious Blow",
    "type": "skill",
    "faction": "guardian",
    "icons": [
      "combat"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "If this skill test is successful during an attack, that attack deals +1 damage."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "counterattack-12026",
    "code": "12026",
    "name": "Counterattack",
    "type": "event",
    "faction": "guardian",
    "cost": 1,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Spirit",
      "Tactic"
    ],
    "text": [
      "Fast. Play when an enemy attacks an investigator at your location <i>(before resolving that attack)</i>.",
      "Cancel that attack. Deal 1 damage to that enemy."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "bodyguard-12027",
    "code": "12027",
    "name": "Bodyguard",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "combat",
      "wild"
    ],
    "traits": [
      "Ally"
    ],
    "text": [
      "Bodyguard may be assigned damage dealt to other investigators at your location.",
      "[reaction] When Bodyguard is defeated: Deal 2 damage to an enemy at your location."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 3,
    "sanity": 2,
    "statModifiers": {
      "combat": 1
    }
  },
  {
    "instanceId": "sledgehammer-12028",
    "code": "12028",
    "name": "Sledgehammer",
    "type": "asset",
    "faction": "guardian",
    "cost": 3,
    "icons": [
      "combat",
      "combat"
    ],
    "traits": [
      "Item",
      "Tool",
      "Weapon",
      "Melee"
    ],
    "text": [
      "[action]: <b>Fight</b> ([combat]). This attack deals + 1 damage.",
      "[action][action]: <b>Fight</b> ([combat]). You get +3 [combat] for this attack. If you succeed, you may exhaust Sledgehammer for this attack to deal +2 damage."
    ],
    "abilities": [],
    "slot": "Hand x2",
    "statModifiers": {
      "combat": 2
    }
  },
  {
    "instanceId": "winchester-model-12-12029",
    "code": "12029",
    "name": "Winchester Model 12",
    "type": "asset",
    "faction": "guardian",
    "cost": 4,
    "icons": [
      "combat",
      "combat"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "text": [
      "Uses (3 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([combat]). You get +3 [combat] for this attack. If you succeed, this attack deals +1 damage for each point you succeed by (to a maximum of +4). If you fail and would deal damage to another investigator, this attack deals 1 damage for each point you fail by (to a maximum of 5 damage)."
    ],
    "abilities": [],
    "slot": "Hand x2",
    "statModifiers": {
      "combat": 2
    }
  },
  {
    "instanceId": "dorothy-simmons-12030",
    "code": "12030",
    "name": "Dorothy Simmons",
    "type": "asset",
    "faction": "seeker",
    "cost": 3,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Ally",
      "Miskatonic"
    ],
    "text": [
      "You get +1 [intellect].",
      "[reaction] After you successfully investigate by exactly 1 or 3, exhaust Dorothy Simmons: Gain 1 resource."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 1,
    "sanity": 1,
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "fingerprint-kit-12031",
    "code": "12031",
    "name": "Fingerprint Kit",
    "type": "asset",
    "faction": "seeker",
    "cost": 4,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Tool"
    ],
    "text": [
      "Uses (3 supplies).",
      "[action] Exhaust Fingerprint Kit and spend 1 supply: <b>Investigate</b> ([intellect]). You get +1 [intellect] for this investigation. If you succeed, discover 1 additional clue at your location."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "laboratory-assistant-12032",
    "code": "12032",
    "name": "Laboratory Assistant",
    "type": "asset",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect"
    ],
    "traits": [
      "Ally",
      "Miskatonic",
      "Science"
    ],
    "text": [
      "Your maximum hand size is increased by 2.",
      "[reaction] After you play Laboratory Assistant: Draw 2 cards."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 1,
    "sanity": 2,
    "statModifiers": {
      "willpower": 1,
      "intellect": 1
    }
  },
  {
    "instanceId": "local-map-12033",
    "code": "12033",
    "name": "Local Map",
    "type": "asset",
    "faction": "seeker",
    "cost": 3,
    "icons": [
      "agility"
    ],
    "traits": [
      "Item"
    ],
    "text": [
      "Uses (4 secrets).",
      "[action] Spend 1 secret: <b>Investigate</b> ([intellect]). Investigate a revealed connecting location. You get +1 [intellect] for this investigation. If you succeed, you may exhaust Local Map to move to that location."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "magnifying-glass-12034",
    "code": "12034",
    "name": "Magnifying Glass",
    "type": "asset",
    "faction": "seeker",
    "cost": 1,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Tool"
    ],
    "text": [
      "Fast.",
      "You get +1 [intellect] while investigating."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "sharp-rhetoric-12035",
    "code": "12035",
    "name": "Sharp Rhetoric",
    "type": "asset",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "willpower",
      "intellect"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "[fast] Spend 1 resource: You get +1 [intellect] for this skill test (+2 [intellect] instead if this is an investigation or parley).",
      "[fast] Spend 1 resource: You get +1 [willpower] for this skill test (+2 [willpower] instead if this is an investigation or parley)."
    ],
    "abilities": [],
    "statModifiers": {
      "willpower": 1,
      "intellect": 1
    }
  },
  {
    "instanceId": "gather-intel-12036",
    "code": "12036",
    "name": "Gather Intel",
    "type": "event",
    "faction": "seeker",
    "cost": 1,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Insight"
    ],
    "text": [
      "Fast. Play when an enemy enters your location.",
      "Draw 2 cards."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "through-the-cracks-12037",
    "code": "12037",
    "name": "Through the Cracks",
    "type": "event",
    "faction": "seeker",
    "cost": 3,
    "icons": [
      "agility"
    ],
    "traits": [
      "Insight",
      "Trick"
    ],
    "text": [
      "<b>Evade</b> ([agility]). You get +1 [agility] for this evasion for each clue you control (to a maximum of +3). If you succeed, you may disengage from each enemy engaged with you and move to a revealed connecting location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "working-a-hunch-12038",
    "code": "12038",
    "name": "Working a Hunch",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "intellect",
      "intellect"
    ],
    "traits": [
      "Insight"
    ],
    "text": [
      "Fast. Play only during your turn.",
      "Discover 1 clue at your location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "deduction-12039",
    "code": "12039",
    "name": "Deduction",
    "type": "skill",
    "faction": "seeker",
    "icons": [
      "intellect"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "If this skill test is successful while investigating a location, discover 1 additional clue at that location."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "mysterious-grimoire-12040",
    "code": "12040",
    "name": "Mysterious Grimoire",
    "type": "asset",
    "faction": "seeker",
    "cost": 3,
    "icons": [
      "intellect",
      "intellect"
    ],
    "traits": [
      "Item",
      "Tome"
    ],
    "text": [
      "Uses (4 secrets).",
      "[fast] During your turn, spend 1 or 2 secrets and exhaust Mysterious Grimoire: Search the top 3 cards (or 6 cards instead if you spent 2 secrets) of your deck for a card and draw it. If 1 or more weaknesses are among the searched cards, draw them as well. Shuffle your deck."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 2
    }
  },
  {
    "instanceId": "through-the-cracks-12041",
    "code": "12041",
    "name": "Through the Cracks",
    "type": "event",
    "faction": "seeker",
    "cost": 2,
    "icons": [
      "agility",
      "wild"
    ],
    "traits": [
      "Insight",
      "Trick"
    ],
    "text": [
      "<b>Evade</b> ([agility]). You get +2 [agility] for this evasion for each clue you control (to a maximum of +6). If you succeed, you may disengage from each enemy engaged with you and move to a revealed connecting location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "studious-12042",
    "code": "12042",
    "name": "Studious",
    "type": "asset",
    "faction": "seeker",
    
    "icons": [],
    "traits": [
      "Talent"
    ],
    "text": [
      "Permanent.",
      "You begin each game with 1 additional card in your opening hand."
    ],
    "abilities": []
  },
  {
    "instanceId": "unbridled-knowledge-12043",
    "code": "12043",
    "name": "Unbridled Knowledge",
    "type": "event",
    "faction": "seeker",
    "cost": 1,
    "icons": [
      "intellect",
      "intellect",
      "wild"
    ],
    "traits": [
      "Insight"
    ],
    "text": [
      "Reveal the top 5 cards of your deck (8 cards instead if you control 2 or more clues). Draw 3 of them and place the rest of those cards on the top and/or bottom of your deck in any order."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "lucky-cigarette-case-12044",
    "code": "12044",
    "name": "Lucky Cigarette Case",
    "type": "asset",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Item",
      "Charm"
    ],
    "text": [
      "[reaction] After you succeed at a skill test by 2 or more, exhaust Lucky Cigarette Case: Draw 1 card."
    ],
    "abilities": [],
    "slot": "Accessory",
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "m1903-hammerless-12045",
    "code": "12045",
    "name": "M1903 Hammerless",
    "type": "asset",
    "faction": "rogue",
    "cost": 3,
    "icons": [
      "agility"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Firearm"
    ],
    "text": [
      "Uses (4 ammo).",
      "[action] Spend 1 ammo: <b>Fight</b> ([agility]). If the targeted enemy is exhausted, this attack deals +1 damage."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "olivier-bishop-12046",
    "code": "12046",
    "name": "Olivier Bishop",
    "type": "asset",
    "faction": "rogue",
    "cost": 4,
    "icons": [
      "agility"
    ],
    "traits": [
      "Ally",
      "Criminal",
      "Socialite"
    ],
    "text": [
      "You get +1 [agility].",
      "[fast] During your turn, exhaust Olivier Bishop: Move to a connecting location."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 2,
    "sanity": 1,
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "silver-tongue-12047",
    "code": "12047",
    "name": "Silver Tongue",
    "type": "asset",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "[fast] Spend 1 resource: You get +1 [intellect] for this skill test (+2 [intellect] instead if this is an evasion or parley).",
      "[fast] Spend 1 resource: You get +1 [agility] for this skill test (+2 [agility] instead if this is an evasion or parley)."
    ],
    "abilities": [],
    "statModifiers": {
      "intellect": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "sticky-fingers-12048",
    "code": "12048",
    "name": "Sticky Fingers",
    "type": "asset",
    "faction": "rogue",
    "cost": 1,
    "icons": [
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "Limit 1 per investigator.",
      "[reaction] After you successfully evade an enemy, exhaust Sticky Fingers: Gain 1 resource."
    ],
    "abilities": [],
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "thieves-kit-12049",
    "code": "12049",
    "name": "Thieves' Kit",
    "type": "asset",
    "faction": "rogue",
    "cost": 3,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Tool",
      "Illicit"
    ],
    "text": [
      "Uses (6 supplies).",
      "[action] Spend 1 supply: <b>Investigate</b> ([intellect] or [agility]). If you succeed, gain 1 resource."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "breaking-and-entering-12050",
    "code": "12050",
    "name": "Breaking and Entering",
    "type": "event",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Trick"
    ],
    "text": [
      "<b>Investigate</b> ([intellect]). Add your [agility] to your [intellect] for this investigation. If you succeed by 2 or more, you may automatically evade an enemy at this location. This action does not provoke attacks of opportunity."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "paint-the-town-red-12051",
    "code": "12051",
    "name": "Paint the Town Red",
    "type": "event",
    "faction": "rogue",
    "cost": 0,
    "icons": [
      "willpower",
      "agility"
    ],
    "traits": [
      "Fortune",
      "Gambit"
    ],
    "text": [
      "<b>Parley.</b> Search the top 9 cards of the encounter deck for a non-[[Elite]] enemy, draw it, and gain resources equal to that enemy's printed health. Shuffle the encounter deck."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "prestidigitation-12052",
    "code": "12052",
    "name": "Prestidigitation",
    "type": "event",
    "faction": "rogue",
    "cost": 1,
    "icons": [
      "willpower",
      "agility"
    ],
    "traits": [
      "Trick"
    ],
    "text": [
      "Fast. Play only during your turn.",
      "Play an [[Item]] asset from your hand, reducing its cost by 2. When your turn ends, return an [[Item]] asset you control to your hand."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "out-of-sight-12053",
    "code": "12053",
    "name": "Out of Sight",
    "type": "skill",
    "faction": "rogue",
    "icons": [
      "agility"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "If this test is successful by 2 or more, the performing investigator may disengage from each enemy and move to a revealed connecting location."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "sticky-fingers-12054",
    "code": "12054",
    "name": "Sticky Fingers",
    "type": "asset",
    "faction": "rogue",
    "cost": 1,
    "icons": [
      "agility",
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "Fast. Limit 1 per investigator.",
      "[reaction] After you successfully evade an enemy, exhaust Sticky Fingers: Gain 1 resource."
    ],
    "abilities": [],
    "statModifiers": {
      "agility": 2
    }
  },
  {
    "instanceId": "decisive-strike-12055",
    "code": "12055",
    "name": "Decisive Strike",
    "type": "event",
    "faction": "rogue",
    "cost": 2,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Tactic",
      "Gambit"
    ],
    "text": [
      "<b>Fight</b> ([combat]). You get +2 [combat] and deal +1 damage for this attack. If this attack defeats an enemy, gain 5 resources."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "another-day-another-dollar-12056",
    "code": "12056",
    "name": "Another Day, Another Dollar",
    "type": "asset",
    "faction": "rogue",
    
    "icons": [],
    "traits": [
      "Talent"
    ],
    "text": [
      "Permanent.",
      "You begin each game with 2 additional resources."
    ],
    "abilities": []
  },
  {
    "instanceId": "out-of-sight-12057",
    "code": "12057",
    "name": "Out of Sight",
    "type": "skill",
    "faction": "rogue",
    "icons": [
      "agility",
      "agility",
      "agility"
    ],
    "traits": [
      "Practiced",
      "Expert"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "If this test is successful by 1 or more, the performing investigator may disengage from each enemy and move to a revealed location up to 2 connections away."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "cloak-of-resonance-12058",
    "code": "12058",
    "name": "Cloak of Resonance",
    "type": "asset",
    "faction": "mystic",
    "cost": 3,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Item",
      "Clothing",
      "Alchemy"
    ],
    "text": [
      "[reaction] When horror is placed on Cloak of Resonance, exhaust it: Deal 1 damage to an enemy at your location."
    ],
    "abilities": [],
    "slot": "Body",
    "sanity": 3,
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "cosmic-flame-12059",
    "code": "12059",
    "name": "Cosmic Flame",
    "type": "asset",
    "faction": "mystic",
    "cost": 3,
    "icons": [
      "combat"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "Uses (3 charges).",
      "[action]: <b>Fight</b> ([willpower]). If you succeed, you may spend 1 charge to deal +1 damage for this attack. If you reveal a [skull] token during this test, remove 1 charge from Cosmic Flame (if you cannot, take 1 damage and discard this card)."
    ],
    "abilities": [],
    "slot": "Arcane",
    "statModifiers": {
      "combat": 1
    }
  },
  {
    "instanceId": "jim-culver-12060",
    "code": "12060",
    "name": "Jim Culver",
    "type": "asset",
    "faction": "mystic",
    "cost": 4,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Ally",
      "Performer"
    ],
    "text": [
      "You get +1 [willpower].",
      "[reaction] After you take damage and/or horror, exhaust Jim Culver: Draw 1 card."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 2,
    "sanity": 2,
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "lucky-charm-12061",
    "code": "12061",
    "name": "Lucky Charm",
    "type": "asset",
    "faction": "mystic",
    "cost": 2,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Item",
      "Charm",
      "Blessed"
    ],
    "text": [
      "Uses (4 charges).",
      "[fast] Spend 1 charge and exhaust Lucky Charm: Move 1 damage or 1 horror from a card at your location to a card you control <i>(with a health or sanity value)</i>."
    ],
    "abilities": [],
    "slot": "Accessory",
    "sanity": 2,
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "second-sight-12062",
    "code": "12062",
    "name": "Second Sight",
    "type": "asset",
    "faction": "mystic",
    "cost": 4,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "Uses (3 charges).",
      "[action]: <b>Investigate</b> ([willpower]). If you succeed, you may spend 1 charge to discover 1 additional clue at your location. If you reveal a [cultist] token during this test, remove 1 charge from Second Sight (if you cannot, take 1 horror and discard this card)."
    ],
    "abilities": [],
    "slot": "Arcane",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "spiritual-intuition-12063",
    "code": "12063",
    "name": "Spiritual Intuition",
    "type": "asset",
    "faction": "mystic",
    "cost": 2,
    "icons": [
      "willpower",
      "combat"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "[fast] Spend 1 resource: You get +1 [willpower] for this skill test (+2 [willpower] instead if this test is on a [[Spell]] or [[Ritual]] card).",
      "[fast] Spend 1 resource: You get +1 [combat] for this skill test (+2 [combat] instead if this test is on a [[Spell]] or [[Ritual]] card)."
    ],
    "abilities": [],
    "statModifiers": {
      "willpower": 1,
      "combat": 1
    }
  },
  {
    "instanceId": "premonition-12064",
    "code": "12064",
    "name": "Premonition",
    "type": "event",
    "faction": "mystic",
    "cost": 0,
    "icons": [
      "intellect",
      "agility"
    ],
    "traits": [
      "Augury"
    ],
    "text": [
      "Fast. Play during any [fast] window.",
      "Put Premonition into play and seal a random token from the chaos bag on Premonition.",
      "<b>Forced</b> - When a token would be revealed from the chaos bag: Resolve the token sealed here as if it were just revealed, instead. Then, release that token and discard Premonition."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "ward-of-protection-12065",
    "code": "12065",
    "name": "Ward of Protection",
    "type": "event",
    "faction": "mystic",
    "cost": 1,
    "icons": [
      "wild"
    ],
    "traits": [
      "Spell",
      "Spirit"
    ],
    "text": [
      "Fast. Play when you draw a non-weakness treachery card.",
      "Cancel that card's revelation effect and take 1 horror."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "will-of-the-cosmos-12066",
    "code": "12066",
    "name": "Will of the Cosmos",
    "type": "event",
    "faction": "mystic",
    "cost": 0,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Insight",
      "Augury"
    ],
    "text": [
      "Place 1 doom on a player card you control. Then, discover 1 clue at your location and 1 clue at another revealed location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "soul-link-12067",
    "code": "12067",
    "name": "Soul Link",
    "type": "skill",
    "faction": "mystic",
    "icons": [
      "wild",
      "wild",
      "wild"
    ],
    "traits": [
      "Innate",
      "Spell"
    ],
    "text": [
      "As an additional cost to commit Soul Link, take 1 horror."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "mask-of-silenus-12068",
    "code": "12068",
    "name": "Mask of Silenus",
    "type": "asset",
    "faction": "mystic",
    "cost": 3,
    "icons": [
      "wild"
    ],
    "traits": [
      "Item",
      "Mask",
      "Relic",
      "Cursed"
    ],
    "text": [
      "Uses (3 charges).",
      "[reaction] When you would reveal a chaos token, spend 1 charge: Reveal 1 additional token. Choose 1 of those tokens to resolve and ignore the other. If you resolved a token with a symbol, take 1 horror."
    ],
    "abilities": [],
    "slot": "Head"
  },
  {
    "instanceId": "fearless-12069",
    "code": "12069",
    "name": "Fearless",
    "type": "skill",
    "faction": "mystic",
    "icons": [
      "willpower",
      "willpower"
    ],
    "traits": [
      "Innate",
      "Developed"
    ],
    "text": [
      "If this skill test is successful, heal 1 horror (2 horror instead if it succeeds by 2 or more)."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "augur-of-elokoss-12070",
    "code": "12070",
    "name": "Augur of Elokoss",
    "type": "event",
    "faction": "mystic",
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
    "text": [
      "<b>Investigate</b> ([intellect]). Add your [willpower] to your [intellect] for this investigation. If you succeed, discover 1 additional clue at your location. If you succeed and a token with a symbol was revealed during this test, you may discard a [[Terror]] or [[Hex]] treachery from any investigator's threat area."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "cosmic-flame-12071",
    "code": "12071",
    "name": "Cosmic Flame",
    "type": "asset",
    "faction": "mystic",
    "cost": 3,
    "icons": [
      "willpower",
      "combat",
      "wild"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "Uses (4 charges).",
      "[action]: <b>Fight</b> ([willpower]). You get +2 [willpower] and deal +1 damage for this attack. If you succeed, you may spend 1 charge to deal 1 damage to an enemy at your location. If you reveal a [skull] token during this test, remove 1 charge from Cosmic Flame (if you cannot, take 1 damage and discard this card)."
    ],
    "abilities": [],
    "slot": "Arcane",
    "statModifiers": {
      "willpower": 1,
      "combat": 1
    }
  },
  {
    "instanceId": "aleksey-saburov-12072",
    "code": "12072",
    "name": "Aleksey Saburov",
    "type": "asset",
    "faction": "survivor",
    "cost": 3,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Ally"
    ],
    "text": [
      "[reaction] When your turn begins: Heal 1 damage or 1 horror from Aleksey Saburov."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 2,
    "sanity": 2,
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "bandages-12073",
    "code": "12073",
    "name": "Bandages",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "agility"
    ],
    "traits": [
      "Item"
    ],
    "text": [
      "Uses (3 supplies). If there are no supplies on Bandages, discard it.",
      "[reaction] After an investigator or [[Ally]] asset at your location takes 1 or more damage, spend 1 supply: Heal 1 damage from that card."
    ],
    "abilities": [],
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "hunter-s-instinct-12074",
    "code": "12074",
    "name": "Hunter's Instinct",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "Limit 1 per investigator. Uses (3 supplies). If there are no supplies on Hunter's Instinct, discard it.",
      "[reaction] After you engage an enemy, spend 1 supply and exhaust Hunter's Instinct: Add a level 0 event in your discard pile to your hand."
    ],
    "abilities": [],
    "statModifiers": {
      "combat": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "jumpsuit-12075",
    "code": "12075",
    "name": "Jumpsuit",
    "type": "asset",
    "faction": "survivor",
    "cost": 1,
    "icons": [
      "combat"
    ],
    "traits": [
      "Item",
      "Clothing"
    ],
    "text": [
      "[fast] During your turn, discard Jumpsuit: Choose a [[Tool]] or [[Weapon]] asset in your discard pile and add it to your hand."
    ],
    "abilities": [],
    "slot": "Body",
    "health": 2,
    "statModifiers": {
      "combat": 1
    }
  },
  {
    "instanceId": "levelheaded-12076",
    "code": "12076",
    "name": "Levelheaded",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "willpower",
      "agility"
    ],
    "traits": [
      "Talent"
    ],
    "text": [
      "[fast] Spend 1 resource: You get +1 [willpower] for this skill test (+2 [willpower] instead if this test is on a scenario card).",
      "[fast] Spend 1 resource: You get +1 [agility] for this skill test (+2 [agility] instead if this test is on a scenario card)."
    ],
    "abilities": [],
    "statModifiers": {
      "willpower": 1,
      "agility": 1
    }
  },
  {
    "instanceId": "meat-cleaver-12077",
    "code": "12077",
    "name": "Meat Cleaver",
    "type": "asset",
    "faction": "survivor",
    "cost": 3,
    "icons": [
      "willpower"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Melee"
    ],
    "text": [
      "[action]: <b>Fight</b> ([combat]). You get +1 [combat] for this attack (+2 [combat] instead if you have 3 or fewer remaining sanity). If this attack defeats an enemy, you may heal 1 horror.",
      "[reaction] When you trigger the above [action] ability, take 1 horror: This attack deals +1 damage."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "willpower": 1
    }
  },
  {
    "instanceId": "look-what-i-found-12078",
    "code": "12078",
    "name": "\"Look what I found!\"",
    "type": "event",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "intellect",
      "intellect"
    ],
    "traits": [
      "Fortune"
    ],
    "text": [
      "Fast. Play after you fail a skill test by 2 or less while investigating.",
      "Discover 2 clues at your location."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "shove-off-12079",
    "code": "12079",
    "name": "\"Shove off!\"",
    "type": "event",
    "faction": "survivor",
    "cost": 1,
    "icons": [
      "combat",
      "agility"
    ],
    "traits": [
      "Tactic"
    ],
    "text": [
      "<b>Evade</b> ([agility]). If you succeed, deal 1 damage to the evaded enemy. If you fail, return \"Shove off!\" to your hand at the end of your turn."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "slippery-12080",
    "code": "12080",
    "name": "Slippery",
    "type": "skill",
    "faction": "survivor",
    "icons": [
      "agility"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "If this skill test is successful while evading a non-[[Elite]] enemy, that enemy does not ready during the next upkeep phase."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "timely-intervention-12081",
    "code": "12081",
    "name": "Timely Intervention",
    "type": "skill",
    "faction": "survivor",
    "icons": [
      "willpower",
      "agility",
      "wild"
    ],
    "traits": [
      "Fortune"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "You may commit Timely Intervention from your hand after revealing chaos tokens during a skill test you are performing."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "scrape-by-12082",
    "code": "12082",
    "name": "Scrape By",
    "type": "event",
    "faction": "survivor",
    "cost": 1,
    "icons": [
      "wild"
    ],
    "traits": [
      "Fortune"
    ],
    "text": [
      "Fast. Play when you would fail a skill test during which a non-[auto_fail] token was revealed.",
      "You succeed at that skill test instead. If a token with a symbol was revealed during that skill test, take 1 horror."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "old-compass-12083",
    "code": "12083",
    "name": "Old Compass",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "intellect",
      "intellect"
    ],
    "traits": [
      "Item",
      "Tool"
    ],
    "text": [
      "[action]: <b>Investigate</b> ([intellect]). Your location gets -1 shroud for this investigation. If you fail, you may exhaust Old Compass to attempt this test again. If you do, your location gets -2 shroud for this investigation, instead."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 2
    }
  },
  {
    "instanceId": "on-the-brink-12084",
    "code": "12084",
    "name": "On the Brink",
    "type": "skill",
    "faction": "survivor",
    "icons": [
      "wild",
      "wild"
    ],
    "traits": [
      "Gambit",
      "Desperate"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "If this test fails, return each other card committed to this test to its owner's hand and draw 1 card."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "meat-cleaver-12085",
    "code": "12085",
    "name": "Meat Cleaver",
    "type": "asset",
    "faction": "survivor",
    "cost": 2,
    "icons": [
      "willpower",
      "combat",
      "wild"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Melee"
    ],
    "text": [
      "[action]: <b>Fight</b> ([combat]). You get +2 [combat] for this attack (+3 [combat] instead if you have 3 or fewer remaining sanity). If this attack defeats an enemy, you may heal 1 horror.",
      "[reaction] When you trigger the above [action] ability, take 1 horror: This attack deals +1 damage."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "willpower": 1,
      "combat": 1
    }
  },
  {
    "instanceId": "broken-bottle-12086",
    "code": "12086",
    "name": "Broken Bottle",
    "type": "asset",
    "faction": "neutral",
    "cost": 1,
    "icons": [
      "combat"
    ],
    "traits": [
      "Item",
      "Weapon",
      "Melee",
      "Improvised"
    ],
    "text": [
      "[action]: <b>Fight</b> ([combat]). You get +1 [combat] for this attack. If you succeed, you may discard Broken Bottle to deal +1 damage for this attack."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "combat": 1
    }
  },
  {
    "instanceId": "fedora-12087",
    "code": "12087",
    "name": "Fedora",
    "type": "asset",
    "faction": "neutral",
    "cost": 2,
    "icons": [
      "agility"
    ],
    "traits": [
      "Item",
      "Apparel",
      "Headwear"
    ],
    "text": [],
    "abilities": [],
    "slot": "Head",
    "health": 1,
    "sanity": 1,
    "statModifiers": {
      "agility": 1
    }
  },
  {
    "instanceId": "hand-crank-flashlight-12088",
    "code": "12088",
    "name": "Hand-Crank Flashlight",
    "type": "asset",
    "faction": "neutral",
    "cost": 1,
    "icons": [
      "intellect"
    ],
    "traits": [
      "Item",
      "Tool"
    ],
    "text": [
      "[action]: <b>Investigate</b> ([intellect]). You get +1 [intellect] for this test. If you succeed, you may discard Hand-Crank Flashlight for your location to get -1 shroud until the end of the round."
    ],
    "abilities": [],
    "slot": "Hand",
    "statModifiers": {
      "intellect": 1
    }
  },
  {
    "instanceId": "emergency-cache-12089",
    "code": "12089",
    "name": "Emergency Cache",
    "type": "event",
    "faction": "neutral",
    "cost": 0,
    "icons": [],
    "traits": [
      "Supply"
    ],
    "text": [
      "Gain 3 resources."
    ],
    "onPlay": {
      "kind": "none"
    }
  },
  {
    "instanceId": "guts-12090",
    "code": "12090",
    "name": "Guts",
    "type": "skill",
    "faction": "neutral",
    "icons": [
      "willpower",
      "willpower"
    ],
    "traits": [
      "Innate"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "If this test is successful, the performing investigator draws 1 card."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "manual-dexterity-12091",
    "code": "12091",
    "name": "Manual Dexterity",
    "type": "skill",
    "faction": "neutral",
    "icons": [
      "agility",
      "agility"
    ],
    "traits": [
      "Innate"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "If this test is successful, the performing investigator draws 1 card."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "overpower-12092",
    "code": "12092",
    "name": "Overpower",
    "type": "skill",
    "faction": "neutral",
    "icons": [
      "combat",
      "combat"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "If this test is successful, the performing investigator draws 1 card."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "perception-12093",
    "code": "12093",
    "name": "Perception",
    "type": "skill",
    "faction": "neutral",
    "icons": [
      "intellect",
      "intellect"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "Max 1 committed per skill test.",
      "If this test is successful, the performing investigator draws 1 card."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "unexpected-courage-12094",
    "code": "12094",
    "name": "Unexpected Courage",
    "type": "skill",
    "faction": "neutral",
    "icons": [
      "wild",
      "wild"
    ],
    "traits": [
      "Innate"
    ],
    "text": [
      "Max 1 committed per skill test."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "charisma-12095",
    "code": "12095",
    "name": "Charisma",
    "type": "asset",
    "faction": "neutral",
    
    "icons": [],
    "traits": [
      "Talent"
    ],
    "text": [
      "Permanent.",
      "You have 1 additional ally slot."
    ],
    "abilities": []
  },
  {
    "instanceId": "relic-hunter-12096",
    "code": "12096",
    "name": "Relic Hunter",
    "type": "asset",
    "faction": "neutral",
    
    "icons": [],
    "traits": [
      "Talent"
    ],
    "text": [
      "Permanent.",
      "You have 1 additional accessory slot."
    ],
    "abilities": []
  },
  {
    "instanceId": "amnesia-12097",
    "code": "12097",
    "name": "Amnesia",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Madness"
    ],
    "text": [
      "<b>Revelation</b> - Choose and discard all but 1 card from your hand."
    ],
    "subtype": "basicweakness",
    "isWeakness": true
  },
  {
    "instanceId": "the-gold-bug-12098",
    "code": "12098",
    "name": "The Gold Bug",
    "type": "asset",
    "faction": "neutral",
    
    "icons": [],
    "traits": [
      "Item",
      "Relic",
      "Alchemy",
      "Cursed"
    ],
    "text": [
      "<b>Revelation</b> - Put The Gold Bug into play in your threat area. It cannot leave play except by the [action] ability below.",
      "You get -1 health and -1 sanity.",
      "[action]: Shuffle the Gold Bug into your deck."
    ],
    "abilities": [],
    "slot": "Accessory"
  },
  {
    "instanceId": "overzealous-12100",
    "code": "12100",
    "name": "Overzealous",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Flaw"
    ],
    "text": [
      "<b>Revelation</b> - Draw the top card of the encounter deck. That card gains surge."
    ],
    "subtype": "basicweakness",
    "isWeakness": true
  },
  {
    "instanceId": "paranoia-12101",
    "code": "12101",
    "name": "Paranoia",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Madness"
    ],
    "text": [
      "<b>Revelation</b> - Lose all of your resources."
    ],
    "subtype": "basicweakness",
    "isWeakness": true
  },
  {
    "instanceId": "pursued-12102",
    "code": "12102",
    "name": "Pursued",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Terror"
    ],
    "text": [
      "<b>Revelation</b> - Put Pursued into play in your threat area.",
      "<b>Forced</b> - After an enemy enters <i>(moves into or spawns at)</i> your location: Take 1 horror.",
      "[action][action]: Discard Pursued."
    ],
    "subtype": "basicweakness",
    "isWeakness": true
  },
  {
    "instanceId": "syndicate-obligations-12103",
    "code": "12103",
    "name": "Syndicate Obligations",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Pact",
      "Syndicate"
    ],
    "text": [
      "<b>Revelation</b> - Put Syndicate Obligations into play in your threat area.",
      "<b>Forced</b> - After you spend 1 or more resources: Take 1 damage.",
      "[action][action]: Discard Syndicate Obligations."
    ],
    "subtype": "basicweakness",
    "isWeakness": true
  },
  {
    "instanceId": "wounded-12104",
    "code": "12104",
    "name": "Wounded",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Injury"
    ],
    "text": [
      "<b>Revelation</b> - Put Wounded into play in your threat area.",
      "<b>Forced</b> - The first time you move each turn: Take 1 damage.",
      "[action][action]: Discard Wounded."
    ],
    "subtype": "basicweakness",
    "isWeakness": true
  },
  {
    "instanceId": "dr-henry-armitage-12115",
    "code": "12115",
    "name": "Dr. Henry Armitage",
    "type": "asset",
    "faction": "neutral",
    "cost": 3,
    "icons": [
      "willpower",
      "intellect",
      "wild"
    ],
    "traits": [
      "Ally",
      "Miskatonic"
    ],
    "text": [
      "You get +1 [willpower] and +1 [intellect].",
      "The first action you perform each round does not provoke attacks of opportunity."
    ],
    "abilities": [],
    "slot": "Ally",
    "health": 3,
    "sanity": 3,
    "statModifiers": {
      "willpower": 1,
      "intellect": 1
    }
  },
  {
    "instanceId": "mark-of-elokoss-12137",
    "code": "12137",
    "name": "Mark of Elokoss",
    "type": "treachery",
    "faction": "neutral",
    "icons": [],
    "traits": [
      "Curse"
    ],
    "text": [
      "<b>Revelation</b> - Put Mark of Elokoss into play in your threat area.",
      "<b>Forced</b> - When your turn ends: Take 1 damage. Assign that damage to an asset you control, if able.",
      "[action][action]: Discard Mark of Elokoss."
    ],
    "subtype": "weakness",
    "isWeakness": true
  },
  {
    "instanceId": "collector-12181",
    "code": "12181",
    "name": "Collector",
    "type": "asset",
    "faction": "neutral",
    
    "icons": [],
    "traits": [
      "Talent"
    ],
    "text": [
      "Permanent. Reward. Limit 1 per deck. Purchase only at deck creation.",
      "You get +5 deck size.",
      "Your investigator's Deckbuilding Options gains: \"one other [[Relic]] or [[Charm]] asset of any class ([guardian], [seeker], [rogue], [mystic], [survivor]) level 0-3.\""
    ],
    "abilities": []
  },
  {
    "instanceId": "vicious-blow-60169",
    "code": "60169",
    "name": "Vicious Blow",
    "type": "skill",
    "faction": "guardian",
    "icons": [
      "combat"
    ],
    "traits": [
      "Practiced"
    ],
    "text": [
      "If this skill test is successful during an attack, that attack deals +1 damage."
    ],
    "onSkillTestSuccess": []
  },
  {
    "instanceId": "cosmic-flame-60459",
    "code": "60459",
    "name": "Cosmic Flame",
    "type": "asset",
    "faction": "mystic",
    "cost": 3,
    "icons": [
      "combat"
    ],
    "traits": [
      "Spell"
    ],
    "text": [
      "Uses (3 charges).",
      "[action]: <b>Fight</b> ([willpower]). If you succeed, you may spend 1 charge to deal +1 damage for this attack. If you reveal a [skull] token during this test, remove 1 charge from Cosmic Flame (if you cannot, take 1 damage and discard this card)."
    ],
    "abilities": [],
    "slot": "Arcane",
    "statModifiers": {
      "combat": 1
    }
  }
]
