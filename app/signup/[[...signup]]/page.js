import { SignUp } from "@clerk/nextjs";
import { AppBar, Box, Container, Typography } from "@mui/material";

export default function SignUpPage() {
    return (
        <Container >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h4">Sign Up</Typography>
                <SignUp />
            </Box>
        </Container>
    )
}