import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#064829', dark: '#064829' }}
      headerImage={
        <Image
          source={require('@/assets/images/bench-buddy-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bench Buddy</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedText>
        {`Map all the benches nearby and save new locations. Select a bench pin to get directions, or tap Add a bench to save a new spot.`}
      </ThemedText>
      <ThemedView style={styles.mapPlaceholder}>
        <ThemedText type="subtitle">Map view placeholder</ThemedText>
        <ThemedText>
          {`This is where the bench map will appear once Google Maps or your location API is integrated.`}
        </ThemedText>
        <ThemedView style={styles.pinRow}>
          <ThemedText type="defaultSemiBold">Bench pin:</ThemedText>
          <ThemedText>{` Coordinate example: 51.5074, -0.1278`}</ThemedText>
        </ThemedView>
      </ThemedView>
      <Link href="/add-bench" style={styles.addButton}>
        <ThemedText type="subtitle">Add a bench</ThemedText>
      </Link>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Instructions</ThemedText>
        <ThemedText>
          {`Use the Benches tab to browse known bench locations. The Map tab is where new benches can be added.`}
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    alignSelf: 'center',
    marginTop: 24,
  },
  mapPlaceholder: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    gap: 8,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 24,
    backgroundColor: '#0CA86B',
  },
});
