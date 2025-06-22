import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
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

const ShareUserStoryScreen = () => {
  const navigation = useNavigation();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      const result = await getMyUserStories();
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
      <Text style={styles.title}>Share My Story</Text>
      <Text style={styles.subtitle}>
        Share an experience where you practiced empathy or made a positive
        impact
      </Text>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* my Story */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Stories</Text>
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
      </ScrollView>
      {/* Footer */}
      <View style={styles.footer}></View>
    </View>
  );
};

export default ShareUserStoryScreen;

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
  storyAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  icon: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: 'black',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 0,
    paddingHorizontal: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: '#3478f6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
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
  timeText: {
    fontSize: 12,
    color: '#999',
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    paddingLeft: 10,
  },
});
