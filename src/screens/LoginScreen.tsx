import { memo, useCallback, useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import createStyles from "../style/LoginScreen.style";
const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const style = useMemo(() => createStyles(), []);

  const handleLogin = useCallback(() => {
    // Implement your login logic here
    console.log("Logging in with:", { username, password });
  }, [username, password]);

  return (
    <View style={style.container}>
      <Text>LoginScreen</Text>
      <View style={{ marginTop: 20, padding: 10, gap: 12 }}>
        <TextInput
          style={style.input}
          placeholder="username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={style.input}
          secureTextEntry
          placeholder="password"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={{}}>
        <TouchableOpacity onPress={handleLogin} style={style.button}>
          <Text style={style.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(LoginScreen);
