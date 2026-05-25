import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';

interface Plan {
  id: number;
  duration_years: number;
  amount: string;
}

interface VendorPlan {
  id: number;
  plan_id: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired';
  SubscriptionPlan: Plan;
}

const VendorPlanList = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlan, setActivePlan] = useState<VendorPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);
  const user = useSelector((state: any) => state.user);
  const vendor_id = user?.id;

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      const res = await axios.get('https://mycityinbox.com/api/plans/list');
      if (res.data.success) setPlans(res.data.plans);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch plans');
    }
  };

  // Fetch vendor's active plan
  const fetchActivePlan = async () => {
    try {
      const res = await axios.get(`https://mycityinbox.com/api/vendor/${vendor_id}/plan`);
      if (res.data.success && res.data.vendorPlan) setActivePlan(res.data.vendorPlan);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPlans();
      await fetchActivePlan();
      setLoading(false);
    };
    loadData();
  }, []);

  const startPayment = async (plan: Plan) => {
    const amount = parseFloat(plan.amount) * 100; // Razorpay expects paise
    const options = {
      description: `${plan.duration_years}-Year Subscription`,
      currency: 'INR',
      // key: 'rzp_test_RReeW06i5vHQ2n', // 🔑 replace with your Razorpay Key ID
      key: 'rzp_live_RvpofRe5opusnU', // 🔑 replace with your Razorpay Key ID
      amount: amount.toString(),
      name: 'MyCityInbox',
      prefill: {
        email: user?.email || '',
        contact: user?.phone || '',
        name: user?.name || 'Vendor',
      },
      theme: { color: '#2980b9' },
    };

    try {
      const data = await RazorpayCheckout.open(options);
      if (data.razorpay_payment_id) {
        // Payment successful → confirm purchase in backend
        await confirmPurchase(plan, data.razorpay_payment_id);
      }
    } catch (error: any) {
      Alert.alert('Payment Failed', error.description || 'Something went wrong');
    }
  };

  const confirmPurchase = async (plan: Plan, paymentId: string) => {
    console.log('vendor_id',vendor_id, plan.id, paymentId);
    
    try {
      setPurchaseLoading(plan.id);
      const res = await axios.post('https://mycityinbox.com/api/plans/purchase', {
        vendor_id,
        plan_id: plan.id,
        razorpay_payment_id: paymentId, // store payment ID
      });

      if (res.data.success && res.data.vendorPlan) {
        Alert.alert('Success', res.data.message || 'Plan purchased successfully');
        setActivePlan(res.data.vendorPlan);
      } else {
        Alert.alert('Error', res.data.message || 'Failed to confirm purchase');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to confirm plan purchase');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handlePurchase = (plan: Plan) => {
    if (!vendor_id) return Alert.alert('Error', 'Vendor not found');
    Alert.alert(
      'Purchase Plan',
      `Do you want to purchase the ${plan.duration_years} ${plan.duration_years === 1 ? 'Year' : 'Years'} plan for ₹${parseFloat(plan.amount).toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed to Pay', onPress: () => startPayment(plan) },
      ]
    );
  };

  const renderPlanItem = ({ item }: { item: Plan }) => {
    const isActive = activePlan?.plan_id === item.id && activePlan.status === 'active';

    return (
      <LinearGradient
        colors={['#2980b9', '#2980b9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.planCard, isActive ? { borderColor: '#ffec00', borderWidth: 2 } : {}]}
      >
        <Text style={styles.planYears}>
          {item.duration_years} {item.duration_years === 1 ? 'Year' : 'Years'} {isActive ? '(Active)' : ''}
        </Text>
        <Text style={styles.planAmount}>₹ {parseFloat(item.amount).toFixed(2)}</Text>
        {isActive ? (
          <Text style={{ color: '#fff', marginTop: 4 }}>
            Valid until: {new Date(activePlan.end_date).toLocaleDateString()}
          </Text>
        ) : (
          <TouchableOpacity
            style={styles.purchaseBtn}
            onPress={() => handlePurchase(item)}
            disabled={purchaseLoading === item.id}
          >
            {purchaseLoading === item.id ? (
              <ActivityIndicator color="#2980b9" />
            ) : (
              <Text style={styles.purchaseBtnText}>Purchase Plan</Text>
            )}
          </TouchableOpacity>
        )}
      </LinearGradient>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2980b9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Plans</Text>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlanItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f2f5' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20, textAlign: 'center', color: '#2c3e50' },
  planCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  planYears: { fontSize: 22, fontWeight: '700', color: '#fff' },
  planAmount: { fontSize: 20, fontWeight: '600', color: '#ffec00', marginVertical: 8 },
  purchaseBtn: {
    marginTop: 12,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  purchaseBtnText: { color: '#2980b9', fontSize: 16, fontWeight: '700' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default VendorPlanList;
