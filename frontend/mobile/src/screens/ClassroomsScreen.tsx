import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const CLASSROOMS = Array.from({ length: 240 }, (_, i) => ({
  id: i + 1,
  grade: `Grade ${Math.floor(i / 20) + 1}`,
  teacher: `Teacher ${String.fromCharCode(65 + (i % 26))}`,
}));

export function ClassroomsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🚪 240 Classrooms</Text>
      <Text style={styles.subtitle}>Tap any door to enter the live classroom</Text>
      <View style={styles.grid}>
        {CLASSROOMS.slice(0, 48).map(r => (
          <TouchableOpacity key={r.id} style={styles.door}>
            <View style={styles.doorInner}>
              <Text style={styles.doorId}>{r.id}</Text>
              <Text style={styles.doorGrade}>{r.grade}</Text>
            </View>
            <Text style={styles.doorTeacher}>{r.teacher}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0a1628' },
  subtitle: { fontSize: 12, color: '#6b7280', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  door: { width: '23%', alignItems: 'center', marginBottom: 8 },
  doorInner: {
    backgroundColor: '#6B3A2A', borderRadius: 8, padding: 12,
    width: '100%', alignItems: 'center', borderWidth: 2, borderColor: '#3e1f12',
  },
  doorId: { color: '#c8a84e', fontWeight: 'bold', fontSize: 16 },
  doorGrade: { color: '#fff', fontSize: 9, marginTop: 2 },
  doorTeacher: { fontSize: 8, color: '#6b7280', marginTop: 2 },
});
