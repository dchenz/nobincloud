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
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jsonFetch } from "../../api/helpers";
import { unlockAccount } from "../../api/loginAccount";
import { PAGE_ROUTES, SERVER_ROUTES } from "../../const";
import AuthContext from "../../context/AuthContext";
import { useLogout } from "../../misc/hooks";

const LockedOutForm: React.FC = () => {
  const logout = useLogout();
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [failedLogin, setFailedLogin] = useState<string>("");

  useEffect(() => {
    (async () => {
      const currentUserEmail = await jsonFetch<string>(SERVER_ROUTES.whoami);
      if (!currentUserEmail) {
        logout();
        return;
      }
      setEmail(currentUserEmail);
    })();
  }, []);

  if (!email) {
    return <></>;
  }

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    unlockAccount(email, password)
      .then((decryptedAccountKey) => {
        if (decryptedAccountKey) {
          // Store the decrypted AES key on successful login
          // as this will be used to encrypt/decrypt files.
          ctx.setAccountKey(decryptedAccountKey);
          ctx.setLoggedIn(true);
          // Redirect to personal dashboard.
          navigate(PAGE_ROUTES.dashboard);
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
                data-test-id="login-password"
              />
            </FormControl>
            <Button type="submit">Submit</Button>
            {failedLogin ? <Alert status="warning">{failedLogin}</Alert> : null}
          </Stack>
        </form>
        <Box mt={8}>
          <Text>
            Not {email}? Click{" "}
            <Link to={PAGE_ROUTES.login} onClick={logout}>
              <u>here</u>
            </Link>{" "}
            to logout.
          </Text>
        </Box>
      </Box>
    </Center>
  );
};

export default LockedOutForm;
