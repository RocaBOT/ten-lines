import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { memo } from "react";
import { frameToMS, hexSeed } from "../tenLines";
import type {
    ExtendedGeneratorState,
    ExtendedWildGeneratorState,
    FRLGContiguousSeedEntry,
} from "../tenLines/generated";
import {
    ABILITIES,
    GENDERS,
    getName,
    METHODS,
    NATURES,
    SHININESS,
    TYPES,
} from "../tenLines/resources";

const CalibrationTable = memo(function CalibrationTable({
    rows,
    target,
    gameConsole,
    isStatic,
    isMultiMethod,
    isTeachyTVMode,
    isSwitch,
    overworldFrames,
    lang
}: {
    rows: ExtendedGeneratorState[] | ExtendedWildGeneratorState[];
    target: FRLGContiguousSeedEntry;
    gameConsole: string;
    isStatic: boolean;
    isMultiMethod: boolean;
    isTeachyTVMode: boolean;
    isSwitch: boolean;
    overworldFrames: number;
    lang: string;
}) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Seed</TableCell>
                        <TableCell>Advances</TableCell>
                        {isMultiMethod && <TableCell>Method</TableCell>}
                        <TableCell>Final A Press Frame</TableCell>
                        {isTeachyTVMode && (
                            <TableCell>TeachyTV Advances</TableCell>
                        )}
                        {isSwitch && (
                            <TableCell>Continue Screen Frames</TableCell>
                        )}
                        {!isStatic && <TableCell>Slot</TableCell>}
                        {!isStatic && <TableCell>Level</TableCell>}
                        <TableCell>PID</TableCell>
                        <TableCell>Shiny</TableCell>
                        <TableCell>Nature</TableCell>
                        <TableCell>Ability</TableCell>
                        <TableCell>IVs</TableCell>
                        <TableCell>Hidden</TableCell>
                        <TableCell>Power</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => {
                        if (index === 1000) {
                            return <TableRow key={index}>...</TableRow>;
                        } else if (index > 1000) {
                            return null;
                        } else if (isSwitch && (row.advances - overworldFrames * 2 - (isTeachyTVMode ? row.ttvAdvances * 312 : 0)) < 200) {
                            // SWITCH: Continue-screen proofing: hide results that require to pass the continue screen in less than 200 frames (tight, but doable)
                            return null;
                        }
                        const seedMS = frameToMS(row.seedTime / 16, gameConsole);
                        const offsetMS =
                            seedMS - frameToMS(target.seedTime / 16, gameConsole);

                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    {/* so only the actual number gets selected on double click */}
                                    <div style={{ float: "left" }}>
                                        {hexSeed(row.initialSeed, 16)} |{" "}
                                        {seedMS}
                                    </div>
                                    <span>ms</span> ({offsetMS >= 0 && "+"}
                                    {offsetMS}
                                    ms)
                                </TableCell>
                                <TableCell>{row.advances}</TableCell>
                                {isMultiMethod && (
                                    <TableCell>
                                        {
                                            METHODS[lang][
                                            (
                                                row as ExtendedWildGeneratorState
                                            ).method
                                            ]
                                        }
                                    </TableCell>
                                )}
                                <TableCell>
                                    {row.advances -
                                        row.ttvAdvances * 312 - 
                                        overworldFrames}
                                </TableCell>
                                {isTeachyTVMode && (
                                    <TableCell>{row.ttvAdvances}</TableCell>
                                )}
                                {isSwitch && (
                                    <TableCell>
                                        {/* the overworld advances 2x2 in the switch games */}
                                        {row.advances - overworldFrames * 2 - (isTeachyTVMode ? row.ttvAdvances * 312 : 0)}
                                    </TableCell>
                                )}
                                {!isStatic && (
                                    <TableCell>
                                        {
                                            (row as ExtendedWildGeneratorState)
                                                .encounterSlot
                                        }
                                        :{" "}
                                        {getName(
                                            (row as ExtendedWildGeneratorState)
                                                .species,
                                            (row as ExtendedWildGeneratorState)
                                                .form,
                                            lang
                                        )}
                                    </TableCell>
                                )}
                                {!isStatic && (
                                    <TableCell>
                                        {
                                            (row as ExtendedWildGeneratorState)
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
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default CalibrationTable;
