import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { Player } from '@/types';
import { PlusCircle, MinusCircle, Star, Trophy, User } from 'lucide-react-native';

interface PlayerCardProps {
  player: Player;
  onAdd?: () => void;
  onRemove?: () => void;
  onSetCaptain?: () => void;
  inTeam?: boolean;
  isCaptain?: boolean;
  disabled?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onAdd,
  onRemove,
  onSetCaptain,
  inTeam = false,
  isCaptain = false,
  disabled = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const positionColor = colors.positions[player.position];

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <View style={[
      styles.container,
      inTeam && styles.inTeamContainer,
      isCaptain && styles.captainContainer,
      disabled && styles.disabledContainer
    ]}>
      <View style={styles.header}>
        <View style={[styles.positionBadge, { backgroundColor: positionColor }]}>
          <Text style={styles.positionText}>{player.position}</Text>
        </View>
        <Text style={styles.teamText}>{player.team}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>£{player.price.toFixed(1)}m</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {imageLoading && !imageError && (
            <View style={[styles.placeholderContainer, styles.loadingContainer]}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
          {imageError ? (
            <View style={styles.placeholderContainer}>
              <User size={24} color={colors.textSecondary} />
            </View>
          ) : (
            <Image 
              source={{ uri: player.image }} 
              style={[
                styles.image,
                imageLoading && styles.hiddenImage
              ]} 
              resizeMode="cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.nameText} numberOfLines={1}>{player.name}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>PTS</Text>
              <Text style={styles.statValue}>{player.points}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>G</Text>
              <Text style={styles.statValue}>{player.stats.goals}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>A</Text>
              <Text style={styles.statValue}>{player.stats.assists}</Text>
            </View>
            
            {player.position === 'GK' && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>S</Text>
                <Text style={styles.statValue}>{player.stats.saves}</Text>
              </View>
            )}
            
            {(player.position === 'GK' || player.position === 'DEF') && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>CS</Text>
                <Text style={styles.statValue}>{player.stats.cleanSheets}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.actions}>
        {inTeam ? (
          <>
            {onSetCaptain && !isCaptain && (
              <Pressable 
                style={styles.actionButton} 
                onPress={onSetCaptain}
                disabled={disabled}
              >
                <Star size={20} color={colors.primary} />
              </Pressable>
            )}
            {onRemove && (
              <Pressable 
                style={styles.actionButton} 
                onPress={onRemove}
                disabled={disabled}
              >
                <MinusCircle size={20} color={colors.error} />
              </Pressable>
            )}
          </>
        ) : (
          onAdd && (
            <Pressable 
              style={styles.actionButton} 
              onPress={onAdd}
              disabled={disabled}
            >
              <PlusCircle size={20} color={colors.primary} />
            </Pressable>
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inTeamContainer: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  captainContainer: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRightWidth: 4,
    borderRightColor: colors.primary,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  positionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  positionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  teamText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priceContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: colors.background,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    marginRight: 12,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButton: {
    padding: 4,
  },
  captainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  captainText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 4,
  },
  loadingContainer: {
    backgroundColor: colors.background,
  },
  hiddenImage: {
    opacity: 0,
  },
});