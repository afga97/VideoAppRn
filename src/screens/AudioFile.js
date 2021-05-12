import React, { useRef, useState } from 'react'
import Video from 'react-native-video';
import ProgressBar from 'react-native-progress/Bar';

import Icon from 'react-native-vector-icons/dist/Ionicons';
import { useWindowDimensions, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'

export const AudioFile = () => {
    const window = useWindowDimensions();

    const [state, setState] = useState({
        progress: 0,
        duration: 0,
        paused: false,
        resizeMode: 'cover',
        fullScreen: false,
        rate: undefined,
        volume: undefined,
        muted: undefined,
        stylefull: {}

    })
    const videoRef = useRef();

    const onMainButtonPress = () => {
        if (state.progress >= 1) {
            videoRef.current.seek(0);
        };
        setState({ ...state, paused: !state.paused })
    }

    const handleLoad = async (meta) => {
        setState({ ...state, duration: meta.duration })
    }

    const handleProgress = (progressTime) => {
        setState({ ...state, progress: Math.floor(progressTime.currentTime) / state.duration })
    }

    const onProgressPress = (e) => {
        const position = e.nativeEvent.locationX;
        const progress = (position / 250) * state.duration;
        videoRef.current.seek(progress);
    }

    const handleEnd = () => {
        setState({ ...state, progress: 0, paused: true })
        videoRef.current.seek(0);
    }

    const fullScreenMode = () => {
        let fullScreen = true
        let stylefull = {}
        if (!state.fullScreen) {
            videoRef.current.presentFullscreenPlayer()
            
        } else {
            videoRef.current.dismissFullscreenPlayer()
            fullScreen = false
        }
        if (fullScreen) {
            stylefull = {
                containerChild: {
                    width: '100%', 
                    height: '100%'
                },
                containerVideo: {
                    width: '100%',
                    height: '90%'
                },
                video: {
                    width: '100%',
                    height: '100%'
                }
            }
        } 
        setState({ ...state, fullScreen, stylefull })
    }

    const secondsToTime = (seconds) => {
        let hour = Math.floor(seconds / 3600);
        hour = (hour < 10) ? '0' + hour : hour;
        let minute = Math.floor((seconds / 60) % 60);
        minute = (minute < 10) ? '0' + minute : minute;
        let second = seconds % 60;
        second = (second < 10) ? '0' + second : second;
        return hour + ':' + minute + ':' + second;
    }

    return (
        <View style={{ ...styles.container }}>
            <View style={{ backgroundColor: 'purple', borderRadius: 10, ...state.stylefull?.containerChild, paddingTop: 40 }}>
                <View style={{ ...styles.containerVideo, ...state.stylefull?.containerVideo  }}>
                    <Video source={{ uri: "https://player.vimeo.com/external/177625290.hd.mp4?s=49a8e7ed3bb0a6b023bf3c87cea2436567da8e6f&profile_id=174" }}
                        style={{ ...styles.video, ...state.stylefull?.video }}
                        ref={(ref) => {
                            videoRef.current = ref
                        }}
                        rate={state.rate}
                        paused={state.paused}
                        volume={state.volume}
                        muted={state.muted}
                        resizeMode={state.resizeMode}
                        fullScreen={true}
                        controls={false}
                        repeat={false}
                        onLoad={handleLoad}
                        progress={handleProgress}
                        onEnd={handleEnd}
                        onError={(err) => console.log(err)}
                        onProgress={handleProgress}
                    />
                </View>
                <View style={styles.playButton}>
                    <TouchableWithoutFeedback
                        onPress={() => onMainButtonPress()}
                    >
                        <Icon name={state.paused ? 'play-circle-outline' : 'pause-circle-outline'} size={70} color="white" />
                    </TouchableWithoutFeedback >
                </View>
                <View style={styles.containerOptions}>
                    <TouchableWithoutFeedback
                        onPress={onProgressPress}
                    >
                        <ProgressBar
                            progress={state.progress}
                            color="#FFF"
                            unfilledColor="rgba(255, 255,255, .5)"
                            borderColor="#FFF"
                            width={window.width}
                            height={10}
                        />
                    </TouchableWithoutFeedback >
                    <View style={styles.buttonsControl}>
                        <Text style={styles.duration}>
                            {secondsToTime(Math.floor(state.progress * state.duration))}
                        </Text>

                        <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <Icon
                                name={'volume-mute-outline'}
                                size={40} color="white"
                                style={{ marginRight: 20 }}
                            />
                            <TouchableWithoutFeedback
                                onPress={fullScreenMode}
                            >
                                <Icon
                                    name={'scan-outline'}
                                    size={40} color="white"
                                />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end'
    },
    containerOptions: {
        width: '100%',
        height: 65,
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    containerVideo: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
    },
    duration: {
        color: 'white',
        paddingTop: 10
    },
    playButton: {
        justifyContent: 'center', 
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        position: 'absolute',
        height: 390,
        backgroundColor: 'blue'
    },
    buttonsControl: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        width: '100%',
        // height: 50,
    },
    video: {
        width: '100%',
        height: 300,
        // marginTop: 50,
    }
})