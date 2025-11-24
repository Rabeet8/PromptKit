import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface AdMobBannerAdProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle' | 'fullBanner' | 'leaderboard' | 'smartBannerPortrait' | 'smartBannerLandscape';
  adUnitID?: string;
}

export const AdMobBannerAd: React.FC<AdMobBannerAdProps> = ({
  size = 'banner',
  adUnitID
}) => {
  // For now, just show a placeholder until AdMob is properly configured
  return (
    <View style={[styles.container, styles.placeholder]}>
      <Text style={styles.placeholderText}>Advertisement</Text>
      <Text style={styles.placeholderSubtext}>Your ad here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  placeholder: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 15,
    minHeight: 50,
    width: '100%',
    maxWidth: 320,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 4,
  },
});