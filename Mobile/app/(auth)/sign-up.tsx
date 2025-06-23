import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, TextInput, TouchableOpacity } from "react-native";
import React, { use, useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {authStyles} from '../../assets/style/auth.styles'
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import VerifyEmail from "./verify-email";

const SignUp = () => {
  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handeleSignUpPress = async () => {
    if (!emailAddress || !password)
      return Alert.alert("Error", "Please enter email and password");
    if (password.length < 6)
      return Alert.alert("Error", "Password must be at least 6 characters");
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (error) {
      Alert.alert("Error", (error as any).errors?.[0]?.message || "sign Up failed");
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return <VerifyEmail emailAddress={emailAddress} onBackPress={() => setPendingVerification(false)} />
  }

  return (
    <View style={authStyles.container}> 
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      style={authStyles.keyboardView}
      >
        <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        showsHorizontalScrollIndicator={false}
        >
          {/* Image Container */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i2.png")}
              style={authStyles.image}
              resizeMode="contain"
            />
          </View>
          <Text style={authStyles.title}>Create Account</Text>
          <View style={authStyles.formContainer}>
            {/* Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter email"
                placeholderTextColor={COLORS.textLight}
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>


            {/* Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handeleSignUpPress}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={() => router.back()}>
              <Text style={authStyles.linkText}>
                Already have an account? <Text style={authStyles.link}>Sign In</Text>
              </Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;
