import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useUserStore } from "./userStore";

export const useHydrateStore = () => {
  const { setToken, setUser, setHydrated, hydrated } = useUserStore();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken) {
          useUserStore.setState({ token: JSON.parse(storedToken) });
        }
        if (storedUser) {
          useUserStore.setState({ user: JSON.parse(storedUser) });
        }
      } catch (error) {
        console.error("Error hydrating store:", error);
      } finally {
        setHydrated(true);
      }
    };

    if (!hydrated) {
      hydrate();
    }
  }, [hydrated, setHydrated, setToken, setUser]);
};
