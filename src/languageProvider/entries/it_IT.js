import antdSA from 'antd/lib/locale-provider/it_IT';
import appLocaleData from 'react-intl/locale-data/it';
import { messages } from '../locales/it_IT';

const saLang = {
  messages: {
    ...messages
  },
  antd: antdSA,
  locale: 'it-IT',
  data: appLocaleData
};
export default saLang;
