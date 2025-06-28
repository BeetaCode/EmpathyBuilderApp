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
import { getUserStories } from '../api/userStoryApi';

const FeaturedStoriesScreen = () => {
  const navigation = useNavigation();
  const [stories, setStories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const result = await getUserStories();
      if (result.success) {
        setStories(result.data);
      } else {
        console.warn('Failed to load stories:', result.error.message);
      }
      setLoading(false);
    };

    fetchStories();
  }, []);

  const filteredStories = stories.filter(
    (story) =>
      story.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      story.story?.toLowerCase().includes(search.toLowerCase())
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

      <Text style={styles.featureTitle}>Featured Stories</Text>
      <Text style={styles.description}>
        Explore heartwarming featured stories of empathy and kindness from our
        community members
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
          placeholder="Search stories..."
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
        ) : filteredStories.length > 0 ? (
          filteredStories.map((story, index) => (
            <View
              key={index}
              style={styles.card}
            >
              <View style={styles.storyHeader}>
                <Text style={styles.storyAuthor}>{story.fullName}</Text>
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color="#888"
                />
              </View>

              <View style={styles.storyTagContainer}>
                {story.userStoryTags?.map((tag, i) => (
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
                <Text style={styles.iconText}>💙 {story.likes}</Text>
                <Text style={styles.timeText}>
                  {new Date(story.postedOn).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text>No stories available.</Text>
        )}
      </ScrollView>
      <View style={styles.footer} />
    </View>
  );
};

export default FeaturedStoriesScreen;

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
    paddingHorizontal: 10,
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
  card: {
    borderWidth: 1,
    borderColor: '#2D6EFF',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
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
  },
  storyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
