import { TextField } from "@mui/material";
import { useMemo, useState } from "react";
import React from "react";
import type { IVRange } from "../tenLines/generated";
import { LABEL, IV_NAMES } from "../tenLines/resources";

function IvCalculator({
    value,
    onChange,
    calculateIVs,
    lang
}: {
    value: string;
    onChange: (
        event: React.ChangeEvent<HTMLInputElement>,
        value: { value: string; isValid: boolean; calculatedValue: IVRange[] }
    ) => void;
    calculateIVs: (parsedLines: number[][]) => Promise<IVRange[]>;
    lang:string;
}) {
    const getError = (value: string, checkCalculatingError: boolean = true) => {
        if (checkCalculatingError && calculatingError !== "")
            return calculatingError;
        const lines = value.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineEntries = line.split(" ");
            if (line == "") return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["missing level"]}`;
            const level = parseInt(lineEntries[0]) ?? 0;
            if (level > 100 || level < 1) return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["invalid level"]}`;
            if (lineEntries.length == 1) return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["missing hp"]}`;
            const hp = parseInt(lineEntries[1]) ?? 0;
            if (hp > 651 || hp < 1) return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["invalid hp"]}`;
            if (lineEntries.length == 2) return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["missing atk"]}`;
            const atk = parseInt(lineEntries[2]) ?? 0;
            if (atk > 437 || atk < 1) return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["invalid atk"]}`;
            if (lineEntries.length == 3) return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["missing def"]}`;
            const def = parseInt(lineEntries[3]) ?? 0;
            if (def > 545 || def < 1) return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["invalid def"]}`;
            if (lineEntries.length == 4)
                return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["missing spa"]}`;
            const spa = parseInt(lineEntries[4]) ?? 0;
            if (spa > 435 || spa < 1)
                return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["invalid spa"]}`;
            if (lineEntries.length == 5)
                return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["missing spd"]}`;
            const spd = parseInt(lineEntries[5]) ?? 0;
            if (spd > 545 || spd < 1)
                return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["invalid spd"]}`;
            if (lineEntries.length == 6) return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["missing spe"]}`;
            const spe = parseInt(lineEntries[6]) ?? 0;
            if (spe > 479 || spe < 1) return `${LABEL[lang]["line"]} ${i + 1} ${LABEL[lang]["invalid spe"]}`;
        }
        return "";
    };

    const [calculatingError, setCalculatingError] = useState("");
    const error = useMemo(() => getError(value), [value, calculatingError]);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCalculatingError("");
        const baseValidity = getError(event.target.value, false) === "";
        onChange(event, {
            value: event.target.value,
            isValid: false,
            calculatedValue: [],
        });
        if (!baseValidity) {
            return;
        }
        const lines = event.target.value.split("\n");
        const parsedLines = lines.map((line) =>
            line.split(" ").map((entry) => parseInt(entry))
        );

        const calculate = async () => {
            const ivRanges = await calculateIVs(parsedLines);
            for (let i = 0; i < 6; i++) {
                if (ivRanges[i].min === 32) {
                    setCalculatingError(`${LABEL[lang]["no possible iv 1"]} ${IV_NAMES[lang][i]} ${LABEL[lang]["no possible iv 2"]}`);
                    onChange(event, {
                        value: event.target.value,
                        isValid: false,
                        calculatedValue: [],
                    });
                    return;
                }
            }
            onChange(event, {
                value: event.target.value,
                isValid: true,
                calculatedValue: ivRanges,
            });
            setCalculatingError("");
        };

        calculate();
    };

    return (
        <TextField
            label={LABEL[lang]["iv calc"]}
            margin="normal"
            value={value}
            error={error !== ""}
            helperText={error}
            onChange={handleChange}
            multiline
            fullWidth
        />
    );
}

export default IvCalculator;
