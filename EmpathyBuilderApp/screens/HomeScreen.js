import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
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

      {/* Featured Story */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Story</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.storyHeader}>
            <Text style={styles.storyAuthor}>Emma Johnson</Text>
            <Ionicons
              name="person-circle-outline"
              size={24}
              color="#888"
            />
          </View>

          <View style={styles.storyTagContainer}>
            <Text style={styles.storyTag}>Kindness</Text>
          </View>

          <Text style={styles.storyText}>
            Yesterday, I noticed an elderly person struggling with their grocery
            bags. More...
          </Text>

          <View style={styles.storyFooter}>
            <Text style={styles.iconText}>💙 24</Text>
            <Text style={styles.timeText}>2 hours ago</Text>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Read More</Text>
          </TouchableOpacity>
        </View>
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
      <View style={styles.shareCard}>
        <Ionicons
          name="book-outline"
          size={28}
          color="#3478f6"
        />
        <Text style={styles.shareText}>
          Share your personal experiences of empathy and inspire others to act.
        </Text>
      </View>
    </ScrollView>
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
    marginBottom: 20,
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
    alignSelf: 'flex-start',
  },
  storyText: {
    fontSize: 14,
    color: '#333',
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
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  shareCard: {
    borderWidth: 1,
    borderColor: '#3478f6',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  shareText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
});
