import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSignUp } from '@clerk/clerk-expo';
import { authStyles } from '@/assets/style/auth.styles';
import { COLORS } from '@/constants/colors';

type VerifyEmailProps = {
  emailAddress: string;
  onBackPress: () => void;
};

const VerifyEmail = ({ emailAddress, onBackPress }: VerifyEmailProps) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const handleVerifyPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const response = await signUp.attemptEmailAddressVerification({ code });
      if (response.status === "complete") {
        await setActive({ session: response.createdSessionId });
      }else {
        console.error(JSON.stringify(response, null, 2));
        Alert.alert("Error", "Invalid verification code");
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      Alert.alert("Error", (error as any).errors?.[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Container */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i3.png")}
              style={authStyles.image}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {emailAddress}</Text>

          <View style={authStyles.formContainer}>
            {/* Verification Code Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter verification code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleVerifyPress}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>{loading ? "Verifying..." : "Verify Email"}</Text>
            </TouchableOpacity>

            {/* Back to Sign Up */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={onBackPress}>
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>

  )
}

export default VerifyEmail