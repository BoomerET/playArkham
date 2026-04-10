import type { PlayerCard } from "../types/game";

const playerCardImages = import.meta.glob(
    [
        "../assets/images/players/*.{jpg,jpeg,png,webp}",
        "../assets/images/playerCards/*.{jpg,jpeg,png,webp}",
        "../assets/images/playercards/*.{jpg,jpeg,png,webp}",
        "../assets/images/cards/*.{jpg,jpeg,png,webp}",
    ],
    {
        eager: true,
        import: "default",
    },
) as Record<string, string>;

function findImageUrlByBaseNames(baseNames: string[]): string | null {
    const normalizedBases = baseNames.map((name) => name.toLowerCase());

    const match = Object.entries(playerCardImages).find(([path]) => {
        const fileName = path.split("/").pop()?.toLowerCase() ?? "";
        const baseName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "");
        return normalizedBases.includes(baseName);
    });

    return match?.[1] ?? null;
}

export function getPlayerCardImageUrl(card: PlayerCard): string | null {
    if (!card.code) {
        return null;
    }

    return findImageUrlByBaseNames([card.code]);
}

export function getPlayerCardBackImageUrl(card: PlayerCard): string | null {
    if (!card.code) {
        return null;
    }

    return findImageUrlByBaseNames([
        `${card.code}-back`,
        `${card.code}_back`,
    ]);
}
