// screens/ProfileScreen.js
import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getProfileSummary } from '../api/userProfileApi';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [rewards, setRewards] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      const load = async () => {
        try {
          const res = await getProfileSummary();
          console.log(res);
          if (!mounted) return;

          if (res.success) {
            const payload = res.data || null; // <-- res.data IS the profile object
            setProfile(payload);

            // rewards comes as a JSON string
            try {
              const parsed = payload?.rewards
                ? JSON.parse(payload.rewards)
                : [];
              setRewards(Array.isArray(parsed) ? parsed : []);
            } catch {
              setRewards([]);
            }
          } else {
            setProfile(null);
            setRewards([]);
          }
        } finally {
          if (mounted) setLoading(false);
        }
      };
      load();
      return () => {
        mounted = false;
      };
    }, [])
  );

  const memberSince = (() => {
    if (!profile?.joinedDate) return '—';
    const d = new Date(profile.joinedDate);
    return isNaN(d.getTime())
      ? '—'
      : d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  })();

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <ActivityIndicator
          size="large"
          color="#3478f6"
        />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <Text>Unable to load profile.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Empathy Builder</Text>
          <TouchableOpacity>
            <Ionicons
              name="person-circle-outline"
              size={28}
              color="#000"
            />
          </TouchableOpacity>
        </View>

        {/* Back */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.pageTitle}>My Profile</Text>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={64}
            color="#9bb8ff"
          />
        </View>

        {/* Name + small edit icon (visual only) */}
        <View style={styles.nameRow}>
          <Text style={styles.nameText}>{profile.fullName || '—'}</Text>
          <TouchableOpacity style={{ marginLeft: 6 }}>
            <Ionicons
              name="create-outline"
              size={18}
              color="#3478f6"
            />
          </TouchableOpacity>
        </View>

        {/* Bio / description */}
        <View style={styles.bioRow}>
          <Text style={styles.bioText}>
            {profile.description || 'No description yet.'}
          </Text>
          <TouchableOpacity style={{ marginLeft: 6, marginTop: 2 }}>
            <Ionicons
              name="create-outline"
              size={16}
              color="#3478f6"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.memberSince}>Member since {memberSince}</Text>

        {/* Impact card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Impact</Text>

          <View style={styles.impactGrid}>
            <ImpactItem
              icon="book-outline"
              value={profile.sharedStories ?? 0}
              label="Stories Shared"
            />
            <ImpactItem
              icon="trophy-outline"
              value={profile.challenges ?? 0}
              label="Challenges"
            />
            <ImpactItem
              icon="ribbon-outline"
              value={profile.earnedBadges ?? 0}
              label="Badges Earned"
            />
            <ImpactItem
              icon="heart-outline"
              value={profile.empathyPoints ?? 0}
              label="Empathy Points"
            />
          </View>
        </View>

        {/* Badges / Rewards */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Badges</Text>
          <View style={styles.badgesRow}>
            {rewards.length > 0 ? (
              rewards.map((r, i) => (
                <Image
                  key={`${r.ImageUrl}-${i}`}
                  source={{ uri: r.ImageUrl }}
                  style={styles.badgeIcon}
                  resizeMode="contain"
                />
              ))
            ) : (
              <Text style={{ color: '#667' }}>No rewards yet.</Text>
            )}
          </View>
        </View>

        {/* Bottom spacer like your other screens */}
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const ImpactItem = ({ icon, value, label }) => (
  <View style={styles.impactItem}>
    <Ionicons
      name={icon}
      size={22}
      color="#3478f6"
    />
    <Text style={styles.impactValue}>{value}</Text>
    <Text style={styles.impactLabel}>{label}</Text>
  </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3478f6',
  },

  backButton: {
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: 'center',
    backgroundColor: '#eaf0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  nameRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
  },

  bioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  bioText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
    maxWidth: 320,
  },

  memberSince: {
    textAlign: 'center',
    color: '#8a8a8a',
    marginTop: 6,
    marginBottom: 14,
  },

  card: {
    borderWidth: 1,
    borderColor: '#3478f6',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  impactItem: {
    width: '47%',
    borderWidth: 1,
    borderColor: '#E7EEFF',
    backgroundColor: '#F7FAFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 6,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  impactLabel: {
    fontSize: 12,
    color: '#5e6a7a',
  },

  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeIcon: {
    width: 48,
    height: 48,
  },

  footer: {
    height: 60,
  },
});
