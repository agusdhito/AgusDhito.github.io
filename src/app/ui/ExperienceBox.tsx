import {
    Box,
    Divider,
    Typography
} from "@mui/material";
import Image from "next/image"

export function ExperienceBox(props: { imageSrc: string, title: string, description: string }) {
    return (
        <>
        <Box
            sx={{
                position: "relative",
                // display: "flex",
                // flexDirection: "row-reverse",
                width: "100%",
                height: "300px",
                margin: "32px",

            }}
            >
                <Box
                sx={{
                    position: "relative",
                    width: 200,
                    height: 200,
                    border: "4px solid black",
                    backgroundColor: "white",
                }}
                >
                    <Image
                    src={`/${[props.imageSrc]}`}
                    alt={props.title}
                    fill={true}
                    />
                </Box>

                <Box
                sx={{
                    padding: "16px",
                    margin: "4px",
                    backgroundColor: "white",
                    width: "70%",
                    position: "absolute",
                    left: "150px",
                    top: "125px",
                    textAlign: "justify",
                }}
                >
                    <Typography variant="h5">
                        {props.title}
                    </Typography>

                    <Box
                    sx={{
                        margin: "4px"
                    }}
                    >
                        <Divider></Divider>
                    </Box>

                    <Typography>
                        {props.description}
                    </Typography>
                </Box>

            </Box>
        </>
    )
}
