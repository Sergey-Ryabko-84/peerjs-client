import { TextareaAutosize, TextareaAutosizeProps, styled } from "@mui/material";

export const Textarea = styled((props: TextareaAutosizeProps) => (
  <TextareaAutosize minRows="2" {...props} />
))(
  () => `
  //   width: 86%;
  padding: 12px 36px 12px 12px;
  border-radius: 12px 12px 0 12px;

  &:focus {
    outline: 0;
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);
