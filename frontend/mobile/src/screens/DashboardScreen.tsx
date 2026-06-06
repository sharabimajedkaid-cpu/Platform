import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export function DashboardScreen() {
  const [metrics, setMetrics] = useState({ students: 50, teachers: 9, classrooms: 240 });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Britishce44</Text>
        <Text style={styles.subtitle}>The First British Center Online</Text>
      </View>
      <View style={styles.cardsRow}>
        {[
          { label: 'Students', value: metrics.students, color: '#1e3a5f' },
          { label: 'Teachers', value: metrics.teachers, color: '#c8a84e' },
          { label: 'Classrooms', value: metrics.classrooms, color: '#059669' },
        ].map(c => (
          <View key={c.label} style={[styles.card, { borderTopColor: c.color }]}>
            <Text style={styles.cardValue}>{c.value}</Text>
            <Text style={styles.cardLabel}>{c.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {['🚪 Classrooms', '💬 Messenger', '📝 Exams', '📄 Homework'].map(a => (
            <TouchableOpacity key={a} style={styles.actionBtn}>
              <Text style={styles.actionText}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { backgroundColor: '#0a1628', padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#c8a84e' },
  subtitle: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  cardsRow: { flexDirection: 'row', padding: 16, gap: 12 },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderTopWidth: 3, shadowOpacity: 0.1, shadowRadius: 8 },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#0a1628' },
  cardLabel: { fontSize: 11, color: '#6b7280', marginTop: 4 },
  quickActions: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#0a1628', marginBottom: 12 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionBtn: { backgroundColor: '#fff', padding: 16, borderRadius: 12, minWidth: '47%', alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '500', color: '#0a1628' },
});
