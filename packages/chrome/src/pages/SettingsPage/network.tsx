import classnames from 'classnames';
import { useState } from 'react';
import styles from './network.module.scss';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateNetworkId } from '../../store/app-context';
import message from '../../components/message';
import SettingTwoLayout from '../../layouts/SettingTwoLayout';
import Nav from '../../components/Nav';
import Typo from '../../components/Typo';
import Icon from '../../components/Icon';

import { ReactComponent as IconCheck } from '../../assets/icons/check.svg';
import { ReactComponent as IconNotCheck } from '../../assets/icons/not-check.svg';
import { ReactComponent as IconDevnetSelected } from '../../assets/icons/devnet-selected.svg';
import { ReactComponent as IconDevnetUnselected } from '../../assets/icons/devnet-unselected.svg';
import { ReactComponent as IconTestnetSelected } from '../../assets/icons/testnet-selected.svg';
import { ReactComponent as IconTestnetUnselected } from '../../assets/icons/testnet-unselected.svg';
import { ReactComponent as IconMainnet } from '../../assets/icons/mainnet.svg';
import { RootState } from '../../store';

const networkType = ['devnet', 'testnet'];

const networks: Record<
  string,
  {
    name: string;
    icon: {
      selected: JSX.Element;
      unselected: JSX.Element;
    };
  }
> = {
  devnet: {
    name: 'Devnet',
    icon: {
      selected: <IconDevnetSelected />,
      unselected: <IconDevnetUnselected />,
    },
  },
  testnet: {
    name: 'Testnet',
    icon: {
      selected: <IconTestnetSelected />,
      unselected: <IconTestnetUnselected />,
    },
  },
};

function Network() {
  const { networkId } = useSelector((state: RootState) => state.appContext);
  const [network, setNetwork] = useState(networkId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSave() {
    await dispatch(updateNetworkId(network));
    // avoid toast flashing after navigation
    setTimeout(() => {
      message.success(`Switched to ${network}`);
    }, 0);
    navigate(-1);
  }

  return (
    <SettingTwoLayout
      title={'Network'}
      desc={'Switch between different network.'}
    >
      <Nav
        position={'absolute'}
        onNavBack={() => {
          navigate(-1);
        }}
      />

      <section className={'mt-[36px]'}>
        {networkType.map((type) => {
          const active = network === type;
          const config = networks[type];

          return (
            <div
              key={type}
              className={classnames(styles['network-selection-container'], {
                [styles['active']]: active,
              })}
              onClick={() => {
                setNetwork(type);
              }}
            >
              <Icon
                icon={active ? config.icon.selected : config.icon.unselected}
                className={styles['network-selection-icon']}
              />
              <Typo.Normal className={styles['network-item-name']}>
                {config.name}
              </Typo.Normal>
              <Icon
                icon={active ? <IconCheck /> : <IconNotCheck />}
                className={styles['network-selection-check']}
              />
            </div>
          );
        })}
      </section>
      {/* not supported yet */}
      {/* <Typo.Normal className={styles['add-custom']}>
        + Add custom network
      </Typo.Normal> */}
      <Button state="primary" onClick={handleSave} className={'mt-[100px]'}>
        Save
      </Button>
    </SettingTwoLayout>
  );
}

export default Network;
