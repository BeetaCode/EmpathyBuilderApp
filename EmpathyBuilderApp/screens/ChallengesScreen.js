import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getChallenges } from '../api/userChallengeApi';

const ChallengesScreen = () => {
  const navigation = useNavigation();
  const [challenges, setchallenges] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      const result = await getChallenges();
      if (result.success) {
        setchallenges(result.data);
      } else {
        console.warn('Failed to load challenges:', result.error.message);
      }
      setLoading(false);
    };

    fetchChallenges();
  }, []);

  const getDaysLeft = (startDateString) => {
    const now = new Date();
    const startDate = new Date(startDateString);
    // Calculate the difference in milliseconds
    const diffTime = now - startDate;

    // Convert milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0; // never return negative days
  };

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.category?.toLowerCase().includes(search.toLowerCase()) ||
      challenge.difficulty?.toLowerCase().includes(search.toLowerCase()) ||
      challenge.name?.toLowerCase().includes(search.toLowerCase()) ||
      challenge.description?.toLowerCase().includes(search.toLowerCase())
  );

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

      <Text style={styles.featureTitle}>Challenges</Text>
      <Text style={styles.description}>
        Join community challenges to create positive social impact
      </Text>

      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search challenge..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#3478f6"
          />
        ) : filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge, index) => (
            <View
              key={index}
              style={styles.card}
            >
              <View style={styles.challengeTags}>
                <Text style={styles.challengeTagGreen}>
                  {challenge.difficulty}
                </Text>
                <Text style={styles.challengeTagBlue}>
                  {challenge.category}
                </Text>
                <Ionicons
                  name="trophy-outline"
                  size={20}
                  color="#888"
                  style={{ marginLeft: 'auto' }}
                />
              </View>
              <Text style={styles.challengeTitle}>{challenge.name}</Text>
              <Text style={styles.challengeText}>{challenge.description}</Text>
              <View style={styles.challengeFooter}>
                <Text style={styles.iconText}>
                  👥 {challenge.activeUserCount} participants
                </Text>
                <Text style={styles.timeText}>
                  {getDaysLeft(challenge.startDate)} days left
                </Text>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Join Challenge</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No challenges available.</Text>
        )}
      </ScrollView>
      <View style={styles.footer} />
    </View>
  );
};

export default ChallengesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 40,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#3478f6',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
    paddingHorizontal: 70,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  backButton: {
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#3478f6',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: '#2D6EFF',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  challengeTags: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  challengeTagGreen: {
    backgroundColor: '#e0f8e9',
    color: '#4CAF50',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
  },
  challengeTagBlue: {
    backgroundColor: '#d0e6ff',
    color: '#3478f6',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  challengeTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  challengeText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 8,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 12,
    color: '#666',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  footer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
});
