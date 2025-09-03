import React from "react";
import { Button, ButtonProps } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  text?: string;
  onClick: () => void;
  children?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, onClick, children, ...props }) => {
  return (
    <Button 
      onClick={onClick} 
      size="medium" 
      sx={{
        px: 3,
        py: 1.5,
        fontSize: '0.95rem',
        fontWeight: 600,
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4,
        }
      }}
      {...props}
    >
      {children || text}
    </Button>
  );
};

export default CustomButton;