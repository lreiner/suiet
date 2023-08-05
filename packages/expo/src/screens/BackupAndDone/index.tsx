import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Dimensions, View, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '@/../App';
import { Button } from '@/components/Button';
import { useWallets } from '@/hooks/useWallets';
import Typography from '@/components/Typography';
import { White } from '@/styles/colors';
import { Mnemonic } from '@/components/Mnemonic';
import { useKeychain } from '@/hooks/useKeychain';

export const BackupAndDone: React.FC<StackScreenProps<RootStackParamList, 'BackupAndDone'>> = ({
  route,
  navigation,
}) => {
  const source = Image.resolveAssetSource(require('@assets/bg.png'));
  const { width, height } = Dimensions.get('screen');

  const { top, bottom } = useSafeAreaInsets();

  const { wallets, updateWallets, selectedWallet, updateSelectedWallet } = useWallets();

  const { saveMnemonic } = useKeychain();

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white', paddingHorizontal: 24 }}>
      <Image style={[StyleSheet.absoluteFill, { width, height }]} resizeMode="stretch" source={source} />

      <View style={{ flexGrow: 1, maxHeight: 150 }} />

      <View style={{ marginBottom: 40 }}>
        <Typography.Headline children="Welcome" color={White} />
        <Typography.Headline children="to Your" color={White} />
        <Typography.Headline children="New Wallet" color={White} />
        <View style={{ height: 8 }} />
        <Typography.Body children="Copy and save your recovery phrase." color={`rgba(255,255,255,0.7)`} />
      </View>

      <Mnemonic mnemonic={route.params.mnemonic} dark={true} />

      <View style={{ flexGrow: 1 }} />

      <Button
        title={'Confirm'}
        innerStyle={{ marginBottom: 8 }}
        onPress={async () => {
          const existingWallets = wallets ?? [];
          const address = route.params?.address;
          if (typeof address === 'string') {
            const { address, mnemonic } = route.params;
            await saveMnemonic(address, mnemonic);

            updateWallets([
              ...existingWallets,
              {
                name: `Wallet ${existingWallets.length + 1}`,
                address,
                avatar: 0,
              },
            ]);
            if (typeof selectedWallet === 'undefined') {
              updateSelectedWallet(address);
            }
          }
          navigation.popToTop();
          navigation.replace('Home');
        }}
      />

      <View style={{ height: bottom }} />
    </View>
  );
};
