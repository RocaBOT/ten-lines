import { useState } from "react";

import { Box, Button, MenuItem, TextField } from "@mui/material";

import fetchTenLines, {
    COMBINED_WILD_METHOD,
    getLanguage,
    SEED_IDENTIFIER_TO_GAME,
    STATIC_2,
    STATIC_4,
} from "../tenLines";
import NumericalInput from "./NumericalInput";
import { proxy } from "comlink";
import {
    type ExtendedSearcherState,
    type ExtendedWildSearcherState,
} from "../tenLines/generated";
import React from "react";
import {
    GENDERS,
    METHODS,
    NATURES,
    TYPES,
    LABEL,
    LIST_GAME
} from "../tenLines/resources";
import IvEntry from "./IvEntry";
import StaticEncounterSelector from "./StaticEncounterSelector";
import { useSearchParams } from "react-router-dom";
import WildEncounterSelector from "./WildEncounterSelector";
import SearcherTable from "./SearcherTable";

export interface SearcherFormState {
    shininess: number;
    nature: number;
    gender: number;
    hiddenPower: number;
    ivRangeStrings: [string, string][];
    staticCategory: number;
    staticPokemon: number;
    wildCategory: number;
    wildLocation: number;
    wildPokemon: number;
    wildLead: number;
    method: number;
}

export interface SearcherURLState {
    game: string;
    trainerID: string;
    secretID: string;
}

function useSearcherURLState() {
    const [searchParams, setSearchParams] = useSearchParams();
    const game = searchParams.get("game") || "r_painting";
    const trainerID = searchParams.get("trainerID") || "0";
    const secretID = searchParams.get("secretID") || "0";
    const setSearcherURLState = (state: Partial<SearcherURLState>) => {
        setSearchParams((prev) => {
            for (const [key, value] of Object.entries(state)) {
                prev.set(key, value);
            }
            return prev;
        });
    };
    return {
        game,
        trainerID,
        secretID,
        setSearcherURLState,
    };
}

export default function CalibrationForm({
    sx,
    hidden,
}: {
    sx?: any;
    hidden?: boolean;
}) {
    const lang = getLanguage();
    const [searcherFormState, setSearcherFormState] =
        useState<SearcherFormState>({
            shininess: 255,
            nature: -1,
            gender: 255,
            hiddenPower: -1,
            ivRangeStrings: [
                ["0", "31"],
                ["0", "31"],
                ["0", "31"],
                ["0", "31"],
                ["0", "31"],
                ["0", "31"],
            ],
            staticCategory: 0,
            staticPokemon: 0,
            wildCategory: 0,
            wildLocation: 0,
            wildPokemon: 0,
            wildLead: 255,
            method: 1,
        });
    const { game, trainerID, secretID, setSearcherURLState } =
        useSearcherURLState();

    const [rows, setRows] = useState<ExtendedSearcherState[]>([]);
    const [searching, setSearching] = useState(false);

    const [ivRangesAreValid, setIvRangesAreValid] = useState(true);
    const ivRanges = ivRangesAreValid
        ? searcherFormState.ivRangeStrings.map((range) => [
            parseInt(range[0], 10),
            parseInt(range[1], 10),
        ])
        : [];

    const [trainerIDIsValid, setTrainerIDIsValid] = useState(true);
    const [secretIDIsValid, setSecretIDIsValid] = useState(true);

    const isNotSubmittable =
        searching || !trainerIDIsValid || !secretIDIsValid || !ivRangesAreValid;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isNotSubmittable) return;
        const submit = async () => {
            const tenLines = await fetchTenLines();
            setRows([]);
            setSearching(true);
            if (isStatic) {
                await tenLines.search_seeds_static(
                    SEED_IDENTIFIER_TO_GAME[game],
                    parseInt(trainerID),
                    parseInt(secretID),
                    searcherFormState.staticCategory,
                    searcherFormState.staticPokemon,
                    searcherFormState.method,
                    searcherFormState.shininess,
                    searcherFormState.nature,
                    searcherFormState.gender,
                    searcherFormState.hiddenPower,
                    ivRanges,
                    proxy((results: ExtendedSearcherState[]) => {
                        setRows((rows) => {
                            if (rows.length > 1000 || results.length === 0) {
                                return rows;
                            }
                            return [...rows, ...results];
                        });
                    }),
                    proxy(setSearching)
                );
            } else {
                await tenLines.search_seeds_wild(
                    SEED_IDENTIFIER_TO_GAME[game],
                    parseInt(trainerID),
                    parseInt(secretID),
                    searcherFormState.wildCategory,
                    searcherFormState.wildLocation,
                    searcherFormState.wildPokemon,
                    searcherFormState.method,
                    searcherFormState.wildLead,
                    searcherFormState.shininess,
                    searcherFormState.nature,
                    searcherFormState.gender,
                    searcherFormState.hiddenPower,
                    ivRanges,
                    proxy((results: ExtendedWildSearcherState[]) => {
                        setRows((rows) => {
                            if (rows.length > 1000 || results.length === 0) {
                                return rows;
                            }
                            return [...rows, ...results];
                        });
                    }),
                    proxy(setSearching)
                );
            }
        };
        submit();
    };

    const isStatic = searcherFormState.method <= STATIC_4;
    const isFRLG = game.startsWith("fr") || game.startsWith("lg");
    const isFRLGE = isFRLG || game.startsWith("e_");

    if (searcherFormState.staticCategory == 3 && !isFRLG) {
        searcherFormState.staticCategory = 0;
        setSearcherFormState(searcherFormState);
    }
    if (searcherFormState.staticCategory == 6 && !isFRLGE) {
        searcherFormState.staticCategory = 0;
        setSearcherFormState(searcherFormState);
    }
    if (searcherFormState.staticCategory == 8 && isFRLG) {
        searcherFormState.staticCategory = 0;
        setSearcherFormState(searcherFormState);
    }

    if (hidden) {
        return null;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ sx }}>
            <TextField
                label={LABEL[lang]["game"]}
                margin="normal"
                style={{ textAlign: "left" }}
                onChange={(event) =>
                    setSearcherURLState({
                        game: event.target.value,
                    })
                }
                value={game}
                select
                fullWidth
            >
                <MenuItem value="r_painting">{LIST_GAME[lang]["r_painting"]}</MenuItem>
                <MenuItem value="s_painting">{LIST_GAME[lang]["s_painting"]}</MenuItem>
                <MenuItem value="e_painting">{LIST_GAME[lang]["e_painting"]}</MenuItem>
                <MenuItem value="fr">{LIST_GAME[lang]["fr"]}</MenuItem>
                <MenuItem value="fr_eu">{LIST_GAME[lang]["fr_eu"]}</MenuItem>
                <MenuItem value="fr_jpn_1_0">{LIST_GAME[lang]["fr_jpn_1_0"]}</MenuItem>
                <MenuItem value="fr_jpn_1_1">{LIST_GAME[lang]["fr_jpn_1_1"]}</MenuItem>
                <MenuItem value="fr_nx">{LIST_GAME[lang]["fr_nx"]}</MenuItem>
                <MenuItem value="fr_mgba">{LIST_GAME[lang]["fr_mgba"]}</MenuItem>
                <MenuItem value="lg">{LIST_GAME[lang]["lg"]}</MenuItem>
                <MenuItem value="lg_eu">{LIST_GAME[lang]["lg_eu"]}</MenuItem>
                <MenuItem value="lg_jpn">{LIST_GAME[lang]["lg_jpn"]}</MenuItem>
                <MenuItem value="lg_nx">{LIST_GAME[lang]["lg_nx"]}</MenuItem>
                <MenuItem value="lg_mgba">{LIST_GAME[lang]["lg_mgba"]}</MenuItem>
            </TextField>
            <Box sx={{ flexDirection: "row", display: "flex" }}>
                <NumericalInput
                    label={LABEL[lang]["trainer id"]}
                    margin="normal"
                    onChange={(_event, value) => {
                        setSearcherURLState({ trainerID: value.value });
                        setTrainerIDIsValid(value.isValid);
                    }}
                    value={trainerID}
                    minimumValue={0}
                    maximumValue={65535}
                    isHex={false}
                    name="trainerID"
                />
                <span
                    style={{
                        margin: "0 10px",
                        alignSelf: "center",
                    }}
                >
                    /
                </span>
                <NumericalInput
                    label={LABEL[lang]["secret id"]}
                    margin="normal"
                    onChange={(_event, value) => {
                        setSearcherURLState({ secretID: value.value });
                        setSecretIDIsValid(value.isValid);
                    }}
                    value={secretID}
                    minimumValue={0}
                    maximumValue={65535}
                    isHex={false}
                    name="secretID"
                />
            </Box>
            <TextField
                label={LABEL[lang]["method"]}
                margin="normal"
                style={{ textAlign: "left" }}
                onChange={(event) => {
                    setSearcherFormState((data) => ({
                        ...data,
                        method: parseInt(event.target.value),
                    }));
                }}
                value={searcherFormState.method}
                select
                fullWidth
            >
                {Object.entries(METHODS[lang])
                    .filter(([value, _name]) => parseInt(value) != STATIC_2)
                    .map(([value, name], index) => (
                        <MenuItem key={index} value={parseInt(value)}>
                            {name}
                        </MenuItem>
                    ))}
            </TextField>
            {isStatic && (
                <StaticEncounterSelector
                    staticCategory={searcherFormState.staticCategory}
                    staticPokemon={searcherFormState.staticPokemon}
                    game={SEED_IDENTIFIER_TO_GAME[game]}
                    onChange={(staticCategory, staticPokemon) => {
                        setSearcherFormState((data) => ({
                            ...data,
                            staticCategory,
                            staticPokemon,
                        }));
                    }}
                />
            )}
            {!isStatic && (
                <WildEncounterSelector
                    wildCategory={searcherFormState.wildCategory}
                    wildLocation={searcherFormState.wildLocation}
                    wildPokemon={searcherFormState.wildPokemon}
                    wildLead={searcherFormState.wildLead}
                    game={SEED_IDENTIFIER_TO_GAME[game]}
                    onChange={(
                        wildCategory,
                        wildLocation,
                        wildPokemon,
                        wildLead,
                        _
                    ) => {
                        setSearcherFormState((data) => ({
                            ...data,
                            wildCategory,
                            wildLocation,
                            wildPokemon,
                            wildLead,
                        }));
                    }}
                    shouldFilterPokemon={true}
                    allowAnyPokemon
                    isSearcher
                />
            )}
            <TextField
                label={LABEL[lang]["shininess"]}
                margin="normal"
                style={{ textAlign: "left" }}
                onChange={(event) => {
                    setSearcherFormState((data) => ({
                        ...data,
                        shininess: parseInt(event.target.value),
                    }));
                }}
                value={searcherFormState.shininess}
                select
                fullWidth
            >
                <MenuItem value="255">{LABEL[lang]["any"]}</MenuItem>
                <MenuItem value="1">{LABEL[lang]["star"]}</MenuItem>
                <MenuItem value="2">{LABEL[lang]["square"]}</MenuItem>
                <MenuItem value="3">{LABEL[lang]["star/square"]}</MenuItem>
            </TextField>
            <TextField
                label={LABEL[lang]["nature"]}
                margin="normal"
                style={{ textAlign: "left" }}
                onChange={(event) => {
                    setSearcherFormState((data) => ({
                        ...data,
                        nature: parseInt(event.target.value),
                    }));
                }}
                value={searcherFormState.nature}
                select
                fullWidth
            >
                <MenuItem value="-1">{LABEL[lang]["any"]}</MenuItem>
                {NATURES[lang].map((nature, index) => (
                    <MenuItem key={index} value={index}>
                        {nature}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label={LABEL[lang]["gender"]}
                margin="normal"
                style={{ textAlign: "left" }}
                onChange={(event) => {
                    setSearcherFormState((data) => ({
                        ...data,
                        gender: parseInt(event.target.value),
                    }));
                }}
                value={searcherFormState.gender}
                select
                fullWidth
            >
                <MenuItem value="255">{LABEL[lang]["any"]}</MenuItem>
                {GENDERS.slice(0, 2).map((gender, index) => (
                    <MenuItem key={index} value={index}>
                        {gender}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label={LABEL[lang]["hidden power"]}
                margin="normal"
                style={{ textAlign: "left" }}
                onChange={(event) => {
                    setSearcherFormState((data) => ({
                        ...data,
                        hiddenPower: parseInt(event.target.value),
                    }));
                }}
                value={searcherFormState.hiddenPower}
                select
                fullWidth
            >
                <MenuItem value="-1">{LABEL[lang]["any"]}</MenuItem>
                {TYPES[lang].map((type, index) => (
                    <MenuItem key={index} value={index}>
                        {type}
                    </MenuItem>
                ))}
            </TextField>
            <IvEntry
                onChange={(_event, value) => {
                    setIvRangesAreValid(value.isValid);
                    setSearcherFormState((data) => ({
                        ...data,
                        ivRangeStrings: value.value,
                    }));
                }}
                value={searcherFormState.ivRangeStrings}
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isNotSubmittable}
                fullWidth
            >
                {searching ? LABEL[lang]["searching"] : LABEL[lang]["submit"]}
            </Button>
            <SearcherTable
                rows={rows}
                isStatic={isStatic}
                isMultiMethod={
                    searcherFormState.method === COMBINED_WILD_METHOD
                }
            />
        </Box>
    );
}
