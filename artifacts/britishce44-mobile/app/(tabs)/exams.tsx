import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

type ExamStatus = "live" | "upcoming" | "completed" | "draft";

const EXAMS: Array<{
  id: string;
  title: string;
  subject: string;
  level: string;
  date: string;
  time: string;
  duration: string;
  questions: number;
  status: ExamStatus;
  score?: number;
}> = [
  { id: "1", title: "Mid-Term English B2", subject: "Cambridge B2", level: "B2", date: "Today", time: "2:00 PM", duration: "90 min", questions: 40, status: "live" },
  { id: "2", title: "IELTS Mock Test — Set A", subject: "IELTS Prep", level: "C1", date: "Today", time: "4:30 PM", duration: "165 min", questions: 80, status: "upcoming" },
  { id: "3", title: "Grammar Fundamentals", subject: "Foundation", level: "A2", date: "Jan 20", time: "10:00 AM", duration: "45 min", questions: 25, status: "upcoming" },
  { id: "4", title: "Advanced Reading Quiz", subject: "Advanced", level: "C2", date: "Jan 22", time: "2:00 PM", duration: "60 min", questions: 30, status: "upcoming" },
  { id: "5", title: "Speaking Assessment", subject: "Conversation", level: "B1", date: "Jan 10", time: "11:00 AM", duration: "20 min", questions: 10, status: "completed", score: 87 },
  { id: "6", title: "Vocabulary Test — Unit 4", subject: "Vocabulary", level: "A1", date: "Jan 8", time: "9:00 AM", duration: "30 min", questions: 20, status: "completed", score: 92 },
  { id: "7", title: "Business English Final", subject: "Business", level: "B2", date: "Dec 20", time: "3:00 PM", duration: "120 min", questions: 50, status: "completed", score: 78 },
  { id: "8", title: "TOEFL Practice Test", subject: "TOEFL Prep", level: "C1", date: "Jan 25", time: "9:00 AM", duration: "200 min", questions: 120, status: "upcoming" },
];

const STATUS_CONFIG: Record<ExamStatus, { label: string; color: string; bg: string }> = {
  live: { label: "Live Now", color: "#059669", bg: "#05966922" },
  upcoming: { label: "Upcoming", color: "#6366f1", bg: "#6366f122" },
  completed: { label: "Completed", color: "#6b7fa3", bg: "#6b7fa322" },
  draft: { label: "Draft", color: "#d97706", bg: "#d9770622" },
};

const FILTERS: Array<{ key: string; label: string }> = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Done" },
];

function ExamCard({ item }: { item: (typeof EXAMS)[0] }) {
  const colors = useColors();
  const status = STATUS_CONFIG[item.status];
  const isLive = item.status === "live";
  const isDone = item.status === "completed";

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: colors.card,
        borderRadius: colors.radius,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: isLive ? "#05966940" : colors.border,
        opacity: pressed ? 0.85 : 1,
      })}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <View style={{ flexDirection: "row", gap: 6, marginBottom: 6 }}>
            <View style={{ backgroundColor: status.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontFamily: "Inter_600SemiBold", color: status.color }}>{status.label}</Text>
            </View>
            <View style={{ backgroundColor: colors.muted, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontFamily: "Inter_600SemiBold", color: colors.mutedForeground }}>{item.level}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: colors.foreground, marginBottom: 3 }}>
            {item.title}
          </Text>
          <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>
            {item.subject}
          </Text>
        </View>

        {isDone && item.score !== undefined && (
          <View style={{ alignItems: "center", backgroundColor: item.score >= 80 ? "#05966922" : item.score >= 60 ? "#f0a50022" : "#e11d4822", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
            <Text style={{ fontSize: 20, fontFamily: "Inter_700Bold", color: item.score >= 80 ? "#059669" : item.score >= 60 ? "#f0a500" : "#e11d48" }}>
              {item.score}
            </Text>
            <Text style={{ fontSize: 9, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>SCORE</Text>
          </View>
        )}
        {isLive && (
          <Pressable
            style={{ backgroundColor: "#059669", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 }}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Text style={{ fontSize: 12, fontFamily: "Inter_700Bold", color: "#ffffff" }}>Start</Text>
          </Pressable>
        )}
      </View>

      <View style={{ flexDirection: "row", gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="calendar-outline" size={13} color={colors.mutedForeground} />
          <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>{item.date} · {item.time}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="time-outline" size={13} color={colors.mutedForeground} />
          <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>{item.duration}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="help-circle-outline" size={13} color={colors.mutedForeground} />
          <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>{item.questions} Q</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function ExamsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("all");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = activeFilter === "all" ? EXAMS : EXAMS.filter(e => e.status === activeFilter);
  const liveCount = EXAMS.filter(e => e.status === "live").length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPad + 16, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 22, fontFamily: "Inter_700Bold", color: colors.foreground }}>Exams</Text>
            <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 2 }}>
              {liveCount > 0 ? `${liveCount} exam live now` : `${EXAMS.filter(e => e.status === "upcoming").length} upcoming`}
            </Text>
          </View>
          {liveCount > 0 && (
            <View style={{ backgroundColor: "#05966922", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#059669" }} />
              <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#059669" }}>Live</Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {FILTERS.map(f => (
            <Pressable
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              style={{
                paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
                backgroundColor: activeFilter === f.key ? colors.primary : colors.surface2,
                borderWidth: 1, borderColor: activeFilter === f.key ? colors.primary : colors.border,
              }}
            >
              <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: activeFilter === f.key ? colors.primaryForeground : colors.mutedForeground }}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ExamCard item={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 60 }}>
            <Ionicons name="document-text-outline" size={48} color={colors.mutedForeground} />
            <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: colors.mutedForeground, marginTop: 12 }}>No exams found</Text>
          </View>
        }
      />
    </View>
  );
}
