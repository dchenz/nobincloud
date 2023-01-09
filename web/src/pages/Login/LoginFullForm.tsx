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
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAccount } from "../../api/loginAccount";
import { PageRoutes } from "../../const";
import AuthContext from "../../context/AuthContext";

const LoginFullForm: React.FC = () => {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [failedLogin, setFailedLogin] = useState<string>("");
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginAccount({ email, password })
      .then((decryptedAccountKey) => {
        if (decryptedAccountKey) {
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
        <Heading mb={10}>Login</Heading>
        <form onSubmit={onFormSubmit}>
          <Stack gap={8}>
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
            {failedLogin ? <Alert status="warning">{failedLogin}</Alert> : null}
          </Stack>
        </form>
        <Box mt={8}>
          <Text>
            Don&apos;t have an account?{" "}
            <Link to="/register">
              <u>Register here.</u>
            </Link>
          </Text>
          <br />
          <Text>
            After logging in, do not refresh the page or navigate via the
            address bar as you will be forced to re-enter your password.
            Currently, your encryption keys are never put in browser storage
            (in-memory) for security reasons.
          </Text>
        </Box>
      </Box>
    </Center>
  );
};

export default LoginFullForm;
