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
import { PAGE_ROUTES } from "../../const";
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
                data-test-id="login-email"
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
                data-test-id="login-password"
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
        </Box>
      </Box>
    </Center>
  );
};

export default LoginFullForm;
