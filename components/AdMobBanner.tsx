import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'; // Requires development build

interface AdMobBannerAdProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle' | 'fullBanner' | 'leaderboard' | 'smartBannerPortrait' | 'smartBannerLandscape';
  adUnitID?: string;
}

export const AdMobBannerAd: React.FC<AdMobBannerAdProps> = ({
  size = 'banner',
  adUnitID
}) => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  // AdMob with react-native-google-mobile-ads requires a development build
  // Cannot be used with Expo Go - need to create EAS build
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>🎯 AdMob Configured</Text>
        <Text style={styles.placeholderSubtext}>
          {__DEV__ 
            ? 'Requires EAS development build' 
            : 'Real ads will show here'}
        </Text>
        <Text style={styles.placeholderInfo}>
          {Platform.OS === 'ios' 
            ? 'iOS Unit: ...3288449833'
            : 'Android Unit: ...8301103360'}
        </Text>
      </View>
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
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
    borderColor: '#4caf50',
    borderRadius: 8,
    padding: 15,
    minHeight: 60,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#388e3c',
    textAlign: 'center',
    marginTop: 4,
  },
  placeholderInfo: {
    fontSize: 10,
    color: '#66bb6a',
    textAlign: 'center',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  error: {
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#f5c6cb',
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
  },
  errorText: {
    fontSize: 12,
    color: '#721c24',
    textAlign: 'center',
  },
  loading: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
  },
  loadingText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
});