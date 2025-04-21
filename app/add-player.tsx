import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/constants/colors';
import { useStore } from '@/store/useStore';
import { Position } from '@/types';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload, Link } from 'lucide-react-native';

type RootStackParamList = {
  Welcome: undefined;
  MainTabs: undefined;
  AddPlayer: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AddPlayerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addCustomPlayer } = useStore();
  
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Position>('MID');
  const [team, setTeam] = useState('');
  const [price, setPrice] = useState('5.0');
  const [goals, setGoals] = useState('0');
  const [assists, setAssists] = useState('0');
  const [cleanSheets, setCleanSheets] = useState('0');
  const [saves, setSaves] = useState('0');
  const [yellowCards, setYellowCards] = useState('0');
  const [redCards, setRedCards] = useState('0');
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('upload');
  
  const positions: Position[] = ['GK', 'DEF', 'MID', 'FWD'];
  
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setPlayerImage(result.assets[0].uri);
        setImageSource('upload');
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setPlayerImage(result.assets[0].uri);
        setImageSource('upload');
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      Alert.alert('Error', 'Please enter an image URL');
      return;
    }
    
    // Basic URL validation
    try {
      new URL(imageUrl);
      setPlayerImage(imageUrl);
      setImageSource('url');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Alert.alert('Error', 'Please enter a valid URL');
    }
  };
  
  const handleAddPlayer = () => {
    // Validate inputs
    if (!name.trim()) {
      Alert.alert('Error', 'Player name is required');
      return;
    }
    
    if (!team.trim()) {
      Alert.alert('Error', 'Team name is required');
      return;
    }
    
    if (!playerImage) {
      Alert.alert('Error', 'Player image is required');
      return;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Error', 'Price must be a positive number');
      return;
    }
    
    // Create player object
    const newPlayer = {
      name: name.trim(),
      position,
      team: team.trim(),
      price: priceValue,
      points: 0, // Will be calculated based on stats
      image: playerImage,
      stats: {
        goals: parseInt(goals) || 0,
        assists: parseInt(assists) || 0,
        cleanSheets: parseInt(cleanSheets) || 0,
        saves: position === 'GK' ? (parseInt(saves) || 0) : undefined,
        yellowCards: parseInt(yellowCards) || 0,
        redCards: parseInt(redCards) || 0,
      }
    };
    
    // Calculate points based on stats
    let points = 0;
    
    // Base points for playing
    points += 2;
    
    // Points for goals
    if (position === 'GK' || position === 'DEF') {
      points += newPlayer.stats.goals * 6;
    } else if (position === 'MID') {
      points += newPlayer.stats.goals * 5;
    } else {
      points += newPlayer.stats.goals * 4;
    }
    
    // Points for assists
    points += newPlayer.stats.assists * 3;
    
    // Points for clean sheets
    if (position === 'GK' || position === 'DEF') {
      points += newPlayer.stats.cleanSheets * 4;
    } else if (position === 'MID') {
      points += newPlayer.stats.cleanSheets * 1;
    }
    
    // Points for saves (GK only)
    if (position === 'GK' && newPlayer.stats.saves) {
      points += Math.floor(newPlayer.stats.saves / 3);
    }
    
    // Deductions for cards
    points -= newPlayer.stats.yellowCards;
    points -= newPlayer.stats.redCards * 3;
    
    // Update points
    newPlayer.points = Math.max(0, points);
    
    // Add player to store
    addCustomPlayer(newPlayer);
    
    Alert.alert(
      'Success',
      `${name} has been added to the players list`,
      [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Player Information</Text>
            
            <View style={styles.imageUploadContainer}>
              {playerImage ? (
                <Image 
                  source={{ uri: playerImage }} 
                  style={styles.playerImage} 
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Upload size={24} color={colors.textSecondary} />
                  <Text style={styles.imagePlaceholderText}>Add player image</Text>
                </View>
              )}
              
              <View style={styles.imageSourceTabs}>
                <Pressable 
                  style={[
                    styles.imageSourceTab,
                    imageSource === 'upload' && styles.activeImageSourceTab
                  ]}
                  onPress={() => setImageSource('upload')}
                >
                  <Text style={[
                    styles.imageSourceText,
                    imageSource === 'upload' && styles.activeImageSourceText
                  ]}>Upload</Text>
                </Pressable>
                <Pressable 
                  style={[
                    styles.imageSourceTab,
                    imageSource === 'url' && styles.activeImageSourceTab
                  ]}
                  onPress={() => setImageSource('url')}
                >
                  <Text style={[
                    styles.imageSourceText,
                    imageSource === 'url' && styles.activeImageSourceText
                  ]}>URL</Text>
                </Pressable>
              </View>
              
              {imageSource === 'upload' ? (
                <View style={styles.imageActions}>
                  <Pressable 
                    style={styles.imageActionButton}
                    onPress={pickImage}
                  >
                    <Upload size={20} color={colors.primary} />
                    <Text style={styles.imageActionText}>Upload</Text>
                  </Pressable>
                  <Pressable 
                    style={styles.imageActionButton}
                    onPress={takePhoto}
                  >
                    <Camera size={20} color={colors.primary} />
                    <Text style={styles.imageActionText}>Camera</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.urlInputContainer}>
                  <TextInput
                    style={styles.urlInput}
                    value={imageUrl}
                    onChangeText={setImageUrl}
                    placeholder="Enter image URL (e.g. Premier League player URL)"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <Pressable 
                    style={styles.urlSubmitButton}
                    onPress={handleUrlSubmit}
                  >
                    <Link size={20} color="white" />
                    <Text style={styles.urlSubmitText}>Use URL</Text>
                  </Pressable>
                </View>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter player name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Position</Text>
              <View style={styles.positionsContainer}>
                {positions.map((pos) => (
                  <Pressable
                    key={pos}
                    style={[
                      styles.positionButton,
                      position === pos && styles.activePositionButton,
                    ]}
                    onPress={() => setPosition(pos)}
                  >
                    <Text
                      style={[
                        styles.positionText,
                        position === pos && styles.activePositionText,
                      ]}
                    >
                      {pos}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Team</Text>
              <TextInput
                style={styles.input}
                value={team}
                onChangeText={setTeam}
                placeholder="Enter team name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price (£m)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Enter price"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Player Stats</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statInput}>
                <Text style={styles.statLabel}>Goals</Text>
                <TextInput
                  style={styles.statInputField}
                  value={goals}
                  onChangeText={setGoals}
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={styles.statInput}>
                <Text style={styles.statLabel}>Assists</Text>
                <TextInput
                  style={styles.statInputField}
                  value={assists}
                  onChangeText={setAssists}
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={styles.statInput}>
                <Text style={styles.statLabel}>Clean Sheets</Text>
                <TextInput
                  style={styles.statInputField}
                  value={cleanSheets}
                  onChangeText={setCleanSheets}
                  keyboardType="number-pad"
                />
              </View>
              
              {position === 'GK' && (
                <View style={styles.statInput}>
                  <Text style={styles.statLabel}>Saves</Text>
                  <TextInput
                    style={styles.statInputField}
                    value={saves}
                    onChangeText={setSaves}
                    keyboardType="number-pad"
                  />
                </View>
              )}
              
              <View style={styles.statInput}>
                <Text style={styles.statLabel}>Yellow Cards</Text>
                <TextInput
                  style={styles.statInputField}
                  value={yellowCards}
                  onChangeText={setYellowCards}
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={styles.statInput}>
                <Text style={styles.statLabel}>Red Cards</Text>
                <TextInput
                  style={styles.statInputField}
                  value={redCards}
                  onChangeText={setRedCards}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.addButton}
              onPress={handleAddPlayer}
            >
              <Text style={styles.addButtonText}>Add Player</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  formSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  positionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  positionButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activePositionButton: {
    backgroundColor: colors.primary,
  },
  positionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activePositionText: {
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statInput: {
    width: '48%',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  statInputField: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  playerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  imageSourceTabs: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageSourceTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  activeImageSourceTab: {
    backgroundColor: colors.primary,
  },
  imageSourceText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeImageSourceText: {
    color: 'white',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  imageActionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  urlInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  urlInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  urlSubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  urlSubmitText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
});