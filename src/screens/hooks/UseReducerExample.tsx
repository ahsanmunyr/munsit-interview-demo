/**
 * useReducer Example
 *
 * Problem:
 *   A shopping cart has: items[], total, discount, isCheckingOut
 *   With useState you'd have 4 separate useState calls.
 *   When you add an item, you need to update items AND total together.
 *   It's easy to forget one → state gets out of sync.
 *
 * Solution: useReducer
 *   All state lives in ONE object.
 *   All updates go through ONE pure function (reducer).
 *   dispatch({ type: 'ADD_ITEM', payload: item }) → reducer returns new state.
 *
 * This is EXACTLY how Redux works.
 * useReducer = Redux without the global store.
 *
 * Use useReducer when:
 *   - 3+ state fields that change together
 *   - Next state depends on previous state
 *   - Complex update logic (add/remove/update/reset)
 */

import { useReducer } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// ─── Types (same pattern as Redux Toolkit) ───────────────────────────────────

type CartItem = { id: number; name: string; price: number; qty: number };

type CartState = {
  items: CartItem[];
  discount: number;       // percentage, 0–100
  isCheckingOut: boolean;
};

type CartAction =
  | { type: 'ADD_ITEM';    payload: Omit<CartItem, 'qty'> }
  | { type: 'REMOVE_ITEM'; payload: number }             // item id
  | { type: 'INCREMENT';   payload: number }             // item id
  | { type: 'DECREMENT';   payload: number }             // item id
  | { type: 'APPLY_DISCOUNT'; payload: number }
  | { type: 'CHECKOUT' }
  | { type: 'RESET' };

// ─── Reducer (pure function — same as Redux reducer) ─────────────────────────

const initialState: CartState = { items: [], discount: 0, isCheckingOut: false };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        // already in cart → increment qty
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };

    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, qty: i.qty + 1 } : i
        ),
      };

    case 'DECREMENT':
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.payload ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0), // auto-remove when qty hits 0
      };

    case 'APPLY_DISCOUNT':
      return { ...state, discount: action.payload };

    case 'CHECKOUT':
      return { ...state, isCheckingOut: true };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// ─── Sample products ──────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1, name: 'AirPods Pro', price: 249 },
  { id: 2, name: 'iPhone Case', price: 49 },
  { id: 3, name: 'MagSafe Charger', price: 39 },
  { id: 4, name: 'USB-C Hub', price: 79 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function UseReducerExample() {
  // dispatch is stable — same reference across renders (no useCallback needed)
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = subtotal * (1 - state.discount / 100);
  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);

  if (state.isCheckingOut) {
    return (
      <View style={styles.success}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.successText}>Order placed!</Text>
        <Pressable style={styles.btn} onPress={() => dispatch({ type: 'RESET' })}>
          <Text style={styles.btnText}>Start over</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>useReducer</Text>
      <Text style={styles.subtitle}>
        dispatch(action) → reducer → new state. Same as Redux.
      </Text>

      {/* ── Products ── */}
      <Text style={styles.sectionLabel}>PRODUCTS</Text>
      {PRODUCTS.map((product) => (
        <View key={product.id} style={styles.productRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
          </View>
          <Pressable
            style={styles.addBtn}
            onPress={() => dispatch({ type: 'ADD_ITEM', payload: product })}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </Pressable>
        </View>
      ))}

      {/* ── Cart ── */}
      <Text style={styles.sectionLabel}>CART ({itemCount} items)</Text>
      {state.items.length === 0 ? (
        <Text style={styles.empty}>Cart is empty — add something above</Text>
      ) : (
        state.items.map((item) => (
          <View key={item.id} style={styles.cartRow}>
            <Text style={styles.cartName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.qtyRow}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => dispatch({ type: 'DECREMENT', payload: item.id })}>
                <Text style={styles.qtyBtnText}>−</Text>
              </Pressable>
              <Text style={styles.qty}>{item.qty}</Text>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => dispatch({ type: 'INCREMENT', payload: item.id })}>
                <Text style={styles.qtyBtnText}>+</Text>
              </Pressable>
            </View>
            <Text style={styles.cartPrice}>${item.price * item.qty}</Text>
            <Pressable onPress={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
              <Text style={styles.remove}>✕</Text>
            </Pressable>
          </View>
        ))
      )}

      {/* ── Discount ── */}
      <Text style={styles.sectionLabel}>DISCOUNT</Text>
      <View style={styles.discountRow}>
        {[0, 10, 20, 50].map((pct) => (
          <Pressable
            key={pct}
            style={[styles.discountBtn, state.discount === pct && styles.discountBtnActive]}
            onPress={() => dispatch({ type: 'APPLY_DISCOUNT', payload: pct })}>
            <Text style={[styles.discountText, state.discount === pct && styles.discountTextActive]}>
              {pct}% off
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── Total ── */}
      <View style={styles.totalBox}>
        <Text style={styles.totalRow}>Subtotal   ${subtotal.toFixed(2)}</Text>
        {state.discount > 0 && (
          <Text style={styles.totalRow}>Discount   −{state.discount}%</Text>
        )}
        <Text style={styles.totalFinal}>Total   ${total.toFixed(2)}</Text>
      </View>

      {state.items.length > 0 && (
        <Pressable style={styles.checkoutBtn} onPress={() => dispatch({ type: 'CHECKOUT' })}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </Pressable>
      )}

      {/* ── Key concept ── */}
      <View style={styles.note}>
        <Text style={styles.noteText}>
          {'// useReducer vs useState:\n'}
          {'useState  → 1 value, simple updates\n'}
          {'useReducer → many related values, complex updates\n\n'}
          {'// dispatch is stable (no useCallback needed)\n'}
          {'// reducer must be a PURE function (no side effects)\n'}
          {'// same pattern as Redux — just local, not global'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#aaa', letterSpacing: 1, marginBottom: 8, marginTop: 16 },

  productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  productName: { fontSize: 15, fontWeight: '600', color: '#111' },
  productPrice: { fontSize: 13, color: '#999', marginTop: 2 },
  addBtn: { backgroundColor: '#1a1a2e', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  empty: { color: '#bbb', fontSize: 14, textAlign: 'center', paddingVertical: 16 },
  cartRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', gap: 8 },
  cartName: { flex: 1, fontSize: 14, color: '#111' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#F0F0F5', justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 16, color: '#333', lineHeight: 20 },
  qty: { fontSize: 14, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  cartPrice: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', minWidth: 44, textAlign: 'right' },
  remove: { fontSize: 14, color: '#FF3B30', paddingHorizontal: 4 },

  discountRow: { flexDirection: 'row', gap: 8 },
  discountBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, backgroundColor: '#F0F0F5' },
  discountBtnActive: { backgroundColor: '#1a1a2e' },
  discountText: { fontSize: 13, color: '#555' },
  discountTextActive: { color: '#fff', fontWeight: '600' },

  totalBox: { marginTop: 16, backgroundColor: '#F8F8FA', borderRadius: 12, padding: 16, gap: 4 },
  totalRow: { fontSize: 14, color: '#666' },
  totalFinal: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginTop: 4 },

  checkoutBtn: { marginTop: 12, backgroundColor: '#007AFF', borderRadius: 12, padding: 16, alignItems: 'center' },
  checkoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  success: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  successIcon: { fontSize: 60 },
  successText: { fontSize: 24, fontWeight: '700', color: '#1a1a2e' },

  btn: { backgroundColor: '#1a1a2e', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '600' },

  note: { backgroundColor: '#1a1a2e', borderRadius: 10, padding: 14, marginTop: 20 },
  noteText: { color: '#a8d8ff', fontFamily: 'monospace', fontSize: 11, lineHeight: 19 },
});
