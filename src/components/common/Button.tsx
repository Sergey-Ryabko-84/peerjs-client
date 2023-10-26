import { Button as ButtonMUI, ButtonProps, Typography } from "@mui/material";

interface Props extends ButtonProps {
  onClick?: () => void;
  testId?: string;
}
export const Button: React.FC<Props> = ({ children, onClick, type = "submit" }) => {
  return (
    <ButtonMUI variant="contained" type={type} onClick={onClick} fullWidth>
      <Typography>{children}</Typography>
    </ButtonMUI>
  );
};
