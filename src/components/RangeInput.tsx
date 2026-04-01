import { Box, Button, Tooltip } from "@mui/material";
import { useState } from "react";
import NumericalInput from "./NumericalInput";
import InfoIcon from "@mui/icons-material/Info";


function RangeInput({
    label_min,
    label_max,
    name,
    value,
    minimumValue,
    maximumValue,
    onChange,
    resetButton = false,
    infotext,
    ...props
}: {
    label_min: string;
    label_max: string;
    name: string;
    value: [string, string];
    minimumValue: number;
    maximumValue: number;
    onChange: (
        event: React.ChangeEvent<HTMLInputElement>,
        value: {
            isValid: boolean;
            value: [string, string];
        }
    ) => void;
    resetButton?: boolean;
    infotext?: string;
    [key: string]: any;
}) {
    const [minValid, setMinValid] = useState(true);
    const [maxValid, setMaxValid] = useState(true);
    const minChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        { value: newMin, isValid: newMinValid }: { value: string; isValid: boolean }
    ) => {
        setMinValid(newMinValid);
        // Re-evaluate max validity with the new min boundary
        const newMaxValid = newMinValid
            ? parseInt(value[1]) >= parseInt(newMin) && parseInt(value[1]) <= maximumValue
            : maxValid;
        if (newMaxValid !== maxValid) setMaxValid(newMaxValid);
        onChange(event, {
            value: [newMin, value[1]],
            isValid: newMinValid && newMaxValid,
        });
    };
    const maxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        { value: newMax, isValid: newMaxValid }: { value: string; isValid: boolean }
    ) => {
        setMaxValid(newMaxValid);
        // Re-evaluate min validity with the new max boundary
        const newMinValid = newMaxValid
            ? parseInt(value[0]) >= minimumValue && parseInt(value[0]) <= parseInt(newMax)
            : minValid;
        if (newMinValid !== minValid) setMinValid(newMinValid);
        onChange(event, {
            value: [value[0], newMax],
            isValid: newMinValid && newMaxValid,
        });
    };

    return (
        <Box sx={{ display: "flex" }}>
            {(infotext?.length) && <span
                    style={{
                        margin: "25px 10px",
                        alignSelf: "left",
                    }}
                >
                    <Tooltip title={infotext}><InfoIcon fontSize="large"/></Tooltip>
                </span>}
            <NumericalInput
                label={`${label_min}`}
                name={name}
                minimumValue={minimumValue}
                maximumValue={maxValid ? parseInt(value[1]) : maximumValue}
                onChange={minChange}
                value={value[0]}
                {...props}
            />
            <span
                style={{
                    margin: "0 10px",
                    alignSelf: "center",
                }}
            >
                -
            </span>
            <NumericalInput
                label={`${label_max}`}
                name={name}
                minimumValue={minValid ? parseInt(value[0]) : minimumValue}
                maximumValue={maximumValue}
                onChange={maxChange}
                value={value[1]}
                {...props}
            />
            {resetButton && (
                <Button
                    onClick={(e) => {
                        setMinValid(true);
                        setMaxValid(true);
                        // TODO: this is hacky but nothing currently actually cares about the event
                        onChange(e as any, {
                            value: [
                                minimumValue.toString(),
                                maximumValue.toString(),
                            ],
                            isValid: true,
                        });
                    }}
                    size="large"
                    sx={{
                        maxWidth: "35px",
                        minWidth: "35px",
                    }}
                >
                    ↻
                </Button>
            )}
        </Box>
    );
}

export default RangeInput;
