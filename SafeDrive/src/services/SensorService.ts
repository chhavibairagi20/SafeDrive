import { Accelerometer, DeviceMotion, Gyroscope } from 'expo-sensors';

export interface SensorSample {
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    x: number;
    y: number;
    z: number;
  };
  deviceMotion: {
    rotation: {
      alpha: number;
      beta: number;
      gamma: number;
    };
    rotationRate: {
      alpha: number;
      beta: number;
      gamma: number;
    };
    accelerationIncludingGravity: {
      x: number;
      y: number;
      z: number;
    };
  };
}

type SensorCallback = (sample: SensorSample) => void;

let accelerometerSubscription: { remove: () => void } | null = null;
let gyroscopeSubscription: { remove: () => void } | null = null;
let deviceMotionSubscription: { remove: () => void } | null = null;

const initialSample: SensorSample = {
  accelerometer: { x: 0, y: 0, z: 0 },
  gyroscope: { x: 0, y: 0, z: 0 },
  deviceMotion: {
    rotation: { alpha: 0, beta: 0, gamma: 0 },
    rotationRate: { alpha: 0, beta: 0, gamma: 0 },
    accelerationIncludingGravity: { x: 0, y: 0, z: 0 },
  },
};

let currentSample: SensorSample = { ...initialSample };

const emitUpdate = (callback: SensorCallback) => {
  callback({ ...currentSample });
};

export const SensorService = {
  start: (callback: SensorCallback) => {
    Accelerometer.setUpdateInterval(200);
    Gyroscope.setUpdateInterval(200);
    DeviceMotion.setUpdateInterval(200);

    accelerometerSubscription = Accelerometer.addListener((data) => {
      currentSample = {
        ...currentSample,
        accelerometer: { x: data.x, y: data.y, z: data.z },
      };
      emitUpdate(callback);
    });

    gyroscopeSubscription = Gyroscope.addListener((data) => {
      currentSample = {
        ...currentSample,
        gyroscope: { x: data.x, y: data.y, z: data.z },
      };
      emitUpdate(callback);
    });

    deviceMotionSubscription = DeviceMotion.addListener((data) => {
      if (!data.rotationRate || !data.rotation) {
        return;
      }

      currentSample = {
        ...currentSample,
        deviceMotion: {
          rotation: {
            alpha: data.rotation.alpha ?? 0,
            beta: data.rotation.beta ?? 0,
            gamma: data.rotation.gamma ?? 0,
          },
          rotationRate: {
            alpha: data.rotationRate.alpha ?? 0,
            beta: data.rotationRate.beta ?? 0,
            gamma: data.rotationRate.gamma ?? 0,
          },
          accelerationIncludingGravity: {
            x: data.accelerationIncludingGravity?.x ?? 0,
            y: data.accelerationIncludingGravity?.y ?? 0,
            z: data.accelerationIncludingGravity?.z ?? 0,
          },
        },
      };
      emitUpdate(callback);
    });

    emitUpdate(callback);
  },

  stop: () => {
    accelerometerSubscription?.remove();
    gyroscopeSubscription?.remove();
    deviceMotionSubscription?.remove();
    accelerometerSubscription = null;
    gyroscopeSubscription = null;
    deviceMotionSubscription = null;
    currentSample = { ...initialSample };
  },
};
