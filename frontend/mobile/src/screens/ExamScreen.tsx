import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const MODELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export function ExamScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📝 100 Exams</Text>
      <Text style={styles.subtitle}>10 Models × 10 Sub-tests | 30 min | Certificate at 70%+</Text>
      <View style={styles.grid}>
        {MODELS.map(m => (
          <TouchableOpacity key={m} style={styles.modelCard}>
            <Text style={styles.modelTitle}>Model {m}</Text>
            <Text style={styles.modelDesc}>10 exams</Text>
            <TouchableOpacity style={styles.startBtn}>
              <Text style={styles.startText}>Start</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0a1628' },
  subtitle: { fontSize: 11, color: '#6b7280', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  modelCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, width: '48%', borderLeftWidth: 3, borderLeftColor: '#c8a84e' },
  modelTitle: { fontSize: 16, fontWeight: 'bold', color: '#0a1628' },
  modelDesc: { fontSize: 11, color: '#6b7280', marginVertical: 4 },
  startBtn: { backgroundColor: '#c8a84e', borderRadius: 12, padding: 8, alignItems: 'center', marginTop: 6 },
  startText: { color: '#0a1628', fontWeight: 'bold', fontSize: 12 },
});
