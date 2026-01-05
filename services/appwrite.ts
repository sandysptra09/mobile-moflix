import { Client, Databases, ID, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query),
        ]);

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];
            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                }
            );
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                title: movie.title,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (error) {
        console.error('Error updating search count:', error);
        throw error;
    }
};

export const getTrendingMovies = async (): Promise<
    TrendingMovie[] | undefined
> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ]);

        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export const getSavedMovies = async (): Promise<Movie[] | undefined> => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            SAVED_COLLECTION_ID
        );

        return result.documents.map((doc) => ({
            id: doc.movie_id,
            title: doc.title,
            poster_path: doc.poster_url, 
            vote_average: parseFloat(doc.vote_average),
            release_date: doc.release_date,
            adult: false,
            backdrop_path: "",
            genre_ids: [],
            original_language: "en",
            original_title: doc.title,
            overview: "",
            popularity: 0,
            video: false,
            vote_count: 0
        }));
    } catch (error) {
        console.error('Error fetching saved movies:', error);
        return undefined;
    }
};

export const checkIsSaved = async (movieId: number): Promise<boolean> => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            SAVED_COLLECTION_ID,
            [Query.equal('movie_id', movieId)] // Cek berdasarkan movie_id
        );

        return result.documents.length > 0;
    } catch (error) {
        console.error('Error checking saved status:', error);
        return false;
    }
};

export const saveMovie = async (movie: MovieDetails) => {
    try {
        await database.createDocument(
            DATABASE_ID,
            SAVED_COLLECTION_ID,
            ID.unique(),
            {
                movie_id: movie.id,
                title: movie.title,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, // Masukin URL lengkap
                vote_average: movie.vote_average.toString(), // Convert ke String sesuai settingan DB lu
                release_date: movie.release_date,
            }
        );
        return true;
    } catch (error) {
        console.error('Error saving movie:', error);
        return false;
    }
};

export const unsaveMovie = async (movieId: number) => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            SAVED_COLLECTION_ID,
            [Query.equal('movie_id', movieId)]
        );

        if (result.documents.length > 0) {
            await database.deleteDocument(
                DATABASE_ID,
                SAVED_COLLECTION_ID,
                result.documents[0].$id
            );
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting movie:', error);
        return false;
    }
};