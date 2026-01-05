import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { icons } from '@/constants/icons';
import { images } from '@/constants/images';

interface ProfileOptionProps {
    title: string;
    icon?: any;
    showArrow?: boolean;
    isDestructive?: boolean;
}

const ProfileOption = ({ title, icon, showArrow = true, isDestructive = false }: ProfileOptionProps) => (
    <TouchableOpacity className='flex-row items-center justify-between w-full py-4 border-b border-white/10'>
        <View className='flex-row items-center gap-4'>
            {icon && (
                <View className='size-10 bg-white/10 rounded-full items-center justify-center'>
                    <Image
                        source={icon}
                        className='size-5'
                        tintColor={isDestructive ? '#ef4444' : '#ffffff'}
                    />
                </View>
            )}
            <Text className={`text-base font-semibold ${isDestructive ? 'text-red-500' : 'text-white'}`}>
                {title}
            </Text>
        </View>

        {showArrow && (
            <Image
                source={icons.arrow}
                className='size-4 rotate-180'
                tintColor='#6b7280'
            />
        )}
    </TouchableOpacity>
);

const Profile = () => {
    return (
        <View className='bg-primary flex-1'>
            <Image
                source={images.bg}
                className='absolute w-full h-full z-0'
                resizeMode='cover'
            />

            <SafeAreaView className='flex-1'>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

                    <View className='px-5 mt-5 mb-8'>
                        <Text className='text-2xl font-bold text-white'>My Profile</Text>
                    </View>

                    <View className='items-center justify-center mb-10'>
                        <View className='size-28 rounded-full border-2 border-accent p-1 mb-4 overflow-hidden'>
                            <Image
                                source={{ uri: 'https://i.pinimg.com/736x/fa/c3/d2/fac3d255fcf54ce831406787a51594c7.jpg' }}
                                className='w-full h-full rounded-full'
                                resizeMode='cover'
                            />
                        </View>

                        <Text className='text-white text-xl font-bold'>Sanchie Mikhailovna</Text>
                        <Text className='text-gray-400 text-sm mt-1'>@snchie_mkhlvna</Text>

                        <View className='flex-row items-center justify-center gap-8 mt-6 w-full px-10'>
                            <View className='items-center'>
                                <Text className='text-white font-bold text-lg'>124</Text>
                                <Text className='text-gray-400 text-xs'>Watched</Text>
                            </View>
                            <View className='w-[1px] h-8 bg-white/20' />
                            <View className='items-center'>
                                <Text className='text-white font-bold text-lg'>48</Text>
                                <Text className='text-gray-400 text-xs'>Favorites</Text>
                            </View>
                            <View className='w-[1px] h-8 bg-white/20' />
                            <View className='items-center'>
                                <Text className='text-white font-bold text-lg'>21</Text>
                                <Text className='text-gray-400 text-xs'>Reviews</Text>
                            </View>
                        </View>
                    </View>

                    <View className='px-5'>
                        <Text className='text-gray-400 text-sm font-semibold mb-4 uppercase tracking-widest'>General</Text>


                        <ProfileOption title='Edit Profile' icon={icons.person} />
                        <ProfileOption title='Notifications' icon={icons.save} />
                        <ProfileOption title='Security' icon={icons.play} />
                        <ProfileOption title='Language' icon={icons.search} />

                        <View className='h-8' />

                        <Text className='text-gray-400 text-sm font-semibold mb-4 uppercase tracking-widest'>Support</Text>
                        <ProfileOption title='Help Center' icon={icons.person} />
                        <ProfileOption title='Privacy Policy' icon={icons.save} />

                        <View className='h-8' />

                        <ProfileOption title='Log Out' icon={icons.arrow} isDestructive showArrow={false} />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default Profile;