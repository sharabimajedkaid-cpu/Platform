import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const CLASSROOM_DATA: Record<string, { name: string; teacher: string; subject: string; level: string; students: number }> = {
  "1": { name: "English Foundation", teacher: "Mr. Ahmed Al-Shami", subject: "Foundation A1", level: "A1", students: 18 },
  "2": { name: "Intermediate English", teacher: "Ms. Fatima Hassan", subject: "Intermediate B1", level: "B1", students: 22 },
  "3": { name: "Advanced Conversation", teacher: "Dr. Omar Nasser", subject: "Advanced C1", level: "C1", students: 12 },
  "4": { name: "Business English", teacher: "Mrs. Sara Al-Yemeni", subject: "Business B2", level: "B2", students: 15 },
};

const CHAT_MSGS = [
  { id: "1", author: "Ms. Fatima Hassan", role: "teacher", text: "Good morning everyone! Let's begin with today's warm-up exercise.", time: "9:01 AM" },
  { id: "2", author: "Ahmed Hassan Ali", role: "student", text: "Good morning teacher! Ready 🙋", time: "9:02 AM" },
  { id: "3", author: "Nadia Hassan Qasim", role: "student", text: "Good morning!", time: "9:02 AM" },
  { id: "4", author: "Ms. Fatima Hassan", role: "teacher", text: "Today we're covering Type 2 conditionals. Can anyone give me an example?", time: "9:03 AM" },
  { id: "5", author: "Mohammed Yahya", role: "student", text: "If I studied harder, I would pass the exam.", time: "9:04 AM" },
  { id: "6", author: "Ms. Fatima Hassan", role: "teacher", text: "Excellent example, Mohammed! That's exactly right. ✅", time: "9:04 AM" },
];

const PARTICIPANTS = [
  { id: "1", name: "Ms. Fatima Hassan", role: "teacher", audio: true, video: true },
  { id: "2", name: "Ahmed Hassan Ali", role: "student", audio: false, video: true },
  { id: "3", name: "Nadia Hassan", role: "student", audio: true, video: false },
  { id: "4", name: "Mohammed Yahya", role: "student", audio: false, video: false },
  { id: "5", name: "Khadija Al-Shami", role: "student", audio: true, video: true },
];

type Tab = "video" | "chat" | "participants" | "whiteboard";

export default function ClassroomRoomScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const roomId = params.id ?? "1";
  const room = CLASSROOM_DATA[roomId] ?? CLASSROOM_DATA["1"];
  const displayName = params.name ?? room.name;

  const [tab, setTab] = useState<Tab>("video");
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);

  const leave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.back();
  };

  const tabIcons: { key: Tab; icon: string; label: string }[] = [
    { key: "video", icon: "videocam", label: "Video" },
    { key: "chat", icon: "chatbubbles", label: "Chat" },
    { key: "participants", icon: "people", label: "People" },
    { key: "whiteboard", icon: "brush", label: "Board" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#050a15" }}>
      {/* Header */}
      <View style={{ paddingTop: topPad + 10, paddingHorizontal: 16, paddingBottom: 10, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontFamily: "Inter_700Bold", color: "#ffffff" }} numberOfLines={1}>{displayName}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: "#059669" }} />
            <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: "#6b7fa3" }}>
              Live · {room.teacher} · {room.students} students
            </Text>
          </View>
        </View>
        <Pressable
          onPress={leave}
          style={{ backgroundColor: "#e11d48", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Ionicons name="exit-outline" size={15} color="#ffffff" />
          <Text style={{ fontSize: 12, fontFamily: "Inter_700Bold", color: "#ffffff" }}>Leave</Text>
        </Pressable>
      </View>

      {/* Tab navigation */}
      <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#1a2740", backgroundColor: "#0a1628" }}>
        {tabIcons.map(t => (
          <Pressable key={t.key} onPress={() => setTab(t.key)} style={{ flex: 1, alignItems: "center", paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: tab === t.key ? colors.primary : "transparent" }}>
            <Ionicons name={t.icon as any} size={18} color={tab === t.key ? colors.primary : "#6b7fa3"} />
            <Text style={{ fontSize: 10, fontFamily: "Inter_500Medium", color: tab === t.key ? colors.primary : "#6b7fa3", marginTop: 3 }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {tab === "video" && (
          <View style={{ flex: 1, padding: 12 }}>
            {/* Main video area */}
            <View style={{ flex: 1, borderRadius: 14, backgroundColor: "#0d1f3c", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.primary + "44", marginBottom: 10 }}>
              <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: "#6366f122", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Text style={{ fontSize: 28, fontFamily: "Inter_700Bold", color: "#6366f1" }}>FH</Text>
              </View>
              <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#ffffff" }}>Ms. Fatima Hassan</Text>
              <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: "#6b7fa3", marginTop: 4 }}>Teacher · Camera On</Text>
              <View style={{ position: "absolute", top: 10, right: 10, backgroundColor: "#05966922", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#059669" }} />
                <Text style={{ fontSize: 10, fontFamily: "Inter_600SemiBold", color: "#059669" }}>LIVE</Text>
              </View>
            </View>
            {/* Participant thumbnails */}
            <View style={{ flexDirection: "row", gap: 8 }}>
              {PARTICIPANTS.slice(1, 5).map(p => (
                <View key={p.id} style={{ flex: 1, aspectRatio: 1, borderRadius: 10, backgroundColor: "#0d1f3c", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#1a2740" }}>
                  <Text style={{ fontSize: 14, fontFamily: "Inter_700Bold", color: "#6366f1" }}>{p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</Text>
                  {!p.audio && <Ionicons name="mic-off" size={10} color="#e11d48" style={{ marginTop: 3 }} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {tab === "chat" && (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14, gap: 12 }}>
            {CHAT_MSGS.map(msg => (
              <View key={msg.id} style={{ maxWidth: "85%", alignSelf: msg.role === "teacher" ? "flex-start" : "flex-end" }}>
                {msg.role === "teacher" && (
                  <Text style={{ fontSize: 10, fontFamily: "Inter_600SemiBold", color: colors.primary, marginBottom: 3 }}>{msg.author}</Text>
                )}
                <View style={{ backgroundColor: msg.role === "teacher" ? "#0d1f3c" : "#6366f133", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: msg.role === "teacher" ? "#1a2740" : "#6366f144" }}>
                  <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: "#e2e8f0", lineHeight: 19 }}>{msg.text}</Text>
                </View>
                <Text style={{ fontSize: 9, fontFamily: "Inter_400Regular", color: "#6b7fa3", marginTop: 2, alignSelf: "flex-end" }}>{msg.time}</Text>
              </View>
            ))}
            <View style={{ height: Platform.OS === "web" ? 100 : insets.bottom + 100 }} />
          </ScrollView>
        )}

        {tab === "participants" && (
          <ScrollView contentContainerStyle={{ padding: 14, gap: 8 }}>
            {PARTICIPANTS.map(p => (
              <View key={p.id} style={{ backgroundColor: "#0d1f3c", borderRadius: 10, padding: 12, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: "#1a2740" }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#6366f122", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 14, fontFamily: "Inter_700Bold", color: "#6366f1" }}>{p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: "#e2e8f0" }}>{p.name}</Text>
                  <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: "#6b7fa3", textTransform: "capitalize" }}>{p.role}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Ionicons name={p.audio ? "mic" : "mic-off"} size={16} color={p.audio ? "#059669" : "#e11d48"} />
                  <Ionicons name={p.video ? "videocam" : "videocam-off"} size={16} color={p.video ? "#059669" : "#e11d48"} />
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {tab === "whiteboard" && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
            <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: "#6366f122", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="brush-outline" size={40} color="#6366f1" />
            </View>
            <Text style={{ fontSize: 18, fontFamily: "Inter_700Bold", color: "#e2e8f0", textAlign: "center" }}>Interactive Whiteboard</Text>
            <Text style={{ fontSize: 14, fontFamily: "Inter_400Regular", color: "#6b7fa3", textAlign: "center", lineHeight: 22 }}>
              The live collaborative whiteboard is available in the full desktop experience via fabric.js. View-only mode in the mobile app.
            </Text>
            <Pressable style={{ backgroundColor: "#6366f1", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Text style={{ fontSize: 14, fontFamily: "Inter_700Bold", color: "#ffffff" }}>View Board</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 12, paddingBottom: Platform.OS === "web" ? 20 : insets.bottom + 12, backgroundColor: "#0a1628", borderTopWidth: 1, borderTopColor: "#1a2740" }}>
        {[
          { icon: micOn ? "mic" : "mic-off", label: micOn ? "Mute" : "Unmute", active: micOn, action: () => { setMicOn(!micOn); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
          { icon: camOn ? "videocam" : "videocam-off", label: camOn ? "Stop Video" : "Start Video", active: camOn, action: () => { setCamOn(!camOn); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
          { icon: handRaised ? "hand-left" : "hand-left-outline", label: "Raise Hand", active: handRaised, action: () => { setHandRaised(!handRaised); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } },
          { icon: "chatbubbles-outline", label: "Chat", active: false, action: () => setTab("chat") },
        ].map(ctrl => (
          <Pressable key={ctrl.label} onPress={ctrl.action} style={{ alignItems: "center", gap: 5 }}>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: ctrl.active ? colors.primary + "33" : "#1a2740", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={ctrl.icon as any} size={20} color={ctrl.active ? colors.primary : "#6b7fa3"} />
            </View>
            <Text style={{ fontSize: 10, fontFamily: "Inter_400Regular", color: "#6b7fa3" }}>{ctrl.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
