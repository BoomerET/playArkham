import type {
  Investigator,
  InvestigatorSlotCounts,
  InvestigatorSlotType,
  PlayerCard,
} from "../../types/game";

export const DEFAULT_SLOT_CAPACITY: InvestigatorSlotCounts = {
  Hand: 2,
  Arcane: 2,
  Ally: 1,
  Accessory: 1,
  Head: 1,
  Body: 1,
};

export function getSlotCapacity(
  investigator: Investigator,
): InvestigatorSlotCounts {
  return {
    ...DEFAULT_SLOT_CAPACITY,
    ...investigator.slotCapacity,
  };
}

export function createEmptySlotCounts(): InvestigatorSlotCounts {
  return {
    Hand: 0,
    Arcane: 0,
    Ally: 0,
    Accessory: 0,
    Head: 0,
    Body: 0,
  };
}

export function getCardSlotUsage(card: PlayerCard): InvestigatorSlotCounts {
  const usage = createEmptySlotCounts();

  if (card.type !== "asset" || !card.slot) {
    return usage;
  }

  switch (card.slot) {
    case "Hand":
      usage.Hand = 1;
      break;
    case "Hand x2":
      usage.Hand = 2;
      break;
    case "Arcane":
      usage.Arcane = 1;
      break;
    case "Ally":
      usage.Ally = 1;
      break;
    case "Accessory":
      usage.Accessory = 1;
      break;
    case "Head":
      usage.Head = 1;
      break;
    case "Body":
      usage.Body = 1;
      break;
  }

  return usage;
}

export function getUsedSlots(playArea: PlayerCard[]): InvestigatorSlotCounts {
  const used = createEmptySlotCounts();

  for (const card of playArea) {
    const cardUsage = getCardSlotUsage(card);

    used.Hand += cardUsage.Hand;
    used.Arcane += cardUsage.Arcane;
    used.Ally += cardUsage.Ally;
    used.Accessory += cardUsage.Accessory;
    used.Head += cardUsage.Head;
    used.Body += cardUsage.Body;
  }

  return used;
}

export function canPlayInAvailableSlots(
  card: PlayerCard,
  playArea: PlayerCard[],
  investigator: Investigator,
): boolean {
  if (card.type !== "asset" || !card.slot) {
    return true;
  }

  const used = getUsedSlots(playArea);
  const capacity = getSlotCapacity(investigator);
  const required = getCardSlotUsage(card);

  return (
    used.Hand + required.Hand <= capacity.Hand &&
    used.Arcane + required.Arcane <= capacity.Arcane &&
    used.Ally + required.Ally <= capacity.Ally &&
    used.Accessory + required.Accessory <= capacity.Accessory &&
    used.Head + required.Head <= capacity.Head &&
    used.Body + required.Body <= capacity.Body
  );
}

export function getBlockedSlot(
  card: PlayerCard,
  playArea: PlayerCard[],
  investigator: Investigator,
): InvestigatorSlotType | null {
  if (card.type !== "asset" || !card.slot) {
    return null;
  }

  const used = getUsedSlots(playArea);
  const capacity = getSlotCapacity(investigator);
  const required = getCardSlotUsage(card);

  if (used.Hand + required.Hand > capacity.Hand) return "Hand";
  if (used.Arcane + required.Arcane > capacity.Arcane) return "Arcane";
  if (used.Ally + required.Ally > capacity.Ally) return "Ally";
  if (used.Accessory + required.Accessory > capacity.Accessory) {
    return "Accessory";
  }
  if (used.Head + required.Head > capacity.Head) return "Head";
  if (used.Body + required.Body > capacity.Body) return "Body";

  return null;
}
