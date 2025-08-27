import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import { Checkbox, Portal, Button } from 'react-native-paper';
import {
  getNewlyJoinedChallenge,
  updateChallengeSteps,
} from '../api/userChallengeApi';

const ChallengeDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [challengeData, setChallengeData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await getNewlyJoinedChallenge({ id });
      if (result.success) {
        const challenge = result.data.data;
        setChallengeData(challenge);

        const completedSteps =
          parseInt(challenge.userChallengeDto.progress || 0) / 20;
        const checks = {};
        challenge.challengeDto.challengeDetail.forEach((step, index) => {
          checks[step.stepNo] = index < completedSteps;
        });
        setCheckedSteps(checks);
      } else {
        console.warn(result.error?.message || 'Error loading challenge');
      }
    };

    fetchData();
  }, [id]);

  if (!challengeData) return null;

  const { challengeDto, userChallengeDto } = challengeData;
  const progress = parseFloat(userChallengeDto.progress || '0');
  const isCompleted = progress === 100;

  const getDaysLeft = (startDateString) => {
    const now = new Date();
    const startDate = new Date(startDateString);
    // Calculate the difference in milliseconds
    const diffTime = now - startDate;

    // Convert milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0; // never return negative days
  };

  const toggleStep = (stepNo) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepNo]: !prev[stepNo],
    }));
  };

  const handleSaveProgress = async () => {
    const selectedSteps = Object.keys(checkedSteps)
      .filter((k) => checkedSteps[k])
      .map((k) => parseInt(k));

    const result = await updateChallengeSteps(
      challengeData.userChallengeDto.id,
      selectedSteps
    );

    if (result.success) {
      const newProgress = selectedSteps.length * 20;
      setChallengeData((prev) => ({
        ...prev,
        userChallengeDto: {
          ...prev.userChallengeDto,
          progress: newProgress.toString(),
        },
      }));
      setModalVisible(false);
    } else {
      alert(result.error.message || 'Failed to update');
    }
  };

  return (
    <View style={styles.container}>
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

        <View style={styles.infoRow}>
          <Text>👥 {challengeDto.activeUserCount} participants</Text>
          <Text>🏆 {challengeDto.difficulty.toLowerCase()} difficulty</Text>
          <Text>⏳ {getDaysLeft(challengeDto.startDate)} days left</Text>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionLabel}>Progress</Text>
          <Progress.Bar
            progress={progress / 100}
            width={null}
            height={12}
            borderRadius={6}
            color="#3478f6"
            unfilledColor="#e0e0e0"
            borderWidth={0}
          />
          <Text style={styles.progressText}>{progress}% complete</Text>
        </View>

        <Text style={styles.sectionLabel}>Challenge Steps</Text>
        {challengeDto.challengeDetail.map((step) => (
          <View
            key={step.id}
            style={styles.stepBox}
          >
            <Text>{`${step.stepNo}. ${step.step}`}</Text>
          </View>
        ))}

        <Text style={styles.sectionLabel}>Impact</Text>
        <Text style={styles.impactText}>{challengeDto.impact}</Text>

        {!isCompleted ? (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.updateButtonText}>Update Progress</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBox}>
            <Text style={styles.completedText}>
              🎉 Challenge Completed! Great job!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Challenge Progress</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                  />
                </TouchableOpacity>
              </View>

              {challengeDto.challengeDetail.map((step) => (
                <View
                  key={step.id}
                  style={styles.checkboxContainer}
                >
                  <Checkbox
                    status={checkedSteps[step.stepNo] ? 'checked' : 'unchecked'}
                    onPress={() => toggleStep(step.stepNo)}
                  />
                  <Text style={styles.checkboxLabel}>{step.step}</Text>
                </View>
              ))}

              <Button
                mode="contained"
                onPress={handleSaveProgress}
              >
                Save Progress
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default ChallengeDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3478f6',
  },
  backButton: {
    marginTop: 20,
    marginBottom: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 8,
    flexShrink: 1,
  },
  completedBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#e0f8e9',
    borderRadius: 8,
    alignItems: 'center',
  },
  completedText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});
