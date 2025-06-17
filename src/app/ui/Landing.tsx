"use client"

import Image from "next/image"
import { Divider, Typography, Box, Container, Button, List, ListItem, IconButton, Collapse, createTheme, useMediaQuery } from "@mui/material"
import { useEffect, useState } from "react";
import { Rect, useRect } from "react-use-rect";
import Link from "next/link";
import {
  Widgets,
  DeveloperModeOutlined,
  StorageOutlined,
  AlarmOutlined,
  GitHub,
  Mail,
  LinkedIn,
  KeyboardArrowDown,
  KeyboardArrowUp
} from "@mui/icons-material"
import { WorkingExperiences } from "@/app/data/data";
import experiencesData from '@/app/data/experience_timeline.json';
import { ExperienceBox } from "@/app/ui/ExperienceBox";
import { ThemeProvider } from "@emotion/react";
import Timeline from '@/app/ui/Timeline';

const theme = createTheme({
  typography: {
    fontFamily: [
      'cursive',
      'sans-serif',
    ].join(','),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
})

function Landing() {
  const mock = ["Engineering Manager", "Backend Engineer", "Frontend Engineer", "Guitarist", "Music Producer"];
  const slidePictures = ["golang.png", "ruby-on-rails.png", "java.png", "postgresql.png", "redis.png", "react.png", "typescript.png", "docker.png", "kubernetes.png", "gcp.png"];

  const [detailsOpen, setDetailsOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const SlideText = ({ source }: { source: string[] }) => {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [rect, setRect] = useState<Rect | null>(null);
    const [rectRef] = useRect(setRect);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentItemIndex((index) =>
          index === source.length - 1 ? 0 : index + 1
        );
      }, 2000);
      return () => clearInterval(interval);
    }, [currentItemIndex, source]);

    return (
      <div
        style={{
          display: "inline-flex",
          overflow: "hidden",
          position: "relative",
          width: `${rect?.width}px`,
          transition: "all 0.5s ease-in-out",
        }}
      >
        <span className="w-full" style={{ visibility: "hidden" }}>{source[currentItemIndex]}</span>
        {source.map((text, index) => (
          <span
            key={text}
            className="w-full"
            ref={currentItemIndex === index ? rectRef : null}
            style={{
              position: "absolute",
              left: (rect?.width ?? 0) * 2,
              transform: `translateX(${currentItemIndex === index ? `-${(rect?.width ?? 0) * 2}px` : 0})`,
              transition: "all 1s ease-in-out",
            }}
          >
            {text}
          </span>
        ))}
      </div>
    );
  };

  const SlidePictures = ({ source }: { source: string[] }) => {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [rect, setRect] = useState<Rect | null>(null);
    const [rectRef] = useRect(setRect);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentItemIndex((index) =>
          index === source.length - 1 ? 0 : index + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }, [currentItemIndex, source]);

    return (
      <div
        style={{
          display: "inline-flex",
          overflow: "hidden",
          position: "relative",
          width: `${rect?.width}px`,
          transition: "all 0.5s ease-in-out",
        }}
      >
        <span className="w-full" style={{ visibility: "hidden" }}>
          <img src={`/${source[currentItemIndex]}`} alt={source[currentItemIndex]} width={150} height={150} />
        </span>
        {source.map((text, index) => (
          <span
            key={text}
            className="w-full"
            ref={currentItemIndex === index ? rectRef : null}
            style={{
              position: "absolute",
              left: (rect?.width ?? 0) * 2,
              transform: `translateX(${currentItemIndex === index ? `-${(rect?.width ?? 0) * 2}px` : 0})`,
              transition: "all 1s ease-in-out",
            }}
          >
            <img src={`/${text}`} alt={text} width={150} height={150} />
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          maxWidth="xl"
          sx={{
            minHeight: { xs: 'auto', md: '90vh' },
            position: "relative",
            padding: { xs: 2, sm: 3, md: 4 }
          }}
          className="h-auto"
        >
          <Box
            sx={{
              backgroundColor: "lightblue",
              display: "flex",
              flexDirection: { xs: 'column', md: 'row' },
              zIndex: 1,
              padding: { xs: 2, sm: 3 }
            }}
          >
            <Box
              sx={{
                width: { xs: '100%', md: '50%' },
                height: "100%",
                padding: "8px",
                margin: "8px",
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box sx={{
                position: "relative",
                width: { xs: '90%', sm: '85%', md: '80%' },
                aspectRatio: '3/4',
                // maxHeight: { xs: '300px', sm: '400px', md: '500px', lg: '600px' },
                marginTop: { xs: 2, md: 4 },
              }}>
                {/* Main image */}
                <img
                  src={"/landing-new.jpg"}
                  alt="Landing page"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    position: "relative",
                    zIndex: 1
                  }}
                />

                {/* Right frame */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: { xs: -8, sm: -12, md: -16 },
                    width: { xs: 8, sm: 12, md: 16 },
                    height: "100%",
                    backgroundColor: "white",
                    zIndex: 0
                  }}
                />

                {/* Bottom frame */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: -8, sm: -12, md: -16 },
                    left: 0,
                    width: "100%",
                    height: { xs: 8, sm: 12, md: 16 },
                    backgroundColor: "white",
                    zIndex: 0
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                margin: { xs: "8px", md: "4px" },
                textAlign: { xs: "center", md: "right" },
                width: { xs: '100%', md: '50%' },
                padding: { xs: 2, md: 4 }
              }}
            >
              <Typography variant={isMobile ? "h4" : "h3"}>
                Agustinus Ardhito Vedoputro
              </Typography>

              <br />
              <Typography className="pt-4">
                Hello everyone, nice to meet you! I'm a
              </Typography>
              <br />
              <SlideText source={mock} />

              <Typography
                sx={{
                  fontStyle: "italic",
                  mt: 2
                }}
              >
                (See full of what I do) :
                <IconButton
                  onClick={() => { setDetailsOpen(!detailsOpen) }}
                >
                  {
                    detailsOpen ? (<KeyboardArrowUp />) : (<KeyboardArrowDown />)
                  }
                </IconButton>
              </Typography>

              <Collapse in={detailsOpen}>
                <List>
                  <ListItem>
                    I'm a Software Engineering Manager that likes to coach & empower people, and experienced handling teams & platforms with millions of traffic.
                  </ListItem>
                  <ListItem>
                    An experienced software engineer that likes to tinker from the database to application layer, and experienced in handling industry-level platform with millions of users.
                  </ListItem>
                  <ListItem>
                    A guitarist & music producer that like to experiment & combining multiple & cross music genres.
                  </ListItem>
                  <ListItem>
                    An energetic traveler.
                  </ListItem>
                </List>
              </Collapse>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  mt: 2
                }}
              >
                <div className="size-8">
                  <Link href="https://www.linkedin.com/in/agustinus-ardhito">
                    <Button>
                      <LinkedIn />
                    </Button>
                  </Link>
                </div>
                <div className="size-8 mx-2">
                  <Link href="mailto:agusdhito@gmail.com">
                    <Button>
                      <Mail />
                    </Button>
                  </Link>
                </div>
                <div className="size-8">
                  <Link href="https://github.com/AgusDhito">
                    <Button style={{ width: "100%" }}>
                      <GitHub />
                    </Button>
                  </Link>
                </div>
              </Box>
            </Box>
          </Box>
        </Container>

        <Container maxWidth="xl">
          {/*  Services I offer */}
          <div
            className="p-4 md:p-8 text-center"
            style={{
              backgroundColor: "#a55742"
            }}
          >
            <Typography variant="h5">
              Expertises & Services
            </Typography>

            <div className="mx-4 md:mx-32 p-4">
              <Typography>
                I'm a professional technologist that has extensive expertises & competencies right from discovering your business' problems & needs, to implementing web-based platform that meets start-up company standards. you can trust to start digitalizing your business.
              </Typography>
            </div>


            <div className="flex flex-col md:flex-row p-4 md:p-8">
              {/* for the card */}
              <div className="mb-6 md:mb-0">
                <Widgets fontSize="large" />
                <div className="p-4">
                  <Typography>
                    Consult for a better understanding about how technology can help solve your business' problems.
                  </Typography>
                </div>
              </div>

              <div className="mb-6 md:mb-0">
                <DeveloperModeOutlined fontSize="large" />
                <div className="p-4">
                  <Typography>
                    Implement solutions with web-based platform, along with creative & user-friendly display to engage your customers.
                  </Typography>
                </div>
              </div>

              <div className="mb-6 md:mb-0">
                <StorageOutlined fontSize="large" />

                <div className="p-4">
                  <Typography>
                    Implement the backbone system seamlessly, from database to infrastructure required, all fully-customizable & personalized only for your business characteristics.
                  </Typography>
                </div>

              </div>

              <div className="mb-6 md:mb-0">
                <AlarmOutlined fontSize="large" />

                <div className="p-4">
                  <Typography>
                    Full reliable support from initial development until it received by your user's browsers. And can go further more, as needed.
                  </Typography>
                </div>

              </div>
            </div>
          </div>

          <div
            style={{ margin: "32px" }}
          >
            <div>
              <Typography variant="h6" className="text-center">
                Tech stack
              </Typography>

              <div className="flex flex-wrap justify-center items-center mx-2 md:mx-16">
                {slidePictures.map((logo) => (
                  <div key={logo} className="p-2 logo">
                    <img
                      src={`/${logo}`}
                      alt={logo}
                      style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: isMobile ? '60px' : isTablet ? '90px' : '120px', // Reduced from 80/120/180px
                        maxHeight: isMobile ? '60px' : isTablet ? '90px' : '120px', // Added maxHeight constraint
                        objectFit: 'contain'
                      }}
                      className="logo"
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Working & Project Experience */}
          <div
            className="relative"
          >
            <div className="m-4">
              <Typography variant="h5"
                className="text-center"
              >
                Working experience
              </Typography>
            </div>

            {/* container cardnya */}
            {/* {WorkingExperiences.map((exp, index) => (
              <ExperienceBox
                imageSrc={exp.imageSrc}
                title={exp.title}
                description={exp.description}
              />
            ))} */}
            <Typography variant="body1" paragraph align="center" sx={{ mb: 6 }}>
              Scroll down to explore my professional journey throughout the years.
            </Typography>

            <Timeline experiences={experiencesData} />

          </div>
        </Container >

        <Box
          sx={{
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Box
            sx={{
              backgroundColor: "lightgray",
              margin: "16px",
              padding: "16px"
            }}
          >
            <Box
              sx={{
                marginBottom: "8px"
              }}
            >
              <Typography variant="h5">
                Interested in collaborating?
              </Typography>
            </Box>


            <Divider></Divider>

            <Box
              sx={{
                marginTop: "16px"
              }}
            >
              Download my resume here : &nbsp;
              <Button href="/cv.pdf" variant="contained">
                Download PDF
              </Button>
            </Box>

          </Box>

        </Box>
      </ThemeProvider >
    </>
  )

}

export default Landing