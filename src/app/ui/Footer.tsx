import {
    Box,
    Typography
} from "@mui/material"

export function Footer() {
    return (
        <>
            <Box
            sx={{
                backgroundColor: "black",
                width: "100%",
                height: "100px"
            }}
            >
                <Box
                sx={{
                    padding: "4px",
                    margin: "4px"
                }}
                >
                    <Typography
                    sx={{
                        color: "white"
                    }}
                    >
                        Copyright (c) 2025
                    </Typography>
                </Box>
                
                
            </Box>
        </>
    )
}