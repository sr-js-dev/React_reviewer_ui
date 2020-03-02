import antdSA from 'antd/lib/locale-provider/ca_ES';
import appLocaleData from 'react-intl/locale-data/es';
import { messages } from '../locales/es_ES';

const saLang = {
  messages: {
    ...messages
  },
  antd: antdSA,
  locale: 'es',
  data: appLocaleData
};
export default saLang;
