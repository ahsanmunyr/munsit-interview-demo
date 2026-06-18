import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '@/App';

type Props = NativeStackScreenProps<RootStackParamList, 'HooksMenu'>;

const EXAMPLES: {
  route: keyof RootStackParamList;
  title: string;
  hook: string;
  when: string;
}[] = [
  {
    route: 'UseTransitionExample',
    title: 'useTransition',
    hook: 'const [isPending, startTransition] = useTransition()',
    when: 'You own the setState that causes the heavy render',
  },
  {
    route: 'UseDeferredValueExample',
    title: 'useDeferredValue',
    hook: 'const deferred = useDeferredValue(value)',
    when: 'Value comes from props/context you don\'t control',
  },
  {
    route: 'UseReducerExample',
    title: 'useReducer',
    hook: 'const [state, dispatch] = useReducer(reducer, initial)',
    when: '3+ state fields that update together — like a mini Redux',
  },
  {
    route: 'SuspenseExample',
    title: 'React.lazy + Suspense',
    hook: 'const C = React.lazy(() => import("./C"))',
    when: 'Heavy component most users never open — load on demand',
  },
];

export default function HooksMenuScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Modern React Hooks</Text>
      <Text style={styles.sub}>Suspense-era patterns — tap each to see live example</Text>

      {EXAMPLES.map((ex, i) => (
        <Pressable
          key={ex.route}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => navigation.navigate(ex.route as any)}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{i + 1}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{ex.title}</Text>
            <Text style={styles.cardCode}>{ex.hook}</Text>
            <Text style={styles.cardWhen}>Use when: {ex.when}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 26, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  sub: { fontSize: 13, color: '#999', marginBottom: 20 },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#F8F8FA',
    marginBottom: 12,
    gap: 12,
  },
  cardPressed: { opacity: 0.6 },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#111' },
  cardCode: { fontSize: 11, fontFamily: 'monospace', color: '#007AFF', backgroundColor: '#EEF4FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  cardWhen: { fontSize: 12, color: '#888', marginTop: 2 },
  chevron: { fontSize: 22, color: '#ccc', alignSelf: 'center' },
});
