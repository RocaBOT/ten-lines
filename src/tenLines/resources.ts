import types_en_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/en/powers_en.txt?raw";
import natures_en_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/en/natures_en.txt?raw";
import abilities_en_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/en/abilities_en.txt?raw";
import species_en_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/en/species_en.txt?raw";
import forms_en_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/en/forms_en.txt?raw";
import frlg_en_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/en/frlg_en.txt?raw";
import rs_en_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/en/rs_en.txt?raw";
import e_en_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/en/e_en.txt?raw";
import types_fr_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/fr/powers_fr.txt?raw";
import natures_fr_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/fr/natures_fr.txt?raw";
import abilities_fr_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/fr/abilities_fr.txt?raw";
import species_fr_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/fr/species_fr.txt?raw";
import forms_fr_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/fr/forms_fr.txt?raw";
import frlg_fr_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/fr/frlg_fr.txt?raw";
import rs_fr_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/fr/rs_fr.txt?raw";
import e_fr_txt from "../wasm/lib/PokeFinder/Source/Core/Resources/i18n/fr/e_fr.txt?raw";
import {
    COMBINED_WILD_METHOD,
    Game,
    STATIC_1,
    STATIC_2,
    STATIC_4,
    WILD_1,
    WILD_2,
    WILD_4,
} from ".";

const parseMap = (text: string) => {
    return Object.fromEntries(parseList(text).map((line) => line.split(",")));
};

const parseList = (text: string) => {
    return text.split("\n").map((line) => line.trim());
};

export const METHODS: Record<string, Record<number, string>> = {
    "EN": {[STATIC_1]: "Static 1",
        [STATIC_2]: "Static 2",
        [STATIC_4]: "Static 4",
        [WILD_1]: "Wild 1",
        [WILD_2]: "Wild 2",
        [WILD_4]: "Wild 4",
        [COMBINED_WILD_METHOD]: "All Wild Methods",},
    "FR": {[STATIC_1]: "Statique 1",
        [STATIC_2]: "Statique 2",
        [STATIC_4]: "Statique 4",
        [WILD_1]: "Sauvage 1",
        [WILD_2]: "Sauvage 2",
        [WILD_4]: "Sauvage 4",
        [COMBINED_WILD_METHOD]: "Toutes Méthodes Sauvage",},
};
export const GENDERS = ["♂", "♀", "-"];
export const SHININESS: Record<string, string[]> = {
    "EN": ["No", "Star", "Square"],
    "FR": ["Non", "Étoile", "Carré"],
};
export const NATURES: Record<string, string[]> = {
    "EN": parseList(natures_en_txt),
    "FR": parseList(natures_fr_txt),
};
export const ABILITIES: Record<string, string[]> = {
    "EN": parseList(abilities_en_txt),
    "FR": parseList(abilities_fr_txt),
};
export const SPECIES: Record<string, string[]> = {
    "EN": ["Egg", ...parseList(species_en_txt)],
    "FR": ["Œuf", ...parseList(species_fr_txt)]
};
export const FORMS_EN = Object.fromEntries(
    parseList(forms_en_txt).map((line) => {
        const [species, form, name] = line.split(",");
        return [`${species}-${form}`, name];
    })
);
export const FORMS_FR = Object.fromEntries(
    parseList(forms_fr_txt).map((line) => {
        const [species, form, name] = line.split(",");
        return [`${species}-${form}`, name];
    })
);

export const TYPES: Record<string, string[]> = {
    "EN": parseList(types_en_txt),
    "FR": parseList(types_fr_txt),
};
export const FRLG_LOCATIONS_EN = parseMap(frlg_en_txt);
export const FRLG_LOCATIONS_FR = parseMap(frlg_fr_txt);

export const RS_LOCATIONS_EN = parseMap(rs_en_txt);
export const RS_LOCATIONS_FR = parseMap(rs_fr_txt);

export const E_LOCATIONS_EN = parseMap(e_en_txt);
export const E_LOCATIONS_FR = parseMap(e_fr_txt);

export const getLocation = (game: number, location: number, lang: string | "EN") => {
    if (lang == "FR") {
        if (game & Game.RS) return (RS_LOCATIONS_FR[location] as string);
        if (game & Game.Emerald) return E_LOCATIONS_FR[location];
        return FRLG_LOCATIONS_FR[location];
    }
    if (game & Game.RS) return (RS_LOCATIONS_EN[location] as string);
    if (game & Game.Emerald) return E_LOCATIONS_EN[location];
    return FRLG_LOCATIONS_EN[location];
};

export const GAMES: Record<string, Record<number, string>> = {
    "EN": {[Game.None]: "None",
        [Game.Ruby]: "Ruby",
        [Game.Sapphire]: "Sapphire",
        [Game.RS]: "Ruby & Sapphire",
        [Game.Emerald]: "Emerald",
        [Game.Ruby | Game.Emerald]: "Ruby & Emerald",
        [Game.Sapphire | Game.Emerald]: "Sapphire & Emerald",
        [Game.RSE]: "Ruby, Sapphire & Emerald",
        [Game.FireRed]: "FireRed",
        [Game.LeafGreen]: "LeafGreen",
        [Game.FRLG]: "FireRed & LeafGreen",
        [Game.FRLG | Game.Emerald]: "FireRed, LeafGreen & Emerald",
        [Game.Gen3]: "Generation 3",},
    "FR": {[Game.None]: "Aucun",
        [Game.Ruby]: "Rubis",
        [Game.Sapphire]: "Saphir",
        [Game.RS]: "Rubis & Saphir",
        [Game.Emerald]: "Émeraude",
        [Game.Ruby | Game.Emerald]: "Rubis & Émeraude",
        [Game.Sapphire | Game.Emerald]: "Saphir & Émeraude",
        [Game.RSE]: "Rubis, Saphir & Émeraude",
        [Game.FireRed]: "Rouge Feu",
        [Game.LeafGreen]: "Vert Feuille",
        [Game.FRLG]: "Rouge Feu & Vert Feuille",
        [Game.FRLG | Game.Emerald]: "Rouge Feu, Vert Feuille & Émeraude",
        [Game.Gen3]: "Génération 3",},
};

export const getName = (
    species: number | string,
    form: number | string = 0,
    lang: string
) => {
    const speciesName =
        SPECIES[lang][typeof species === "number" ? species : parseInt(species)];
    const formName = (lang == "FR") ? FORMS_FR[`${species}-${form}`] : FORMS_EN[`${species}-${form}`];
    

    return `${speciesName}${formName ? ` (${formName})` : ""}`;
};

export const LABEL: Record<string, Record<string, string>> = {
    "EN": {
        "game": "Game",
        "sound": "Sound",
        "button mode": "Button Mode",
        "help": "Help",
        "mono": "Mono",
        "stereo": "Stereo",
        "l eq a": "L=A",
        "lr": "LR",
        "seed button": "Seed Button",
        "extra button": "Extra Button",
        "none": "None",
        "any": "Any",
        "startup select": "Startup Select",
        "startup a": "Startup A",
        "blackout l": "Blackout L",
        "blackout r": "Blackout R",
        "blackout a": "Blackout A",
        "blackout a+l": "Blackout A+L",
        "console": "Console",
        "target seed": "Target Seed",
        "no seed for settings": "No known seeds for this game & settings",
        "seed +/-": "Seed +/-",
        "show seeds": "Show Seeds",
        "final a press frame min": "Minimum Final A Press Frame",
        "final a press frame max": "Maximum Final A Press Frame",
        "offset": "Offset",
        "ttv advances min": "Minimum TeachyTV Advances",
        "ttv advances max": "Maximum TeachyTV Advances",
        "req ow frames": "Required Ingame Frames",
        "ttv mode": "TeachyTV Mode",
        "total time": "Main timer post-title screen",
        "ttv timer": "TeachyTV Timer (separate from main timer)",
        "main timer final phase": "Main timer final phase",
        "trainer id": "Trainer ID",
        "secret id": "Secret ID",
        "method": "Method",
        "category": "Category",
        "grass": "Grass",
        "rock smash": "Rock Smash",
        "surfing": "Surfing",
        "old rod": "Old Rod",
        "good rod": "Good Rod",
        "super rod": "Super Rod",
        "location": "Location",
        "lead": "Lead",
        "synchronize": "Synchronize",
        "hpvs": "Hustle/Pressure/Vital Spirit",
        "static": "Static",
        "magnet pull": "Magnet Pull",
        "female cute charm": "Female Cute Charm",
        "male cute charm": "Male Cute Charm",
        "matching synchronize": "Matching Synchronize",
        "filter": "Filter",
        "shininess": "Shininess",
        "star": "Star",
        "square": "Square",
        "star/square": "Star/Square",
        "nature": "Nature",
        "gender": "Gender",
        "search all natures": "IV Calculation disabled. Searching all Natures.",
        "searching": "Searching...",
        "submit": "Submit",
        "nature help text": "Required for IV calculation",
        "starters": "Starters",
        "fossils": "Fossils",
        "gifts": "Gifts",
        "game corner": "Game Corner",
        "stationary": "Stationary",
        "legends": "Legends",
        "events": "Events",
        "roamers": "Roamers",
        "blisy e-reader": "Blisy's E-Reader Events",
        "min time outside ttv": "Minimum Advances Outside of TeachyTV",
        "seed": "Seed",
        "advances": "Advances",
        "final a press frame": "Final A Press Frame",
        "ttv advances": "TeachyTV Advances",
        "continue frames": "Continue Screen Frames",
        "encounter slot": "Slot",
        "encounter level": "Level",
        "pid": "PID",
        "shiny": "Shiny",
        "ability": "Ability",
        "ivs": "IVs",
        "hidden power": "Hidden Power",
        "hidden power 1": "Hidden",
        "hidden power 2": "Power",
        "result count": "Result Count",
        "startup": "Startup",
        "blackout": "Blackout",
        "est total frames": "Estimated Total Frames",
        "est total time": "Estimated Total Time",
        "seed time": "Seed Time",
        "settings": "Settings",
        "open in calibration": "Open In Calibration",
        "open in init seed": "Open In Initial Seed",
        "calibration": "Calibration",
        "searcher": "Searcher",
        "initial seed": "Initial Seed",
        "bingo": "Bingo",
        "language": "Language",
        "min hp": "Minimum HP",
        "max hp": "Maximum HP",
        "min atk": "Minimum Attack",
        "max atk": "Maximum Attack",
        "min def": "Minimum Defense",
        "max def": "Maximum Defense",
        "min spa": "Minimum Special Attack",
        "max spa": "Maximum Special Attack",
        "min spd": "Minimum Special Defense",
        "max spd": "Maximum Special Defense",
        "min spe": "Minimum Speed",
        "max spe": "Maximum Speed",
        "iv calc": "IV Calculator",
        "line": "Line",
        "missing level": "Missing Level",
        "invalid level": "Invalid Level",
        "missing hp": "Missing HP",
        "invalid hp": "Invalid HP",
        "missing atk": "Missing Attack",
        "invalid atk": "Invalid Attack",
        "missing def": "Missing Defense",
        "invalid def": "Invalid Defense",
        "missing spa": "Missing Special Attack",
        "invalid spa": "Invalid Special Attack",
        "missing spd": "Missing Special Defense",
        "invalid spd": "Invalid Special Defense",
        "missing spe": "Missing Speed",
        "invalid spe": "Invalid Speed",
        "no possible iv 1": "No Possible",
        "no possible iv 2": "IV"
    },
    "FR": {
        "game": "Jeu",
        "sound": "Son",
        "button mode": "Mode Boutons",
        "help": "Aide",
        "mono": "Mono",
        "stereo": "Stéréo",
        "l eq a": "L=A",
        "lr": "LR",
        "seed button": "Bouton Graine",
        "extra button": "Bouton Supplémentaire",
        "none": "Aucun",
        "any": "Peu importe",
        "startup select": "Select au démarrage",
        "startup a": "A au démarrage",
        "blackout l": "L au fondu au noir",
        "blackout r": "R au fondu au noir",
        "blackout a": "A au fondu au noir",
        "blackout a+l": "A+L au fondu au noir",
        "console": "Console",
        "target seed": "Graine Cible",
        "no seed for settings": "Aucune graine connue pour ces jeu & paramètres",
        "seed +/-": "Graine +/-",
        "show seeds": "Voir Graines",
        "final a press frame min": "Frame Minimale d'Appui Final sur A",
        "final a press frame max": "Frame Maximale d'Appui Final sur A",
        "offset": "Décalage",
        "ttv advances min": "Minimum d'Avances TV ABC",
        "ttv advances max": "Maximum d'Avances TV ABC",
        "req ow frames": "Frames Requises en Jeu",
        "ttv mode": "Mode TV ABC",
        "total time": "Chrono principal post-écran titre",
        "ttv timer": "Chrono TV ABC (distinct du chrono principal)",
        "main timer final phase": "Phase finale du chrono principal",
        "trainer id": "ID Dresseur",
        "secret id": "ID Secret",
        "method": "Méthode",
        "category": "Catégorie",
        "grass": "Herbes",
        "rock smash": "Éclate Roc",
        "surfing": "Surf",
        "old rod": "Canne",
        "good rod": "Super Canne",
        "super rod": "Méga Canne",
        "location": "Lieu",
        "lead": "Meneur",
        "synchronize": "Synchro",
        "hpvs": "Agitation/Pression/Esprit Vital",
        "static": "Statik",
        "magnet pull": "Magnépiège",
        "female cute charm": "Joli Sourire Femelle",
        "male cute charm": "Joli Sourire Mâle",
        "matching synchronize": "Synchro Correspondant",
        "filter": "Filtrer",
        "shininess": "Caractère Chromatique",
        "star": "Étoile",
        "square": "Carré",
        "star/square": "Étoile/Carré",
        "nature": "Nature",
        "gender": "Genre",
        "search all natures": "Calcul d'IV désactivé. Recherche pour toutes les Natures.",
        "searching": "Recherche...",
        "submit": "Envoyer",
        "nature help text": "Requis pour le calcul d'IV",
        "starters": "Starters",
        "fossils": "Fossiles",
        "gifts": "Cadeaux",
        "game corner": "Casino",
        "stationary": "Fixes",
        "legends": "Légendaires",
        "events": "Événements",
        "roamers": "Fuyards",
        "blisy e-reader": "Événements E-Reader de Blisy",
        "min time outside ttv": "Avances Minimum hors de la TV ABC",
        "seed": "Graine",
        "advances": "Avances",
        "final a press frame": "Frame d'Appui Final sur A",
        "ttv advances": "Avances TV ABC",
        "continue frames": "Frames sur l'Écran Continuer",
        "encounter slot": "Slot",
        "encounter level": "Niveau",
        "pid": "PID",
        "shiny": "Chromatique",
        "ability": "Talent",
        "ivs": "IVs",
        "hidden power": "Puissance Cachée",
        "hidden power 1": "Puissance",
        "hidden power 2": "Cachée",
        "result count": "Nombre de Résultats",
        "startup": "Démarrage",
        "blackout": "Fondu au noir",
        "est total frames": "Frames Totales Estimées",
        "est total time": "Temps Total estimé",
        "seed time": "Temps Graine",
        "settings": "Paramètres",
        "open in calibration": "Ouvrir dans Calibration",
        "open in init seed": "Ouvrir dans Graine Initiale",
        "calibration": "Calibration",
        "searcher": "Recherche",
        "initial seed": "Graine Initiale",
        "bingo": "Bingo",
        "language": "Langue",
        "min hp": "PV Minimum",
        "max hp": "PV Maximum",
        "min atk": "Attaque Minimum",
        "max atk": "Attaque Maximum",
        "min def": "Défense Minimum",
        "max def": "Défense Maximum",
        "min spa": "Attaque Spéciale Minimum",
        "max spa": "Attaque Spéciale Maximum",
        "min spd": "Défense Spéciale Minimum",
        "max spd": "Défense Spéciale Maximum",
        "min spe": "Vitesse Minimum",
        "max spe": "Vitesse Maximum",
        "iv calc": "Calculateur d'IV",
        "line": "Ligne",
        "missing level": "Niveau manquant",
        "invalid level": "Niveau invalide",
        "missing hp": "PV manquant",
        "invalid hp": "PV invalide",
        "missing atk": "Attaque manquante",
        "invalid atk": "Attaque invalide",
        "missing def": "Défense manquante",
        "invalid def": "Défense invalide",
        "missing spa": "Attaque Spéciale manquante",
        "invalid spa": "Attaque Spéciale invalide",
        "missing spd": "Défense Spéciale manquante",
        "invalid spd": "Défense Spéciale invalide",
        "missing spe": "Vitesse manquante",
        "invalid spe": "Vitesse invalide",
        "no possible iv 1": "Aucun IV",
        "no possible iv 2": "possble"
    }
}

export const LIST_GAME: Record<string, Record<string, string>> = {
    "EN": {
        "r_painting": "Ruby Painting Seed",
        "s_painting": "Sapphire Painting Seed",
        "e_painting": "Emerald Painting Seed",
        "fr": "FireRed (ENG)",
        "fr_eu": "FireRed (SPA/FRE/ITA/GER)",
        "fr_jpn_1_0": "FireRed (JPN) (1.0)",
        "fr_jpn_1_1": "FireRed (JPN) (1.1)",
        "fr_nx": "Switch FireRed (ENG/SPA/FRE/ITA/GER)",
        "fr_mgba": "FireRed (ENG) (MGBA 10.5)",
        "lg": "LeafGreen (ENG)",
        "lg_eu": "LeafGreen (SPA/FRE/ITA/GER)",
        "lg_jpn": "LeafGreen (JPN)",
        "lg_nx": "Switch LeafGreen (ENG/SPA/FRE/ITA/GER)",
        "lg_mgba": "LeafGreen (ENG) (MGBA 10.5)",
    },
    "FR": {
        "r_painting": "Rubis, graine via tableau",
        "s_painting": "Saphir, graine via tableau",
        "e_painting": "Émeraude, graine via tableau",
        "fr": "Rouge Feu (ENG)",
        "fr_eu": "Rouge Feu (SPA/FRE/ITA/GER)",
        "fr_jpn_1_0": "Rouge Feu (JPN) (1.0)",
        "fr_jpn_1_1": "Rouge Feu (JPN) (1.1)",
        "fr_nx": "Rouge Feu Switch (ENG/SPA/FRE/ITA/GER)",
        "fr_mgba": "Rouge Feu (ENG) (MGBA 10.5)",
        "lg": "Vert Feuille (ENG)",
        "lg_eu": "Vert Feuille (SPA/FRE/ITA/GER)",
        "lg_jpn": "Vert Feuille (JPN)",
        "lg_nx": "Vert Feuille Switch (ENG/SPA/FRE/ITA/GER)",
        "lg_mgba": "Vert Feuille (ENG) (MGBA 10.5)",
    },
}

export const IV_NAMES: Record<string, string[]> = {
    "EN": ["HP",
        "Attack",
        "Defense",
        "Special Attack",
        "Special Defense",
        "Speed"],
    "FR": ["de PV",
        "d'Attaque",
        "de Défense",
        "d'Attaque Spéciale",
        "de Défense Spéciale",
        "de Vitesse"
    ]
};