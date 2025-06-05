import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import i18n from "i18next";
import axios from "axios";
import Constants from "expo-constants";

interface RegisterFormProps {
  // onRegister?: (data: { name: string; email: string; password: string }) => void;
}

export default function RegisterForm(props: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const lang = useState<string | null>(i18n.language)[0];
  const apiUrl = Constants.expoConfig?.extra?.API_URL;

  const handleRegister = async () => {
    setError(null);

    if (!name.trim()) return setError("Введіть ім'я");
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))
      return setError("Некоректний email");
    if (password.length < 8)
      return setError("Пароль має бути мінімум 8 символів");

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/auth/registration`, {
        name,
        email,
        password,
        lang,
      });
      setLoading(false);
    } catch (err: any) {
      console.log("Registration error:", err);
      // setError(err);
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Ім'я"
        style={styles.input}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Пароль"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={styles.btn}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Зареєструватись</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f2f3f7",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  error: { color: "#e53935", marginBottom: 12 },
  btn: {
    backgroundColor: "#6C47FF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
