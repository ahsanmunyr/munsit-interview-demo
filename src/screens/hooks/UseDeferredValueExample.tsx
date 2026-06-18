/**
 * useDeferredValue Example
 *
 * Very similar to useTransition but for a different scenario:
 *
 *   useTransition  → you control the state update, wrap it in startTransition()
 *   useDeferredValue → you DON'T control the source (e.g. it comes from props/context)
 *                      you just defer the value you RECEIVE
 *
 * Real example:
 *   Parent passes a search query as a prop → child does expensive filtering.
 *   Child can't wrap the parent's setState in startTransition.
 *   Solution: const deferredQuery = useDeferredValue(props.query)
 *
 * What it does:
 *   - Returns the OLD value while a new one is being processed
 *   - When the render with the new value finishes, it switches
 *   - isStale = (deferredValue !== freshValue) → show a "loading" visual
 */

import { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

const ALL_ITEMS = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: `Item ${i + 1} — ${Math.random().toString(36).slice(2, 8)}`,
}));

export default function UseDeferredValueExample() {
  const [query, setQuery] = useState('');

  // useDeferredValue: React keeps the old value while rendering the new one
  // The component re-renders TWICE:
  //   1st pass: deferredQuery = old value (fast, user sees stale results)
  //   2nd pass: deferredQuery = new value (expensive, happens in background)
  const deferredQuery = useDeferredValue(query);

  // isStale = true during the gap between the two passes
  // Use this to dim the list or show a spinner
  const isStale = query !== deferredQuery;

  const results = useMemo(
    () => ALL_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(deferredQuery.toLowerCase())
    ),
    [deferredQuery] // only recomputes when deferred value settles
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>useDeferredValue</Text>
      <Text style={styles.subtitle}>
        Results dim while stale. New results render in background.
      </Text>

      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Type to search…"
        placeholderTextColor="#aaa"
      />

      {/* Show the two values side by side so you can see the difference */}
      <View style={styles.valueRow}>
        <View style={styles.valueBox}>
          <Text style={styles.valueLabel}>query (fresh)</Text>
          <Text style={styles.value}>"{query}"</Text>
        </View>
        <View style={[styles.valueBox, isStale && styles.staleBox]}>
          <Text style={styles.valueLabel}>deferredQuery</Text>
          <Text style={[styles.value, isStale && styles.staleValue]}>
            "{deferredQuery}" {isStale ? '← stale' : '← in sync'}
          </Text>
        </View>
      </View>

      {/* Dim the list while stale to give user feedback */}
      <FlatList
        style={{ opacity: isStale ? 0.4 : 1 }}
        data={results.slice(0, 30)}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.name}</Text>
        )}
        ListHeaderComponent={
          <Text style={styles.count}>{results.length} results</Text>
        }
      />

      <View style={styles.note}>
        <Text style={styles.noteText}>
          {'// When to use each:\n'}
          {'useTransition   → you own the setState that triggers the render\n'}
          {'useDeferredValue → value comes from outside (props / context)\n\n'}
          {'const deferred = useDeferredValue(props.searchQuery)\n'}
          {'const isStale = props.searchQuery !== deferred\n'}
          {'<List style={{ opacity: isStale ? 0.5 : 1 }} />'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#F8F8FA',
    marginBottom: 12,
  },
  valueRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  valueBox: {
    flex: 1,
    backgroundColor: '#F0FFF4',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  staleBox: { backgroundColor: '#FFF8EE', borderColor: '#FF9500' },
  valueLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  value: { fontSize: 12, fontWeight: '600', color: '#333' },
  staleValue: { color: '#FF9500' },
  count: { fontSize: 13, color: '#999', marginBottom: 4 },
  item: { paddingVertical: 7, fontSize: 14, color: '#333', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  note: { backgroundColor: '#1a1a2e', borderRadius: 10, padding: 14, marginTop: 8 },
  noteText: { color: '#a8d8ff', fontFamily: 'monospace', fontSize: 11, lineHeight: 19 },
});
