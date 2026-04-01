import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { memo } from "react";
import { frameToMS, hexSeed, teachyTVConversion } from "../tenLines";
import { LABEL } from "../tenLines/resources";
import type { InitialSeedResult } from "../tenLines/generated";
import { Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";

dayjs.extend(duration);

const InitialSeedTable = memo(function InitialSeedTable({
    rows,
    isFRLG,
    gameConsole,
    isTeachyTVMode,
    teachyTVRegularOut,
    lang
}: {
    rows: InitialSeedResult[];
    isFRLG: boolean;
    gameConsole: string;
    isTeachyTVMode: boolean;
    teachyTVRegularOut: number;
    lang: string;
}) {
    const [_, setSearchParams] = useSearchParams();
    function humanizeSettings(settings: string | undefined) {
        if (!settings) return "";
        const [
            sound,
            buttonMode,
            active_button,
            held_button_modifier,
            held_button,
        ] = settings.split("_");
        const humanizedTerms: Record<string, string> = {
            stereo: LABEL[lang]["stereo"],
            mono: LABEL[lang]["mono"],
            start: "Start",
            select: "Select",
            a: "A",
            l: "L",
            r: "R",
            startup: LABEL[lang]["startup"],
            blackout: LABEL[lang]["lackout"],
            al: "A+L",
            none: LABEL[lang]["none"],
            undefined: "",
        };
        const humanizedButtonModes: Record<string, string> = {
            a: LABEL[lang]["l eq a"],
            h: LABEL[lang]["help"],
            r: LABEL[lang]["lr"],
        };
        return `${humanizedTerms[sound]} | ${humanizedButtonModes[buttonMode]} | ${LABEL[lang]["seed button"]}: ${humanizedTerms[active_button]} | ${LABEL[lang]["extra button"]}: ${humanizedTerms[held_button_modifier]} ${humanizedTerms[held_button]}`;
    }

    function openInCalibration(row: InitialSeedResult, isAuxClick: boolean) {
        setSearchParams((previous) => {
            let params = new URLSearchParams(previous);
            params.set("targetInitialSeed", hexSeed(row.initialSeed, 16));
            if (isTeachyTVMode) {
                const ttv = teachyTVConversion(
                    row.advances,
                    teachyTVRegularOut,
                    gameConsole.startsWith("NX")
                );
                params.set(
                    "advancesMin",
                    Math.max(
                        0,
                        ttv.regular_advances + ttv.ttv_advances - 15
                    ).toString()
                );
                params.set(
                    "advancesMax",
                    // SWITCH: Continue-screen proofing: give some leeway to the maxAdvances to allow the system to show 
                    (ttv.regular_advances + ttv.ttv_advances + (gameConsole.startsWith("NX") ? 500 : 15)).toString()
                );
                params.set(
                    "ttvAdvancesMin",
                    Math.max(0, ttv.ttv_advances - 15).toString()
                );
                params.set(
                    "ttvAdvancesMax",
                    (ttv.ttv_advances + 15).toString()
                );
                if (gameConsole.startsWith("NX")) {
                    params.set(
                        "overworldFrames",
                        (ttv.ttv_advances + teachyTVRegularOut).toString()
                    )
                }
            } else {
                params.set(
                    "advancesMin",
                    Math.max(0, row.advances - 1000).toString()
                );
                params.set("advancesMax", (row.advances + 1000).toString());
            }
            params.set("page", "1");
            if (isFRLG) {
                const [
                    sound,
                    buttonMode,
                    active_button,
                    held_button_modifier,
                    held_button,
                ] = (row.settings as string).split("_");
                params.set("sound", sound);
                params.set("buttonMode", buttonMode);
                params.set("button", active_button);
                params.set(
                    "heldButton",
                    held_button_modifier +
                    (held_button ? "_" + held_button : "")
                );
            }
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
                        {!isFRLG && <TableCell>{LABEL[lang]["seed"]} (dec)</TableCell>}
                        <TableCell>{LABEL[lang]["seed"]} (hex)</TableCell>
                        <TableCell>{LABEL[lang]["advances"]}</TableCell>
                        {isTeachyTVMode && (
                            <TableCell>{LABEL[lang]["final a press frame"]}</TableCell>
                        )}
                        {isTeachyTVMode && (
                            <TableCell>{LABEL[lang]["ttv advances"]}</TableCell>
                        )}
                        <TableCell>{LABEL[lang]["est total frames"]}</TableCell>
                        <TableCell>{LABEL[lang]["est total time"]}</TableCell>
                        <TableCell>{LABEL[lang]["seed time"]}</TableCell>
                        {isFRLG && <TableCell>{LABEL[lang]["settings"]}</TableCell>}
                        <TableCell>{LABEL[lang]["open in calibration"]}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => {
                        let visual_frame = row.advances;
                        let ttv_advances = 0;
                        if (isTeachyTVMode) {
                            // TODO: TTV on switch
                            const ttv = teachyTVConversion(
                                row.advances,
                                teachyTVRegularOut,
                                gameConsole.startsWith("NX")
                            );
                            ttv_advances = ttv.ttv_advances;
                            visual_frame = ttv_advances + ttv.regular_advances;
                        }
                        return (
                            <TableRow key={index}>
                                {!isFRLG && (
                                    <TableCell>{row.initialSeed}</TableCell>
                                )}
                                <TableCell>
                                    {hexSeed(row.initialSeed, 16)}
                                </TableCell>
                                <TableCell>{row.advances}</TableCell>
                                {isTeachyTVMode && (
                                    <TableCell>{visual_frame}</TableCell>
                                )}
                                {isTeachyTVMode && (
                                    <TableCell>{ttv_advances}</TableCell>
                                )}
                                <TableCell>
                                    {Math.round(row.seedTime / 16 + visual_frame)}
                                </TableCell>
                                <TableCell>
                                    {(() => {
                                        const duration = dayjs
                                            .duration(
                                                frameToMS(
                                                    row.seedTime / 16 + visual_frame,
                                                    gameConsole
                                                )
                                            )
                                        if (duration.days() > 0) {
                                            return `${Math.floor(duration.asHours())}:${duration.format("mm:ss.SSS")}`
                                        }
                                        return duration.format("HH:mm:ss.SSS")
                                    })()}
                                </TableCell>
                                <TableCell>
                                    {/* so only the actual number gets selected on double click */}
                                    <div style={{ float: "left" }}>
                                        {frameToMS(row.seedTime / 16, gameConsole)}
                                    </div>
                                    <span>ms</span>
                                </TableCell>
                                {isFRLG && (
                                    <TableCell>
                                        {humanizeSettings(
                                            row.settings as string
                                        )}
                                    </TableCell>
                                )}
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                            openInCalibration(row, false);
                                        }}
                                        onMouseDown={(e) => {
                                            if (e.button === 1) {
                                                e.preventDefault();
                                                openInCalibration(row, true);
                                            }
                                        }}
                                    >
                                        {LABEL[lang]["calibration"]}
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

export default InitialSeedTable;
