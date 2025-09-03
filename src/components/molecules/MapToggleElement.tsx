import React, { useState } from "react";
import { Box, IconButton, Typography, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface MapToggleElementProps {
  title: string;
  children: React.ReactNode;
}

const MapToggleElement: React.FC<MapToggleElementProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 1,
        padding: 1,
        minWidth: 240,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <IconButton size="small" onClick={handleToggle}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ mt: 1 }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default MapToggleElement;