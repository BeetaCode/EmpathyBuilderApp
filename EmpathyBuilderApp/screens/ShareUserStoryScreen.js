import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMyUserStories, addUserStory } from '../api/userStoryApi';

const ShareUserStoryScreen = () => {
  const navigation = useNavigation();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLoading, setShareLoading] = useState(true);
  const [userStory, setuserStory] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [showStoryError, setShowStoryError] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleAddTag = () => {
    if (tag.trim() !== '') {
      setTags([...tags, tag.trim()]);
      setTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  useEffect(() => {
    setShareLoading(false);
    const fetchStories = async () => {
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

  const validate = () => {
    let valid = true;

    if (userStory === '') {
      setShowStoryError('Story cannot be empty');

      valid = false;
    } else {
      setShowStoryError('');
    }

    return valid;
  };

  const handleShareStory = async () => {
    if (!validate()) return;
    setShareLoading(true);

    try {
      const response = await addUserStory({
        story: userStory,
        tags,
        isShared,
        isAnonymous,
      });

      if (
        response.success &&
        response.data.message === 'user_story_posted_successfully'
      ) {
        Alert.alert('You are Great!!!', response.data.data.feedback);
      } else {
        Alert.alert('Error', 'Something went wrong.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setShareLoading(false);
      setTag('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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

        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <Text style={styles.title}>Share My Story</Text>
          <Text style={styles.subtitle}>
            Share an experience where you practiced empathy or made a positive
            impact
          </Text>
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
              <Text style={styles.noStoryText}>No stories available.</Text>
            )}
          </View>
          {/* Share my story */}
          <View style={styles.card}>
            <Text style={[styles.myStoryHeader, styles.sectionTitle]}>
              My Story
            </Text>
            <TextInput
              placeholder="Type your story here..."
              style={styles.textArea}
              value={userStory}
              multiline={true}
              numberOfLines={10}
              onChangeText={setuserStory}
            />
            {showStoryError !== '' && (
              <Text style={styles.errorText}>{showStoryError}</Text>
            )}
            <View style={styles.checkboxGroup}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsShared(!isShared)}
              >
                <View style={styles.checkbox}>
                  {isShared && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color="blue"
                    />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Make Public</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsAnonymous(!isAnonymous)}
              >
                <View style={styles.checkbox}>
                  {isAnonymous && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color="blue"
                    />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Share Anonymously</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Add Tags (Optional)</Text>
            <View style={styles.tagRow}>
              <TextInput
                style={styles.tagInput}
                value={tag}
                onChangeText={setTag}
                placeholder="Add a tag here..."
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTag}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Display tags below input */}
            <View style={styles.tagList}>
              {tags.map((tag, index) => (
                <View
                  key={index}
                  style={styles.tagChip}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <Ionicons
                      name="close"
                      size={14}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleShareStory()}
              disabled={shareLoading}
            >
              {shareLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Share My Story</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* Footer */}
        <View style={styles.footer}></View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 0,
    padding: 10,
  },
  myStoryHeader: {
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
  addButton: {
    marginLeft: 8,
    backgroundColor: '#3478f6',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
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
    marginBottom: 10,
    paddingHorizontal: 50,
  },
  noStoryText: {
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top', // Important for Android
    fontSize: 14,
    marginBottom: 12,
    minHeight: 150,
    backgroundColor: 'white',
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
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
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlignVertical: 'top', // Important for Android
    fontSize: 14,
    backgroundColor: 'white',
    width: 290,
    padding: 14,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tagChip: {
    flexDirection: 'row',
    backgroundColor: '#3478f6',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  tagText: {
    color: '#fff',
    marginRight: 4,
  },
  footer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    paddingLeft: 5,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
  checkboxGroup: {
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#3478f6',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#3478f6',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
});
