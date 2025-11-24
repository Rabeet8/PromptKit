import { DeveloperCardProps } from "@/types";
import React from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Github,
  Globe,
  Linkedin,
  Twitter,
} from "lucide-react-native";

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
      onPress={() => onPress?.(developer.id)}
    >
      <Image source={developer.image} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{developer.name}</Text>
        <Text style={styles.title}>{developer.title}</Text>

        <View style={styles.socialRow}>
          {developer.socials.github && (
            <TouchableOpacity
              onPress={() => Linking.openURL(developer.socials.github!)}
              style={styles.iconButton}
            >
              <Github size={20} color="#2D2A26" strokeWidth={2.2} />
            </TouchableOpacity>
          )}

          {developer.socials.linkedin && (
            <TouchableOpacity
              onPress={() => Linking.openURL(developer.socials.linkedin!)}
              style={styles.iconButton}
            >
              <Linkedin size={20} color="#0A66C2" strokeWidth={2.2} />
            </TouchableOpacity>
          )}

          {developer.socials.twitter && (
            <TouchableOpacity
              onPress={() => Linking.openURL(developer.socials.twitter!)}
              style={styles.iconButton}
            >
              <Twitter size={20} color="#1DA1F2" strokeWidth={2.2} />
            </TouchableOpacity>
          )}

          {developer.socials.website && (
            <TouchableOpacity
              onPress={() => Linking.openURL(developer.socials.website!)}
              style={styles.iconButton}
            >
              <Globe size={20} color="#2D2A26" strokeWidth={2.2} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default DeveloperCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,

    borderWidth: 1,
    borderColor: "#ECE7E1",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,

    marginBottom: 18,
  },

  image: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: "#F2EEE8",
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
  },

  title: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6C6762",
    marginTop: 2,
  },

  socialRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 12,
  },

  iconButton: {
    padding: 8,
    backgroundColor: "#F5F2EE",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
