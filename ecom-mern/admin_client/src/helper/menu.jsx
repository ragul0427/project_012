
import {
  AppstoreOutlined,
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
export const items = [
  getItem(<Link to="/">DashBoard</Link>, '1', <MailOutlined />),
  getItem('Users', '2', <CalendarOutlined />),
  getItem('Product Management', 'sub1', <AppstoreOutlined />, [
    getItem(<Link to="/category">Category</Link>, '3'),
    getItem(<Link to="/subcategory">Subcategory</Link>, '4'),
    getItem('Product', '5')
    // getItem('Submenu', 'sub1-2', null, [getItem('Option 5', '5'), getItem('Option 6', '6')]),
  ]),
  getItem('Navigation Three', 'sub2', <SettingOutlined />, [
    getItem('Option 7', '7'),
    getItem('Option 8', '8'),
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
  ]),
  getItem(
    <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
      Ant Design
    </a>,
    'link',
    <LinkOutlined />,
  ),
];