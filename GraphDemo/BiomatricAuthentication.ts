import ReactNativeBiometrics from "react-native-biometrics";
import FingerprintScanner from "react-native-fingerprint-scanner";
import { showAlert } from "../base/DefaultAlertDialog";
import { STRING_CONSTANTS } from "../utils/constants/stringConstants";
import { logOnConsole } from "../utils/globalFunction";

let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
let payload = epochTimeSeconds + STRING_CONSTANTS.some_message;

export const initBiometric = (successCB: Function, errorCB: Function) => {
	ReactNativeBiometrics?.isSensorAvailable()
		?.then((resultObject) => {
			const { available, biometryType } = resultObject;
			if (available && biometryType === ReactNativeBiometrics.TouchID) {
				isKeyExists(successCB, errorCB);
			} else if (available && biometryType === ReactNativeBiometrics.FaceID) {
				isKeyExists(successCB, errorCB);
			} else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
				logOnConsole(STRING_CONSTANTS.biometric_supported);
			} else {
				showAlert(STRING_CONSTANTS.bio_not_supported);
				errorCB(STRING_CONSTANTS.bio_not_supported);
			}
		})
		.catch((error) => {
			errorCB?.(error);
		});
};

export const isKeyExists = (successCB: Function, errorCB: Function) => {
	ReactNativeBiometrics.biometricKeysExist().then((resultObject) => {
		const { keysExist } = resultObject;
		if (keysExist) {
			generateKey(successCB, errorCB);
		} else {
			generateKey(successCB, errorCB);
		}
	});
};

export const generateKey = (successCB: Function, errorCB: Function) => {
	ReactNativeBiometrics.createKeys()
		.then((resultObject) => {
			resultObject;
			successCB(resultObject);
			// sendPublicKeyToServer(publicKey)s
		})
		.catch((error) => {
			errorCB?.(error);
		});
};

export const deleteKey = (successCB: Function, errorCB: Function) => {
	ReactNativeBiometrics.deleteKeys().then((resultObject) => {
		const { keysDeleted } = resultObject;

		if (keysDeleted) {
			logOnConsole("Successful deletion");
		} else {
			logOnConsole("Unsuccessful deletion because there were no keys to delete");
		}
	});
};

export const generateSignature = (successCB: Function, errorCB: Function) => {
	ReactNativeBiometrics.createSignature({
		promptMessage: "Sign in",
		payload: payload,
	})
		.then((resultObject) => {
			const { success, signature } = resultObject;

			if (success) {
				successCB?.(resultObject);
				console.log(signature, "signature");
				//   verifySignatureWithServer(signature, payload)
			}
		})
		.catch((error) => {
			errorCB?.(error);
		});
};

export const promptModal = (successCB: Function, errorCB: Function) => {
	ReactNativeBiometrics.simplePrompt({ promptMessage: STRING_CONSTANTS.confirm_fingerprint })
		.then((resultObject) => {
			const { success } = resultObject;

			if (success) {
				logOnConsole("successful biometrics provided");
			} else {
				logOnConsole("user cancelled biometric prompt");
			}
		})
		.catch(() => {
			logOnConsole("biometrics failed");
		});
};

// react-native-fingerprint-scanner function are below

export const checkIsSensorAvailable = (successCB: Function, errorCB: Function) => {
	FingerprintScanner.isSensorAvailable()
		.then((biometryType) => {
			successCB(biometryType);
		})
		.catch((error) => {
			errorCB(error);
		});
};

export const checkIsBiometricValid = (options: object, successCB: Function, errorCB: Function) => {
	FingerprintScanner.authenticate({ ...options })
		.then((res) => {
			successCB(res);
			FingerprintScanner.release();
		})
		.catch((err) => {
			errorCB(err);
			FingerprintScanner.release();
		});
};

export const BIOMETRIC_ERRORS = {
	UserCancel: "UserCancel",
	AuthenticationFailed: "AuthenticationFailed", // Authentication was not successful because the user failed to provide valid credentials
	DeviceLockedPermanent: "DeviceLockedPermanent", // Authentication was not successful, device must be unlocked via password
	DeviceLocked: "DeviceLocked", // Authentication was not successful, the device currently in a lockout of 30 seconds
	FingerprintScannerNotSupported: "FingerprintScannerNotSupported", // Device does not support Fingerprint Scanner
	FingerprintScannerNotEnrolled: "FingerprintScannerNotEnrolled", // Authentication could not start because Fingerprint Scanner has no enrolled fingers
	FingerprintScannerNotAvailable: "FingerprintScannerNotAvailable", // Authentication could not start because Fingerprint Scanner is not available on the device
};
