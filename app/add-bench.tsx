import { Link } from 'expo-router';
import { useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AddBenchScreen() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (name.trim().length === 0 || location.trim().length === 0) {
      return;
    }
    setSaved(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedText type="title">Add a bench</ThemedText>
        <ThemedText style={styles.paragraph}>
          {`Enter the bench name, location, and notes here. Later you can replace location input with an API lookup for coordinates or what3words.`}
        </ThemedText>

        <View style={styles.field}>
          <ThemedText type="subtitle">Bench name</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="E.g. Riverside Bench"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.field}>
          <ThemedText type="subtitle">Location</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="E.g. 51.5074, -0.1278 or what3words"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.field}>
          <ThemedText type="subtitle">Notes</ThemedText>
          <TextInput
            style={[styles.input, styles.notes]}
            placeholder="E.g. shady spot, near the river"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <View style={styles.buttonRow}>
          <Button title="Save bench" onPress={handleSave} color="#0CA86B" />
        </View>

        {saved ? (
          <ThemedView style={styles.savedBox}>
            <ThemedText type="subtitle">Bench saved</ThemedText>
            <ThemedText>{`Name: ${name}`}</ThemedText>
            <ThemedText>{`Location: ${location}`}</ThemedText>
            {notes ? <ThemedText>{`Notes: ${notes}`}</ThemedText> : null}
          </ThemedView>
        ) : null}

        <Link href="/" style={styles.link}>
          <ThemedText type="link">Back to map</ThemedText>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 18,
  },
  paragraph: {
    lineHeight: 24,
  },
  field: {
    gap: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    padding: 14,
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  notes: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    marginTop: 4,
    alignSelf: 'stretch',
  },
  savedBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    gap: 8,
  },
  link: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
  },
});