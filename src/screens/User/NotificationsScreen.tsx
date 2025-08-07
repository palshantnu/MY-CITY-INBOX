import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { baseURL, getData, postData } from '../../API'; // your helper
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

type NotificationItemType = {
    id: number;
    title?: string;
    message?: string;
    createdAt?: string;
    image?: string;  // Add image field
    // other fields if any
};

const NotificationsScreen = ({ navigation }) => {
    const isFocused = useIsFocused();

    const [notifications, setNotifications] = useState<NotificationItemType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const user = useSelector(state => state.user);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getData('notification');
            console.log('====================================');
            console.log(res);
            console.log('====================================');
            if (Array.isArray(res)) {
                setNotifications(res);
            } else if (res && Array.isArray(res.data)) {
                setNotifications(res.data);
            } else {
                setNotifications(res.notifications ?? []);
            }
        } catch (err) {
            console.log('fetchNotifications error', err);
            Alert.alert('Error', 'Failed to fetch notifications');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (!isFocused) return;
        fetchNotifications();
    }, [isFocused, fetchNotifications]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
    };
    const renderItem = ({ item }: { item: NotificationItemType }) => {
        const time = item.createdAt ? new Date(item.createdAt).toLocaleString() : '';
        return (
            <TouchableOpacity
                style={styles.item}
                activeOpacity={0.8}
                onPress={() => {
                    // optional: open detail later
                }}
            >
                <View style={styles.itemLeft}>
                    {item.image ? (
                        <Image
                            source={{ uri: `${baseURL}/uploads/notifications/${item.image}` }}
                            style={styles.notificationThumbnail}
                            resizeMode="cover"
                        />
                    ) : (
                        <Icon name="bell-outline" size={28} color="#2980b9" />
                    )}
                </View>

                <View style={styles.itemBody}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.title ?? 'Notification'}
                    </Text>

                    {item.message ? (
                        <Text style={styles.itemMessage} numberOfLines={1}>
                            {item.message}
                        </Text>
                    ) : null}

                    <Text style={styles.itemTime}>{time}</Text>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="chevron-left" size={28} color="#2d3436" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            {loading && notifications.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => String(item.id ?? item.createdAt ?? Math.random())}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyText}>No notifications</Text>
                        </View>
                    )}
                    contentContainerStyle={notifications.length === 0 ? { flex: 1 } : undefined}
                />
            )}
        </SafeAreaView>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f6f8' },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    backBtn: { padding: 6, marginRight: 6 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#2d3436' },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    separator: { height: 8, backgroundColor: '#f4f6f8' },

    emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    emptyText: { color: '#7f8c8d', fontSize: 16 },
    notificationThumbnail: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },

    itemBody: {
        flex: 1,
        justifyContent: 'center',
    },

    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2d3436',
    },

    itemMessage: {
        fontSize: 14,
        color: '#616161',
        marginTop: 2,
    },

    itemTime: {
        fontSize: 12,
        color: '#9e9e9e',
        marginTop: 4,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',   // center vertically
        padding: 14,
        backgroundColor: '#fff',
    },

    itemLeft: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

});
