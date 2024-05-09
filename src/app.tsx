import { Footer, Question, SelectLang, AvatarDropdown, AvatarName } from '@/components';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import React from 'react';
import { request } from 'umi';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';


type BlockchainData = Record<string, Record<string, string[]>>;

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  blockchainData?: BlockchainData;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchBlockchainData?: () =>  Promise<{blockchains:string[],subChains:string[]} & Pick<API.CurrentUser,'metricsList'>>;

}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const fetchBlockchainData = async (): Promise<BlockchainData> => {
    console.log("Called the function fetchBlockchainData -------------------------------------------------------")
    try {
      // Fetch the blockchain data from your backend
      console.log("send request to get blockchain data")
      const response = await request('http://localhost:5000/app/metrics/init', { method: 'GET' });
      const rawData = response.data.data; // Assuming this is the structure based on your provided JSON

      const blockchainData: BlockchainData = rawData.reduce((acc, { blockchain, sub_chain, metrics }) => {
        if (!acc[blockchain]) {
          acc[blockchain] = {};
        }
        acc[blockchain][sub_chain] = metrics;
        return acc;
      }, {} as BlockchainData);

      return blockchainData;
      
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error);
      return {};
    }
  };


  // If it's not a login page, execute
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    const blockchainData = await fetchBlockchainData(); // Actually fetch the blockchain data
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
      blockchainData, // Include blockchain data in the initial state
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout Supported api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // If you are not logged in, you are redirected to login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          // <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          //   <LinkOutlined />
          //   <span>OpenAPI 文档</span>
          // </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // Customize the 403 page
    // unAccessible: <div>unAccessible</div>,
    // Add a loading state
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request configuration, error handling can be configured
 * It provides a unified set of network request and error handling scenarios based on axios and ahooks' useRequest.
 * @doc https://umijs.org/docs/max/request#配置
 */
// export const request = {
//   ...errorConfig,
// };
