import { Animated, Easing } from 'react-native';
import getSceneIndicesForInterpolationInputRange from 'react-navigation/src/utils/getSceneIndicesForInterpolationInputRange';
import { I18nManager } from 'react-native';

function forInitial(props) {
    const { navigation, scene } = props;

    const focused = navigation.state.index === scene.index;
    const opacity = focused ? 1 : 0;
    const translate = focused ? 0 : 1000000;
    return {
        opacity,
        transform: [{ translateX: translate }, { translateY: translate }],
    };
}

function fromRight(props){
    let t = Date.now()
    const { layout, position, scene } = props;
    if (!layout.isMeasured) {
        return forInitial(props);
    }
    const interpolate = getSceneIndicesForInterpolationInputRange(props);
    if (!interpolate) return { opacity: 0 };

    const { first, last } = interpolate;
    const index = scene.index;
    const opacity = position.interpolate({
        inputRange: [first, (first+index)/2, index, last -0.01 ,last],
        outputRange: [0, 0.5, 1, 0.5, 0],
    });

    
    const scale = position.interpolate({
        inputRange: [first, first+0.01, index, (index+last)/2, last],
        outputRange: [0, 1, 1, 0.98, 0.98],
    });
    const width = layout.initWidth;
    const translateX = position.interpolate({
        inputRange: [first, index, last],
        outputRange: [width * 0.06, 0, -width*0.06]
        // : [ width * 0.03, 0, width*-0.03],
    });
    const translateY = 0;
    //{ translateX }, { translateY }, {scale}
    return {
        opacity,
        transform: [ ],
    };
}

function fromBottom(props){
    const { layout, position, scene } = props;

    if (!layout.isMeasured) {
        return forInitial(props);
    }
    const interpolate = getSceneIndicesForInterpolationInputRange(props);

    if (!interpolate) return { opacity: 0 };

    const { first, last } = interpolate;
    const index = scene.index;
    const opacity = position.interpolate({
        inputRange: [first, first + 0.01, index, last - 0.01, last],
        outputRange: [0, 1, 1, 0.85, 0],
    });

    const scale = position.interpolate({
        inputRange: [first, first+0.01, index, last, last],
        outputRange: [0, 1, 1, 0.97, 0.97],
    });

    const height = layout.initHeight;
    const translateY = position.interpolate({
        inputRange: [first, index, last],
        outputRange: I18nManager.isRTL
        ? [-height, 0, height * 0.3]
        : [height, 0, height * -0.3],
    });
    const translateX = 0;
    //{ translateX }, { translateY }, { scale }
    return {
        opacity,
        transform: [],
    };
}

export function CustomTransition(sceneProps,duration = 300) {
    return {
        transitionSpec: {
            duration,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            // useNativeDriver: true,
        },
        screenInterpolator: (props) => {
            let routes = sceneProps.scenes.map((r)=>r.route.routeName)
            let routeName = routes[routes.length - 1]

            if( routeName == "RegDoc" )
                return fromBottom(props);

            return fromRight(props);
        },
    };
}
