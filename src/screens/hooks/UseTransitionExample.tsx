/**
 * useTransition Example
 *
 * Problem it solves:
 *   When you type in a search box and the filtering is expensive (big list),
 *   every keystroke triggers a heavy re-render → the input feels laggy/frozen.
 *
 * Solution:
 *   Split the update into two priorities:
 *     1. URGENT   → update the input text immediately (user sees what they typed)
 *     2. NON-URGENT → update the search query (triggers the heavy render later)
 *
 *   React finishes the urgent update first, then works on the non-urgent one.
 *   isPending = true while the non-urgent update is in progress.
 */

import { useState, useTransition } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

// Generate 5000 items to make filtering noticeably expensive
const ALL_ITEMS = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: `Product ${i + 1} — item ${Math.random().toString(36).slice(2, 7)}`,
}));

export default function UseTransitionExample() {
  const [inputText, setInputText] = useState('');   // always fresh — drives the TextInput
  const [query, setQuery] = useState('');            // drives the expensive filtering

  // isPending: true while React is still processing the non-urgent update
  // startTransition: wraps the non-urgent state update
  const [isPending, startTransition] = useTransition();

  const handleChange = (text: string) => {
    setInputText(text); // urgent: update input immediately so typing feels instant

    startTransition(() => {
      setQuery(text);   // non-urgent: React will process this when it has time
    });
  };

  // This runs on every render but only with the settled query value
  const results = ALL_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>useTransition</Text>
      <Text style={styles.subtitle}>
        Input stays snappy. Spinner shows while list catches up.
      </Text>

      {/* The input uses inputText (urgent) — never lags */}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleChange}
          placeholder="Type to filter 5000 items…"
          placeholderTextColor="#aaa"
        />
        {/* isPending shows while the non-urgent list re-render is in flight */}
        {isPending && <ActivityIndicator color="#007AFF" style={styles.spinner} />}
      </View>

      <Text style={styles.count}>
        {isPending ? 'Filtering…' : `${results.length} results`}
      </Text>

      <FlatList
        data={results.slice(0, 50)} // show first 50 to keep it fast visually
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.name}</Text>
        )}
      />

      {/* ── Key facts to say in interview ── */}
      <View style={styles.note}>
        <Text style={styles.noteText}>
          Without startTransition → every keystroke freezes input until list re-renders{'\n'}
          With startTransition → input updates instantly, list catches up async{'\n'}
          isPending → use this to show a loading indicator
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#F8F8FA',
  },
  spinner: { marginLeft: 10 },
  count: { fontSize: 13, color: '#999', marginBottom: 8 },
  item: { paddingVertical: 8, fontSize: 14, color: '#333', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  note: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
  },
  noteText: { color: '#a8d8ff', fontFamily: 'monospace', fontSize: 12, lineHeight: 20 },
});
