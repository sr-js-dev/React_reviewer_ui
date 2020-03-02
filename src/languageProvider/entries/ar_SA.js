import antdSA from 'antd/lib/locale-provider/en_US';
import appLocaleData from 'react-intl/locale-data/ar';
import { messages } from '../locales/ar_SA';

const saLang = {
  messages: {
    ...messages
  },
  antd: antdSA,
  locale: 'ar',
  data: appLocaleData
};
export default saLang;
