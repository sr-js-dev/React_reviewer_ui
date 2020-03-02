import antdEn from 'antd/lib/locale-provider/en_US';
import appLocaleData from 'react-intl/locale-data/en';
import { messages } from '../locales/en_US';

const EnLang = {
  messages: {
    ...messages,
  },
  antd: antdEn,
  locale: 'en-US',
  data: appLocaleData,
};
export default EnLang;
