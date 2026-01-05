import { icons } from '@/constants/icons';
import { fetchMovieDetails, fetchMovieRecommendations } from '@/services/api';
import { checkIsSaved, saveMovie, unsaveMovie } from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MovieCard from '@/components/movie-card';

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className='flex-col items-start justify-center mt-5'>
        <Text className='text-light-200 font-normal text-sm'>{label}</Text>
        <Text className='text-light-100 font-bold text-sm mt-2'>
            {value || 'N/A'}
        </Text>
    </View>
);

const Details = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { data: movie, loading } = useFetch(() =>
        fetchMovieDetails(id as string)
    );

    const { data: recommendations, loading: recommendationsLoading } = useFetch(() =>
        fetchMovieRecommendations(id as string)
    );

    useEffect(() => {
        const checkStatus = async () => {
            if (id) {
                const status = await checkIsSaved(Number(id));
                setIsSaved(status);
            }
        };
        checkStatus();
    }, [id]);

    const toggleSave = async () => {
        if (isSaving || !movie) return;

        setIsSaving(true);
        try {
            if (isSaved) {
                await unsaveMovie(movie.id);
                setIsSaved(false);
            } else {
                await saveMovie(movie as any);
                setIsSaved(true);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update watchlist');
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenTrailer = () => {
        const trailer = movie?.videos?.results?.find(
            (vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube'
        );

        if (trailer?.key) {
            Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`);
        } else {
            Alert.alert('Sorry', 'No trailer available for this movie.');
        }
    };

    if (loading)
        return (
            <SafeAreaView className='bg-primary flex-1'>
                <ActivityIndicator />
            </SafeAreaView>
        );

    return (
        <View className='bg-primary flex-1'>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View>
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                        }}
                        className='w-full h-[550px]'
                        resizeMode='stretch'
                    />

                    <TouchableOpacity
                        className='absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center'
                        onPress={handleOpenTrailer}
                    >
                        <Image
                            source={icons.play}
                            className='w-6 h-7 ml-1'
                            resizeMode='stretch'
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className='absolute top-12 right-5 rounded-full size-12 bg-black/50 flex items-center justify-center z-10'
                        onPress={toggleSave}
                        disabled={isSaving}
                    >
                        <Image
                            source={icons.save}
                            className='size-6'
                            tintColor={isSaved ? '#ef4444' : '#ffffff'}
                        />
                    </TouchableOpacity>
                </View>

                <View className='flex-col items-start justify-center mt-5 px-5'>
                    <Text className='text-white font-bold text-xl'>{movie?.title}</Text>
                    <View className='flex-row items-center gap-x-1 mt-2'>
                        <Text className='text-light-200 text-sm'>
                            {movie?.release_date?.split('-')[0]} •
                        </Text>
                        <Text className='text-light-200 text-sm'>{movie?.runtime}m</Text>
                    </View>

                    <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
                        <Image source={icons.star} className='size-4' />

                        <Text className='text-white font-bold text-sm'>
                            {Math.round(movie?.vote_average ?? 0)}/10
                        </Text>

                        <Text className='text-light-200 text-sm'>
                            ({movie?.vote_count} votes)
                        </Text>
                    </View>

                    <MovieInfo label='Overview' value={movie?.overview} />
                    <MovieInfo
                        label='Genres'
                        value={movie?.genres?.map((g) => g.name).join(' • ') || 'N/A'}
                    />

                    <View className='flex flex-row justify-between w-1/2'>
                        <MovieInfo
                            label='Budget'
                            value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
                        />
                        <MovieInfo
                            label='Revenue'
                            value={`$${Math.round(
                                (movie?.revenue ?? 0) / 1_000_000
                            )} million`}
                        />
                    </View>

                    <MovieInfo
                        label='Production Companies'
                        value={
                            movie?.production_companies?.map((c) => c.name).join(' • ') ||
                            'N/A'
                        }
                    />

                    <View className='mt-8 mb-4 w-full'>
                        <Text className='text-white font-bold text-lg mb-4'>Cast</Text>

                        <FlatList
                            data={movie?.credits?.cast}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ gap: 14 }}
                            renderItem={({ item }) => (
                                <View className='items-center w-20'>
                                    <Image
                                        source={{
                                            uri: item.profile_path
                                                ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                                                : 'https://placehold.co/100x100/333/FFF?text=Actor'
                                        }}
                                        className='w-16 h-16 rounded-full mb-2'
                                        resizeMode='cover'
                                    />
                                    <Text className='text-white text-xs text-center font-medium' numberOfLines={2}>
                                        {item.name}
                                    </Text>
                                    <Text className='text-light-300 text-[10px] text-center' numberOfLines={1}>
                                        {item.character}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>

                    {recommendations && recommendations.length > 0 && (
                        <View className='mt-4 mb-8 w-full'>
                            <Text className='text-white font-bold text-lg mb-4'>
                                More Like This
                            </Text>
                            <FlatList
                                data={recommendations}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={{ gap: 14 }}
                                renderItem={({ item }) => (
                                    <MovieCard {...item} />
                                )}
                            />
                        </View>
                    )}

                </View>
            </ScrollView>

            <TouchableOpacity
                className='absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50'
                onPress={router.back}
            >
                <Image
                    source={icons.arrow}
                    className='size-5 mr-1 mt-0.5 rotate-180'
                    tintColor='#fff'
                />
                <Text className='text-white font-semibold text-base'>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Details;