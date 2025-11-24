import { ChevronDown, ChevronUp } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { ModelDropdownProps } from "../../types";

const ModelDropdown: React.FC<ModelDropdownProps> = ({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  loading = false,
  maxMenuHeight = 180,
}) => {
  return (
    <View style={styles.card}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Dropdown Button */}
      <Pressable
        onPress={onToggle}
        disabled={loading}
        style={({ pressed }) => [
          styles.dropdown,
          { opacity: pressed ? 0.95 : 1 },
        ]}
      >
        <Text
          style={[
            styles.dropdownText,
            loading && styles.disabledText,
          ]}
        >
          {loading ? "Loading..." : value}
        </Text>

        {isOpen ? (
          <ChevronUp size={22} color="#2D2A26" strokeWidth={2.2} />
        ) : (
          <ChevronDown size={22} color="#2D2A26" strokeWidth={2.2} />
        )}
      </Pressable>

      {/* Dropdown Menu */}
      {isOpen && (
        <View style={styles.dropdownMenu}>
          <ScrollView
            style={{ maxHeight: maxMenuHeight }}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {options.map((opt, i) => (
              <Pressable
                key={`${opt}-${i}`}
                onPress={() => onSelect(opt)}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  pressed && styles.dropdownItemPressed,
                ]}
              >
                <Text style={styles.dropdownItemText}>{opt}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default ModelDropdown;

const styles = StyleSheet.create({
  /** Card container */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  /** Label */
  label: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#2D2A26",
    marginBottom: 12,
  },

  /** Dropdown button */
  dropdown: {
    backgroundColor: "#F5F2EE",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 14,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#2D2A26",
  },

  disabledText: {
    color: "#A19B93",
  },

  /** Dropdown Menu */
  dropdownMenu: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 6,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  /** Dropdown Items */
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  dropdownItemPressed: {
    backgroundColor: "#F1EFEA",
  },

  dropdownItemText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: "#2D2A26",
  },
});
