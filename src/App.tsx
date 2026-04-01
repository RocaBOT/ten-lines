import "./App.css";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import InitialSeedForm from "./components/InitialSeedForm";
import SearcherForm from "./components/SearcherForm";
import { Box, Tab, Tabs, TextField, MenuItem } from "@mui/material";
import CalibrationForm from "./components/CalibrationForm";
import FrLgSeedsTimestamp from "./wasm/src/generated/frlg_seeds_timestamp.txt?raw";
import { BrowserRouter, useSearchParams } from "react-router-dom";
import BingoPage, { getBingoActive } from "./components/BingoPage";
import { LABEL } from "./tenLines/resources";
import { getLanguage } from "./tenLines";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function TenLinesPages() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "0") ?? 0;
    const bingoActive = getBingoActive();
    const lang = getLanguage();

    const pages = [
        <InitialSeedForm
            key={0}
            sx={{ maxWidth: 1100, minWidth: 1100, width: 1100 }}
            hidden={currentPage != 0}
        />,
        <CalibrationForm
            key={1}
            sx={{ maxWidth: 1100, minWidth: 1100, width: 1100 }}
            hidden={currentPage != 1}
        />,
        <SearcherForm
            key={2}
            sx={{ maxWidth: 1100, minWidth: 1100, width: 1100 }}
            hidden={currentPage != 2}
        />,
        bingoActive && <BingoPage key={3} hidden={currentPage != 3} />,
    ];

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <TextField
                label={LABEL[lang]["language"]}
                margin="normal"
                style={{ textAlign: "left" }}
                onChange={(event) => {
                    setSearchParams({ lang: event.target.value });
                }}
                value={lang}
                select
                fullWidth
            >
                <MenuItem value="EN">English</MenuItem>,
                <MenuItem value="FR">Français</MenuItem>
            </TextField>
            <Box>
                <Tabs
                    value={currentPage}
                    onChange={(_, newValue) => {
                        setSearchParams((prev) => {
                            prev.set("page", newValue);
                            return prev;
                        });
                    }}
                    variant="fullWidth"
                >
                    <Tab label={LABEL[lang]["searcher"]} value={2} />
                    <Tab label={LABEL[lang]["initial seed"]}  value={0} />
                    <Tab label={LABEL[lang]["calibration"]}  value={1} />
                    {bingoActive && <Tab label={LABEL[lang]["bingo"]}  value={3} />}
                </Tabs>
                {pages}
            </Box>

            <footer>
                THIS IS A FORK FOR TESTING PURPOSES ONLY. WE DO NOT OFFER SUPPORT. DO NOT USE.
                <br />
                Go to{" "}
                <a href="https://lincoln-lm.github.io/ten-lines/">
                    lincoln-lm's page 
                </a>
                {" "}for the supported version of Ten Lines.
                <br />
                Original "10 lines" was created by Shao, FRLG seeds farmed by
                blisy, po, HunarPG, 10Ben, Real96, Papa Jef&eacute;, and トノ
                <br />
                Powered by{" "}
                <a href="https://github.com/Admiral-Fish/PokeFinder">
                    PokeFinderCore
                </a>
                <br />
                FRLG seed data as of {FrLgSeedsTimestamp}
            </footer>
        </ThemeProvider>
    );
}

function App() {
    return (
        <BrowserRouter>
            <TenLinesPages />
        </BrowserRouter>
    );
}

export default App;
