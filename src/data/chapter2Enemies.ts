export interface Enemy {
  id: string;
  name: string;
  fight: number;
  evade: number;
  health: number;
  damage: number;
  horror: number;
  locationId: string;
  engagedInvestigatorId: string | null;
  exhausted: boolean;
  damageOnEnemy: number;

  traits?: string[];
  keywordFlags?: {
    hunter?: boolean;
    retaliate?: boolean;
    alert?: boolean;
    aloof?: boolean;
    massive?: boolean;
  };
}

{
  id: "ghoul-minion-1",
  name: "Ghoul Minion",
  fight: 2,
  evade: 2,
  health: 2,
  damage: 1,
  horror: 0,
  locationId: "hallway",
  engagedInvestigatorId: null,
  exhausted: false,
  damageOnEnemy: 0,
  traits: ["Humanoid", "Monster", "Ghoul"],
  keywordFlags: {
    hunter: false,
    retaliate: false,
    alert: false,
    aloof: false,
    massive: false,
  },
}