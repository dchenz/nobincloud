import {
  Alert,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { unlockAccount } from "../../api/loginAccount";
import { PageRoutes } from "../../const";
import AuthContext from "../../context/AuthContext";
import { decrypt } from "../../crypto/cipher";

const LockedOutForm: React.FC = () => {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [failedLogin, setFailedLogin] = useState<string>("");
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    unlockAccount(password)
      .then(async (result) => {
        if (result.success) {
          const decryptedAccountKey = await decrypt(
            result.data.accountKey,
            result.data.passwordKey
          );
          if (!decryptedAccountKey) {
            setFailedLogin("Could not retrieve your keys.");
            throw new Error("Could not retrieve your keys.");
          }
          // Store the decrypted AES key on successful login
          // as this will be used to encrypt/decrypt files.
          ctx.setAccountKey(decryptedAccountKey);
          ctx.setLoggedIn(true);
          // Redirect to personal dashboard.
          navigate(PageRoutes.dashboard);
        } else {
          setFailedLogin("Incorrect email or password.");
        }
      })
      .catch(console.error);
  };
  return (
    <Center p={12}>
      <Box width="50%">
        <Heading mb={10}>Re-enter password</Heading>
        <form onSubmit={onFormSubmit}>
          <Stack gap={8}>
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
            {failedLogin ? <Alert status="warning">{failedLogin}</Alert> : null}
          </Stack>
        </form>
      </Box>
    </Center>
  );
};

export default LockedOutForm;
