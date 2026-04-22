import type {
    ChaosToken,
} from "../types/game";

import {
    loadPersistedCampaignSetup,
} from "./gsFunctions";

export const CAMPAIGN_SETUP_STORAGE_KEY = "playArkham.campaignSetup";

export const startingChaosBag: ChaosToken[] = [
    +1,
    0,
    0,
    -1,
    -1,
    -2,
    "skull",
    "cultist",
    "autoFail",
    "elderSign",
];

export const persistedCampaignSetup = loadPersistedCampaignSetup();

export const initialSelectedDeckId = persistedCampaignSetup?.selectedDeckId ?? "";

