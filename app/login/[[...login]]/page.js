import { SignIn } from "@clerk/nextjs";
import { AppBar, Box, Container, Typography } from "@mui/material";

export default function LoginPage() {
    return (
        <Container >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h4">Login</Typography>
                <SignIn />
            </Box>
        </Container>
    )
}