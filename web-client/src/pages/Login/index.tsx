import {
  Alert,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { loginAccount } from "../../api/loginAccount";
import AuthContext from "../../context/AuthContext";
import { decrypt } from "../../crypto/cipher";

export default function LoginPage(): JSX.Element {
  const ctx = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [failedLogin, setFailedLogin] = useState<string>("");
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginAccount({ email, password })
      .then(async (result) => {
        if (result.success) {
          const dataKey = await decrypt(result.data.wrappedKey, result.data.masterKey);
          if (!dataKey) {
            setFailedLogin("Could not retrieve your keys.");
            throw new Error("Could not retrieve your keys.");
          }
          // Store the master key on successful login.
          // And store the decrypted AES data key.
          ctx.setMasterKey(result.data.masterKey);
          ctx.setDataKey(dataKey);
          ctx.setLoggedIn(ctx.masterKey !== null && ctx.dataKey !== null);
        } else {
          setFailedLogin("Incorrect email or password.");
        }
      })
      .catch(console.error);
  };
  return (
    <Center p={12}>
      <Box width="50%">
        <Heading mb={10}>Login</Heading>
        <form onSubmit={onFormSubmit}>
          <Stack gap={5}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                required
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFailedLogin("");
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                required
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFailedLogin("");
                }}
              />
            </FormControl>
            <Button type="submit">Submit</Button>
            {
              failedLogin ?
                <Alert status="warning">
                  {failedLogin}
                </Alert> : null
            }
          </Stack>
        </form>
      </Box>
    </Center>
  );
}