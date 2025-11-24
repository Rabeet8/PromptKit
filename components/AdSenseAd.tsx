import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface AdSenseAdProps {
  width?: number;
  height?: number;
  adSlot: string;
  adClient: string;
  adFormat?: string;
}

export const AdSenseAd: React.FC<AdSenseAdProps> = ({
  width = 320,
  height = 100,
  adSlot,
  adClient,
  adFormat = 'auto'
}) => {
  console.log('AdSenseAd props:', { width, height, adSlot, adClient, adFormat });
  // Test HTML to verify WebView is working
  const testHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f0f0f0; }
        .test-ad { width: ${width}px; height: ${height}px; border: 2px solid #007AFF; background: #e6f2ff; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
        .test-text { color: #007AFF; font-size: 14px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="test-ad">
        <div class="test-text">
          <strong>Test Ad Space</strong><br>
          ${width}x${height}<br>
          Client: ${adClient}<br>
          Slot: ${adSlot}
        </div>
      </div>
    </body>
    </html>
  `;

  // Use test content for now to verify WebView works
  const htmlContent = testHtmlContent;

  return (
    <View style={[styles.container, { width, height }]}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        onLoadStart={() => console.log('Ad WebView loading started')}
        onLoadEnd={() => console.log('Ad WebView loading finished')}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('Ad WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('Ad WebView HTTP error: ', nativeEvent);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  webview: {
    backgroundColor: 'transparent',
  },
});