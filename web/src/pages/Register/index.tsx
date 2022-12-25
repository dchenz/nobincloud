import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack
} from "@chakra-ui/react";
import React, { useState } from "react";
import { registerAccount } from "../../api/registerAccount";

export default function RegisterPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUser = {email, nickname, password};
    registerAccount(newUser)
      .then(console.log)
      .catch(console.error);
  };
  return (
    <Center p={12}>
      <Box width="50%">
        <Heading mb={10}>Create an account</Heading>
        <form onSubmit={onFormSubmit}>
          <Stack gap={5}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Nickname</FormLabel>
              <Input onChange={(e) => setNickname(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type="password" onChange={(e) => setPassword(e.target.value)} />
              <FormHelperText>
                All account data is lost if you forget your password.
              </FormHelperText>
            </FormControl>
            <Button type="submit">Create</Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
}