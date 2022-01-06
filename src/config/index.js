export const companyConfig = () => {
    const url = window.location.origin;
    switch (url) {
      case 'https://test-dm.green-valley.com':
        return {
          agentid: '1000050',
          corpCode: 'gv0001',
          companyName: '绿谷制药',
          appid: 'wx05b038f10791705d',
          origin: url,
        };
      case 'https://dm.green-valley.com':
        return {
          agentid: '1000052',
          corpCode: 'gv0001',
          companyName: '绿谷制药',
          appid: 'wx05b038f10791705d',
          origin: url,
        };
      case 'https://test-dm.greenvalleypharma.com':
        return {
          agentid: '1000010',
          corpCode: 'gv0002',
          companyName: '绿谷医药科技',
          appid: 'ww4fbe1ef409109428',
          origin: url,
        };
      case 'https://dm.greenvalleypharma.com':
        return {
          agentid: '1000009',
          corpCode: 'gv0002',
          companyName: '绿谷医药科技',
          appid: 'ww4fbe1ef409109428',
          origin: url,
        };
      default:
        return {
          agentid: '1000050',
          corpCode: 'gv0001',
          companyName: '绿谷制药',
          appid: 'wx05b038f10791705d',
          origin: 'https://test-dm.greenvalleypharma.com',
        };
    }
};


export const baseURL = '/api/gv'
export const webUrl = '/web/dm'