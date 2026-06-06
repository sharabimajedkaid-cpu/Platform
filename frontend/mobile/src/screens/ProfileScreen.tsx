import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>B44</Text>
        </View>
        <Text style={styles.name}>Admin Britishce44</Text>
        <Text style={styles.role}>Administrator</Text>
        <Text style={styles.email}>britishce44@gmail.com</Text>
      </View>
      <View style={styles.menu}>
        {[
          { icon: '👤', label: 'Edit Profile' },
          { icon: '🔔', label: 'Notifications' },
          { icon: '🔒', label: 'Security' },
          { icon: '🌐', label: 'Language' },
          { icon: '💳', label: 'Subscription' },
          { icon: '📊', label: 'Usage Stats' },
          { icon: 'ℹ️', label: 'About' },
          { icon: '🚪', label: 'Logout' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  profileCard: { backgroundColor: '#0a1628', padding: 24, paddingTop: 60, alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#c8a84e', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 18, fontWeight: 'black', color: '#0a1628' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#c8a84e' },
  role: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  email: { fontSize: 11, color: '#6b7280', marginTop: 4 },
  menu: { padding: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 6 },
  menuIcon: { fontSize: 16, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 14, color: '#0a1628' },
  menuArrow: { fontSize: 18, color: '#9ca3af' },
});
