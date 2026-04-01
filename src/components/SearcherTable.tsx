import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { memo } from "react";
import { getLanguage, hexSeed } from "../tenLines";
import type {
    ExtendedSearcherState,
    ExtendedWildSearcherState,
} from "../tenLines/generated";
import {
    ABILITIES,
    GENDERS,
    getName,
    METHODS,
    NATURES,
    SHININESS,
    TYPES,
    LABEL
} from "../tenLines/resources";
import { useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";

const SearcherTable = memo(function SearcherTable({
    rows,
    isStatic,
    isMultiMethod,
}: {
    rows: ExtendedSearcherState[] | ExtendedWildSearcherState[];
    isStatic: boolean;
    isMultiMethod: boolean;
}) {
    const lang = getLanguage();
    const [_, setSearchParams] = useSearchParams();

    function openInInitialSeed(
        row: ExtendedSearcherState | ExtendedWildSearcherState,
        isAuxClick: boolean
    ) {
        setSearchParams((previous) => {
            let params = new URLSearchParams(previous);
            params.set("targetSeed", hexSeed(row.seed, 32));
            params.set("page", "0");
            if (isAuxClick) {
                window.open(`?${params.toString()}`);
                return previous;
            }
            return params;
        });
    }
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{LABEL[lang]["seed"]}</TableCell>
                        {isMultiMethod && <TableCell>{LABEL[lang]["method"]}</TableCell>}
                        {!isStatic && <TableCell>{LABEL[lang]["encounter slot"]}</TableCell>}
                        {!isStatic && <TableCell>{LABEL[lang]["encounter level"]}</TableCell>}
                        <TableCell>{LABEL[lang]["pid"]}</TableCell>
                        <TableCell>{LABEL[lang]["shiny"]}</TableCell>
                        <TableCell>{LABEL[lang]["nature"]}</TableCell>
                        <TableCell>{LABEL[lang]["ability"]}</TableCell>
                        <TableCell>{LABEL[lang]["ivs"]}</TableCell>
                        <TableCell>{LABEL[lang]["hidden power 1"]}</TableCell>
                        <TableCell>{LABEL[lang]["hidden power 2"]}</TableCell>
                        <TableCell>{LABEL[lang]["gender"]}</TableCell>
                        <TableCell>{LABEL[lang]["open in init seed"]}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => {
                        if (index === 1000) {
                            return <TableRow key={index}>...</TableRow>;
                        } else if (index > 1000) {
                            return null;
                        }
                        return (
                            <TableRow key={index}>
                                <TableCell>{hexSeed(row.seed, 32)}</TableCell>
                                {isMultiMethod && (
                                    <TableCell>
                                        {
                                            METHODS[lang][
                                                (
                                                    row as ExtendedWildSearcherState
                                                ).method
                                            ]
                                        }
                                    </TableCell>
                                )}
                                {!isStatic && (
                                    <TableCell>
                                        {
                                            (row as ExtendedWildSearcherState)
                                                .encounterSlot
                                        }
                                        :{" "}
                                        {getName(
                                            (row as ExtendedWildSearcherState)
                                                .species,
                                            (row as ExtendedWildSearcherState)
                                                .form,
                                            lang
                                        )}
                                    </TableCell>
                                )}
                                {!isStatic && (
                                    <TableCell>
                                        {
                                            (row as ExtendedWildSearcherState)
                                                .level
                                        }
                                    </TableCell>
                                )}
                                <TableCell>{hexSeed(row.pid, 32)}</TableCell>
                                <TableCell>{SHININESS[lang][row.shiny]}</TableCell>
                                <TableCell>{NATURES[lang][row.nature]}</TableCell>
                                <TableCell>
                                    {row.ability}:{" "}
                                    {ABILITIES[lang][row.abilityIndex - 1]}
                                </TableCell>
                                <TableCell>{row.ivs.join("/")}</TableCell>
                                <TableCell>
                                    {TYPES[lang][row.hiddenPower]}
                                </TableCell>
                                <TableCell>{row.hiddenPowerStrength}</TableCell>
                                <TableCell>{GENDERS[row.gender]}</TableCell>

                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                            openInInitialSeed(row, false);
                                        }}
                                        onMouseDown={(e) => {
                                            if (e.button === 1) {
                                                e.preventDefault();
                                                openInInitialSeed(row, true);
                                            }
                                        }}
                                    >
                                        {LABEL[lang]["initial seed"]}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default SearcherTable;
