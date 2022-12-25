import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { ChevronRight } from "react-bootstrap-icons";

type PathViewerProps = {
  pathComponents: string[]
}

export default function PathViewer(props: PathViewerProps): JSX.Element {
  return (
    <HStack>
      {
        props.pathComponents.map((name, k) =>
          <React.Fragment key={k}>
            {
              k > 0 ? <IconButton aria-label={name} variant="link">
                <ChevronRight />
              </IconButton> : null
            }
            <Button variant="link">
              <Text fontSize="xl">
                {name}
              </Text>
            </Button>
          </React.Fragment>
        )
      }
    </HStack>
  );
}