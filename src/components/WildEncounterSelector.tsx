import { useEffect, useState } from "react";
import React from "react";
import fetchTenLines, { Game, getLanguage } from "../tenLines";
import { LABEL } from "../tenLines/resources";
import {
    Autocomplete,
    Box,
    Checkbox,
    FormControlLabel,
    MenuItem,
    TextField,
} from "@mui/material";
import { getLocation, getName, NATURES } from "../tenLines/resources";

function WildEncounterSelector({
    wildCategory,
    wildLocation,
    wildPokemon,
    wildLead,
    shouldFilterPokemon,
    onChange,
    game = Game.Gen3,
    allowAnyPokemon = false,
    isSearcher = false,
}: {
    wildCategory: number;
    wildLocation: number;
    wildPokemon: number;
    wildLead: number;
    shouldFilterPokemon: boolean;
    onChange: (
        wildCategory: number,
        wildLocation: number,
        wildPokemon: number,
        wildLead: number,
        shouldFilterPokemon: boolean
    ) => void;
    game?: number;
    allowAnyPokemon?: boolean;
    isSearcher?: boolean;
}) {
    const lang = getLanguage();
    const [wildLocations, setWildLocations] = useState<number[]>([]);
    const [areaSpecies, setAreaSpecies] = useState<number[]>([]);

    useEffect(() => {
        const fetchWildLocations = async () => {
            const tenLines = await fetchTenLines();
            const wildLocations = await tenLines.get_wild_locations(
                game,
                wildCategory
            );
            setWildLocations(wildLocations);
            onChange(
                wildCategory,
                wildLocations.contains(wildLocation)
                    ? wildLocation
                    : wildLocations.length > 0
                    ? wildLocations[0]
                    : 0,
                wildPokemon,
                wildLead,
                shouldFilterPokemon
            );
        };
        fetchWildLocations();
    }, [game, wildCategory]);

    useEffect(() => {
        const fetchAreaSpecies = async () => {
            const tenLines = await fetchTenLines();
            const areaSpecies = await tenLines.get_area_species(
                game,
                wildCategory,
                wildLocation
            );
            setAreaSpecies(areaSpecies);
            onChange(
                wildCategory,
                wildLocation,
                allowAnyPokemon
                    ? -1
                    : areaSpecies.length > 0
                    ? areaSpecies[0]
                    : 0,
                wildLead,
                shouldFilterPokemon
            );
        };
        fetchAreaSpecies();
    }, [game, wildCategory, wildLocation]);

    const isEmerald = (game & Game.Emerald) == Game.Emerald;

    return (
        <React.Fragment>
            <TextField
                label={LABEL[lang]["category"]}
                margin="normal"
                style={{ textAlign: "left" }}
                onChange={(event) => {
                    onChange(
                        parseInt(event.target.value),
                        wildLocation,
                        wildPokemon,
                        wildLead,
                        shouldFilterPokemon
                    );
                }}
                value={wildCategory}
                select
                fullWidth
            >
                <MenuItem value="0">{LABEL[lang]["grass"]}</MenuItem>
                <MenuItem value="3">{LABEL[lang]["rock smash"]}</MenuItem>
                <MenuItem value="4">{LABEL[lang]["surfing"]}</MenuItem>
                <MenuItem value="6">{LABEL[lang]["old rod"]}</MenuItem>
                <MenuItem value="7">{LABEL[lang]["good rod"]}</MenuItem>
                <MenuItem value="8">{LABEL[lang]["super rod"]}</MenuItem>
            </TextField>
            <Autocomplete
                options={wildLocations.map((_, index) => index)}
                onChange={(_event, newValue) => {
                    onChange(
                        wildCategory,
                        newValue,
                        wildPokemon,
                        wildLead,
                        shouldFilterPokemon
                    );
                }}
                getOptionLabel={(option) =>
                    getLocation(game, wildLocations[option], lang) || ""
                }
                renderInput={(params) => (
                    <TextField {...params} label={LABEL[lang]["location"]} margin="normal" />
                )}
                value={wildLocation}
                disablePortal
                disableClearable
                selectOnFocus
                fullWidth
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                    label="Pokémon"
                    margin="normal"
                    style={{ textAlign: "left" }}
                    onChange={(event) => {
                        onChange(
                            wildCategory,
                            wildLocation,
                            parseInt(event.target.value),
                            wildLead,
                            shouldFilterPokemon
                        );
                    }}
                    value={wildPokemon}
                    select
                    fullWidth
                >
                    {allowAnyPokemon && <MenuItem value="-1">{LABEL[lang]["any"]}</MenuItem>}
                    {areaSpecies.map((speciesForm) => (
                        <MenuItem key={speciesForm} value={speciesForm}>
                            {getName(speciesForm & 0x7ff, speciesForm >> 11, lang)}
                        </MenuItem>
                    ))}
                </TextField>
                {!allowAnyPokemon && (
                    <FormControlLabel
                        style={{ marginLeft: 8 }}
                        control={
                            <Checkbox
                                checked={shouldFilterPokemon}
                                onChange={(event) => {
                                    onChange(
                                        wildCategory,
                                        wildLocation,
                                        wildPokemon,
                                        wildLead,
                                        event.target.checked
                                    );
                                }}
                            />
                        }
                        label={LABEL[lang]["filter"]}
                        sx={{
                            whiteSpace: "nowrap",
                        }}
                    />
                )}
            </Box>
            {isEmerald && (
                <TextField
                    label={LABEL[lang]["lead"]}
                    margin="normal"
                    style={{ textAlign: "left" }}
                    onChange={(event) => {
                        onChange(
                            wildCategory,
                            wildLocation,
                            wildPokemon,
                            parseInt(event.target.value),
                            shouldFilterPokemon
                        );
                    }}
                    value={wildLead}
                    select
                    fullWidth
                >
                    <MenuItem value="255">{LABEL[lang]["none"]}</MenuItem>
                    <MenuItem value="25">{LABEL[lang]["female cute charm"]}</MenuItem>
                    <MenuItem value="26">{LABEL[lang]["male cute charm"]}</MenuItem>
                    <MenuItem value="27">{LABEL[lang]["magnet pull"]}</MenuItem>
                    <MenuItem value="28">{LABEL[lang]["static"]}</MenuItem>
                    <MenuItem value="32">{LABEL[lang]["hpvs"]}</MenuItem>
                    {isSearcher ? (
                        <MenuItem value="0">{LABEL[lang]["matching synchronize"]}</MenuItem>
                    ) : (
                        NATURES[lang].map((nature, index) => (
                            <MenuItem key={index} value={index}>
                                {nature} {LABEL[lang]["synchronize"]}
                            </MenuItem>
                        ))
                    )}
                </TextField>
            )}
        </React.Fragment>
    );
}

export default WildEncounterSelector;
