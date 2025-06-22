import React, { useState, useEffect } from 'react';
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
import { getUserStories } from '../api/userStoryApi';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const result = await getUserStories();
      if (result.success) {
        setStory(result.data[0]);
      } else {
        console.warn('Failed to load stories:', result.error.message);
      }
      setLoading(false);
    };

    fetchStories();
  }, []);

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
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
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

              <Text style={styles.storyText}>
                {story.story.length > 150
                  ? `${story.story.substring(0, 150)}...`
                  : story.story}
              </Text>

              <View style={styles.storyFooter}>
                <Text style={styles.iconText}>💙 {story.likes}</Text>
                <Text style={styles.timeText}>
                  {new Date(story.postedOn).toLocaleDateString()}
                </Text>
              </View>

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Read More</Text>
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
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.challengeTags}>
              <Text style={styles.challengeTagGreen}>Easy</Text>
              <Text style={styles.challengeTagBlue}>Environment</Text>
              <Ionicons
                name="trophy-outline"
                size={20}
                color="#888"
                style={{ marginLeft: 'auto' }}
              />
            </View>

            <Text style={styles.challengeTitle}>Community Clean-up</Text>
            <Text style={styles.challengeText}>
              Organize or join a local clean-up effort in your neighborhood or a
              nearby park.
            </Text>

            <View style={styles.challengeFooter}>
              <Text style={styles.iconText}>👥 152 participants</Text>
              <Text style={styles.timeText}>12 days left</Text>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Join Challenge</Text>
            </TouchableOpacity>
          </View>
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
    borderColor: '#ddd',
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
