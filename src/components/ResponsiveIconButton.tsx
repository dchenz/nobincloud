import { Button, IconButton } from "@chakra-ui/react";
import React from "react";
import { useMobileView } from "../misc/hooks";

type ResponsiveIconButtonProps = {
  icon: JSX.Element;
  ariaLabel: string;
  text: string;
  onClick?: () => void;
  title?: string;
};

const ResponsiveIconButton = React.forwardRef<
  unknown,
  ResponsiveIconButtonProps
>(({ icon, ariaLabel, text, onClick, title }, ref) => {
  const isMobileView = useMobileView();
  if (isMobileView) {
    return (
      <IconButton
        ref={ref as React.Ref<HTMLButtonElement>}
        aria-label={ariaLabel}
        onClick={onClick}
        icon={icon}
        title={title}
        data-test-id={ariaLabel}
      />
    );
  }
  return (
    <Button
      ref={ref as React.Ref<HTMLButtonElement>}
      aria-label={ariaLabel}
      onClick={onClick}
      leftIcon={icon}
      title={title}
      data-test-id={ariaLabel}
    >
      {text}
    </Button>
  );
});

ResponsiveIconButton.displayName = "ResponsiveIconButton";

export default ResponsiveIconButton;
