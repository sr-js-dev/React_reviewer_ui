import styled from 'styled-components';
import { palette } from 'styled-theme';
import Buttons from '../../../components/uielements/button';
import Table from '../../Tables/antTables/antTable.style';
import { transition, borderRadius } from '../../../settings/style-util';

const TableWrapper = styled(Table)`
  .ant-table-bordered .ant-table-thead > tr > th,
  .ant-table-bordered .ant-table-tbody > tr > td {
    white-space: normal;
    &.noWrapCell {
      white-space: nowrap;
    }

    @media only screen and (max-width: 920px) {
      white-space: nowrap;
    }
  }
`;

const StatusTag = styled.span`
  padding: 0 5px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  background-color: ${palette('primary', 0)};
  font-size: 12px;
  color: #ffffff;
  text-transform: capitalize;

  &.draft {
    background-color: ${palette('warning', 0)};
  }

  &.publish {
    background-color: ${palette('success', 0)};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const ButtonHolders = styled.div``;

const ComponentTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${palette('text', 0)};
  margin: 5px 0;
`;

const ActionBtn = styled(Buttons)`
  && {
    padding: 0 12px;
    margin-right: 15px;

    &:last-child {
      margin-right: 0;
    }

    i {
      font-size: 17px;
      color: ${palette('text', 1)};
    }

    &:hover {
      i {
        color: inherit;
      }
    }
  }
`;

const Fieldset = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PlaceInput = styled.div`
  input {
    padding: 4px 10px;
    width: 100%;
    height: 35px;
    cursor: text;
    text-align: ${props => (props['data-rtl'] === 'rtl' ? 'right' : 'left')};
    font-size: 13px;
    line-height: 1.5;
    color: ${palette('text', 1)};
    background-color: #fff;
    background-image: none;
    border: 1px solid ${palette('border', 0)};
    ${borderRadius('4px')};
    ${transition()};

    input:focus {
      border-color: ${palette('primary', 0)};
    }

    input:hover {
      border-color: ${palette('primary', 0)};
    }

    input.ant-input-lg {
      height: 42px;
      padding: 6px 10px;
    }

    input.ant-input-sm {
      padding: 1px 10px;
      height: 30px;
    }

    input::-webkit-input-placeholder {
      text-align: ${props => (props['data-rtl'] === 'rtl' ? 'right' : 'left')};
      color: ${palette('grayscale', 0)};
    }

    input:-moz-placeholder {
      text-align: ${props => (props['data-rtl'] === 'rtl' ? 'right' : 'left')};
      color: ${palette('grayscale', 0)};
    }

    input::-moz-placeholder {
      text-align: ${props => (props['data-rtl'] === 'rtl' ? 'right' : 'left')};
      color: ${palette('grayscale', 0)};
    }
    input:-ms-input-placeholder {
      text-align: ${props => (props['data-rtl'] === 'rtl' ? 'right' : 'left')};
      color: ${palette('grayscale', 0)};
    }
  }
`;

const ListItemStyle = styled.div`
  padding: 8px;

  &:hover {
    background-color: #daefff;
    cursor: pointer;
  }
`;

const Label = styled.label`
  font-size: 13px;
  color: ${palette('text', 1)};
  line-height: 1.5;
  font-weight: 500;
  padding: 0;
  margin: 0 0 8px;
`;

const ActionWrapper = styled.div`
  display: flex;
  align-content: center;

  a {
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }

    i {
      font-size: 18px;
      color: ${palette('primary', 0)};

      &:hover {
        color: ${palette('primary', 4)};
      }
    }

    &.deleteBtn {
      i {
        color: ${palette('error', 0)};

        &:hover {
          color: ${palette('error', 2)};
        }
      }
    }
  }
`;

const Form = styled.div``;

export {
  ActionBtn,
  Fieldset,
  Label,
  Form,
  TitleWrapper,
  ButtonHolders,
  ActionWrapper,
  ComponentTitle,
  TableWrapper,
  StatusTag,
  PlaceInput,
  ListItemStyle,
};
