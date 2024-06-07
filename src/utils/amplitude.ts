import * as amplitude from '@amplitude/analytics-react-native';

export const initializeAmplitude = () => {
    // amplitude.init('35e14ee2e4e313f65dae58b8b7f4d007', undefined, {
    //     logLevel: amplitude.Types.LogLevel.Debug,
    // });
    amplitude.init('35e14ee2e4e313f65dae58b8b7f4d007');
};
