import type { PlayerCard } from "../types/game";

export const sampleDeck: PlayerCard[] = [
  {
    id: "machete-1",
    name: "Machete",
    type: "asset",
    cost: 3,
    text: "Fight. You get +1 combat for this attack.",
  },
  {
    id: "beat-cop-1",
    name: "Beat Cop",
    type: "asset",
    cost: 4,
    text: "Ally.",
  },
  {
    id: "magnifying-glass-1",
    name: "Magnifying Glass",
    type: "asset",
    cost: 1,
    text: "You get +1 intellect.",
  },
  {
    id: "working-a-hunch-1",
    name: "Working a Hunch",
    type: "event",
    cost: 2,
    text: "Discover 1 clue at your location.",
  },
  {
    id: "evidence-1",
    name: "Evidence!",
    type: "event",
    cost: 1,
    text: "After you defeat an enemy, discover 1 clue.",
  },
  {
    id: "deduction-1",
    name: "Deduction",
    type: "skill",
    icons: ["intellect"],
    text: "If this test is successful, discover 1 additional clue.",
  },
  {
    id: "vicious-blow-1",
    name: "Vicious Blow",
    type: "skill",
    icons: ["combat"],
    text: "If this attack succeeds, deal +1 damage.",
  },
  {
    id: "manual-dexterity-1",
    name: "Manual Dexterity",
    type: "skill",
    icons: ["agility"],
    text: "If this test is successful, draw 1 card.",
  },
  {
    id: "guts-1",
    name: "Guts",
    type: "skill",
    icons: ["willpower"],
    text: "If this test is successful, draw 1 card.",
  },
  {
    id: "perception-1",
    name: "Perception",
    type: "skill",
    icons: ["intellect", "intellect"],
    text: "If this test is successful, draw 1 card.",
  },
];

