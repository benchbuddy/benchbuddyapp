import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BenchListScreen() {
  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#064829', dark: '#064829' }} headerImage={<ThemedView style={styles.headerPlaceholder} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Saved Benches</ThemedText>
      </ThemedView>
      <ThemedText style={styles.description}>All your bench locations will appear here once the map is connected.</ThemedText>
      <ThemedView style={styles.listPlaceholder}>
        <ThemedText type="subtitle">Bench list placeholder</ThemedText>
        <ThemedText style={styles.description}>{`This tab will show nearby bench locations and details for each bench.`}</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerPlaceholder: {
    flex: 1,
    backgroundColor: '#07482A',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  listPlaceholder: {
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#07482A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    gap: 8,
  },
});