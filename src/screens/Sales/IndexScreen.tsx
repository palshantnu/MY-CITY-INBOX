// screens/SalesExecutive/IndexScreen.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    StatusBar,
    Image
} from "react-native";
import { useSelector } from "react-redux";
import { baseURL, getData } from "../../API";
import { SafeAreaView } from "react-native-safe-area-context";

const IndexScreen = ({ navigation }) => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: any) => state.user);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const res = await getData(`vendor-list-sales/${user.id}`);
            console.log('====================================');
            console.log(res);
            console.log('====================================');
            setVendors(res);
        } catch (error) {
            console.log("Error fetching vendors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const renderVendor = ({ item }) => (
        <TouchableOpacity
            style={styles.card}

            activeOpacity={0.8}
        >
            {item?.images?.length > 0 ? (
                <Image
                    source={{ uri: `${baseURL}/uploads/vendors/${item.images[0]}` }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.noImageContainer}>
                    <Text style={styles.noImageText}>No Image</Text>
                </View>
            )}

            <View style={styles.cardContent}>
                <View style={styles.rowBetween}>
                    <Text style={styles.name}>Shop Name : {item.shop_name}</Text>
                    <Text
                        style={[
                            styles.status,
                            item.verified ? styles.active : styles.inactive,
                        ]}
                    >
                        {item.verified ? "ACTIVE" : "INACTIVE"}
                    </Text>
                </View>

                <View style={[styles.rowBetween, { marginTop: 10 }]}>
                    <Text style={styles.subInfo}>State: {item.state}</Text>
                    <Text style={styles.subInfo}>City: {item.city}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#2980b9" }} edges={["left", "right", "top"]}>
            <StatusBar backgroundColor="#2980b9" barStyle="light-content" />

            <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>My City Inbox</Text>
            </View>

            <View style={{ flex: 1, backgroundColor: "#f5f6fa", paddingHorizontal: 16 }}>
                <FlatList
                    style={{ marginTop: 20 }}
                    data={vendors}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderVendor}
                    refreshControl={
                        <RefreshControl refreshing={loading} colors={["#2980b9"]}
                            tintColor="#2980b9" onRefresh={fetchVendors} />
                    }
                    ListEmptyComponent={
                        !loading && (
                            <Text style={styles.emptyText}>No vendors found.</Text>
                        )
                    }
                    contentContainerStyle={vendors?.length === 0 && styles.emptyContainer}
                />
            </View>
        </SafeAreaView>
    );
};

export default IndexScreen;

const styles = StyleSheet.create({
    topBar: {
        height: 56,
        backgroundColor: "#2980b9",
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    topBarTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3,
    },
    bannerImage: {
        width: "100%",
        height: 160,
    },
    noImageContainer: {
        width: "100%",
        height: 160,
        backgroundColor: "#ececec",
        justifyContent: "center",
        alignItems: "center",
    },
    noImageText: {
        color: "#888",
        fontSize: 14,
    },
    cardContent: {
        padding: 16,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2c3e50",
    },
    subInfo: {
        fontSize: 13,
        color: "#666",
    },
    status: {
        fontSize: 12,
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: "hidden",
    },
    active: {
        backgroundColor: "#e6f4ea",
        color: "#2e7d32",
    },
    inactive: {
        backgroundColor: "#fdecea",
        color: "#c62828",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
    },
});

