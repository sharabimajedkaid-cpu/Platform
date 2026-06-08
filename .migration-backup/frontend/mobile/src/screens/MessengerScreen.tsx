import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CONTACTS = [
  { id: '1', name: 'Admin Britishce44', role: 'Admin', online: true },
  { id: '2', name: 'T.Suhair Almojahid', role: 'Teacher', online: true },
  { id: '3', name: 'T.Shihab Alomary', role: 'Teacher', online: false },
  { id: '4', name: 'Supervisor', role: 'Supervisor', online: true },
];

export function MessengerScreen() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 CE4 Messenger</Text>
      <ScrollView style={styles.contactsList}>
        {CONTACTS.map(c => (
          <TouchableOpacity key={c.id} style={styles.contact} onPress={() => setActiveChat(c.id)}>
            <View style={[styles.statusDot, { backgroundColor: c.online ? '#22c55e' : '#9ca3af' }]} />
            <View>
              <Text style={styles.contactName}>{c.name}</Text>
              <Text style={styles.contactRole}>{c.role}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {activeChat && (
        <View style={styles.chatBar}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => { setMessage(''); }}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0a1628', marginBottom: 12 },
  contactsList: { flex: 1 },
  contact: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 6 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  contactName: { fontSize: 14, fontWeight: '600', color: '#0a1628' },
  contactRole: { fontSize: 11, color: '#6b7280' },
  chatBar: { flexDirection: 'row', gap: 8, paddingTop: 8 },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
  sendBtn: { backgroundColor: '#c8a84e', borderRadius: 20, paddingHorizontal: 20, justifyContent: 'center' },
  sendText: { color: '#0a1628', fontWeight: 'bold', fontSize: 14 },
});
