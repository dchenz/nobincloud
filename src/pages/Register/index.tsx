import {
  Alert,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import { registerAccount } from "../../api/registerAccount";
import { DEV_MODE, GOOGLE_CAPTCHA_SITE_KEY, PAGE_ROUTES } from "../../const";
import AuthContext from "../../context/AuthContext";

export default function RegisterPage(): JSX.Element {
  const navigate = useNavigate();
  const ctx = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [failedSignup, setFailedSignup] = useState<string>("");

  const canSubmit =
    email !== "" &&
    nickname.trim() !== "" &&
    password !== "" &&
    (captchaToken !== null || DEV_MODE);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) {
      return;
    }
    const newUser = { email, nickname, password };
    registerAccount(newUser, captchaToken ?? "")
      .then((result) => {
        if (result.success) {
          // Store the decrypted AES key on successful login
          // as this will be used to encrypt/decrypt files.
          ctx.setAccountKey(result.data);
          ctx.setLoggedIn(true);
          // Redirect to personal dashboard.
          navigate(PAGE_ROUTES.dashboard);
        } else {
          setFailedSignup(result.data);
        }
      })
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
              <Input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFailedSignup("");
                }}
                data-test-id="register-email"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Nickname</FormLabel>
              <Input
                onChange={(e) => setNickname(e.target.value)}
                data-test-id="register-nickname"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                data-test-id="register-password"
              />
              <FormHelperText>
                All account data is lost if you forget your password.
              </FormHelperText>
            </FormControl>
            <Flex gap={2}>
              {!DEV_MODE ? (
                <ReCAPTCHA
                  sitekey={GOOGLE_CAPTCHA_SITE_KEY}
                  onChange={setCaptchaToken}
                />
              ) : null}
              <Button type="submit" disabled={!canSubmit} width="100%">
                Create
              </Button>
            </Flex>
            {failedSignup ? (
              <Alert status="warning">{failedSignup}</Alert>
            ) : null}
          </Stack>
        </form>
        <Box mt={8}>
          <Text>
            Already have an account?{" "}
            <Link to="/login">
              <u>Login here.</u>
            </Link>
          </Text>
        </Box>
      </Box>
    </Center>
  );
}
