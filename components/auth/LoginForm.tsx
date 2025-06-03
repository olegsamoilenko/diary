import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";
import { useNavigation } from "@react-navigation/native";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = Constants.expoConfig?.extra?.API_URL;

  const handleLogin = async () => {
    setError(null);
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))
      return setError("Некоректний email");
    if (!password) return setError("Введіть пароль");

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/auth/login`, { email, password });
      const { accessToken } = res.data;

      await SecureStore.setItemAsync("token", accessToken);
      setLoading(false);

      await Updates.reloadAsync();
    } catch (err) {
      setError("Помилка входу");
      setLoading(false);
    }
  };

  return (
    <View>
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
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Увійти</Text>
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
