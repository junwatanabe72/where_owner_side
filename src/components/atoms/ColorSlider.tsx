import React from "react";
import { Box, Typography } from "@mui/material";

interface ColorSliderProps {
  background: string;
  contents: string[];
}

const ColorSlider: React.FC<ColorSliderProps> = ({ background, contents }) => {
  return (
    <Box sx={{ width: 200 }}>
      <Box
        sx={{
          height: 20,
          background,
          borderRadius: 1,
          marginBottom: 1,
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {contents.map((content, index) => (
          <Typography key={index} variant="caption" sx={{ fontSize: 10 }}>
            {content}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default ColorSlider;