import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Linking, Platform, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

const MapView: any = require('react-native-maps').default;
const Marker: any = require('react-native-maps').Marker;

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBenches } from '@/hooks/useBenches';
import type { Bench } from '@/models/bench';
import { getAppleMapsUrl, getGoogleMapsUrl } from '@/services/bench-service';
import { Link } from 'expo-router';

type BenchFeatures = {
  backrest: boolean;
  armrest: boolean;
  picnic: boolean;
  memorial: boolean;
};

type OsmBench = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  features: BenchFeatures;
};

export default function HomeScreen() {
  const { benches, loading, error } = useBenches();
  const [osmBenches, setOsmBenches] = useState<OsmBench[]>([]);
  const [osmLoading, setOsmLoading] = useState(true);
  const [osmError, setOsmError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: 51.5074,
    longitude: -0.1278,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const mapRef = useRef<any>(null);
  const [selectedBench, setSelectedBench] = useState<Bench | OsmBench | null>(null);
  const [showDirectionsOptions, setShowDirectionsOptions] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied. Showing nearby UK benches by default.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const nextRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setRegion(nextRegion);
      if (mapRef.current?.animateToRegion) {
        mapRef.current.animateToRegion(nextRegion, 500);
      }
    })();
  }, []);

  const searchCity = async () => {
    if (!searchText.trim()) {
      setSearchError('Enter a UK city or place name to search.');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        `${searchText}, UK`
      )}&format=json&limit=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BenchBuddy/1.0 (expo)',
        },
      });
      const results = await response.json();

      if (!results.length) {
        setSearchError('City not found. Try another UK place.');
        return;
      }

      const location = results[0];
      const nextRegion = {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setRegion(nextRegion);
      if (mapRef.current?.animateToRegion) {
        mapRef.current.animateToRegion(nextRegion, 500);
      }
    } catch (err) {
      console.warn('Search failed', err);
      setSearchError('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const reportBench = () => {
    if (!selectedBench) {
      return;
    }

    Linking.openURL('https://www.london.gov.uk/what-we-do/environment/parks-greenspaces/report-problem-park-or-green-space').catch(() => {
      Alert.alert('Unable to open council report page.');
    });
  };

  const renderFeature = (label: string, active: boolean) => (
    <ThemedText style={styles.featureText}>
      {active ? '✅' : '⬜'} {label}
    </ThemedText>
  );

  useEffect(() => {
    const query = `[
      out:json][timeout:25];
      (
        node["amenity"="bench"](around:2500,${region.latitude},${region.longitude});
      );
      out body;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const benches: OsmBench[] = data.elements
          .filter((element: any) => element.type === 'node' && element.lat && element.lon)
          .map((element: any) => {
            const tags = element.tags || {};
            return {
              id: element.id,
              name: tags.name || 'Bench',
              latitude: element.lat,
              longitude: element.lon,
              features: {
                backrest: tags.backrest === 'yes' || tags.seating === 'bench_with_backrest',
                armrest: tags.armrest === 'yes',
                picnic:
                  tags.picnic === 'yes' || tags.bench === 'picnic_table' || tags.leisure === 'picnic_table',
                memorial:
                  tags.memorial === 'yes' || tags.historic === 'memorial' || !!tags['memorial:type'],
              },
            };
          });

        setOsmBenches(benches);
        setOsmError(null);
      })
      .catch(err => {
        console.warn('OSM fetch failed', err);
        setOsmError('Unable to load benches from OpenStreetMap.');
      })
      .finally(() => setOsmLoading(false));
  }, [region.latitude, region.longitude]);

  const openDirections = (url?: string) => {
    if (!url) {
      return;
    }

    Linking.openURL(url).catch(() => {
      console.warn('Unable to open navigation URL.');
    });
    setShowDirectionsOptions(false);
  };

  const handleShowDirections = () => {
    if (!selectedBench) {
      return;
    }

    setShowDirectionsOptions(true);
  };

  const getSelectedCoordinates = () => {
    if (!selectedBench) {
      return undefined;
    }

    if ('coordinates' in selectedBench) {
      return selectedBench.coordinates;
    }

    return {
      latitude: selectedBench.latitude,
      longitude: selectedBench.longitude,
    };
  };

  const getGoogleMaps = () => {
    const coords = getSelectedCoordinates();
    return coords ? getGoogleMapsUrl(coords.latitude, coords.longitude) : undefined;
  };

  const getAppleMaps = () => {
    const coords = getSelectedCoordinates();
    return coords ? getAppleMapsUrl(coords.latitude, coords.longitude) : undefined;
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image
          source={require('@/assets/images/bench-buddy-logo.png')}
          style={styles.logo}
        />

        <ThemedView style={styles.mapPlaceholder}>
          <ThemedText type="subtitle">Map view</ThemedText>
          <ThemedText>
            {`Tap a bench marker on the map to explore nearby public benches from OpenStreetMap.`}
          </ThemedText>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search a UK city or neighbourhood"
            placeholderTextColor="rgba(255,255,255,0.65)"
            returnKeyType="search"
            onSubmitEditing={searchCity}
          />
          <Pressable style={styles.searchButton} onPress={searchCity}>
            <ThemedText type="subtitle">{searchLoading ? 'Searching…' : 'Search city'}</ThemedText>
          </Pressable>
          {searchError ? <ThemedText>{searchError}</ThemedText> : null}
          {locationError ? <ThemedText>{locationError}</ThemedText> : null}

          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            onRegionChangeComplete={(nextRegion: any) => setRegion(nextRegion)}
            showsUserLocation
          >
            {osmBenches.map(bench => (
              <Marker
                key={bench.id}
                coordinate={{ latitude: bench.latitude, longitude: bench.longitude }}
                title={bench.name}
                description="Public bench"
                onPress={() => {
                  setSelectedBench(bench);
                }}
              />
            ))}
          </MapView>

          {osmLoading ? (
            <ThemedText>Loading OpenStreetMap benches...</ThemedText>
          ) : osmError ? (
            <ThemedText>{osmError}</ThemedText>
          ) : osmBenches.length === 0 ? (
            <ThemedText>No public benches found in this area.</ThemedText>
          ) : (
            <ThemedText>{`${osmBenches.length} benches loaded from OpenStreetMap.`}</ThemedText>
          )}
        </ThemedView>

        {selectedBench ? (
          <ThemedView style={styles.selectedCard}>
            <ThemedText type="subtitle">Selected bench</ThemedText>
            <ThemedText>{selectedBench.name}</ThemedText>
            <ThemedText>{selectedBench.description}</ThemedText>
            {(() => {
              const coords = getSelectedCoordinates();
              if (!coords) {
                return <ThemedText>Coordinates unavailable.</ThemedText>;
              }

              return (
                <ThemedText>{`Coordinates: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`}</ThemedText>
              );
            })()}
            {'features' in selectedBench ? (
              <ThemedView style={styles.featureCard}>
                <ThemedText type="subtitle">Bench type</ThemedText>
                <ThemedText style={styles.featureTypeLabel}>
                  {selectedBench.features.picnic
                    ? 'Picnic bench'
                    : selectedBench.features.memorial
                    ? 'Memorial bench'
                    : 'Standard bench'}
                </ThemedText>
                <ThemedView style={styles.featureRow}>
                  {renderFeature('Back rest', selectedBench.features.backrest)}
                  {renderFeature('Arm rest', selectedBench.features.armrest)}
                  {renderFeature('Picnic', selectedBench.features.picnic)}
                  {renderFeature('Memorial', selectedBench.features.memorial)}
                </ThemedView>
              </ThemedView>
            ) : (
              <ThemedText>Bench feature details unavailable for this item.</ThemedText>
            )}
          {showDirectionsOptions ? (
            <ThemedView style={styles.directionOptions}>
              {Platform.OS === 'ios' ? (
                <>
                  <Pressable
                    style={styles.directionButton}
                    onPress={() => openDirections(getGoogleMaps())}
                  >
                    <ThemedText type="subtitle">Open in Google Maps</ThemedText>
                  </Pressable>
                  <Pressable
                    style={styles.directionButtonAlt}
                    onPress={() => openDirections(getAppleMaps())}
                  >
                    <ThemedText type="subtitle">Open in Apple Maps</ThemedText>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  style={styles.directionButton}
                  onPress={() => openDirections(getGoogleMaps())}
                >
                  <ThemedText type="subtitle">Open in Google Maps</ThemedText>
                </Pressable>
              )}
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowDirectionsOptions(false)}
              >
                <ThemedText type="subtitle">Cancel</ThemedText>
              </Pressable>
            </ThemedView>
          ) : (
            <Pressable style={styles.navigateButton} onPress={handleShowDirections}>
              <ThemedText type="subtitle">Open directions</ThemedText>
            </Pressable>
          )}
          <ThemedView style={styles.actionRow}>
            <Pressable
              style={styles.actionButton}
              onPress={() => Alert.alert('Rate this bench', 'Rating feature coming soon.')}
            >
              <ThemedText type="subtitle">Rate bench</ThemedText>
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={() => Alert.alert('Add photos', 'Photo sharing coming soon.')}
            >
              <ThemedText type="subtitle">Share photos</ThemedText>
            </Pressable>
          </ThemedView>
          <Pressable style={styles.reportButton} onPress={reportBench}>
            <ThemedText type="subtitle">Report broken bench</ThemedText>
          </Pressable>
          <Link href="/add-bench" style={styles.addButton}>
            <ThemedText type="subtitle">Add a bench</ThemedText>
          </Link>
          </ThemedView>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  mapPlaceholder: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: 16,
    gap: 12,
    backgroundColor: '#07482A',
  },
  map: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
  },
  searchInput: {
    marginTop: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  searchButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#FEBD59',
  },
  featureCard: {
    marginTop: 16,
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  featureTypeLabel: {
    marginTop: 6,
    fontSize: 14,
    color: '#FEBD59',
    fontWeight: '700',
  },
  featureRow: {
    marginTop: 12,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    minWidth: 140,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#064829',
    alignItems: 'center',
  },
  reportButton: {
    marginTop: 14,
    alignSelf: 'stretch',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#B02A37',
    alignItems: 'center',
  },
  logo: {
    height: 120,
    width: 240,
    alignSelf: 'center',
    marginBottom: 12,
  },
  benchButton: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#0CA76B',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginTop: 8,
  },
  selectedCard: {
    borderRadius: 20,
    padding: 18,
    gap: 12,
    backgroundColor: '#0CA76B',
  },
  navigateButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#FEBD59',
  },
  directionOptions: {
    alignSelf: 'stretch',
    borderRadius: 20,
    padding: 18,
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  directionHint: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.85)',
  },
  directionButton: {
    alignSelf: 'stretch',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#FEBD59',
    alignItems: 'center',
  },
  directionButtonAlt: {
    alignSelf: 'stretch',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#064829',
    alignItems: 'center',
  },
  cancelButton: {
    alignSelf: 'stretch',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
  },
  addButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#064829',
  },
});