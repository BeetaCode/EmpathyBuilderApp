import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserStories, likeUserStory } from '../api/userStoryApi';
import {
  getChallenges,
  setUserChallenge,
  getNewlyJoinedChallenge,
} from '../api/userChallengeApi';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [story, setStory] = useState(null);
  const [storyLoading, setStoryLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [challengeLoading, setChallengeLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchStories = async () => {
        const result = await getUserStories();

        if (result.success) {
          setStory(result.data[0]);
          console.log(result.data[0].userStoryId);
        } else {
          console.warn('Failed to load challenges:', result.error.message);
        }
        setStoryLoading(false);
      };

      fetchStories();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchChallenges = async () => {
        const result = await getChallenges();
        if (result.success) {
          setChallenge(result.data[0]);
        } else {
          console.warn('Failed to load challenges:', result.error.message);
        }
        setChallengeLoading(false);
      };

      fetchChallenges();
    }, [])
  );

  const getDaysLeft = (startDateString) => {
    const now = new Date();
    const startDate = new Date(startDateString);
    // Calculate the difference in milliseconds
    const diffTime = now - startDate;

    // Convert milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0; // never return negative days
  };

  const getChallenge = async (id) => {
    const result = await getNewlyJoinedChallenge({ id });
    if (result.success) {
      navigation.navigate('ChallengeDetail', { id });
    } else {
      Alert.alert('Error', result.error.message || 'Failed to load challenge');
    }
  };

  const joinChallenge = async (id) => {
    const startedOn = new Date();
    const progress = 0;

    try {
      const result = await setUserChallenge({ id, startedOn, progress });
      if (
        result.success &&
        result.data.message == 'challenge_join_successful'
      ) {
        getChallenge(result.data.userChallengeId);
      } else if (
        result.success &&
        result.data.message == 'challenge_already_exists_for_user'
      ) {
        getChallenge(result.data.userChallengeId);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const handleLike = async () => {
    if (!story) return;

    const result = await likeUserStory(story.userStoryId);
    if (result.success) {
      const likedresult = await getUserStories();

      if (likedresult.success) {
        setStory(likedresult.data[0]);
      } else {
        console.warn('Failed to load challenges:', likedresult.error.message);
      }
      setStoryLoading(false);
    } else {
      alert(result.error?.message || 'Failed to like story');
    }
  };

  const shareText = async (text) => {
    const fileUri = FileSystem.documentDirectory + 'story.txt';
    await FileSystem.writeAsStringAsync(fileUri, text);

    if (!(await Sharing.isAvailableAsync())) {
      alert('Sharing is not available on your device');
      return;
    }

    await Sharing.shareAsync(fileUri);
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

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Featured Story */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Story</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyStories')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {storyLoading ? (
            <ActivityIndicator
              size="large"
              color="#3478f6"
            />
          ) : story ? (
            <View style={styles.card}>
              <View style={styles.storyHeader}>
                <Text style={styles.storyAuthor}>{story.fullName}</Text>
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color="#888"
                />
              </View>

              <View style={styles.storyTagContainer}>
                {story.userStoryTags.map((tag, i) => (
                  <Text
                    key={i}
                    style={styles.storyTag}
                  >
                    {tag.tag}
                  </Text>
                ))}
              </View>

              <Text style={styles.storyText}>{story.story}</Text>

              <View style={styles.storyFooter}>
                <TouchableOpacity onPress={handleLike}>
                  <Text style={styles.iconText}>💙 {story.likes}</Text>
                </TouchableOpacity>

                <Text style={styles.timeText}>
                  {new Date(story.postedOn).toLocaleDateString()}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => shareText(story.story)}
              >
                <Text style={styles.buttonText}>Share Story</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text>No stories available.</Text>
          )}
        </View>

        {/* Current Challenge */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Challenge</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Challenges')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {challengeLoading ? (
            <ActivityIndicator
              size="large"
              color="#3478f6"
            />
          ) : story ? (
            <View style={styles.card}>
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

              <TouchableOpacity
                style={styles.button}
                onPress={() => joinChallenge(challenge.id)}
              >
                <Text style={styles.buttonText}>Join Challenge</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text>No challenges available.</Text>
          )}
        </View>

        {/* Share Stories */}
        <View style={styles.shareStoriesCard}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('ShareUserStory')}
          >
            <Ionicons
              name="book-outline"
              size={40}
              color="#3478f6"
            />
            <Text style={styles.shareStoriesHeader}>Share Stories</Text>
            <Text style={styles.shareText}>
              Share your personal experiences of empathy and inspire others to
              make a difference.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Join Challenges */}
        <View style={styles.joinChallengesCard}>
          <TouchableOpacity style={styles.linkButton}>
            <Ionicons
              name="trophy-outline"
              size={40}
              color="#3478f6"
            />
            <Text style={styles.shareStoriesHeader}>Join Challenges</Text>
            <Text style={styles.shareText}>
              Participate in community challenges designed to create positive
              social impact.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Earn Rewards */}
        <View style={styles.earnRewardsCard}>
          <Ionicons
            name="medal-outline"
            size={40}
            color="#3478f6"
          />
          <Text style={styles.shareStoriesHeader}>Earn Rewards</Text>
          <Text style={styles.shareText}>
            Complete learning modules and challenges to earn badges and
            recognition.
          </Text>
        </View>
      </ScrollView>
      {/* Footer */}
      <View style={styles.footer}></View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewAll: {
    fontSize: 14,
    color: '#3478f6',
  },
  card: {
    borderWidth: 1,
    borderColor: '#2D6EFF',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  storyTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 8,
  },
  storyTag: {
    backgroundColor: '#d0e6ff',
    color: '#3478f6',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
    // alignSelf: 'flex-start',
  },
  storyText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  button: {
    backgroundColor: '#3478f6',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  linkButton: {
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  shareStoriesCard: {
    borderWidth: 1,
    borderColor: '#3478f6',
    backgroundColor: '#E3ECFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: 200,
  },
  joinChallengesCard: {
    borderWidth: 1,
    borderColor: '#FFB62D',
    backgroundColor: '#FFFDE3',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: 200,
  },
  earnRewardsCard: {
    borderWidth: 1,
    borderColor: '#2DFF4D',
    backgroundColor: '#E3FFF1',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: 200,
  },
  shareStoriesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
  shareText: {
    fontSize: 17,
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
  footer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },

  footerText: {
    fontSize: 12,
    color: '#888',
  },
});
