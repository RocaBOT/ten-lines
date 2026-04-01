import { useEffect, useState } from "react";
import React from "react";
import type { EnumeratedStaticTemplate3 } from "../tenLines/generated";
import fetchTenLines, { Game, getLanguage } from "../tenLines";
import { MenuItem, TextField } from "@mui/material";
import { GAMES, LABEL, getName } from "../tenLines/resources";

function StaticEncounterSelector({
    staticCategory,
    staticPokemon,
    onChange,
    game = Game.Gen3,
}: {
    staticCategory: number;
    staticPokemon: number;
    onChange: (staticCategory: number, staticPokemon: number) => void;
    game?: number;
}) {
    const lang = getLanguage();
    const [staticTemplates, setStaticTemplates] = useState<
        EnumeratedStaticTemplate3[]
    >([]);

    useEffect(() => {
        const fetchStaticTemplates = async () => {
            const tenLines = await fetchTenLines();
            const staticTemplates = (
                await tenLines.get_static_template_info(staticCategory)
            ).filter(
                (template: EnumeratedStaticTemplate3) => template.version & game
            );
            setStaticTemplates(staticTemplates);
            onChange(
                staticCategory,
                staticTemplates.some(
                    (template: EnumeratedStaticTemplate3) =>
                        template.index == staticPokemon
                )
                    ? staticPokemon
                    : staticTemplates.length > 0
                    ? staticTemplates[0].index
                    : 0
            );
        };
        fetchStaticTemplates();
    }, [staticCategory, game]);

    const isFRLG = game & Game.FRLG;
    const isFRLGE = game & (Game.FRLG | Game.Emerald);

    return (
        <React.Fragment>
            <TextField
                label={LABEL[lang]["category"]}
                margin="normal"
                style={{ textAlign: "left" }}
                onChange={(event) => {
                    onChange(parseInt(event.target.value), staticPokemon);
                }}
                value={staticCategory}
                select
                fullWidth
            >
                <MenuItem value="0">{LABEL[lang]["starters"]}</MenuItem>
                <MenuItem value="1">{LABEL[lang]["fossils"]}</MenuItem>
                <MenuItem value="2">{LABEL[lang]["gifts"]}</MenuItem>
                {isFRLG && <MenuItem value="3">{LABEL[lang]["game corner"]}</MenuItem>}
                <MenuItem value="4">{LABEL[lang]["stationary"]}</MenuItem>
                <MenuItem value="5">{LABEL[lang]["legends"]}</MenuItem>
                {isFRLGE && <MenuItem value="6">{LABEL[lang]["events"]}</MenuItem>}
                <MenuItem value="7">{LABEL[lang]["roamers"]}</MenuItem>
                {!isFRLG && (
                    <MenuItem value="8">{LABEL[lang]["blisy e-reader"]}</MenuItem>
                )}
            </TextField>
            <TextField
                label="Pokémon"
                margin="normal"
                style={{ textAlign: "left" }}
                onChange={(event) => {
                    onChange(staticCategory, parseInt(event.target.value));
                }}
                value={staticPokemon}
                select
                fullWidth
            >
                {staticTemplates.map((template) => (
                    <MenuItem key={template.index} value={template.index}>
                        {`${getName(template.species, template.form, lang)}${
                            template.shiny == 1
                                ? " (Shiny Locked)"
                                : template.species == 251
                                ? " (Lock Break)"
                                : ""
                        } - ${GAMES[lang][template.version]}`}
                    </MenuItem>
                ))}
            </TextField>
        </React.Fragment>
    );
}

export default StaticEncounterSelector;
