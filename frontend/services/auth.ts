import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the token payload
    const isExpired = payload.exp * 1000 < Date.now(); // Check if the token is expired
    return !isExpired;
  } catch (error) {
    return false; // Return false if the token is invalid
  }
};


export const getUserDetails = async (): Promise<any | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the token payload
    const is_fono = payload.is_fono; // Get is_fono flag

    const endpoint = is_fono ? "/auth/fono/details" : "/auth/patient/details";
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const data = await response.json();
    return { ...data, is_fono };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};


export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await isAuthenticated();
        if (!auth) return;

        const userDetails = await getUserDetails();
        if (userDetails?.is_fono) {
          router.push("../(tabs)/home");    //MUDAR ROTA
        } else {
          router.push("../(tabs)/home2");    //MUDAR ROTA
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      }
    };

    checkAuth();
  }, [router]);
};


export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem("token"); // Remove token
};