import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { Link, router } from 'expo-router';
import Background from '@/auth/components/Background'
import Logo from '@/auth/components/Logo'
import Header from '@/auth/components/Header'
import Button from '@/auth/components/Button'
import TextInput from '@/auth/components/TextInput'
import { theme } from '@/auth/core/theme'
import { emailValidator } from '@/auth/helpers/emailValidator'
import { passwordValidator } from '@/auth/helpers/passwordValidator'
import { signInWithPassword } from '@/auth/services/AuthService';

export default function LoginScreen() {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    await signInWithPassword(email.value, password.value);
    router.replace('/');
  }

  return (
    <Background>
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <Link href="/reset-password" asChild>
            <TouchableOpacity>
              <Text style={styles.forgot}>Forgot your password?</Text>
            </TouchableOpacity>
        </Link>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <Link href="/register" asChild>
            <TouchableOpacity>
            <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
        </Link>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
