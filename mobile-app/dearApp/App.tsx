/* eslint-disable no-void */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Platform,
  PermissionsAndroid,
  StatusBar,
  NativeModules,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {WebView} from 'react-native-webview';
import type {WebView as WebViewType} from 'react-native-webview';
import NfcManager, {Ndef} from 'react-native-nfc-manager';
import {Linking} from 'react-native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import NoTag from './NoTag';
import Forbidden from './Forbidden';

// NFC 초기화
NfcManager.start();

type KeyringData = {
  url: string;
  text: string;
  keyringId: string;
  device: {
    model: string;
    brand: string;
    manufacturer: string;
    deviceId: string;
    systemName: string;
    systemVersion: string;
    uniqueId: string;
  };
};

const App = () => {
  const [data, setData] = useState<KeyringData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const webViewRef = useRef<WebViewType>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (Platform.OS === 'android') {
          await PermissionsAndroid.request('android.permission.NFC' as any);
          NativeModules?.FullScreenModule?.enableFullScreen?.();
        }

        // ✅ 최초 실행 시 딥링크 처리
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink({url: initialUrl});
        }

        // ✅ 실행 중일 때 딥링크
        const sub = Linking.addEventListener('url', handleDeepLink);

        // ✅ NFC 태깅 리스너 등록
        await (NfcManager as any).registerTagEvent((tag: any) => {
          void handleNfcTag(tag);
        });

        return () => {
          NfcManager.unregisterTagEvent().catch(() => {});
          sub.remove();
        };
      } catch (e) {
        console.error('❌ 초기화 오류:', e);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (data) {
      sendDeviceInfoToServer(data);
    }
  }, [data]);

  const handleDeepLink = async ({url}: {url: string}) => {
    try {
      const match = url.match(/^lettering:\/\/nfc\/([^?]+)(\?.*)?$/);
      const keyringId = match?.[1] ?? '';
      const queryString = match?.[2] ?? '';

      const query: Record<string, string> = {};
      if (queryString.startsWith('?')) {
        queryString
          .slice(1)
          .split('&')
          .forEach(pair => {
            const [key, value] = pair.split('=');
            query[key] = decodeURIComponent(value || '');
          });
      }

      const text = query.text ?? '';
      const device = await getDeviceInfo();

      if (keyringId) {
        const webUrl = 'https://letterring.shop/dear';
        setData({
          url: webUrl,
          text,
          keyringId,
          device,
        });
      }
    } catch (err) {
      console.error('❌ 딥링크 처리 오류:', err);
    }
  };

  const sendDeviceInfoToServer = async (info: KeyringData) => {
    try {
      console.log(info);
      const res = await axios.post(
        'https://letterring.shop/api/keyrings/nfc-access',
        {
          id: Number(info?.keyringId),
          deviceId: info?.device.uniqueId,
        },
        {
          withCredentials: true,
        },
      );
      setIsReady(true);
      console.log('✅ 서버 응답:', res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          '❌ API 호출 실패:',
          err.response?.status,
          err.response?.data,
        );
        //403 에러 발생
        if (err.response?.status === 403) {
          setIsForbidden(true);
        }
      } else {
        console.error('❌ 알 수 없는 에러:', err);
      }
    }
  };

  const handleNfcTag = async (tag: any) => {
    try {
      const ndefRecords = tag.ndefMessage ?? [];

      let url = '';
      let text = '';

      for (const record of ndefRecords) {
        const type = String.fromCharCode(...record.type);

        if (record.tnf === Ndef.TNF_WELL_KNOWN && type === 'T') {
          text = decodeTextPayload(record.payload);
        } else if (record.tnf === Ndef.TNF_WELL_KNOWN && type === 'U') {
          url = decodeUriPayload(record.payload);
        }
      }

      const match = url.match(/^https:\/\/[^/]+\/nfc\/([^?]+)(\?.*)?$/);
      const keyringId = match?.[1] ?? '';
      const searchParams = new URLSearchParams(match?.[2] ?? '');
      const textParam = searchParams.get('text') ?? text;

      const device = await getDeviceInfo();
      console.log(device);

      if (keyringId) {
        const newData = {
          url,
          text: textParam,
          keyringId,
          device,
        };

        setData(newData);
        await sendDeviceInfoToServer(newData);
      }

      await NfcManager.unregisterTagEvent();
    } catch (err) {
      console.error('❌ 태그 처리 중 오류:', err);
    }
  };

  const decodeTextPayload = (payload: number[]): string => {
    if (payload.length < 3) {
      return '';
    }
    const textBytes = payload.slice(3);
    return String.fromCharCode(...textBytes);
  };

  const decodeUriPayload = (payload: number[]): string => {
    try {
      return Ndef.uri.decodePayload(Uint8Array.from(payload));
    } catch (e) {
      return '';
    }
  };

  const getDeviceInfo = async () => ({
    model: await DeviceInfo.getModel(),
    brand: await DeviceInfo.getBrand(),
    manufacturer: await DeviceInfo.getManufacturer(),
    deviceId: await DeviceInfo.getDeviceId(),
    systemName: await DeviceInfo.getSystemName(),
    systemVersion: await DeviceInfo.getSystemVersion(),
    uniqueId: await DeviceInfo.getUniqueId(),
  });

  if (isForbidden) {
    return <Forbidden />;
  }

  if (!data || (!isReady && !isForbidden)) {
    return <NoTag />;
    // return (
    //   <WebView
    //     source={{uri: 'https://letterring.shop/dear/notag'}}
    //     // onLoadEnd={() => {
    //     //   if (webViewRef.current) {
    //     //     const payload = {
    //     //       keyringId: data?.keyringId,
    //     //       text: data?.text,
    //     //       device: data?.device,
    //     //     };
    //     //     webViewRef.current.postMessage(JSON.stringify(payload));
    //     //   }
    //     // }}
    //     javaScriptEnabled
    //     originWhitelist={['*']}
    //   />
    // );
  }

  console.log(data.url);

  return (
    <>
      <StatusBar hidden={true} />
      <WebView
        ref={webViewRef}
        source={{uri: data?.url ?? ''}}
        sharedCookiesEnabled={true}
        javaScriptEnabled
        originWhitelist={['*']}
        style={{flex: 1}}
        onMessage={async event => {
          console.log('📨 받은 메시지:', event.nativeEvent.data);

          const base64 = event.nativeEvent.data;

          if (!base64?.startsWith('data:image')) {
            console.warn('📛 예상치 못한 메시지:', base64);
            return;
          }

          if (Platform.OS === 'android') {
            try {
              let granted;

              if (Platform.Version >= 33) {
                // Android 13 이상
                granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                );
              } else {
                // Android 12 이하
                granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                );
              }

              if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('저장 권한이 필요합니다.');
              } else {
                console.log('✅ 권한 허용됨');
              }
            } catch (err) {
              console.warn(err);
            }
          }

          const base64Data = base64.replace(/^data:image\/png;base64,/, '');
          const filename = `letterring_postcard_${Date.now()}.png`;
          const path = `${RNFS.DownloadDirectoryPath}/${filename}`;

          try {
            await RNFS.writeFile(path, base64Data, 'base64');
            Alert.alert('내 파일 > Download에 사진이 저장되었습니다!');
          } catch (err) {
            console.error('❌ 저장 실패:', err);
            Alert.alert('파일을 저장할 수 없습니다.');
          }
        }}
      />
    </>
    // </View>
  );
};

export default App;
