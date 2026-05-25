import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

// ------------------------
// Types
// ------------------------
interface ReferralReward {
  id: number;
  referred_id: number;
  reward_amount: string;
  created_at: string;
}

interface WalletHistory {
  id: number;
  vendor_id: number;
  amount: string;
  type: 'credit' | 'debit';
  note: string | null;
  created_at: string;
}

interface WalletData {
  success: boolean;
  wallet_balance: string;
  referral_rewards: ReferralReward[];
  wallet_history: WalletHistory[];
}

// ------------------------
// Main Component
// ------------------------
const WalletScreen: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<'referral' | 'history'>('referral');
  const user = useSelector((state: any) => state.user);

  const fetchWalletData = async () => {
    try {
      const response = await fetch(`https://mycityinbox.com/api/sales/${user.id}/wallet`);
      const data: WalletData = await response.json();
      setWalletData(data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWalletData();
  }, []);

  const renderRewardItem = ({ item }: { item: ReferralReward }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Icon name="gift-outline" size={22} color="#4CAF50" />
        <Text style={styles.amount}>₹ {item.reward_amount}</Text>
      </View>
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </Text>
    </View>
  );

  const renderHistoryItem = ({ item }: { item: WalletHistory }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Icon
          name={item.type === 'credit' ? 'arrow-up-bold-circle-outline' : 'arrow-down-bold-circle-outline'}
          size={22}
          color={item.type === 'credit' ? '#4CAF50' : '#F44336'}
        />
        <Text style={[styles.amount, { color: item.type === 'credit' ? '#4CAF50' : '#F44336' }]}>
          {item.type === 'credit' ? '+' : '-'} ₹ {item.amount}
        </Text>
      </View>
      {item.note && <Text style={styles.date}>{item.note}</Text>}
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Wallet Balance */}
      <View style={styles.walletCard}>
        <View style={styles.row}>
          <Icon name="wallet-outline" size={28} color="#2980b9" />
          <Text style={styles.balanceText}>Wallet Balance</Text>
        </View>
        <Text style={styles.balanceAmount}>₹ {walletData?.wallet_balance ?? '0.00'}</Text>
      </View>

      {/* Select Box */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'referral' && styles.activeTab]}
          onPress={() => setSelectedTab('referral')}
        >
          <Text style={[styles.tabText, selectedTab === 'referral' && styles.activeTabText]}>Referral Rewards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
          onPress={() => setSelectedTab('history')}
        >
          <Text style={[styles.tabText, selectedTab === 'history' && styles.activeTabText]}>Wallet History</Text>
        </TouchableOpacity>
      </View>

      {/* List with Pull-to-Refresh */}
      <FlatList
        data={selectedTab === 'referral' ? walletData?.referral_rewards : walletData?.wallet_history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={selectedTab === 'referral' ? renderRewardItem : renderHistoryItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            {selectedTab === 'referral' ? 'No referral rewards found.' : 'No wallet transactions found.'}
          </Text>
        }
      />
    </View>
  );
};

// ------------------------
// Styles
// ------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC', padding: 16 },
  walletCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 4, marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  balanceText: { fontSize: 18, fontWeight: '600', marginLeft: 10, color: '#333' },
  balanceAmount: { fontSize: 32, fontWeight: 'bold', color: '#2980b9', marginTop: 10 },
  tabContainer: { flexDirection: 'row', marginBottom: 16 },
  tab: { flex: 1, padding: 12, backgroundColor: '#e0e0e0', borderRadius: 8, marginHorizontal: 4 },
  activeTab: { backgroundColor: '#2980b9' },
  tabText: { textAlign: 'center', color: '#333', fontWeight: '600' },
  activeTabText: { color: '#fff' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  amount: { fontSize: 16, fontWeight: '500', marginLeft: 10 },
  date: { fontSize: 13, color: '#999' },
  emptyMessage: { textAlign: 'center', color: '#666', fontSize: 15, marginTop: 20 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default WalletScreen;
