import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import { getNewlyJoinedChallenge } from '../api/userChallengeApi';

const ChallengeDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [challengeData, setChallengeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getNewlyJoinedChallenge({ id });
      if (result.success) {
        setChallengeData(result.data.data);
      } else {
        console.warn(result.error?.message || 'Error loading challenge');
      }
    };

    fetchData();
  }, [id]);

  if (!challengeData) return null;

  const { challengeDto, userChallengeDto } = challengeData;

  const getDaysLeft = () => {
    const now = new Date();
    const startDate = new Date(challengeDto.startDate);
    // Calculate the difference in milliseconds
    const diffTime = now - startDate;

    // Convert milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0; // never return negative days
  };

  return (
    <View style={styles.container}>
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
      <ScrollView>
        <Text style={styles.title}>{challengeDto.name}</Text>
        <Text style={styles.description}>{challengeDto.description}</Text>

        {/* Challenge Info */}
        <View style={styles.infoRow}>
          <Text>👥 {challengeDto.activeUserCount} participants</Text>
          <Text>🏆 {challengeDto.difficulty.toLowerCase()} difficulty</Text>
          <Text>⏳ {getDaysLeft()} days left</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionLabel}>Progress</Text>
          <Progress.Bar
            progress={parseFloat(userChallengeDto.progress) / 100}
            width={null}
            height={12}
            borderRadius={6}
            color="#3478f6"
            unfilledColor="#e0e0e0"
            borderWidth={0}
          />
          <Text style={styles.progressText}>
            {userChallengeDto.progress}% complete
          </Text>
        </View>

        {/* Challenge Steps */}
        <Text style={styles.sectionLabel}>Challenge Steps</Text>
        {challengeDto.challengeDetail.map((step) => (
          <View
            key={step.id}
            style={styles.stepBox}
          >
            <Text>{`${step.stepNo}. ${step.step}`}</Text>
          </View>
        ))}

        {/* Impact */}
        <Text style={styles.sectionLabel}>Impact</Text>
        <Text style={styles.impactText}>{challengeDto.impact}</Text>

        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Update Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ChallengeDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 40,
  },
  backButton: {
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
  },
  stepBox: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  impactText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 30,
  },
  updateButton: {
    backgroundColor: '#3478f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
