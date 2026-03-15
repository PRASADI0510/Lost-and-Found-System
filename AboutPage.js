import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  IconButton,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PhoneIcon from "@mui/icons-material/Phone";

const AboutPage = () => {
  const teamMembers = [
    { name: "Zahinab Falil", avatar: "/team/zahinab.png", color: "#4A90E2" },
    {
      name: "Prasadika Jagoda",
      avatar: "/team/prasadika.png",
      color: "#F5E6D3",
    },
    {
      name: "Nethranjali Silva",
      avatar: "/team/nethranjali.png",
      color: "#FFB6A3",
    },
    { name: "Udara sampath", avatar: "/team/udara.png", color: "#87CEEB" },
    { name: "Dinodi Rimesha", avatar: "/team/dinodi.png", color: "#E74C3C" },
  ];

  const socialLinks = [
    {
      icon: <InstagramIcon sx={{ fontSize: 40 }} />,
      link: "#",
      label: "Instagram",
    },
    {
      icon: <FacebookIcon sx={{ fontSize: 40 }} />,
      link: "#",
      label: "Facebook",
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      link: "mailto:contact@ousl.lk",
      label: "Email",
    },
    {
      icon: <LinkedInIcon sx={{ fontSize: 40 }} />,
      link: "#",
      label: "LinkedIn",
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      link: "tel:+94112881000",
      label: "Phone",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        minHeight: "calc(100vh - 100px)",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Team Section */}
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              mb: 6,
              color: "#000000",
            }}
          >
            Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{
                      width: 150,
                      height: 150,
                      backgroundColor: member.color,
                      border: "4px solid #FFFFFF",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                    onError={(e) => {
                      e.target.style.backgroundColor = member.color;
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      textAlign: "center",
                      color: "#000000",
                    }}
                  >
                    {member.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Us Section */}
        <Box sx={{ mt: 10 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 750,
              textAlign: "center",
              mb: 6,
              color: "#000000",
            }}
          >
            Contact Us
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 3, md: 6 },
              flexWrap: "wrap",
            }}
          >
            {socialLinks.map((social, index) => (
              <IconButton
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "#333333",
                    transform: "scale(1.1)",
                    transition: "all 0.3s ease",
                  },
                }}
                aria-label={social.label}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
