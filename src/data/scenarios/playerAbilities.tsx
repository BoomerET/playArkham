export type PlayerCardAbility =
    | {
        id: string;
        label: string;
        cost?: {
            action?: number;
            exhaust?: boolean;
        };
        effect: {
            kind: "enemyEngagesAndAttacks";
            location: "investigator";
        };
    }
    | {
        id: string;
        label: string;
        cost?: {
            action?: number;
            exhaust?: boolean;
        };
        skillTest: {
            kind: "fight";
            skill: "combat";
            combatModifier: number;
            damageBonusIfEnemyAttackedThisRound?: number;
        };
    };