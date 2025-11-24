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

  // Get AdMob ad unit ID
  const getAdUnitID = () => {
    if (adUnitID) return adUnitID;

    // Test ad unit IDs for development
    if (__DEV__) {
      return Platform.OS === 'ios' ? TestIds.BANNER : TestIds.BANNER;
    }

    // Production ad unit IDs
    return Platform.OS === 'ios'
      ? 'ca-app-pub-1098479655653377/3288449833' // iOS banner ad unit ID
      : 'ca-app-pub-1098479655653377/8301103360'; // Android banner ad unit ID
  };

  // Get banner size
  const getBannerSize = () => {
    switch (size) {
      case 'largeBanner':
        return BannerAdSize.LARGE_BANNER;
      case 'mediumRectangle':
        return BannerAdSize.MEDIUM_RECTANGLE;
      case 'fullBanner':
        return BannerAdSize.FULL_BANNER;
      case 'leaderboard':
        return BannerAdSize.LEADERBOARD;
      case 'smartBannerPortrait':
        return BannerAdSize.ANCHORED_ADAPTIVE_BANNER;
      case 'smartBannerLandscape':
        return BannerAdSize.ANCHORED_ADAPTIVE_BANNER;
      case 'banner':
      default:
        return BannerAdSize.BANNER;
    }
  };

  if (adError) {
    return (
      <View style={[styles.container, styles.error]}>
        <Text style={styles.errorText}>Ad unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={getAdUnitID()}
        size={getBannerSize()}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          setIsAdLoaded(true);
          setAdError(null);
          console.log('AdMob banner loaded successfully');
        }}
        onAdFailedToLoad={(error) => {
          setIsAdLoaded(false);
          setAdError(error.message || 'Ad failed to load');
          console.warn('AdMob banner failed to load:', error);
        }}
      />
      {!isAdLoaded && !adError && (
        <View style={[styles.container, styles.loading]}>
          <Text style={styles.loadingText}>Loading ad...</Text>
        </View>
      )}
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