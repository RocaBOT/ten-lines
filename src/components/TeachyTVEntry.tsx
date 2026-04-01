import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import NumericalInput from "./NumericalInput";
import { LABEL } from "../tenLines/resources";

function TeachyTVEntry({
    isTeachyTVMode,
    teachyTVRegularOut,
    lang,
    onChange,
}: {
    isTeachyTVMode: boolean;
    teachyTVRegularOut: string;
    lang: string;
    onChange: (
        isTeachyTVMode: boolean,
        teachyTVRegularOut: { isValid: boolean; value: string }
    ) => void;
}) {
    const [teachyTVRegularOutValid, setTeachyTVRegularOutValid] =
        useState(true);
    return (
        <Box
            sx={isTeachyTVMode ? { display: "flex", alignItems: "center" } : {}}
        >
            {isTeachyTVMode && (
                <NumericalInput
                    label={LABEL[lang]["min time outside ttv"]}
                    name="teachyTVRegularOut"
                    value={teachyTVRegularOut}
                    minimumValue={0}
                    maximumValue={100000000}
                    onChange={(_, value) => {
                        setTeachyTVRegularOutValid(value.isValid);
                        onChange(isTeachyTVMode, value);
                    }}
                />
            )}
            <FormControlLabel
                style={isTeachyTVMode ? { marginLeft: 8 } : {}}
                control={
                    <Checkbox
                        checked={isTeachyTVMode}
                        onChange={(e) => {
                            onChange(e.target.checked, {
                                value: teachyTVRegularOut,
                                isValid: teachyTVRegularOutValid,
                            });
                        }}
                    />
                }
                label={LABEL[lang]["ttv mode"]}
                sx={{
                    whiteSpace: "nowrap",
                }}
            />
        </Box>
    );
}

export default TeachyTVEntry;
