import { Box, Container, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#EC7510",
        color: "white",
        py: { xs: 1.5, sm: 2.5 },
        px: { xs: 2, sm: 4 },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: { xs: "20px", sm: "30px" },
        zIndex: 1200,
        fontSize: { xs: "10px", sm: "12px" },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 300,
            textAlign: "center",
          }}
        >
          ©2026 IT Launchpad LMS.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
