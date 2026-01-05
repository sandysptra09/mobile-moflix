import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MovieCard from '@/components/movie-card';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { getSavedMovies } from '@/services/appwrite';
import useFetch from '@/services/useFetch';

const Saved = () => {
    const { data: savedMovies, loading, error, refetch } = useFetch(getSavedMovies);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    return (
        <View className='bg-primary flex-1'>
            <Image
                source={images.bg}
                className='absolute w-full h-full z-0'
                resizeMode='cover'
            />

            <SafeAreaView className='flex-1'>
                <View className='px-5 mt-5 mb-5'>
                    <Text className='text-2xl font-bold text-white'>My Watchlist</Text>
                </View>

                {loading ? (
                    <View className='flex-1 justify-center items-center'>
                        <ActivityIndicator size='large' color='#0000ff' />
                    </View>
                ) : (
                    <FlatList
                        data={savedMovies}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={3}
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            paddingBottom: 100
                        }}
                        columnWrapperStyle={{
                            justifyContent: 'flex-start',
                            gap: 16,
                            marginBottom: 16,
                        }}
                        renderItem={({ item }) => <MovieCard {...item} />}
                        ListEmptyComponent={
                            <View className='flex-1 justify-center items-center mt-20'>
                                <Image
                                    source={icons.save}
                                    className='size-12 mb-4'
                                    tintColor='#666'
                                />
                                <Text className='text-gray-500 text-base'>
                                    No movies saved yet
                                </Text>
                            </View>
                        }
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={refetch} />
                        }
                    />
                )}
            </SafeAreaView>
        </View>
    );
};

export default Saved;