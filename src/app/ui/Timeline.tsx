"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Container, Paper, useTheme, useMediaQuery } from '@mui/material';
import { useInView } from 'react-intersection-observer';

interface Experience {
  time: string;
  title: string;
  description: string;
}

interface TimelineProps {
  experiences: Experience[];
}

const Timeline: React.FC<TimelineProps> = ({ experiences }) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isEven = (index: number) => {
    if (isMobile) return true; // On mobile, always show items
    return isEven(index);
  };

  // Track scroll position with improved calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      // Get timeline element dimensions
      const timelineRect = timelineRef.current.getBoundingClientRect();

      // Get document dimensions
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      // Calculate distance from top of timeline to current scroll position
      const distanceFromTop = timelineRect.top + scrollTop;
      const timelineVisibleLength = scrollTop + windowHeight - distanceFromTop;
      const timelineHeight = timelineRef.current.offsetHeight;

      // Calculate primary progress based on timeline visibility
      let calculatedProgress = Math.min(1, Math.max(0, timelineVisibleLength / timelineHeight));

      // Check if we're near the bottom of the document
      const bottomThreshold = 100; // pixels from bottom
      const isAtBottom = scrollTop + windowHeight >= documentHeight - bottomThreshold;

      // If we're at the bottom of the document, force progress to 1
      if (isAtBottom) {
        calculatedProgress = 1;
        setIsNearBottom(true);
      } else {
        setIsNearBottom(false);
      }

      // Additional check: if timeline is fully visible in viewport
      if (timelineRect.bottom <= windowHeight) {
        calculatedProgress = 1;
      }

      // Apply the calculated progress
      setProgress(calculatedProgress);

      // Debug information (you can remove this in production)
      console.log({
        progress: calculatedProgress,
        timelineHeight,
        timelineVisibleLength,
        isAtBottom,
        scrollPercentage: (scrollTop / (documentHeight - windowHeight)).toFixed(2)
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Also listen for resize events to recalculate
    window.addEventListener('resize', handleScroll);
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Calculate visibility for each timeline item
  const getItemVisibility = (index: number, totalItems: number) => {
    // If we're at the bottom of the page, show everything
    if (isNearBottom) return 1;

    // Otherwise calculate based on position in the timeline
    const sectionLength = 1 / totalItems;
    const itemThreshold = index * sectionLength;

    // Scale progress to ensure items appear earlier
    const scaledProgress = progress * 1.25; // Show items slightly ahead of scroll

    // Calculate visibility
    return Math.min(1, Math.max(0, (scaledProgress - itemThreshold) / sectionLength));
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box
        ref={timelineRef}
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {/* Timeline vertical line with animation */}
        <Box sx={{
          position: 'absolute',
          left: { xs: '20px', md: '50%' },
          height: `${progress * 100}%`,
          width: '4px',
          backgroundColor: 'primary.main',
          transform: { xs: 'none', md: 'translateX(-2px)' },
          transition: 'height 0.1s ease-out',
          zIndex: 0,
        }} />

        {experiences.map((experience, index) => (
          <TimelineItem
            key={index}
            experience={experience}
            index={index}
            totalItems={experiences.length}
            visibility={getItemVisibility(index, experiences.length)}
          />
        ))}

        {/* Invisible spacer to ensure we can scroll past the timeline */}
        {/* <Box sx={{ height: '10vh' }} /> */}
      </Box>
    </Container>
  );
}

function TimelineItem({
  experience,
  index,
  totalItems,
  visibility
}: {
  experience: Experience;
  index: number;
  totalItems: number;
  visibility: number;
}) {
  // Use React Intersection Observer for additional visibility detection
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Combine scroll-based visibility with intersection detection
  const effectiveVisibility = inView ? Math.max(0.3, visibility) : visibility;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isEven = (index: number) => {
    if (isMobile) return true; // On mobile, always show items
    return index % 2 === 0;
  };

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: isEven(index) ? 'row' : 'row-reverse' },
        mb: 8, // Increased spacing between items
        opacity: effectiveVisibility,
        transform: `translateY(${(1 - effectiveVisibility) * 20}px)`,
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        position: 'relative',
        justifyContent: 'space-between',
      }}
    >
      {/* Time period */}
      <Box
        sx={{
          width: { xs: 'auto', md: '42%' },
          textAlign: { xs: 'left', md: isEven(index) ? 'right' : 'left' },
          pr: { xs: 0, md: isEven(index) ? 3 : 0 },
          pl: { xs: 0, md: isEven(index) ? 0 : 3 },
          ml: { xs: '40px', md: 0 },
          position: 'relative',
        }}
      >
        <Typography variant="h6" color="primary"
          sx={{
            "position": "relative",
            [isEven(index) ? 'right' : 'left']: { xs: '-24px', md: '6px' },
          }}
        >
          {experience.time}
        </Typography>

        {/* Circle on timeline with animation */}
        <Box
          sx={{
            position: 'absolute',
            top: '8px',
            [isEven(index) ? 'right' : 'left']: { xs: 'auto', md: '-12px' },
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: 'background.paper',
            border: '3px solid',
            borderColor: 'primary.main',
            zIndex: 1,
            transform: `scale(${0.5 + effectiveVisibility * 0.5})`,
            opacity: effectiveVisibility,
            transition: 'transform 0.6s ease, opacity 0.6s ease',
          }}
        />
      </Box>

      {/* Content */}
      <Paper
        elevation={3}
        sx={{
          width: { xs: 'calc(100% - 40px)', md: '42%' },
          ml: { xs: '40px', md: 0 },
          p: 3,
          borderRadius: 2,
          backgroundColor: effectiveVisibility > 0.8 ? 'action.hover' : 'background.paper',
          transition: 'background-color 0.6s ease',
          transform: {
            xs: 'none',
            md: `translateX(${(1 - effectiveVisibility) * (isEven(index) ? -20 : 20)}px)`
          },
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {experience.title}
        </Typography>
        <Typography variant="body1">
          {experience.description}
        </Typography>
      </Paper>
    </Box>
  );
}

export default Timeline;